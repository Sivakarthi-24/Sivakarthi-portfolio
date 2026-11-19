export interface ProjectItem {
  id: string;
  title: string;
  category: 'Web & UI/UX' | '2D Games';
  year: string;
  summary: string;
  problem: string;
  architecture: string;
  stack: string[];
  imageUrl: string;
  imageAlt: string;
  githubUrl: string;
  liveUrl?: string;
  statusLabel: string;
  isFromGitHub?: boolean;
}

export interface SkillGroup {
  category: string;
  subtitle: string;
  skills: {
    name: string;
    stage: 'Core Foundation' | 'Active Practice' | 'Exploring';
    focus: string;
  }[];
}

export interface JourneyMilestone {
  id: string;
  tag: string;
  type: 'Education' | 'Programming' | 'GitHub' | 'LinkedIn' | 'Interests';
  title: string;
  organization: string;
  description: string;
}

export const PROFILE = {
  brand: 'SIVAKARTHI ANNAMALAI',
  brandSubtitle: 'Portfolio',
  name: 'Sivakarthi Annamalai',
  roleLine: 'ECE Student · Developer · Technology Enthusiast',
  headline: 'Engineering ideas.\nBuilding possibilities.',
  subHeadline: 'Exploring technology, creativity and the possibilities beyond the ordinary.',
  location: 'Chennai, India',
  college: 'Panimalar Engineering College, Chennai',
  degree: 'Electronics and Communication Engineering (ECE)',
  email: 'sivakarthiannamalai@gmail.com',
  githubUrl: 'https://github.com/Sivakarthi-24',
  githubHandle: 'Sivakarthi-24',
  linkedinUrl: 'https://www.linkedin.com/in/sivakarthi-annamalai/',
  linkedinCertsUrl: 'https://www.linkedin.com/in/sivakarthi-annamalai/details/certifications/',
  portraitUrl: '/assets/aistudio/WhatsApp_Image_2026-10-20_at_9.06.48_PM_cd54aab6.jpeg',
  aboutParagraphs: [
    "I'm Sivakarthi Annamalai, an Electronics and Communication Engineering (ECE) student at Panimalar Engineering College, interested in Embedded Systems, IoT, software development, UI/UX, web designing, programming, and AI.",
    'I enjoy learning by building, experimenting with code, and exploring how ideas can become practical digital and engineering solutions.',
  ],
  ambitionNote:
    'Focused on continuous growth across programming, web design, embedded engineering, and AI—documenting projects on GitHub and sharing verified credentials on LinkedIn.',
};

export const HERO_ARTWORK_URL = '/src/assets/images/hero_tokyo_rain_1795092086961.jpg';

export const FEATURED_PROJECTS: ProjectItem[] = [
  {
    id: 'kana-idly-kadai',
    title: 'KANA — Tamil Nadu Idly Kadai',
    category: '2D Games',
    year: 'GitHub · Vercel',
    summary:
      'A 2D browser-based cooking and restaurant management game featuring traditional Tamil Nadu dishes, customer orders, cooking challenges, tips, earnings, and shop upgrades.',
    problem:
      'Turn traditional Tamil Nadu culinary themes into a responsive 2D browser cooking and restaurant management game.',
    architecture:
      'Built with HTML, CSS, and JavaScript handling customer order queues, cooking challenge timing, earnings, and shop upgrades.',
    stack: ['HTML', 'CSS', 'JavaScript'],
    imageUrl: '/src/assets/images/project_kana_tamil_1795092090431.jpg',
    imageAlt: 'Atmospheric nocturnal South Indian tiffin stall scene representing KANA Idly Kadai',
    githubUrl: 'https://github.com/Sivakarthi-24/KANA_idly_kadai_game',
    liveUrl: 'https://kanaidlykadaigame-five.vercel.app',
    statusLabel: 'Live on Vercel · GitHub',
  },
  {
    id: 'taskflow-manager',
    title: 'TaskFlow — Smart Productivity Manager',
    category: 'Web & UI/UX',
    year: 'GitHub · Vercel',
    summary:
      'A responsive web application designed to help users organize daily activities and manage tasks with CRUD operations, categorization (Work, Personal, Study, Projects, Other), and priority levels.',
    problem:
      'Organize daily activities across Work, Personal, Study, and Projects with clear priority levels and clean task controls.',
    architecture:
      'Built with JavaScript, HTML, and CSS supporting Create, Read, Update, and Delete task workflows with category and priority management.',
    stack: ['JavaScript', 'HTML', 'CSS'],
    imageUrl: '/src/assets/images/anime_monolith_station_1795092089623.jpg',
    imageAlt: 'Architectural dark transit hall representing structured productivity flow in TaskFlow',
    githubUrl: 'https://github.com/Sivakarthi-24/Taskflow',
    liveUrl: 'https://taskflow-nine-beryl.vercel.app',
    statusLabel: 'Live on Vercel · GitHub',
  },
  {
    id: 'nami-weather',
    title: 'Nami Weather',
    category: 'Web & UI/UX',
    year: 'GitHub',
    summary:
      'A responsive weather dashboard providing real-time global weather updates, temperature, humidity, wind speed, atmospheric pressure, and a 5-day forecast using the OpenWeatherMap API.',
    problem:
      'Present global weather metrics and a 5-day forecast cleanly in a responsive web dashboard.',
    architecture:
      'Built with HTML, CSS, JavaScript, Node.js, and Express.js integrating the OpenWeatherMap API.',
    stack: ['HTML', 'CSS', 'JavaScript', 'Node.js', 'Express.js'],
    imageUrl: '/src/assets/images/anime_shibuya_sakura_1795092088206.jpg',
    imageAlt: 'Rain-lit Tokyo pedestrian bridge representing Nami Weather atmospheric telemetry',
    githubUrl: 'https://github.com/Sivakarthi-24/nami-weather',
    statusLabel: 'Public Repository · GitHub',
  },
  {
    id: 'delivery-da',
    title: 'Delivery Da',
    category: '2D Games',
    year: 'GitHub',
    summary:
      'A 2D Tamil Nadu-inspired arcade delivery game where players ride scooters, pick up food orders, navigate busy streets, dodge traffic, and deliver to customers with vehicle customization, missions, festival environments, and Tamil & English support.',
    problem:
      'Build an interactive 2D street delivery arcade game with bilingual Tamil and English language support.',
    architecture:
      'Built with HTML, CSS, and JavaScript featuring scooter movement, traffic obstacles, missions, vehicle customization, and festival environments.',
    stack: ['HTML', 'CSS', 'JavaScript'],
    imageUrl: '/src/assets/images/hero_tokyo_rain_1795092086961.jpg',
    imageAlt: 'Nocturnal urban skywalk aesthetic representing Delivery Da street navigation',
    githubUrl: 'https://github.com/Sivakarthi-24/delivery-da',
    statusLabel: 'Public Repository · GitHub',
  },
];

export const SKILL_GROUPS: SkillGroup[] = [
  {
    category: 'Programming',
    subtitle: 'Languages in active study and practice',
    skills: [
      {
        name: 'C',
        stage: 'Core Foundation',
        focus: 'Structured programming fundamentals',
      },
      {
        name: 'Python',
        stage: 'Active Practice',
        focus: 'Core scripting and problem solving',
      },
      {
        name: 'C++',
        stage: 'Exploring',
        focus: 'Object-oriented programming foundations',
      },
      {
        name: 'Java',
        stage: 'Exploring',
        focus: 'Core language syntax and OOP concepts',
      },
    ],
  },
  {
    category: 'Web Development',
    subtitle: 'Building responsive interfaces and browser apps',
    skills: [
      {
        name: 'HTML',
        stage: 'Core Foundation',
        focus: 'Semantic page markup and structure',
      },
      {
        name: 'CSS',
        stage: 'Active Practice',
        focus: 'Responsive layouts, styling, and visual craft',
      },
      {
        name: 'JavaScript',
        stage: 'Active Practice',
        focus: 'Interactive web apps, APIs, and 2D browser games',
      },
    ],
  },
  {
    category: 'Engineering',
    subtitle: 'ECE domain and hardware interests',
    skills: [
      {
        name: 'Electronics',
        stage: 'Core Foundation',
        focus: 'Electronics and Communication Engineering track',
      },
      {
        name: 'Embedded Systems',
        stage: 'Exploring',
        focus: 'Hardware-software interfacing concepts',
      },
      {
        name: 'IoT',
        stage: 'Exploring',
        focus: 'Connected devices and sensing systems',
      },
    ],
  },
  {
    category: 'Tools',
    subtitle: 'Daily development workflow',
    skills: [
      {
        name: 'VS Code',
        stage: 'Core Foundation',
        focus: 'Primary code editor and workspace',
      },
      {
        name: 'Git',
        stage: 'Active Practice',
        focus: 'Source version control',
      },
      {
        name: 'GitHub',
        stage: 'Active Practice',
        focus: 'Public project hosting and collaboration',
      },
    ],
  },
];

export const JOURNEY_MILESTONES: JourneyMilestone[] = [
  {
    id: 'm1',
    tag: 'Education',
    type: 'Education',
    title: 'Electronics and Communication Engineering (ECE)',
    organization: 'Panimalar Engineering College, Chennai',
    description:
      'Undergraduate ECE student building a foundation in electronics alongside software development and creative technology.',
  },
  {
    id: 'm2',
    tag: 'Programming',
    type: 'Programming',
    title: 'C, Python, C++, Java & Web Technologies',
    organization: 'Core Technical Learning',
    description:
      'Practicing programming fundamentals across C, Python, C++, and Java alongside front-end and full-stack web development with HTML, CSS, and JavaScript.',
  },
  {
    id: 'm3',
    tag: 'GitHub',
    type: 'GitHub',
    title: 'Public Projects & Browser Games on GitHub',
    organization: 'github.com/Sivakarthi-24',
    description:
      'Published KANA — Tamil Nadu Idly Kadai, TaskFlow, Nami Weather, and Delivery Da on GitHub with live deployments on Vercel.',
  },
  {
    id: 'm4',
    tag: 'LinkedIn',
    type: 'LinkedIn',
    title: 'Professional Profile & Certifications',
    organization: 'linkedin.com/in/sivakarthi-annamalai',
    description:
      'Maintaining academic updates, technical learning milestones, and verified certificates directly on LinkedIn.',
  },
  {
    id: 'm5',
    tag: 'Interests',
    type: 'Interests',
    title: 'UI/UX, Web Designing, Embedded Systems, IoT & AI',
    organization: 'Ongoing Exploration',
    description:
      'Continuing to explore the intersection of electronics, embedded systems, IoT, UI/UX design, web engineering, and AI.',
  },
];

export const HUMAN_PILLARS = [
  {
    index: '01',
    title: 'Technology Curiosity',
    body: 'Interested in how Electronics and Communication Engineering connects with Embedded Systems, IoT, software, and AI.',
  },
  {
    index: '02',
    title: 'UI/UX & Web Design',
    body: 'Passionate about crafting clean, readable, intentional digital interfaces where structure and visual atmosphere work together.',
  },
  {
    index: '03',
    title: 'Learning by Building',
    body: 'I learn best by shipping real code—turning concepts into working web apps, dashboards, and 2D browser games.',
  },
  {
    index: '04',
    title: 'Chennai Roots',
    body: 'Based in Chennai, India, bringing familiar Tamil Nadu culture into projects like KANA Idly Kadai and Delivery Da.',
  },
  {
    index: '05',
    title: 'Cinema & Anime Storytelling',
    body: 'Inspired by Japanese animation aesthetics where rain, architecture, and restrained lighting create quiet emotional depth.',
  },
  {
    index: '06',
    title: 'Continuous Growth',
    body: 'Building step by step across programming, web design, and ECE engineering.',
  },
];
