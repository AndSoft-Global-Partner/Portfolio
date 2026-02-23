import { createContext } from 'react';

export type Lang = 'EN' | 'MN';

export const translations = {
  // Header nav
  'nav.home': { EN: 'Home', MN: 'Нүүр' },
  'nav.technologies': { EN: 'Technologies', MN: 'Технологи' },
  'nav.projects': { EN: 'Projects', MN: 'Төслүүд' },
  'nav.contact': { EN: 'Contact', MN: 'Холбоо барих' },

  // Hero section
  'hero.title': { EN: 'guest@andsoft-os — bash — 120×40', MN: 'зочин@andsoft-os — bash — 120×40' },
  'hero.subtitle': { EN: 'Digital Studio — Innovative Technology Solutions', MN: 'Дижитал Студио — Инновацийн Технологийн Шийдлүүд' },
  'hero.motd': { EN: 'Cutting-edge tools to grow and scale your business.', MN: 'Таны бизнесийг өсгөх, өргөжүүлэх дэвшилтэт хэрэгслүүд.' },
  'hero.motdSub': { EN: 'We build the impossible. We ship the extraordinary.', MN: 'Бид боломжгүйг бүтээнэ. Бид гайхалтайг хүргэнэ.' },
  'hero.trustedNodes': { EN: '/etc/network/trusted-nodes', MN: '/etc/network/итгэмжлэгдсэн-зангилаа' },

  // Info lines
  'info.os': { EN: 'AndSoft OS v2.5 LTS', MN: 'AndSoft OS v2.5 LTS' },
  'info.kernel': { EN: 'Innovation 6.8.0-andsoft', MN: 'Инновац 6.8.0-andsoft' },
  'info.uptime': { EN: '5+ years of building solutions', MN: '5+ жилийн шийдэл бүтээсэн туршлага' },
  'info.packages': { EN: '50+ projects shipped worldwide', MN: '50+ төсөл дэлхий даяар хүргэгдсэн' },
  'info.shell': { EN: 'React · Node.js · Python · Flutter', MN: 'React · Node.js · Python · Flutter' },
  'info.resolution': { EN: 'Pixel Perfect™', MN: 'Пиксел Төгс™' },
  'info.cpu': { EN: 'Creative Engine @ ∞ GHz', MN: 'Бүтээлч Хөдөлгүүр @ ∞ GHz' },
  'info.memory': { EN: '30+ happy clients / ∞', MN: '30+ сэтгэл ханамжтай үйлчлүүлэгч / ∞' },

  // TechStack
  'tech.title': { EN: 'System Monitor — Active Processes', MN: 'Системийн Хяналт — Идэвхтэй Процессууд' },
  'tech.activeProcesses': { EN: 'ACTIVE PROCESSES', MN: 'ИДЭВХТЭЙ ПРОЦЕССУУД' },
  'tech.load': { EN: 'LOAD', MN: 'АЧААЛАЛ' },
  'tech.tasks': { EN: 'TASKS', MN: 'ДААЛГАВАР' },
  'tech.uptime': { EN: 'UPTIME', MN: 'АЖИЛЛАГААНЫ ХУГАЦАА' },
  'tech.pid': { EN: 'PID', MN: 'PID' },
  'tech.process': { EN: 'PROCESS', MN: 'ПРОЦЕСС' },
  'tech.cpu': { EN: 'CPU', MN: 'CPU' },
  'tech.memory': { EN: 'MEMORY', MN: 'САНАХ ОЙ' },
  'tech.status': { EN: 'STATUS', MN: 'ТӨЛӨВ' },
  'tech.active': { EN: 'ACTIVE', MN: 'ИДЭВХТЭЙ' },
  'tech.healthy': { EN: 'HEALTHY', MN: 'ХЭВИЙН' },
  'tech.totalProcesses': { EN: 'processes · All systems operational', MN: 'процесс · Бүх систем хэвийн' },

  // Projects
  'projects.title': { EN: '/home/andsoft/projects — Files', MN: '/home/andsoft/төслүүд — Файлууд' },
  'projects.home': { EN: 'Home', MN: 'Нүүр' },
  'projects.projects': { EN: 'Projects', MN: 'Төслүүд' },
  'projects.recent': { EN: 'Recent', MN: 'Сүүлийн' },
  'projects.favorites': { EN: 'Favorites', MN: 'Дуртай' },
  'projects.storage': { EN: 'Storage', MN: 'Хадгалах сан' },
  'projects.name': { EN: 'Name', MN: 'Нэр' },
  'projects.type': { EN: 'Type', MN: 'Төрөл' },
  'projects.modified': { EN: 'Modified', MN: 'Өөрчлөгдсөн' },
  'projects.size': { EN: 'Size', MN: 'Хэмжээ' },
  'projects.items': { EN: 'items', MN: 'зүйл' },
  'projects.selected': { EN: '1 selected', MN: '1 сонгосон' },
  'projects.noneSelected': { EN: 'None selected', MN: 'Сонгоогүй' },
  'projects.free': { EN: 'Free', MN: 'Чөлөөтэй' },
  'projects.open': { EN: 'Open', MN: 'Нээх' },

  // Project items
  'project.ecommerce.name': { EN: 'E-Commerce Platform', MN: 'Цахим худалдааны платформ' },
  'project.ecommerce.desc': { EN: 'A comprehensive online shopping experience with AI-powered recommendations and real-time inventory.', MN: 'AI зөвлөмжтэй, бодит цагийн бараа материалын удирдлагатай онлайн худалдааны платформ.' },
  'project.health.name': { EN: 'HealthTrack App', MN: 'Эрүүл мэндийн апп' },
  'project.health.desc': { EN: 'Fitness and nutrition tracking mobile app with real-time insights and personalized plans.', MN: 'Фитнесс, хоол тэжээлийн хяналтын мобайл апп, хувийн төлөвлөгөөтэй.' },
  'project.corporate.name': { EN: 'Corporate Portal', MN: 'Байгууллагын портал' },
  'project.corporate.desc': { EN: 'Internal communication and document management system for enterprise teams.', MN: 'Байгууллагын дотоод харилцаа, баримт бичгийн удирдлагын систем.' },
  'project.financial.name': { EN: 'Financial Dashboard', MN: 'Санхүүгийн хяналтын самбар' },
  'project.financial.desc': { EN: 'Real-time financial analytics, reporting platform and data visualization.', MN: 'Бодит цагийн санхүүгийн аналитик, тайлан, дата дүрслэлийн платформ.' },

  // Contact
  'contact.settings': { EN: 'System Settings — Network', MN: 'Системийн Тохиргоо — Сүлжээ' },
  'contact.phone': { EN: 'Phone', MN: 'Утас' },
  'contact.email': { EN: 'Email', MN: 'Имэйл' },
  'contact.location': { EN: 'Location', MN: 'Байршил' },
  'contact.map': { EN: 'Maps — Ulaanbaatar, Mongolia', MN: 'Газрын зураг — Улаанбаатар, Монгол' },
  'contact.compose': { EN: 'Compose — New Message', MN: 'Бичих — Шинэ зурвас' },
  'contact.to': { EN: 'To:', MN: 'Хэнд:' },
  'contact.fromName': { EN: 'From (Name)', MN: 'Нэр' },
  'contact.replyTo': { EN: 'Reply-To', MN: 'Хариу имэйл' },
  'contact.subject': { EN: 'Subject', MN: 'Гарчиг' },
  'contact.body': { EN: 'Body', MN: 'Агуулга' },
  'contact.yourName': { EN: 'Your name', MN: 'Таны нэр' },
  'contact.yourEmail': { EN: 'your@email.com', MN: 'таны@имэйл.com' },
  'contact.projectInquiry': { EN: 'Project inquiry', MN: 'Төслийн лавлагаа' },
  'contact.tellUs': { EN: 'Tell us about your project...', MN: 'Төслийнхөө тухай бичнэ үү...' },
  'contact.sent': { EN: '✓ Message sent successfully', MN: '✓ Зурвас амжилттай илгээгдлээ' },
  'contact.sending': { EN: 'Sending...', MN: 'Илгээж байна...' },
  'contact.allRequired': { EN: 'All fields required', MN: 'Бүх талбарыг бөглөнө үү' },
  'contact.send': { EN: 'Send', MN: 'Илгээх' },

  // Command Palette
  'palette.placeholder': { EN: 'Type a command…', MN: 'Команд бичнэ үү…' },
  'palette.navigate': { EN: 'Navigate', MN: 'Шилжих' },
  'palette.actions': { EN: 'Actions', MN: 'Үйлдлүүд' },
  'palette.apps': { EN: 'Open App', MN: 'Апп нээх' },
  'palette.toggleTheme': { EN: 'Toggle Theme', MN: 'Тема солих' },
  'palette.toggleLang': { EN: 'Toggle Language', MN: 'Хэл солих' },
  'palette.hint': { EN: 'Ctrl+K to open command palette', MN: 'Ctrl+K командын самбар нээх' },
  'palette.openTerminal': { EN: 'Open Terminal', MN: 'Терминал нээх' },
  'palette.openMonitor': { EN: 'Open System Monitor', MN: 'Систем хяналт нээх' },
  'palette.openFiles': { EN: 'Open File Manager', MN: 'Файл менежер нээх' },
  'palette.openMail': { EN: 'Open Mail', MN: 'Имэйл нээх' },

  // Footer
  'footer.title': { EN: '/sys/footer — System Info', MN: '/sys/хөл — Системийн мэдээлэл' },
  'footer.description': { EN: 'Building the future of digital infrastructure. Secure, scalable, and intelligent solutions for the modern world.', MN: 'Дижитал дэд бүтцийн ирээдүйг бүтээж байна. Аюулгүй, өргөтгөх боломжтой, ухаалаг шийдлүүд.' },
  'footer.contact': { EN: 'CONTACT', MN: 'ХОЛБОО БАРИХ' },
  'footer.systemStatus': { EN: 'SYSTEM STATUS', MN: 'СИСТЕМИЙН ТӨЛӨВ' },
  'footer.network': { EN: 'NETWORK', MN: 'СҮЛЖЭЭ' },
  'footer.online': { EN: 'ONLINE', MN: 'ОНЛАЙН' },
  'footer.privacy': { EN: 'Privacy', MN: 'Нууцлал' },
  'footer.terms': { EN: 'Terms', MN: 'Нөхцөл' },
  'footer.visitors': { EN: 'Visitors', MN: 'Зочид' },
  'footer.accessGranted': { EN: 'ACCESS GRANTED', MN: 'ХАНДАЛТ ЗӨВШӨӨРӨГДСӨН' },
  'footer.openTerminal': { EN: '▶ Show', MN: '▶ Харуулах' },
  'footer.closeTerminal': { EN: '▼ Hide', MN: '▼ Нуух' },
} as const;

export type TranslationKey = keyof typeof translations;

export interface I18nContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggleLang: () => void;
  t: (key: TranslationKey) => string;
}

export const I18nContext = createContext<I18nContextType | null>(null);
