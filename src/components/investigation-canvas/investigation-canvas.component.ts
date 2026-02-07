
import { Component, ChangeDetectionStrategy, inject, signal, computed, HostListener, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToolService } from '../../services/tool.service';
import { ToolStateService } from '../../services/tool-state.service';
import { Tool } from '../../models/tool.model';
import { UserService } from '../../services/user.service';
import { GeminiService } from '../../services/gemini.service';
import { Type } from '@google/genai';

interface CanvasNode {
  id: string;
  x: number;
  y: number;
  type: 'tool' | 'file';
  
  // Display Properties
  title: string;
  iconSvg: string;
  iconColor: string;
  
  // Payload
  tool?: Tool;
  file?: {
    name: string;
    size: string;
    type: string;
    preview?: string; // Base64 data URL for images
  };
}

interface Connection {
  from: string; // from node id
  to: string; // to node id
}

interface Point {
  x: number;
  y: number;
}

interface CanvasSettings {
  backgroundColor: string;
  gridColor: string;
  showGrid: boolean;
  nodeBackgroundColor: string;
  connectionColor: string;
  connectionStyle: 'solid' | 'dashed' | 'dotted';
  connectionWidth: number;
}

const DEFAULT_SETTINGS: CanvasSettings = {
  backgroundColor: '#f3f4f6', // base-200ish
  gridColor: '#d1d5db',       // gray-300
  showGrid: true,
  nodeBackgroundColor: '#ffffff',
  connectionColor: '#9ca3af', // gray-400
  connectionStyle: 'solid',
  connectionWidth: 2.5
};

@Component({
  selector: 'app-investigation-canvas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './investigation-canvas.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InvestigationCanvasComponent {
  private toolService = inject(ToolService);
  private toolStateService = inject(ToolStateService);
  private userService = inject(UserService);
  private geminiService = inject(GeminiService);

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  user = this.userService.currentUser;
  
  // Track hovered tool for descriptions
  hoveredTool = signal<Tool | null>(null);
  
  // Canvas Customization State
  isSettingsOpen = signal(false);
  settings = signal<CanvasSettings>({ ...DEFAULT_SETTINGS });

  allTools = computed(() => {
    const userRole = this.user()?.role;
    if (!userRole) return [];

    const excludedToolIdsForCanvas = [
      'ai-assistant', 'mattermost', 'nextcloud', 'webtop', 'meedan-check',
      'ushahidi', 'n8n', 'superdesk', 'ghost-ye', 'erpnext', 'openproject',
      'moodle', 'bigbluebutton', 'tooljet', 'chatwoot', 'nocodb', 'civicrm'
    ];

    return this.toolService.tools().filter(tool => {
      if (excludedToolIdsForCanvas.includes(tool.id)) {
        return false;
      }
      if (userRole === 'super-admin') {
        return tool.isActive;
      }
      return tool.isActive && tool.allowedRoles.includes(userRole);
    });
  });

  categorizedTools = computed(() => {
    return this.allTools().reduce((acc, tool) => {
      if (!acc[tool.category]) {
        acc[tool.category] = [];
      }
      acc[tool.category].push(tool);
      return acc;
    }, {} as Record<string, Tool[]>);
  });

  get categories(): string[] {
    return Object.keys(this.categorizedTools()).sort((a, b) => a.localeCompare(b));
  }

  nodes = signal<CanvasNode[]>([]);
  connections = signal<Connection[]>([]);
  
  private draggedTool = signal<Tool | null>(null);
  private draggedNodeId = signal<string | null>(null);
  private dragOffset = signal<Point>({ x: 0, y: 0 });

  isDrawingConnection = signal(false);
  private connectionStartNodeId = signal<string | null>(null);
  connectionLinePath = signal<string | null>(null);
  
  // --- AI Workflow Builder State ---
  aiCommand = signal('');
  isAiBuilding = signal(false);
  aiError = signal('');

  connectionPaths = computed(() => {
    return this.connections().map(conn => {
      const fromNode = this.nodes().find(n => n.id === conn.from);
      const toNode = this.nodes().find(n => n.id === conn.to);
      if (!fromNode || !toNode) return '';
      
      const startX = fromNode.x + 240; // width of node
      const startY = fromNode.y + 36; // middle of node height
      const endX = toNode.x;
      const endY = toNode.y + 36;
      
      return this.generateSvgPath(startX, startY, endX, endY);
    });
  });
  
  connectionDashArray = computed(() => {
    switch (this.settings().connectionStyle) {
      case 'dashed': return '10, 5';
      case 'dotted': return '3, 3';
      default: return '0';
    }
  });

  private generateSvgPath(startX: number, startY: number, endX: number, endY: number): string {
    const dx = endX - startX;
    const c1x = startX + Math.abs(dx) * 0.5;
    const c1y = startY;
    const c2x = endX - Math.abs(dx) * 0.5;
    const c2y = endY;
    return `M ${startX} ${startY} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${endX} ${endY}`;
  }

  toggleSettings() {
    this.isSettingsOpen.update(v => !v);
  }

  resetSettings() {
    this.settings.set({ ...DEFAULT_SETTINGS });
  }

  updateSetting<K extends keyof CanvasSettings>(key: K, value: CanvasSettings[K]) {
    this.settings.update(s => ({ ...s, [key]: value }));
  }

  triggerFileUpload() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.processFiles(Array.from(input.files), 100, 100);
      input.value = ''; // Reset input
    }
  }

  onToolDragStart(event: DragEvent, tool: Tool) {
    this.draggedTool.set(tool);
    if(event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'copy';
    }
  }

  onCanvasDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onCanvasDrop(event: DragEvent) {
    event.preventDefault();
    const canvasRect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const x = event.clientX - canvasRect.left - 120; // Adjust for half node width
    const y = event.clientY - canvasRect.top - 36;  // Adjust for half node height

    // 1. Handle Tool Drop
    const tool = this.draggedTool();
    if (tool) {
      const newNode: CanvasNode = { 
        id: `${tool.id}-${Date.now()}`,
        type: 'tool',
        title: tool.name,
        iconSvg: tool.iconSvg,
        iconColor: tool.iconColor,
        tool: tool,
        x, y
      };
      this.nodes.update(nodes => [...nodes, newNode]);
      this.draggedTool.set(null);
      return;
    }

    // 2. Handle File Drop
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      this.processFiles(Array.from(event.dataTransfer.files), x, y);
    }
  }

  private processFiles(files: File[], startX: number, startY: number) {
    files.forEach((file, index) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const isImage = file.type.startsWith('image/');
        const preview = isImage ? e.target?.result as string : undefined;
        
        // Define icon based on file type
        let iconSvg = 'M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m.75 12 3 3m0 0 3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z'; // Default Doc
        let iconColor = 'text-gray-500';

        if (isImage) {
          iconSvg = 'M2.25 15.75l5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z';
          iconColor = 'text-purple-500';
        } else if (file.type.includes('pdf')) {
          iconColor = 'text-red-500';
        }

        const newNode: CanvasNode = {
          id: `file-${Date.now()}-${index}`,
          type: 'file',
          title: file.name,
          iconSvg,
          iconColor,
          file: {
            name: file.name,
            size: this.formatBytes(file.size),
            type: file.type,
            preview
          },
          x: startX + (index * 30), // Stagger multiple files
          y: startY + (index * 30)
        };

        this.nodes.update(ns => [...ns, newNode]);
      };

      reader.readAsDataURL(file);
    });
  }

  private formatBytes(bytes: number, decimals = 2) {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  }

  onNodeDragStart(event: MouseEvent, nodeId: string) {
    const target = event.target as HTMLElement;
    // Prevent starting a drag when clicking on buttons or connection points
    if (target.closest('button') || target.classList.contains('connection-point')) {
      return;
    }
    const node = this.nodes().find(n => n.id === nodeId);
    if (node) {
      this.draggedNodeId.set(nodeId);
      this.dragOffset.set({ x: event.clientX - node.x, y: event.clientY - node.y });
    }
  }

  @HostListener('document:mousemove', ['$event'])
  onDocumentMouseMove(event: MouseEvent) {
    const draggedNodeId = this.draggedNodeId();
    if (draggedNodeId) {
      const offset = this.dragOffset();
      const newX = event.clientX - offset.x;
      const newY = event.clientY - offset.y;
      this.nodes.update(nodes =>
        nodes.map(n => n.id === draggedNodeId ? { ...n, x: newX, y: newY } : n)
      );
    }

    if (this.isDrawingConnection()) {
      const startNode = this.nodes().find(n => n.id === this.connectionStartNodeId());
      if (startNode) {
          const canvasRect = (document.querySelector('.investigation-canvas') as HTMLElement)?.getBoundingClientRect();
          if (!canvasRect) return;
          const mouseX = event.clientX - canvasRect.left;
          const mouseY = event.clientY - canvasRect.top;
          const startX = startNode.x + 240;
          const startY = startNode.y + 36;
          this.connectionLinePath.set(this.generateSvgPath(startX, startY, mouseX, mouseY));
      }
    }
  }

  @HostListener('document:mouseup', ['$event'])
  onDocumentMouseUp(event: MouseEvent) {
    this.draggedNodeId.set(null);
    if (this.isDrawingConnection()) {
        this.cancelConnection();
    }
  }

  startConnection(event: MouseEvent, nodeId: string) {
    event.stopPropagation();
    this.isDrawingConnection.set(true);
    this.connectionStartNodeId.set(nodeId);
  }
  
  endConnection(event: MouseEvent, endNodeId: string) {
    event.stopPropagation();
    const startNodeId = this.connectionStartNodeId();
    if (this.isDrawingConnection() && startNodeId && startNodeId !== endNodeId) {
      const alreadyExists = this.connections().some(c => c.from === startNodeId && c.to === endNodeId);
      if (!alreadyExists) {
        this.connections.update(conns => [...conns, { from: startNodeId, to: endNodeId }]);
      }
    }
    this.cancelConnection();
  }

  cancelConnection() {
    this.isDrawingConnection.set(false);
    this.connectionStartNodeId.set(null);
    this.connectionLinePath.set(null);
  }

  runNodeTool(event: MouseEvent, tool: Tool) {
    event.stopPropagation();
    this.toolStateService.runTool(tool.id);
  }

  removeNode(event: MouseEvent, nodeId: string) {
    event.stopPropagation();
    this.nodes.update(nodes => nodes.filter(n => n.id !== nodeId));
    this.connections.update(conns => conns.filter(c => c.from !== nodeId && c.to !== nodeId));
  }
  
  async buildWorkflowWithAi() {
    if (!this.aiCommand()) return;
    this.isAiBuilding.set(true);
    this.aiError.set('');
    this.nodes.set([]);
    this.connections.set([]);

    const toolList = this.allTools().map(t => `- ${t.name} (id: ${t.id}): ${t.description}`).join('\n');
    const systemInstruction = `أنت باني سير عمل ذكي لمنصة تحقيقات صحفية. مهمتك هي تحليل طلب المستخدم وإرجاع سلسلة من معرفات الأدوات (tool IDs) التي يجب استخدامها لإنجاز المهمة. يجب عليك فقط استخدام الأدوات المتوفرة في القائمة أدناه. أرجع معرفات الأدوات بالترتيب الدقيق الذي يجب تنفيذها به.

الأدوات المتاحة:
${toolList}

سيقدم المستخدم أمراً باللغة العربية. يجب أن ترد بكائن JSON يحتوي على مفتاح واحد "toolIds" وهو عبارة عن مصفوفة من السلاسل النصية. لا تقم بإضافة أي نص أو شرح آخر.

مثال:
طلب المستخدم: "ابحث عن حسابات المستخدم 'testuser' على وسائل التواصل الاجتماعي ثم أرشف النتائج"
ردك بصيغة JSON:
{
  "toolIds": ["sherlock-maigret", "archivebox"]
}
`;

    const schema = {
        type: Type.OBJECT,
        properties: {
            toolIds: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
            }
        },
        required: ['toolIds']
    };

    try {
      const result = await this.geminiService.generateStructuredResponse(this.aiCommand(), schema, systemInstruction);
      if (result && result.toolIds && Array.isArray(result.toolIds)) {
        this.createNodesFromAi(result.toolIds);
      } else {
        throw new Error("Invalid response format from AI.");
      }
    } catch (error) {
      console.error(error);
      this.aiError.set('فشل الذكاء الاصطناعي في بناء سير العمل. يرجى المحاولة مرة أخرى أو توضيح طلبك.');
    } finally {
      this.isAiBuilding.set(false);
    }
  }

  private createNodesFromAi(toolIds: string[]) {
    const newNodes: CanvasNode[] = [];
    const newConnections: Connection[] = [];
    const toolsToCreate = toolIds
      .map(id => this.allTools().find(t => t.id === id))
      .filter((t): t is Tool => !!t);

    const nodeWidth = 240;
    const nodeHeight = 72;
    const horizontalSpacing = 80;
    const verticalSpacing = 60;
    const nodesPerRow = 3;

    toolsToCreate.forEach((tool, index) => {
      const newNode: CanvasNode = {
        id: `${tool.id}-${Date.now()}-${index}`,
        type: 'tool',
        title: tool.name,
        iconSvg: tool.iconSvg,
        iconColor: tool.iconColor,
        tool: tool,
        x: (index % nodesPerRow) * (nodeWidth + horizontalSpacing) + 50,
        y: Math.floor(index / nodesPerRow) * (nodeHeight + verticalSpacing) + 50
      };
      newNodes.push(newNode);

      if (index > 0) {
        newConnections.push({ from: newNodes[index - 1].id, to: newNode.id });
      }
    });

    this.nodes.set(newNodes);
    this.connections.set(newConnections);
  }
}
