import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;
const DB_FILE = path.join(process.cwd(), 'data', 'portfolio-db.json');
const UPLOADS_DIR = path.join(process.cwd(), 'uploads');

// Ensure database and uploads folders exist
if (!fs.existsSync(path.dirname(DB_FILE))) {
  fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Memory-based session storage
const activeSessions = new Map<string, { expires: number }>();

// Seed default structures
const DEFAULT_APPEARANCE = {
  wallpaper: 'default-mesh',
  theme: 'midnight',
  accentColor: '#3B82F6',
  desktopIconLayout: {}
};

const DEFAULT_SETTINGS = {
  linkedinUrl: 'https://linkedin.com/in/darshankumarkr',
  githubUrl: 'https://github.com/darshan-kumar-k-r',
  leetcodeUrl: 'https://leetcode.com/u/darshankumarkr97/',
  instagramUrl: 'https://instagram.com/darshankumarkr',
  contactEmail: 'darshankumarkr97@gmail.com',
  heroText: 'I engineer robust distributed infrastructures, develop deep learning threat intelligence classifiers, and build secure systems pipelines.',
  currentFocusWidget: 'Cloud Security Research, Container Orchestration Lab, & Enterprise CMS Deployments',
  buildWithMeContent: 'I advise founders and collaborate with security groups to design custom distributed architectures, secure APIs, and dynamic dashboard nodes.',
  heroTitle: 'Darshan Kumar K R',
  heroSubtitle: 'Cloud Infrastructure & Systems Security Engineer',
  aboutSummary: 'I am a passionate systems developer researching Tor merchant stylometry, container runtimes, consensus networks, and automated vulnerability management patterns.',
  desktopWelcome: "Welcome to Darshan's DevOS Operating System Workspace",
  featuredProjectId: 'dark-web-marketplaces',
  // SEO Meta default settings
  metaTitleHomepage: 'Darshan Kumar K R | Portfolio',
  metaDescriptionHomepage: 'Systems Architect & Cloud Security Specialist portfolio built in React.',
  metaKeywordsHomepage: 'Cybersecurity, Docker, Kubernetes, React, Portfolio',
  ogImageHomepage: '/uploads/profile.png'
};

const DEFAULT_PROJECTS = [
  {
    id: 'dark-web-marketplaces',
    title: 'Vendor Profiling & Behaviour Analysis in Dark Web Marketplaces',
    tagline: 'Algorithmic micro-profiling and AI-driven cross-market link analysis for detecting obfuscated Tor merchant identities.',
    category: 'Cybersecurity & ML Research',
    logo: 'DWP',
    status: 'production',
    lifecycleStatus: 'published',
    metrics: [
      { label: 'Calculated Listings', value: '25,000+' },
      { label: 'Link Accuracy', value: '94.2% F1' },
      { label: 'IP Nodes Rotation', value: '6 Routing lanes' }
    ],
    technologies: ['Machine Learning', 'Tor Scrapers', 'Linguistic Stylometry', 'NLP Classifiers'],
    bannerGradient: 'bg-gradient-to-r from-red-950 to-zinc-900',
    overview: 'This project introduces a highly robust, isolated scraping architecture for crawling obfuscated merchant pages on Tor marketplaces with linguistic profiling algorithm pipelines.',
    githubUrl: 'https://github.com/darshan-kumar-k-r',
    demoUrl: 'https://github.com/darshan-kumar-k-r',
    features: ['Stylometry fingerprinting', 'Distributed rotating crawler', 'Heterogeneous text classifiers'],
    challenges: 'Overcoming Cloudflare browser verification and heavy onion ping loss.',
    learnings: 'Engineered automatic task throttling algorithms inside scraping pools.',
    futureImprovements: ['Support transformer-based embeddings'],
    videoMockTitle: 'SYS_CRAWL_DAEMON',
    videoSteps: [
      { timestamp: '00:01', label: 'Launch scraping node', status: 'COMPLETED' },
      { timestamp: '00:04', label: 'Establish Tor socket', status: 'COMPLETED' },
      { timestamp: '00:08', label: 'Scraping market elements', status: 'COMPLETED' },
      { timestamp: '00:15', label: 'Classifying stylometry lexical vectors', status: 'COMPLETED' }
    ],
    architectureNodes: [],
    architectureEdges: [],
    architectureStory: []
  },
  {
    id: 'creator-insight',
    title: 'Creator Insight Portfolio Analytics',
    tagline: 'A robust visual analytics database dashboard showing engagement streams, viewer funnels, and real-time page hits.',
    category: 'Full-Stack Analytics Systems',
    logo: 'CIA',
    status: 'production',
    lifecycleStatus: 'published',
    metrics: [
      { label: 'Latency', value: '38ms' },
      { label: 'Data Ingestion', value: '5K RPS' }
    ],
    technologies: ['React', 'Node.js', 'Express', 'D3.js', 'Clickhouse'],
    bannerGradient: 'bg-gradient-to-r from-violet-950 to-indigo-900',
    overview: 'An elite professional-grade visitor logging pipeline that aggregates real-time handshakes and maps user sessions dynamically on-map without invading user cookie parameters.',
    githubUrl: 'https://github.com/darshan-kumar-k-r',
    demoUrl: 'https://github.com/darshan-kumar-k-r',
    features: ['Clickhouse columnar layout', 'D3 heatmaps', 'HTTP handshake proxying'],
    challenges: 'Minimizing backend latency overhead down to double digits under burst load.',
    learnings: 'Engineered custom payload serialization frameworks.',
    futureImprovements: ['Incorporate Webassembly stream decoders'],
    videoMockTitle: 'ANALYTICS_DAEMON',
    videoSteps: [
      { timestamp: '00:01', label: 'Init telemetry lanes', status: 'COMPLETED' },
      { timestamp: '00:03', label: 'Fetch geo coordinate vectors', status: 'COMPLETED' },
      { timestamp: '00:07', label: 'Push logs stack to Clickhouse', status: 'COMPLETED' }
    ],
    architectureNodes: [],
    architectureEdges: [],
    architectureStory: []
  }
];

const DEFAULT_RESEARCH = [
  {
    id: 'res-dark-web',
    title: 'Vendor Profiling & Behaviour Analysis in Dark Web Marketplaces',
    abstract: 'Algorithmic micro-profiling and AI-driven cross-market link analysis for detecting obfuscated Tor merchant identities.',
    date: 'March 2026',
    tags: ['Intrusion Detection', 'Machine Learning', 'stylometry', 'Tor Scrapers'],
    outletHistory: 'IEEE International Conference on Applied System Innovation (ICASI)',
    keyFindings: [
      'Linguistic stylometry profiling maps merchant identities with 94.2% F1 accuracy.',
      'Constructed distributed failure-retry onion crawling cluster with rotating IP gateways.'
    ],
    timeline: [
      { phase: 'Phase 01', date: 'Q3 2024', title: 'Ethics Approval', desc: 'Designed isolation bounds for scraping Tor addresses.', status: 'Completed' },
      { phase: 'Phase 02', date: 'Q1 2025', title: 'Ingestion Pipeline', desc: 'Crawled 1.2M listings across 8 darkweb markets.', status: 'Completed' },
      { phase: 'Phase 3', date: 'Q3 2025', title: 'ML Architecture', desc: 'Engineered TF-IDF lexical trackers and neural logs classifiers.', status: 'Completed' }
    ]
  }
];

const DEFAULT_EXPERIENCES = [
  {
    id: 'exp-cyber-intern',
    role: 'Cloud Security & Intrusion Detection Systems Intern',
    company: 'Centre for Computer Networks and Cyber Security',
    location: 'Bengaluru, India',
    duration: '2025 (Internship)',
    type: 'Security Research',
    tags: ['ML Anomaly Detection', 'IDS Security Monitoring', 'Network Log Analysis', 'Cloud Security Practices'],
    bullets: [
      'Engineered Machine Learning models for anomaly detection, classifying high-threat network intrusion indicators.',
      'Configured proactive security monitoring pipelines, analyzing heterogeneous network connection logs to trace scanning loops.'
    ],
    keyAchievement: 'Successfully improved threat classification metrics by optimizing classification models to sub-millisecond latencies.'
  }
];

const DEFAULT_CONTACTS = [
  {
    id: 'cont-1',
    name: 'Sarah Jenkins',
    email: 'sarah@cyberventures.co',
    subject: 'Security Assessment Collaboration Proposal',
    message: 'Hello Darshan, I reviewed your behavioral logging pipeline and paper. We are spinning up a threat intelligence cluster in Bengaluru and would love to collaborate under an advisory or freelance capacity.',
    date: '2026-06-15',
    type: 'freelance',
    status: 'new',
    leadStage: 'new',
    leadNotes: 'Highly promising inquiry. Need to schedule introductory sync on Monday.'
  }
];

const DEFAULT_CHANGELOG = [
  {
    version: 'v2.5',
    date: '2026-06-17',
    summary: 'DevOS Control Center Production Hardening',
    changes: [
      'Migrated portfolio schema to a robust full-stack file persistence database.',
      'Secured administration with secure, stateful session cookie headers.',
      'Created Project Lifecycle controls supporting Draft, Published, and Archived modes.',
      'Designed lead CRM pipeline with notes, filtering, and opportunity status indicators.',
      'Added zero-dependency safe binary content media storage, server page pings, and automatic rollback snapshots.'
    ]
  },
  {
    version: 'v2.4',
    date: '2026-06-10',
    summary: 'Visual Architecture Update',
    changes: [
      'Added dynamic color palette settings.',
      'Improved zoom controls in Schematic Architecture Explorer.',
      'Implemented real-time geolocation timezone mappings.'
    ]
  }
];

const DEFAULT_SESSIONS = [
  {
    id: 's-init-1',
    timestamp: new Date().toISOString(),
    duration: 35,
    pages: ['Workspace Loaded', 'Projects'],
    country: 'India',
    city: 'Bengaluru',
    device: 'Desktop',
    browser: 'Chrome',
    referrer: 'Direct Ingress',
    trafficSource: 'Direct',
    resumeDownloaded: false,
    contactSubmitted: false
  }
];

const DEFAULT_ACHIEVEMENTS = [
  {
    id: 'ach-1',
    title: 'Hindi Internationalization Contribution',
    category: 'Open Source',
    issuer: 'Cal.com Ecosystem',
    date: '2025-02',
    description: 'Developed complete localization packages enabling 600M+ native speakers globally to use robust calendar platforms.',
    icon: 'opensource',
    tags: ['i18n', 'Translation', 'cal.com', 'TypeScript'],
    proofUrl: 'https://github.com/calcom/cal.com'
  },
  {
    id: 'ach-2',
    title: 'Secured Systems Ideathon - Best Prototype',
    category: 'Hackathons',
    issuer: 'Society of Computer Security & Networks',
    date: '2024-11',
    description: 'Engineered a sandboxed container isolation scheduler mapping ingress packet patterns on rotating socket lanes of private Tor endpoints.',
    icon: 'ideathon',
    tags: ['Docker', 'Tor Socks', 'Sandboxing', 'Go'],
    proofUrl: 'https://github.com/darshan-kumar-k-r'
  },
  {
    id: 'ach-3',
    title: 'Systems & Cybersecurity TA Appointments',
    category: 'Professional Appointments',
    issuer: 'Department of Computer Science',
    date: '2024-09',
    description: 'Supervised Kubernetes orchestration sandboxing labs, Docker storage layers, and continuous release pipelines in active Jenkins pools.',
    icon: 'ta',
    tags: ['Kubernetes', 'TA', 'CI/CD Pipelines', 'Security Labs']
  }
];

const DEFAULT_OPEN_SOURCE = [
  {
    id: 'os-1',
    projectName: 'Hindi Internationalization (i18n)',
    repoName: 'calcom/cal.com',
    contributionSummary: 'Authored complete local dictionary map, localized dynamic date formatters, and grammatical gender-fluid agreement adapters inside cal.com, facilitating calendar coordination for over 600 million Hindi speakers globally.',
    pullRequestUrl: 'https://github.com/calcom/cal.com',
    commitHash: '725ba88a318cdfa02a06be977c7f39446342cbcc',
    impactMetric: '600M+ Speakers',
    repositoryUrl: 'https://github.com/calcom/cal.com'
  }
];

const DEFAULT_SERVICES = [
  {
    id: 'saas-mvp',
    name: 'Need an MVP?',
    tagline: 'Rapid-cycle fully functional product builds engineered specifically to validate product-market fit and impress investors.',
    whatIBuild: [
      'Core atomic user workflows integrated with dynamic state storage and safe cloud authentication',
      'Third-party subscription structures processed safely via backend proxy APIs',
      'Intuitive design modules and custom onboarding steps maximizing user retention metrics'
    ],
    techStack: ['React / Vite', 'TypeScript', 'Node.js', 'Firebase / PostgreSQL', 'Tailwind CSS', 'Motion'],
    process: [
      '1. Scope Definition & High-Yield Feature Alignment (Week 1)',
      '2. Complete Database Mapping & Secure Integration (Week 1.5)',
      '3. Functional UI Assembly & State Connectivity (Week 2)',
      '4. Beta Testing, Refinement, & Cloud Ingress Release (Week 3)'
    ],
    timeline: '3 Weeks',
    pricingRange: '$4,000 - $6,000',
    ctaButtonText: 'INQUIRY // NEED AN MVP'
  },
  {
    id: 'internal-tools',
    name: 'Need Internal Tools?',
    tagline: 'Custom workflow managers, admin stations, and operations logs that replace brittle manual spreadsheets.',
    whatIBuild: [
      'Administrative controls with integrated secure role access boards',
      'Custom CRUD setups, bulk file uploads parsing, and direct DB write interfaces',
      'Unified logs and status trackers syncing live data records securely'
    ],
    techStack: ['React', 'TypeScript', 'Node.js', 'Express', 'PostgreSQL', 'Tailwind CSS'],
    process: [
      '1. Operational Bottleneck Identification & Wireframing (Week 1)',
      '2. Secure Database Modeling & Access Rule Schema (Week 1.5)',
      '3. Feature Integration & Access Level Locks (Week 2-3)',
      '4. Performance Optimization & Production Release (Week 4)'
    ],
    timeline: '3 - 4 Weeks',
    pricingRange: '$3,500 - $5,500',
    ctaButtonText: 'INQUIRY // NEED INTERNAL TOOLS'
  },
  {
    id: 'dashboards',
    name: 'Need Dashboards?',
    tagline: 'Sub-second loading interactive analytics stations displaying clean charts and quick data grids.',
    whatIBuild: [
      'Custom data visualization nodes using fluid, responsive charting systems',
      'Fast client-side live list searches, filters, and dynamic grouping pipelines',
      'Unified data views aggregating divergent telemetry threads into cohesive panels'
    ],
    techStack: ['React / Vite', 'Tailwind CSS', 'Recharts / D3', 'TypeScript', 'REST APIs'],
    process: [
      '1. Graphic Structure planning & negative space sizing (Week 1)',
      '2. Query bindings & real-time client state caching (Week 2)',
      '3. Chart interactions, controls & dynamic tooltips (Week 2.5)',
      '4. Speed tuning, rendering optimizations & launch (Week 3)'
    ],
    timeline: '2 - 3 Weeks',
    pricingRange: '$2,500 - $4,500',
    ctaButtonText: 'INQUIRY // NEED DASHBOARDS'
  }
];

const DEFAULT_JOURNALS = [
  {
    id: 'dist-pipeline-ingest',
    title: 'Designing a High-Availability Distributed Ingestion Pipeline',
    category: 'System Design',
    publishDate: '2026-05-12',
    readingTime: '6 min read',
    summary: 'Architecting a fault-tolerant message pipeline utilizing Raft consensus agreements, multi-lane Redis memory tables, and parallel consumer groups.',
    tags: ['Distributed Systems', 'Raft Consensus', 'Redis', 'Node.js', 'Go'],
    status: 'published',
    isFeatured: true,
    content: `# Designing a High-Availability Distributed Ingestion Pipeline\n\n## Executive Overview\nWhen systems digest upwards of **50,000 requests per second (RPS)**, standard transactional routers choke on thread execution and TCP socket locks. This publication evaluates the architecture of a fault-tolerant distributed ingestion pipeline capable of zero-loss operations during failover cycles.\n\nWe focus on isolating ingress nodes, establishing a reliable memory buffer, and coordinating worker clusters.\n\n## 1. System Architecture Blueprint\nThe solution splits concerns into three independent scaling horizons:\n\n\`\`\`\n[ INGRESS NODES ] ---> [ DISTRIBUTED BUFFER ] ---> [ Parallel Consumer Pools ]\n (Nginx Proxy)             (Redis Clusters)                (Worker Nodes)\n\`\`\`\n\n- **Ingress Layer**: Stateless Express/Go microservices behind an Nginx packet proxy running IP-hashing load balancing.\n- **Buffer Layer**: Redis cluster running partitioned hash rings with a primary replica set. Writes block only long enough to persist to memory.\n- **Consumer Layer**: Autoscale workers pulling logs from streams using worker-specific group offsets.\n\n## 2. Ingress Router Implementation (TypeScript Specimen)\nBelow is the highly micro-optimized Express server middleware for fast queuing:\n\n\`\`\`typescript\nimport express from 'express';\nimport Redis from 'ioredis';\n\nconst app = express();\nconst redis = new Redis(process.env.REDIS_CLUSTER_URL!);\n\n// Pre-allocated static buffers to avoid GC thrashing\nconst HEARTBEAT_PAYLOAD = Buffer.from(JSON.stringify({ status: 'ACK', offset_synced: true }));\n\napp.post('/api/v1/telemetry/dispatch', express.raw({ type: 'application/json' }), async (req, res) => {\n  try {\n    const payloadBuffer = req.body;\n    \n    // Non-blocking stream queue ingestion\n    const streamKey = \\\`stream:telemetry:\\\${Date.now() % 8}\\\`;\n    await redis.xadd(streamKey, '*', 'payload', payloadBuffer);\n    \n    res.setHeader('Content-Type', 'application/json');\n    return res.end(HEARTBEAT_PAYLOAD);\n  } catch (err) {\n    console.error('[CRITICAL] Queue saturation:', err);\n    res.statusCode = 503;\n    return res.end(JSON.stringify({ error: 'BUFFER_SATURATED_FAIL' }));\n  }\n});\n\`\`\`\n\n## 3. Achieving Resiliency with Raft Consensus\nTo coordinate metadata offsets safely across multiple worker nodes, we apply a **Raft Consensus State Machine**:\n\n> "State engines must reject corrupt worker offsets. A leader is elected uniformly using randomized timers, ensuring matching split-brain prevention."`
  }
];

const DEFAULT_RESUME = {
  views: 232,
  downloads: 74,
  versionHistory: [
    {
      version: 'v1.4.2',
      uploadedAt: '2026-06-15T12:00:00.000Z',
      summary: 'Original base credentials record compiling cloud security achievements.',
      fileSize: '342 KB',
      fileBase64: 'placeholder'
    }
  ],
  activeVersion: 'v1.4.2'
};

const DEFAULT_DB = {
  appearance: DEFAULT_APPEARANCE,
  settings: DEFAULT_SETTINGS,
  projects: DEFAULT_PROJECTS,
  research: DEFAULT_RESEARCH,
  experiences: DEFAULT_EXPERIENCES,
  contacts: DEFAULT_CONTACTS,
  changelogs: DEFAULT_CHANGELOG,
  sessions: DEFAULT_SESSIONS,
  activityLogs: [],
  versionHistoryStates: [],
  achievements: DEFAULT_ACHIEVEMENTS,
  openSource: DEFAULT_OPEN_SOURCE,
  services: DEFAULT_SERVICES,
  journals: DEFAULT_JOURNALS,
  resume: DEFAULT_RESUME
};

// Load or Seed DB
const loadDB = () => {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(DEFAULT_DB, null, 2));
    return DEFAULT_DB;
  }
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    // Merge defaults to ensure no crashing elements
    return { ...DEFAULT_DB, ...parsed };
  } catch (_) {
    return DEFAULT_DB;
  }
};

const saveDB = (data: any) => {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
};

// Express Middlewares
app.use(express.json({ limit: '50mb' }));
app.use('/uploads', express.static(UPLOADS_DIR));

// Simple Cookie session extractor
app.use((req, res, next) => {
  const cookieHeader = req.headers.cookie || '';
  const match = cookieHeader.match(/devos_session=([^;]+)/);
  const sessionId = match ? match[1] : null;

  if (sessionId) {
    const session = activeSessions.get(sessionId);
    if (session && session.expires > Date.now()) {
      // Slidably extend session expiration (session timeout reset)
      session.expires = Date.now() + 15 * 60 * 1000; // Reset 15 mins
      (req as any).isAuthenticated = true;
      (req as any).sessionId = sessionId;
    } else {
      if (session) activeSessions.delete(sessionId);
      (req as any).isAuthenticated = false;
    }
  } else {
    (req as any).isAuthenticated = false;
  }
  next();
});

// Admin verification guard
const requireAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (!(req as any).isAuthenticated) {
    return res.status(401).json({ error: 'Unauthorized credentials. Access denied.' });
  }
  next();
};

// API: AUTHENTICATION
app.post('/api/auth/login', (req, res) => {
  const { password } = req.body;
  const adminPass = process.env.ADMIN_PASSWORD || '9055';
  const adminSecret = process.env.ADMIN_SECRET_KEY || 'darshan-secret';

  if (password === adminPass || password === adminSecret) {
    const sessionId = 'session_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
    const expires = Date.now() + 15 * 60 * 1000; // 15 mins session timeout
    activeSessions.set(sessionId, { expires });

    res.setHeader('Set-Cookie', `devos_session=${sessionId}; Path=/; HttpOnly; SameSite=Strict; Max-Age=54000`);
    return res.json({ authenticated: true });
  }
  return res.status(401).json({ error: 'Invalid security code credentials.' });
});

app.post('/api/auth/logout', (req, res) => {
  const sessionId = (req as any).sessionId;
  if (sessionId) {
    activeSessions.delete(sessionId);
  }
  res.setHeader('Set-Cookie', 'devos_session=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0');
  res.json({ success: true });
});

app.get('/api/auth/status', (req, res) => {
  res.json({ authenticated: (req as any).isAuthenticated });
});

// API: PUBLIC GET STATE
app.get('/api/public/data', (req, res) => {
  const db = loadDB();
  const publicProjects = (db.projects || []).filter((p: any) => p.lifecycleStatus === 'published' || !p.lifecycleStatus);
  const publicData = {
    appearance: db.appearance || {},
    settings: db.settings || {},
    projects: publicProjects,
    research: db.research || [],
    experiences: db.experiences || [],
    changelogs: db.changelogs || [],
    achievements: db.achievements || [],
    openSource: db.openSource || [],
    services: db.services || [],
    journals: db.journals || [],
    resume: db.resume || {}
  };
  res.json(publicData);
});

// API: PROTECTED GET STATE
app.get('/api/admin/data', requireAuth, (req, res) => {
  const db = loadDB();
  res.json(db);
});

// API: PROTECTED SAVE STATE
app.post('/api/admin/save', requireAuth, (req, res) => {
  const db = loadDB();
  const updatedKeys = req.body; // Keys to merge

  // If restoring an entire db backup, overwrite completely
  let newDb = { ...db };
  if (updatedKeys.isFullRestore) {
    newDb = { ...DEFAULT_DB, ...updatedKeys.data };
  } else {
    // Standard incremental key update
    for (const key of Object.keys(updatedKeys)) {
      newDb[key] = updatedKeys[key];
    }
  }

  // Handle Snapshot Auto-Generation for version history if key requires it (Priority 4 / Priority 5)
  if (updatedKeys.activityLogToSave) {
    const newLog = updatedKeys.activityLogToSave;
    const historyStates = newDb.versionHistoryStates || [];
    
    // Save whole database snapshot inside the historical log itself!
    const logId = 'vh-' + Date.now();
    const record = {
      id: logId,
      timestamp: new Date().toISOString(),
      action: newLog.action,
      section: newLog.section || 'General',
      description: newLog.description || '',
      snapshot: {
        appearance: { ...newDb.appearance },
        projects: JSON.parse(JSON.stringify(newDb.projects || [])),
        research: JSON.parse(JSON.stringify(newDb.research || [])),
        experiences: JSON.parse(JSON.stringify(newDb.experiences || [])),
        settings: { ...newDb.settings },
        changelogs: JSON.parse(JSON.stringify(newDb.changelogs || [])),
        achievements: JSON.parse(JSON.stringify(newDb.achievements || [])),
        openSource: JSON.parse(JSON.stringify(newDb.openSource || [])),
        services: JSON.parse(JSON.stringify(newDb.services || [])),
        journals: JSON.parse(JSON.stringify(newDb.journals || [])),
        resume: { ...(newDb.resume || {}) }
      }
    };
    newDb.versionHistoryStates = [record, ...historyStates];
    
    // Add to logs
    const activityLogs = newDb.activityLogs || [];
    newDb.activityLogs = [
      {
        id: `al-${Date.now()}`,
        timestamp: new Date().toISOString(),
        action: newLog.action,
        resource: newLog.section || 'General',
        oldValue: newLog.oldValue || 'N/A',
        newValue: newLog.newValue || 'N/A'
      },
      ...activityLogs
    ];
  }

  saveDB(newDb);
  res.json({ success: true, db: newDb });
});

// API: PROTECTED ROLLBACK RESTORE STATE (Priority 5)
app.post('/api/admin/rollback', requireAuth, (req, res) => {
  const { historyRecordId } = req.body;
  const db = loadDB();
  const records = db.versionHistoryStates || [];
  const found = records.find((r: any) => r.id === historyRecordId);

  if (!found) {
    return res.status(404).json({ error: 'Historical version state not found.' });
  }

  // Restore snapshots keys into active state
  const snapshot = found.snapshot;
  db.appearance = { ...db.appearance, ...snapshot.appearance };
  db.projects = [...snapshot.projects];
  db.research = [...snapshot.research];
  db.experiences = [...snapshot.experiences];
  db.settings = { ...db.settings, ...snapshot.settings };
  if (snapshot.changelogs) {
    db.changelogs = [...snapshot.changelogs];
  }
  if (snapshot.achievements) {
    db.achievements = [...snapshot.achievements];
  }
  if (snapshot.openSource) {
    db.openSource = [...snapshot.openSource];
  }
  if (snapshot.services) {
    db.services = [...snapshot.services];
  }
  if (snapshot.journals) {
    db.journals = [...snapshot.journals];
  }
  if (snapshot.resume) {
    db.resume = { ...snapshot.resume };
  }

  // Log rollback event
  const rollbackLog = {
    id: `al-${Date.now()}`,
    timestamp: new Date().toISOString(),
    action: `System Rollback`,
    resource: 'Snapshot Recovery',
    oldValue: 'Previous State',
    newValue: `Restored back to version from: ${new Date(found.timestamp).toLocaleString()}`
  };
  db.activityLogs = [rollbackLog, ...(db.activityLogs || [])];

  saveDB(db);
  res.json({ success: true, db });
});

// API: PUBLIC CLICK METRICS INCREMENTOR
app.post('/api/public/track-click', (req, res) => {
  const { buttonId, projectId, type } = req.body;
  // payload can be global clicks or project-specific clicks
  const db = loadDB();
  
  if (projectId) {
    // Project specific clicks (views, demoPlays, githubClicks, liveDemoClicks, pdfDownloads)
    const projs = db.projects || [];
    const projIdx = projs.findIndex((p: any) => p.id === projectId);
    if (projIdx !== -1) {
      if (!projs[projIdx].analytics) {
        projs[projIdx].analytics = { views: 0, demoPlays: 0, githubClicks: 0, liveDemoClicks: 0, pdfDownloads: 0 };
      }
      if (type === 'view') projs[projIdx].analytics.views++;
      else if (type === 'demoPlay') projs[projIdx].analytics.demoPlays++;
      else if (type === 'github') projs[projIdx].analytics.githubClicks++;
      else if (type === 'liveDemo') projs[projIdx].analytics.liveDemoClicks++;
      else if (type === 'pdf') projs[projIdx].analytics.pdfDownloads++;
      db.projects = projs;
    }
  } else if (buttonId) {
    const sum = db.analytics_summary || { visitorCount: 0, uniqueVisitors: 0, pageVisits: 0, githubClicks: 0, linkedinClicks: 0, leetcodeClicks: 0, workWithMeClicks: 0 };
    if (buttonId === 'github') sum.githubClicks = (sum.githubClicks || 0) + 1;
    else if (buttonId === 'linkedin') sum.linkedinClicks = (sum.linkedinClicks || 0) + 1;
    else if (buttonId === 'leetcode') sum.leetcodeClicks = (sum.leetcodeClicks || 0) + 1;
    else if (buttonId === 'work-with-me') sum.workWithMeClicks = (sum.workWithMeClicks || 0) + 1;
    db.analytics_summary = sum;
  }

  saveDB(db);
  res.json({ success: true });
});

// API: PUBLIC CONTACT INQUIRY REGISTRY
app.post('/api/public/submit-contact', (req, res) => {
  const { name, email, subject, message, type } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Validation failed. Fields are required.' });
  }

  const db = loadDB();
  const contacts = db.contacts || [];
  const newLead = {
    id: `cont-${Date.now()}`,
    name,
    email,
    subject: subject || 'General Exploration Handshake',
    message,
    date: new Date().toISOString().substring(0, 10),
    type: type || 'general',
    status: 'new',
    leadStage: 'new',
    leadNotes: ''
  };

  db.contacts = [newLead, ...contacts];
  saveDB(db);
  res.json({ success: true, lead: newLead });
});

// API: PUBLIC USER PAGEVIEW LOGGER
app.post('/api/public/track-pageview', (req, res) => {
  const { pageName, sessionId } = req.body;
  const db = loadDB();
  
  // Increment general analytics visits
  const sum = db.analytics_summary || { visitorCount: 0, pageVisits: 0 };
  sum.pageVisits = (sum.pageVisits || 0) + 1;
  db.analytics_summary = sum;

  // If a project page, increase that specific project views
  if (pageName?.startsWith('Project: ')) {
    const projectId = pageName.replace('Project:', '').trim();
    const projs = db.projects || [];
    const idx = projs.findIndex((p: any) => p.id === projectId);
    if (idx !== -1) {
      if (!projs[idx].analytics) {
        projs[idx].analytics = { views: 0, demoPlays: 0, githubClicks: 0, liveDemoClicks: 0, pdfDownloads: 0 };
      }
      projs[idx].analytics.views++;
      db.projects = projs;
    }
  }

  // Update ongoing session path sequence
  if (sessionId) {
    const sessions = db.sessions || [];
    const sesIdx = sessions.findIndex((s: any) => s.id === sessionId);
    if (sesIdx !== -1) {
      const active = sessions[sesIdx];
      if (!active.pages.includes(pageName)) {
        active.pages = [...active.pages, pageName];
        sessions[sesIdx] = active;
        db.sessions = sessions;

        // If it starts with projecting, set current project
        if (pageName?.startsWith('Project: ')) {
          active.projectOpened = pageName.replace('Project:', '').trim();
        }
      }
    }
  }

  saveDB(db);
  res.json({ success: true });
});

// API: PUBLIC SESSION HANDSHAKE INITIALIZATION
app.post('/api/public/initiate-session', (req, res) => {
  const { device, browser, referrer, trafficSource, country, city } = req.body;
  const db = loadDB();
  const sessions = db.sessions || [];

  const sessionId = `s-${Date.now()}-${Math.floor(100+Math.random()*900)}`;
  const newSession = {
    id: sessionId,
    timestamp: new Date().toISOString(),
    duration: 5, // initial seconds
    pages: ['Desktop Loaded'],
    country: country || 'India',
    city: city || 'Bengaluru',
    device: device || 'Desktop',
    browser: browser || 'Unknown',
    referrer: referrer || 'Direct Ingress',
    trafficSource: trafficSource || 'Direct',
    resumeDownloaded: false,
    contactSubmitted: false
  };

  db.sessions = [newSession, ...sessions];
  
  // Increment total stats
  const sum = db.analytics_summary || { visitorCount: 0, uniqueVisitors: 0 };
  sum.visitorCount = (sum.visitorCount || 0) + 1;
  sum.uniqueVisitors = (sum.uniqueVisitors || 0) + 1;
  db.analytics_summary = sum;

  saveDB(db);
  res.json({ success: true, sessionId });
});

// API: PUBLIC SESSION TIMELINE PING (Priority 6 User Session Tracking duration updater)
app.post('/api/public/session/ping', (req, res) => {
  const { sessionId, secondsToAdd } = req.body;
  if (!sessionId) return res.status(400).json({ error: 'Session ID is required' });

  const db = loadDB();
  const sessions = db.sessions || [];
  const sesIdx = sessions.findIndex((s: any) => s.id === sessionId);

  if (sesIdx !== -1) {
    sessions[sesIdx].duration = (sessions[sesIdx].duration || 0) + Number(secondsToAdd || 10);
    db.sessions = sessions;
    saveDB(db);
  }
  res.json({ success: true });
});

// API: SECURE BINARY MEDIA UPLOAD STORAGE (Priority 12 Media Vault Uploads via binary post requests)
app.post('/api/media/upload', requireAuth, express.raw({ type: ['image/*', 'video/*'], limit: '20mb' }), (req, res) => {
  const filename = req.query.filename as string || `upload_${Date.now()}.png`;
  
  // Secure sanitize filename
  const cleanFilename = filename.replace(/[^a-zA-Z0-9.\-_]/g, '_');
  const filePath = path.join(UPLOADS_DIR, cleanFilename);

  fs.writeFileSync(filePath, req.body);
  const fileUrl = `/uploads/${cleanFilename}`;
  res.json({ url: fileUrl });
});

// Mounting Vite Middleware and Fallbacks
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[DevOS Service] Production-grade backend listening on port ${PORT}`);
  });
}

startServer();
