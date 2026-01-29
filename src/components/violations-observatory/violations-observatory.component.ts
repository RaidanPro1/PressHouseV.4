
import { Component, ChangeDetectionStrategy, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolService } from '../../services/tool.service';
import { UserService } from '../../services/user.service';
import { ToolCardComponent } from '../tool-card/tool-card.component';
import { Tool } from '../../models/tool.model';
import { ViolationReportFormComponent } from '../violation-report-form/violation-report-form.component';

interface Violation {
  id: number;
  case: string; // Type of violation
  journalist: string; // Victim name or entity
  governorate: string;
  date: string;
  perpetrator: string;
  status: 'Verified' | 'Pending' | 'Closed';
}

@Component({
  selector: 'app-violations-observatory',
  standalone: true,
  imports: [CommonModule, ToolCardComponent, ViolationReportFormComponent],
  templateUrl: './violations-observatory.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViolationsObservatoryComponent {
  private toolService = inject(ToolService);
  userService = inject(UserService);

  user = this.userService.currentUser;
  activeTab = signal<'dashboard' | 'database' | 'map' | 'report'>('dashboard');

  // Updated Stats reflecting the imported data logic
  stats = {
    total: 2450,
    thisMonth: 12,
    mostDangerous: 'صنعاء'
  };

  violationsByYear = [
    { year: 2021, count: 86 },
    { year: 2022, count: 92 },
    { year: 2023, count: 54 },
    { year: 2024, count: 35 },
  ];

  violationsByType = [
    { type: 'اعتقال وحجز حرية', count: 450, color: 'bg-red-600' },
    { type: 'تهديد وتحريض', count: 320, color: 'bg-orange-500' },
    { type: 'إصابة', count: 180, color: 'bg-yellow-500' },
    { type: 'منع من التغطية', count: 150, color: 'bg-blue-500' },
    { type: 'قتل', count: 52, color: 'bg-black' },
    { type: 'محاكمات واستدعاء', count: 110, color: 'bg-purple-500' },
  ];

  violationsByGovernorate = [
    { name: 'صنعاء', count: 980 },
    { name: 'تعز', count: 420 },
    { name: 'عدن', count: 350 },
    { name: 'مأرب', count: 180 },
    { name: 'الحديدة', count: 160 },
    { name: 'حضرموت', count: 140 },
  ];

  private perpetratorSourceData = [
    { name: 'جماعة أنصار الله (الحوثيين)', count: 1250, color: 'stroke-red-600', legendColor: 'bg-red-600' },
    { name: 'قوات الحكومة الشرعية', count: 480, color: 'stroke-blue-600', legendColor: 'bg-blue-600' },
    { name: 'المجلس الانتقالي الجنوبي', count: 390, color: 'stroke-yellow-500', legendColor: 'bg-yellow-500' },
    { name: 'مجهولون', count: 180, color: 'stroke-gray-500', legendColor: 'bg-gray-500' },
    { name: 'تنظيمات متطرفة', count: 50, color: 'stroke-black', legendColor: 'bg-black' },
  ];

  totalPerpetratorCount = computed(() => {
    return this.perpetratorSourceData.reduce((sum, p) => sum + p.count, 0);
  });

  perpetratorChartData = computed(() => {
    const data = this.perpetratorSourceData;
    const total = this.totalPerpetratorCount();
    if (total === 0) return [];

    const radius = 54;
    const circumference = 2 * Math.PI * radius;
    let cumulativePercentage = 0;

    return data.map(item => {
      const percentage = (item.count / total) * 100;
      const rotation = -90 + (cumulativePercentage / 100) * 360;
      
      const segmentData = {
        ...item,
        percentage: percentage.toFixed(1),
        strokeDasharray: `${circumference}`,
        strokeDashoffset: circumference - (percentage / 100) * circumference,
        rotation,
      };
      cumulativePercentage += percentage;
      return segmentData;
    });
  });

  // Detailed Realistic Data (Simulating Import from Marsadak)
  violationsData = signal<Violation[]>([
    { id: 2450, case: 'اعتقال تعسفي', journalist: 'فهد الأرحبي', governorate: 'عمران', date: '2024-07-20', perpetrator: 'جماعة أنصار الله', status: 'Pending' },
    { id: 2449, case: 'تهديد بالقتل', journalist: 'محمد اليزيدي', governorate: 'عدن', date: '2024-07-15', perpetrator: 'مسلحون مجهولون', status: 'Verified' },
    { id: 2448, case: 'استدعاء أمني', journalist: 'أحمد ماهر', governorate: 'عدن', date: '2024-07-10', perpetrator: 'المجلس الانتقالي', status: 'Closed' },
    { id: 2447, case: 'منع من التغطية', journalist: 'طاقم قناة بلقيس', governorate: 'مأرب', date: '2024-06-28', perpetrator: 'قوات الأمن الخاصة', status: 'Verified' },
    { id: 2446, case: 'اقتحام مقر', journalist: 'نقابة الصحفيين اليمنيين', governorate: 'عدن', date: '2024-06-15', perpetrator: 'قوات الحزام الأمني', status: 'Verified' },
    { id: 2445, case: 'حكم بالإعدام', journalist: 'توفيق المنصوري (سابقاً)', governorate: 'صنعاء', date: '2024-05-20', perpetrator: 'المحكمة الجزائية - الحوثيين', status: 'Verified' },
    { id: 2444, case: 'إيقاف راتب', journalist: 'موظفي وكالة سبأ', governorate: 'صنعاء', date: '2024-05-01', perpetrator: 'جماعة أنصار الله', status: 'Verified' },
    { id: 2443, case: 'اعتداء جسدي', journalist: 'مجلي الصمدي', governorate: 'صنعاء', date: '2024-04-12', perpetrator: 'عصابة مسلحة', status: 'Verified' },
    { id: 2442, case: 'اعتقال', journalist: 'نصحى بحيبح', governorate: 'مأرب', date: '2024-03-30', perpetrator: 'الأمن السياسي', status: 'Closed' },
    { id: 2441, case: 'مصادرة معدات', journalist: 'مصور مستقل', governorate: 'حضرموت', date: '2024-03-15', perpetrator: 'النخبة الحضرمية', status: 'Verified' },
    { id: 2440, case: 'تحريض إعلامي', journalist: 'وداد البدوي', governorate: 'تعز', date: '2024-02-28', perpetrator: 'نشطاء تواصل اجتماعي', status: 'Pending' },
    { id: 2439, case: 'قصف منزل', journalist: 'عبدالله خلف', governorate: 'الحديدة', date: '2024-02-10', perpetrator: 'قوات مشتركة', status: 'Verified' },
    { id: 2438, case: 'اختطاف', journalist: 'محمد المقري', governorate: 'حضرموت', date: '2015-10-12', perpetrator: 'تنظيم القاعدة', status: 'Pending' },
    { id: 2437, case: 'إخفاء قسري', journalist: 'وحيد الصوفي', governorate: 'صنعاء', date: '2015-04-06', perpetrator: 'جماعة أنصار الله', status: 'Pending' },
    { id: 2436, case: 'قتل (قنص)', journalist: 'أحمد الشيباني', governorate: 'تعز', date: '2016-02-16', perpetrator: 'قناصة الحوثيين', status: 'Verified' },
    { id: 2435, case: 'اغتيال بعبوة', journalist: 'صابر الحيدري', governorate: 'عدن', date: '2022-06-15', perpetrator: 'مجهولون', status: 'Verified' },
    { id: 2434, case: 'اغتيال', journalist: 'رشا الحرازي', governorate: 'عدن', date: '2021-11-09', perpetrator: 'عبوة ناسفة', status: 'Verified' },
    { id: 2433, case: 'حجب موقع', journalist: 'المصدر أونلاين', governorate: 'اليمن', date: '2016-01-01', perpetrator: 'وزارة الاتصالات - صنعاء', status: 'Verified' },
  ]);

  filteredViolations = computed(() => this.violationsData());


  portalTools = computed(() => 
    this.toolService.tools().filter(tool => tool.category === 'مرصد الانتهاكات الصحفية')
  );

  setTab(tab: 'dashboard' | 'database' | 'map' | 'report') {
    this.activeTab.set(tab);
  }

  handleToolToggle(toolId: string) {
    this.toolService.toggleToolStatus(toolId);
  }

  handleToggleFavorite(toolId: string) {
    this.toolService.toggleFavoriteStatus(toolId);
  }

  handleRunTool(tool: Tool) {
    console.log(`Running tool: ${tool.name}`);
  }
}
