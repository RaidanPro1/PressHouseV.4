
import { Injectable, signal, inject } from '@angular/core';
import { Tool } from '../models/tool.model';
import { LoggerService } from './logger.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class ToolService {
  private logger = inject(LoggerService);
  private userService = inject(UserService);

  // All icons refactored to use 24x24 viewbox with 1.5 stroke width for consistency
  tools = signal<Tool[]>([
    // 1. AI Core & Specialized Agents
    {
      id: 'ai-assistant', name: 'YemenJPT-Cloud', englishName: 'YemenJPT Cloud Model', category: 'النواة المعرفية والتحليل الذكي',
      description: 'المساعد الذكي المتقدم للصحفيين. يساعد في صياغة العناوين، التلخيص، والتحليل العميق.',
      iconSvg: 'M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z',
      iconColor: 'text-ph-blue', isActive: true, isFavorite: true, isVisiblePublicly: true, allowedRoles: ['super-admin', 'investigative-journalist', 'editor-in-chief', 'public'],
    },
    {
      id: 'public-defender', name: 'المُرافع الشعبي', englishName: 'AI Public Defender', category: 'الخدمات القانونية',
      description: 'بوت ذكي يحول الشكاوى العامية إلى عرائض قانونية رصينة وجاهزة للتقديم للمحاكم.',
      iconSvg: 'M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0 0 12 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 0 1-2.031.352 5.988 5.988 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971Zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 0 1-2.031.352 5.989 5.989 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971Z',
      iconColor: 'text-indigo-600', isActive: true, isFavorite: true, isVisiblePublicly: true, allowedRoles: ['super-admin', 'investigative-journalist', 'editor-in-chief', 'public']
    },
    {
      id: 'dastoor-meter', name: 'دستور-ميتر', englishName: 'Constitution Meter', category: 'المساءلة والرقابة',
      description: 'مرصد آلي لرصد وتحليل مخالفات المسؤولين للدستور والقانون، مع نظام تنقيط ومؤشرات حية.',
      iconSvg: 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z',
      iconColor: 'text-red-600', isActive: true, isFavorite: false, isVisiblePublicly: true, allowedRoles: ['super-admin', 'investigative-journalist', 'editor-in-chief']
    },
    {
      id: 'whisper', name: 'Whisper-YE', englishName: 'Audio Transcription', category: 'النواة المعرفية والتحليل الذكي',
      description: 'تفريغ المقابلات الطويلة، التسريبات الصوتية، ومحاضر الاجتماعات تلقائياً.',
      iconSvg: 'M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m12 0v-1.5a6 6 0 0 0-6-6v0a6 6 0 0 0-6 6v1.5m6 7.5v3.75m-3.75 0h7.5',
      iconColor: 'text-cyan-500', isActive: true, isFavorite: true, isVisiblePublicly: true, allowedRoles: ['super-admin', 'investigative-journalist', 'editor-in-chief'],
    },
    { 
      id: 'libretranslate', name: 'الترجمة الآمنة', englishName: 'LibreTranslate', category: 'النواة المعرفية والتحليل الذكي',
      description: 'ترجمة الوثائق الأجنبية الحساسة دون إرسال البيانات لسيرفرات خارجية (مثل Google).',
      iconSvg: 'M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 0 1 6-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C13.18 7.061 14.287 7.5 15.5 7.5c1.213 0 2.32-.439 3.166-1.136m0 0a3.032 3.032 0 0 1-3.675 3.675m3.675-3.675a3.032 3.032 0 0 0-3.675 3.675m0 0l-3.675 3.675', 
      iconColor: 'text-blue-500', isActive: true, isFavorite: true, isVisiblePublicly: true, allowedRoles: ['super-admin', 'investigative-journalist', 'editor-in-chief'] 
    },
    { 
      id: 'langfuse', name: 'مراقب الجودة (Langfuse)', englishName: 'AI Quality Monitoring', category: 'النواة المعرفية والتحليل الذكي',
      description: 'تحليل ومراقبة جودة مخرجات الذكاء الاصطناعي، وتوفير حلقة تغذية راجعة لتطوير النماذج.',
      iconSvg: 'M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z', 
      iconColor: 'text-blue-500', isActive: true, isFavorite: false, isVisiblePublicly: true, allowedRoles: ['super-admin'] 
    },
    { 
      id: 'gensim', name: 'YemenJPT-NLP', englishName: 'NLP Models', category: 'النواة المعرفية والتحليل الذكي',
      description: 'للتحقيقات المتقدمة: تحليل وفهم سياق آلاف الوثائق النصية واستخراج العلاقات بينها.',
      iconSvg: 'M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m.75 12 3 3m0 0 3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z', 
      iconColor: 'text-lime-600', isActive: true, isFavorite: false, isVisiblePublicly: true, allowedRoles: ['super-admin', 'investigative-journalist'] 
    },
    { 
      id: 'quaily-ai', name: 'المحرر الصحفي (Quaily)', englishName: 'AI Editorial Assistant', category: 'النواة المعرفية والتحليل الذكي',
      description: 'مساعد ذكي مدرب على دليل التحرير الخاص بالمؤسسة لضمان اتساق "النبرة" والمصطلحات.',
      iconSvg: 'M16.862 4.487l1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125',
      iconColor: 'text-green-600', isActive: true, isFavorite: false, isVisiblePublicly: true, allowedRoles: ['editor-in-chief', 'super-admin']
    },

    // 2. OSINT & Verification
    { 
      id: 'searxng', 
      name: 'محرك البحث الاستقصائي', 
      englishName: 'SearXNG Metasearch', 
      category: 'التقصي والاستخبارات مفتوحة المصدر', 
      description: 'محرك بحث يجمع النتائج من مصادر متعددة دون تتبع. يستخدم للبحث الأولي الآمن عن المعلومات دون كشف هوية المحقق.', 
      iconSvg: 'M21 21l-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z', 
      iconColor: 'text-emerald-500', 
      isActive: true, 
      isFavorite: true, 
      isVisiblePublicly: true, 
      allowedRoles: ['super-admin', 'investigative-journalist', 'editor-in-chief', 'public'] 
    },
    { 
      id: 'spiderfoot', 
      name: 'أداة SpiderFoot', 
      englishName: 'OSINT Automation', 
      category: 'التقصي والاستخبارات مفتوحة المصدر', 
      description: 'أداة أتمتة متقدمة لجمع المعلومات الاستخباراتية (OSINT) مع قدرات تحليل عميقة. تستخدم لمسح الأهداف (عناوين IP، نطاقات، بريد إلكتروني) وجمع بيانات مترابطة من مئات المصادر العامة.', 
      iconSvg: 'M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418', 
      iconColor: 'text-pink-500', 
      isActive: true, 
      isFavorite: false, 
      isVisiblePublicly: true, 
      allowedRoles: ['super-admin', 'investigative-journalist'] 
    },
    { id: 'newsleak', name: 'New/s/leak', englishName: 'Leak Analysis', category: 'التقصي والاستخبارات مفتوحة المصدر', description: 'أداة قوية لتحليل الوثائق المسربة (مثل وثائق بنما) ورسم خرائط العلاقات بين الأسماء.', iconSvg: 'M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z', iconColor: 'text-gray-700', isActive: true, isFavorite: false, isVisiblePublicly: true, allowedRoles: ['super-admin', 'investigative-journalist'] },
    { id: 'changedetection', name: 'راصد التغييرات', englishName: 'ChangeDetection.io', category: 'التقصي والاستخبارات مفتوحة المصدر', description: 'تلقي تنبيه عند تغيير أي كلمة في صفحة ويب (حذف تصريح رسمي، تغيير سعر).', iconSvg: 'M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z', iconColor: 'text-orange-500', isActive: true, isFavorite: true, isVisiblePublicly: true, allowedRoles: ['super-admin', 'investigative-journalist', 'editor-in-chief'] },

    // 3. Social Media Analysis
    { id: 'sherlock-maigret', name: 'أداة Sherlock', englishName: 'Username Search', category: 'تحليل الإعلام الاجتماعي', description: 'البحث عن اسم مستخدم معين (Username) عبر مئات المنصات الاجتماعية لكشف حسابات الهدف.', iconSvg: 'M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z', iconColor: 'text-violet-500', isActive: true, isFavorite: true, isVisiblePublicly: true, allowedRoles: ['super-admin', 'investigative-journalist', 'editor-in-chief'], },
    { id: 'social-analyzer', name: 'المحلل الاجتماعي', englishName: 'Social Analyzer', category: 'تحليل الإعلام الاجتماعي', description: 'تحليل سلوك حساب معين، أوقات نشاطه، ومن يتفاعل معه.', iconSvg: 'M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z', iconColor: 'text-blue-400', isActive: true, isFavorite: false, isVisiblePublicly: true, allowedRoles: ['super-admin', 'investigative-journalist'] },
    
    // 4. Verification & Forensics
    { id: 'invid-weverify', name: 'مختبر التحقق (InVID)', englishName: 'InVID/WeVerify Toolkit', category: 'التحقق وكشف التزييف', description: 'تجزئة الفيديوهات إلى صور للبحث العكسي، وكشف التلاعب في البيانات الوصفية (Metadata).', iconSvg: 'm15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9A2.25 2.25 0 0 0 4.5 18.75Z', iconColor: 'text-red-600', isActive: true, isFavorite: true, isVisiblePublicly: true, allowedRoles: ['investigative-journalist', 'editor-in-chief', 'super-admin'] },
    { id: 'meedan-check', name: 'منصة Meedan Check', englishName: 'Fact-Checking Platform', category: 'التحقق وكشف التزييف', description: 'منصة عمل جماعي لاستقبال الشائعات، التحقق منها، ونشر النتائج للجمهور.', iconSvg: 'M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z', iconColor: 'text-green-600', isActive: true, isFavorite: false, isVisiblePublicly: true, allowedRoles: ['editor-in-chief', 'super-admin'] },
    { id: 'fotoforensics', name: 'تحليل ELA للصور', englishName: 'FotoForensics (ELA)', category: 'التحقق وكشف التزييف', description: 'تحليل مستوى الخطأ في ضغط الصور (ELA) لكشف التلاعب والتعديلات الرقمية التي لا ترى بالعين المجردة.', iconSvg: 'M2.25 15.75l5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z', iconColor: 'text-amber-600', isActive: true, isFavorite: false, isVisiblePublicly: true, allowedRoles: ['investigative-journalist', 'editor-in-chief', 'super-admin'] },
    { id: 'exiftool', name: 'مستخرج البيانات الوصفية', englishName: 'ExifTool Metadata Analysis', category: 'التحقق وكشف التزييف', description: 'استخراج وتحليل البيانات الوصفية (Metadata) من الصور والفيديوهات لكشف معلومات مثل نوع الكاميرا وإحداثيات GPS.', iconSvg: 'M11.25 11.25l.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z', iconColor: 'text-sky-600', isActive: true, isFavorite: false, isVisiblePublicly: true, allowedRoles: ['investigative-journalist', 'editor-in-chief', 'super-admin'] },

    // 5. Geo-Intelligence
    { id: 'ushahidi', name: 'منصة Ushahidi', englishName: 'Crowdsourcing Platform', category: 'الخرائط والرصد الجغرافي', description: 'إنشاء خريطة تفاعلية لرصد الانتهاكات أو الأحداث (مثل انقطاع الخدمات) بناءً على بلاغات الجمهور.', iconSvg: 'M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z', iconColor: 'text-green-500', isActive: true, isFavorite: false, isVisiblePublicly: true, allowedRoles: ['super-admin', 'investigative-journalist', 'editor-in-chief'] },
    { id: 'kepler', name: 'محلل Kepler.gl', englishName: 'Geospatial Analysis', category: 'الخرائط والرصد الجغرافي', description: 'تحويل جداول البيانات الضخمة (Excel) إلى خرائط ثلاثية الأبعاد تفاعلية ومذهلة بصرياً.', iconSvg: 'M9 6.75V15m6-6v8.25m.503-6.938 4.896 9.432M5.625 11.25l4.896 9.432m2.759-19.182a22.512 22.512 0 0 1 7.184 7.29l-.08.208a22.55 22.55 0 0 0-7.104-7.29 22.51 22.51 0 0 0-7.105 7.29l-.079-.208a22.511 22.511 0 0 1 7.184-7.29ZM3.75 18H20.25', iconColor: 'text-teal-500', isActive: true, isFavorite: false, isVisiblePublicly: true, allowedRoles: ['super-admin', 'investigative-journalist'] },
    { id: 'nasa-firms', name: 'راصد الحرائق (NASA FIRMS)', englishName: 'Fire Information for Resource Management', category: 'الخرائط والرصد الجغرافي', description: 'كشف مناطق القصف والاشتباكات عبر تحليل بيانات الأقمار الصناعية الحرارية من وكالة ناسا بشكل شبه لحظي.', iconSvg: 'M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.287 8.287 0 0 0 2.613-2.555 8.252 8.252 0 0 1 3.749-1.832Z', iconColor: 'text-orange-500', isActive: true, isFavorite: false, isVisiblePublicly: true, allowedRoles: ['investigative-journalist', 'editor-in-chief', 'super-admin'] },
    
    // 6. Financial & Corporate
    { id: 'openduka', name: 'كاشف الشركات', englishName: 'OpenDuka', category: 'التحقيقات المالية والشركات', description: 'قاعدة بيانات للشركات لكشف من يملك ماذا، وربط الشخصيات بالكيانات التجارية.', iconSvg: 'M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6h1.5m-1.5 3h1.5m-1.5 3h1.5M15 21v-3.375c0-.621-.504-1.125-1.125-1.125H10.125c-.621 0-1.125.504-1.125 1.125V21', iconColor: 'text-gray-800', isActive: true, isFavorite: false, isVisiblePublicly: true, allowedRoles: ['super-admin', 'investigative-journalist'] },

    // 7. Archiving & Data Vaults
    { id: 'archivebox', name: 'أرشيف الويب الدائم', englishName: 'ArchiveBox', category: 'الأرشفة والتوثيق الرقمي', description: 'حفظ نسخة "قانونية" من صفحات الويب والتغريدات كدليل قبل أن يتم حذفها.', iconSvg: 'M20.25 7.5l-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z', iconColor: 'text-indigo-500', isActive: true, isFavorite: true, isVisiblePublicly: true, allowedRoles: ['super-admin', 'investigative-journalist', 'editor-in-chief'] },
    { id: 'nocodb', name: 'قاعدة بيانات الانتهاكات', englishName: 'Violations Database', category: 'الأرشفة والتوثيق الرقمي', description: 'نظام لتوثيق وأرشفة الانتهاكات ضد الصحفيين لغرض التقارير الحقوقية.', iconSvg: 'M3 7.5h18M3 12h18m-9 4.5h9M3.75 18a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z', iconColor: 'text-amber-600', isActive: true, isFavorite: false, isVisiblePublicly: true, allowedRoles: ['investigative-journalist', 'editor-in-chief', 'super-admin'] },

    // 8. Communication & Workflow
    { id: 'mattermost', name: 'منصة التعاون (Mattermost)', englishName: 'Team Collaboration', category: 'التواصل وسير العمل', description: 'التواصل الداخلي الآمن والمشفر بين أعضاء الفريق بعيداً عن الرقابة.', iconSvg: 'M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z', iconColor: 'text-sky-600', isActive: true, isFavorite: true, isVisiblePublicly: true, allowedRoles: ['investigative-journalist', 'editor-in-chief', 'super-admin'] },
    { id: 'nextcloud', name: 'المكتب السحابي (Nextcloud)', englishName: 'Nextcloud Hub', category: 'التواصل وسير العمل', description: 'مشاركة المستندات وتخزين مسودات التحقيقات بأمان (بديل Google Drive).', iconSvg: 'M2.25 15a4.5 4.5 0 0 0 4.5 4.5H18a3.75 3.75 0 0 0 1.332-7.257 3 3 0 0 0-3.758-3.847 5.25 5.25 0 0 0-10.233 2.343A4.5 4.5 0 0 0 2.25 15Z', iconColor: 'text-blue-600', isActive: true, isFavorite: true, isVisiblePublicly: true, allowedRoles: ['investigative-journalist', 'editor-in-chief', 'super-admin'] },
    
    // 9. Advanced Cyber Security
    { id: 'webtop', name: 'المتصفح الآمن', englishName: 'Secure Browser (Webtop)', category: 'الأمن السيبراني المتقدم', description: 'فتح الروابط المشبوهة داخل بيئة معزولة (Sandbox) لحماية جهاز الصحفي من الاختراق.', iconSvg: 'M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25A2.25 2.25 0 0 1 5.25 3h13.5A2.25 2.25 0 0 1 21 5.25Z', iconColor: 'text-gray-600', isActive: true, isFavorite: true, isVisiblePublicly: true, allowedRoles: ['investigative-journalist', 'editor-in-chief', 'super-admin'] },
    
    // other categories...
    { id: 'n8n', name: 'منصة الأتمتة (n8n)', englishName: 'Workflow Automation', category: 'الأتمتة وسير العمل', description: 'ربط التطبيقات المختلفة لإنشاء تدفقات عمل آلية (مثلاً: عند رصد انتهاك جديد، أرسل تنبيه).', iconSvg: 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z', iconColor: 'text-purple-500', isActive: true, isFavorite: false, isVisiblePublicly: true, allowedRoles: ['super-admin'] },
    { id: 'superdesk', name: 'إدارة المحتوى (Superdesk)', englishName: 'Superdesk CMS', category: 'إدارة غرفة الأخبار والنشر', description: 'قلب غرفة الأخبار؛ استقبال الخيوط الصحفية، توزيع المهام، ومراجعة المقالات (Workflow).', iconSvg: 'M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z', iconColor: 'text-gray-700', isActive: true, isFavorite: false, isVisiblePublicly: true, allowedRoles: ['editor-in-chief', 'super-admin'] },
    { id: 'ghost-ye', name: 'منصة النشر (Ghost-YE)', englishName: 'Ghost Publishing Platform', category: 'إدارة غرفة الأخبار والنشر', description: 'نشر المقالات والتحقيقات للجمهور بتصميم حديث وسريع (واجهة القارئ).', iconSvg: 'M16.862 4.487l1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10', iconColor: 'text-sky-500', isActive: true, isFavorite: true, isVisiblePublicly: true, allowedRoles: ['editor-in-chief', 'super-admin'] },
    { id: 'openproject', name: 'تخطيط المشاريع (OpenProject)', englishName: 'OpenProject', category: 'إدارة المشاريع المؤسسية', description: 'متابعة تقدم التحقيقات الاستقصائية طويلة المدى والجداول الزمنية.', iconSvg: 'M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0h18', iconColor: 'text-teal-600', isActive: true, isFavorite: false, isVisiblePublicly: true, allowedRoles: ['editor-in-chief', 'super-admin'] },
    { id: 'bigbluebutton', name: 'الفصول الافتراضية', englishName: 'BigBlueButton', category: 'بوابة التدريب', description: 'عقد ورش عمل واجتماعات فيديو آمنة (بديل Zoom).', iconSvg: 'M15.75 10.5l4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9A2.25 2.25 0 0 0 4.5 18.75Z', iconColor: 'text-blue-500', isActive: true, isFavorite: false, isVisiblePublicly: true, allowedRoles: ['super-admin', 'editor-in-chief'] },
    { id: 'chatwoot', name: 'تذاكر الدعم (Chatwoot)', englishName: 'Support Tickets', category: 'الدعم الفني', description: 'التواصل مع الجمهور أو تقديم الدعم التقني للصحفيين داخل المنصة.', iconSvg: 'M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z', iconColor: 'text-teal-500', isActive: true, isFavorite: false, isVisiblePublicly: true, allowedRoles: ['super-admin', 'editor-in-chief'] },
    { id: 'tooljet', name: 'بناء النماذج (ToolJet)', englishName: 'Form Builder', category: 'بوابة التدريب', description: 'بناء واجهات بسيطة وسريعة لقواعد البيانات دون الحاجة لبرمجة معقدة.', iconSvg: 'M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 1.083-1.558 1.685-1.558 1.686M8.25 16.5l1-1.083 1.558-1.685 1.558-1.686m0 4.455 1 1.083 1.558 1.685 1.558 1.686M15.75 16.5l-1-1.083-1.558-1.685-1.558-1.686M9 21h6', iconColor: 'text-rose-500', isActive: true, isFavorite: false, isVisiblePublicly: true, allowedRoles: ['super-admin'] },
  ]);

  toggleToolStatus(toolId: string) {
    this.tools.update(tools =>
      tools.map(tool =>
        tool.id === toolId ? { ...tool, isActive: !tool.isActive } : tool
      )
    );
    const tool = this.tools().find(t => t.id === toolId);
    if (tool) {
        this.logger.logEvent(
            `Tool Status Changed: ${tool.name}`,
            `New status: ${tool.isActive ? 'Active' : 'Inactive'}`,
            this.userService.currentUser()?.name,
            this.userService.currentUser()?.role === 'super-admin'
        );
    }
  }

  toggleFavoriteStatus(toolId: string) {
    this.tools.update(tools =>
      tools.map(tool =>
        tool.id === toolId ? { ...tool, isFavorite: !tool.isFavorite } : tool
      )
    );
  }

  updateTool(toolId: string, updates: Partial<Tool>) {
    this.tools.update(tools =>
      tools.map(tool =>
        tool.id === toolId ? { ...tool, ...updates } : tool
      )
    );
  }
}
