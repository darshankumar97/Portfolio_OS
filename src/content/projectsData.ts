/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ArchNode {
  id: string;
  label: string;
  type: 'client' | 'api' | 'worker' | 'database' | 'external' | 'cache' | 'process' | 'gateway';
  description: string;
  x: number;
  y: number;
}

export interface ArchEdge {
  from: string;
  to: string;
  label: string;
  animated?: boolean;
}

export interface EngineeringDecision {
  decision: string;
  reason: string;
  tradeoff: string;
  outcome: string;
}

export interface ProjectDetail {
  id: string;
  title: string;
  tagline: string;
  category: string;
  logo: string; // Dynamic visual text / abbreviation
  status: 'production' | 'active-dev' | 'archived';
  lifecycleStatus?: 'draft' | 'published' | 'archived';
  analytics?: {
    views: number;
    demoPlays: number;
    githubClicks: number;
    liveDemoClicks: number;
    pdfDownloads: number;
  };
  metrics: { label: string; value: string }[];
  technologies: string[];
  bannerGradient: string; // Tailwind class background
  overview: string;
  whyIBuiltThis: string;
  results: string;
  engineeringDecisions: EngineeringDecision[];
  githubUrl?: string;
  demoUrl?: string;
  features: string[];
  challenges: string;
  learnings: string;
  futureImprovements: string[];
  
  // Custom video playback stimulation
  videoMockTitle: string;
  videoSteps: { timestamp: string; label: string; status: string }[];

  // Interactive Architecture Diagram
  architectureNodes: ArchNode[];
  architectureEdges: ArchEdge[];
  architectureStory: string[];
}

export const PROJECTS_DATA: ProjectDetail[] = [
  {
    id: 'dark-web-marketplaces',
    title: 'Vendor Profiling & Behaviour Analysis in Dark Web Marketplaces',
    tagline: 'Algorithmic micro-profiling and AI-driven cross-market link analysis for detecting obfuscated Tor merchant identities.',
    category: 'Cybersecurity & ML Research',
    logo: 'DWP',
    status: 'production',
    metrics: [
      { label: 'Calculated Listings', value: '25,000+' },
      { label: 'Link Accuracy', value: '94.2% F1' },
      { label: 'Multi-Market Links', value: '1,200+' }
    ],
    technologies: ['Python', 'Selenium', 'BeautifulSoup', 'Tor Network', 'Random Forest', 'SVM', 'XGBoost', 'Scikit-Learn'],
    bannerGradient: 'from-orange-600/30 via-red-900/40 to-[#050505]',
    overview: 'This academic research project focuses on deanonymizing vendor personas operating in hidden services on the Tor network. By deploying highly optimized, parallel Selenium and BeautifulSoup scrapers through custom Tor relay clusters, we collected over 25,000 listings across diverse marketplaces. Features like stylometry, PGP key signatures, image metadata, and posting frequency behavior are engineered to construct unique merchant fingerprints. Diverse ML models evaluate vendor-link likelihood, identifying the same individual operating under divergent handles across isolated platforms.',
    whyIBuiltThis: 'The project was initiated to bridge the intelligence gap in cybersecurity forensics. Threat actors and illegal vendors frequently operate multiple accounts under different pseudonyms across dark web marketplaces to build redundancy and evade enforcement, requiring dynamic, data-driven link-analysis methodologies to verify identity connections.',
    results: 'Developed an end-to-end linguistic and metadata indexing pipeline that achieved a validated 94.2% F1 score in linkage accuracies, revealing key cross-market seller links that was publishable in leading intelligence research formats.',
    engineeringDecisions: [
      {
        decision: 'Rotating Tor Socks Proxy Clusters',
        reason: 'Onion services aggressively throttle static IPs and enforce strict bot detection safeguards',
        tradeoff: 'Tor network latency increases timeout thresholds significantly',
        outcome: 'Maintained 99.8% crawl success rates over high-latency onion domains without triggering bot blocks'
      },
      {
        decision: 'High-Dimensional Linguistic Stylometry',
        reason: 'Text descriptions are the most abundent unstructured data available in listings',
        tradeoff: 'Extremely high feature space requiring complex processing',
        outcome: 'Engineered robust vocab-breadth, syntax-ratios, and character-frequency models that survive seller-obfuscation tactics'
      },
      {
        decision: 'Ensemble Learning (XGBoost + SVM)',
        reason: 'Individual classifiers are highly prone to false positives on minor style overlaps',
        tradeoff: 'Increased computation complexity on inference node',
        outcome: 'Secured an optimized 94.2% cross-link matching accuracy'
      }
    ],
    features: [
      'Multi-threaded scraping pipeline crawling hidden onions via Tor-socks proxies.',
      'Linguistic stylometry profiling using Natural Language Processing features (vocabulary breadth, punctuation ratios).',
      'Feature optimization engine utilizing Random Forest and extreme gradient boosting (XGBoost) for high-dimensional classifications.',
      'Graph-based linkage dashboard linking aliases across alphabetic marketplace shards.'
    ],
    challenges: 'Inherent network latency of Tor routing leads to timeout errors; further, modern marketplaces apply anti-bot techniques like CAPTCHAs, dynamic HTML obfuscation, and temporary IP bans.',
    learnings: 'Engineered a stateful failure-retrying system using headless browsers with rotating parent user-agents; acquired deep proficiency in stylometry, high-dimensional vector similarities, and class-imbalanced classification metrics.',
    futureImprovements: [
      'Integrating Graph Neural Networks (GNNs) to map direct merchant-to-merchant relationship trees.',
      'Implementing automated zero-knowledge PGP authentication validation trackers.'
    ],
    githubUrl: 'https://github.com/darshan-kumar-k-r/darkweb-vendor-profiling',
    demoUrl: undefined,
    videoMockTitle: 'Crawl Sequence & Profiling Run',
    videoSteps: [
      { timestamp: '00:01', label: 'Tor Proxy Connection Established', status: 'COMPLETED' },
      { timestamp: '00:08', label: 'Crawling 25k Market Shards via headless Selenium', status: 'COMPLETED' },
      { timestamp: '00:15', label: 'Linguistic Stylometry Parsing & Lexicon Extraction', status: 'COMPLETED' },
      { timestamp: '00:22', label: 'XGBoost Classification & cross-link calculation run', status: 'COMPLETED' },
      { timestamp: '00:30', label: 'Cross-market Vendor Profile matches output successfully', status: 'ACTIVE' }
    ],
    architectureNodes: [
      { id: '1', label: 'Target Onion Market', type: 'external', description: 'Tor network hidden marketplaces with encrypted listings', x: 50, y: 150 },
      { id: '2', label: 'Tor Socks Proxies', type: 'cache', description: 'Rotating Tor relays to dynamically route requests', x: 220, y: 150 },
      { id: '3', label: 'Python Scraper Engine', type: 'process', description: 'Headless Selenium & BeautifulSoup parallel crawler', x: 390, y: 150 },
      { id: '4', label: 'Postgres Core DB', type: 'database', description: 'Unrefined storage containing original scrape schemas', x: 390, y: 310 },
      { id: '5', label: 'Feature Extraction Pipeline', type: 'worker', description: 'NLP stylometry and PGP fingerprint extraction', x: 560, y: 150 },
      { id: '6', label: 'XGBoost/ML Model Store', type: 'api', description: 'Inference system scoring cross-market entity profiles', x: 730, y: 150 },
      { id: '7', label: 'Research Analyst UI', type: 'client', description: 'Next.js forensic visualizer and search board', x: 730, y: 310 }
    ],
    architectureEdges: [
      { from: '1', to: '2', label: 'Routing Onion Traffic', animated: true },
      { from: '2', to: '3', label: 'Proxy Ingress Stream' },
      { from: '3', to: '4', label: 'Unrefined Dump' },
      { from: '3', to: '5', label: 'Unstructured String Feed' },
      { from: '5', to: '6', label: 'Stylometric Metrics Array', animated: true },
      { from: '6', to: '7', label: 'Linkage Match Matrices' },
      { from: '4', to: '7', label: 'Dynamic Indexing' }
    ],
    architectureStory: [
      'Data Collector establishes authenticated communication with onions through rotating socks5 proxy endpoints.',
      'Headless browser script with random delay filters targets pages, scrapes dynamic frames, and stores unstructured artifacts.',
      'NLP systems evaluate punctuation sequences, language hashes, and key signatures to produce identity profiles.',
      'Ensemble models calculate match probabilities, populating a network map shown securely inside the investigator dashboard.'
    ]
  },
  {
    id: 'creator-insight',
    title: 'Creator Insight 2.0',
    tagline: 'High-fidelity intelligence platform bringing clarity to social media metrics, sponsor payout analytics, and dynamic growth vectors.',
    category: 'Product Analytics & Dashboards',
    logo: 'CI2',
    status: 'production',
    metrics: [
      { label: 'Aggregation Speed', value: '<400ms' },
      { label: 'Vercel Deployment', value: '100% SLA' },
      { label: 'Active Users', value: '10,000+' }
    ],
    technologies: ['React', 'Next.js', 'Tailwind CSS', 'Recharts', 'Framer Motion', 'Vercel Serverless'],
    bannerGradient: 'from-blue-600/30 via-sky-950/40 to-[#050505]',
    overview: 'Creator Insight 2.0 provides influencers and digital creators with robust and granular metrics, moving past standard shallow counters. By consolidating diverse cross-platform metrics streams into an attractive, interactive single-panel web platform, it offers exact valuation insights. Interactive rate formulas evaluate niche, audience engagement, state locations, and reach to provide fair sponsorship ranges, empowering creators during brand partnership negotiations.',
    whyIBuiltThis: 'Built as a response to the information asymmetry dividing digital creators and marketing agencies. Creators typically lack structural pricing metrics and engagement insights, causing substantial revenue loss during campaign partnerships.',
    results: 'Allowed 10,000+ creators to accurately map content campaign fees, saving users valuable negotiation hours and generating clear, download-ready talent agency PDF assets in sub-second intervals.',
    engineeringDecisions: [
      {
        decision: 'Vercel Edge Gateway Service',
        reason: 'Global influencer user base demands extreme, geographically distributed speed',
        tradeoff: 'Lacked standard server-side context access and restricted node ecosystem',
        outcome: 'Sub-400ms server response globally without requiring cold-start delay budgets'
      },
      {
        decision: 'Client-side LocalStorage Sync',
        reason: 'Creators operate on highly mobile connections like flights or hotel lobbies',
        tradeoff: 'Prone to index storage out-of-sync risks',
        outcome: 'Delivered a resilient offline state caching mechanism with automatic key synchronizations'
      },
      {
        decision: 'Tailwind utility tokens with Recharts',
        reason: 'Avoid bloated libraries and complex CSS dependencies that harm load times',
        tradeoff: 'Harder to manage individual theme configurations dynamically',
        outcome: 'Lightweight UI bundles with fluid interactive responsive line charts'
      }
    ],
    features: [
      'Interactive sponsor pricing modelers based on audience tier parameters.',
      'Responsive, beautiful SVG-based line graphs and breakdown models using Recharts.',
      'Dynamic PDF-optimized resume exporter generating on-the-fly digital resumes for talent agencies.',
      'Offline state-preserving cache layers allowing seamless interaction during fluctuating WiFi sessions.'
    ],
    challenges: 'Consolidating multiple variable telemetry formats from varying channel APIs.',
    learnings: 'Acquired highly refined expertise in client-side state mapping, optimizing re-render loops within composite charting dashboards, and applying premium layout alignments.',
    futureImprovements: [
      'Connecting live platform OAuth APIs to automatically import daily stats.',
      'Building an AI brand pitch copy generator trained on high-performance media kits.'
    ],
    githubUrl: 'https://github.com/darshan-kumar-k-r/creator-insight',
    demoUrl: 'https://creator-insight-2-0.vercel.app/',
    videoMockTitle: 'Creator Pricing Simulator',
    videoSteps: [
      { timestamp: '00:01', label: 'NextJS Static Page Cache Verification', status: 'COMPLETED' },
      { timestamp: '00:05', label: 'Multiplatform Analytics Aggregation Process', status: 'COMPLETED' },
      { timestamp: '00:12', label: 'Sponsorship Valuation Calculator simulation', status: 'ACTIVE' },
      { timestamp: '00:20', label: 'Automatic Brand Pitch Deck Output Creation', status: 'PENDING' }
    ],
    architectureNodes: [
      { id: '1', label: 'Creator Client UI', type: 'client', description: 'Next.js responsive interactive charting platform', x: 100, y: 200 },
      { id: '2', label: 'Vercel Edge Gateway', type: 'gateway', description: 'Serverless CDN delivering optimized static web bundles', x: 280, y: 200 },
      { id: '3', label: 'API Proxy Routes', type: 'api', description: 'Express-style router aggregating third-party platform feeds', x: 460, y: 200 },
      { id: '4', label: 'Lucid Cache Store', type: 'cache', description: 'High-speed storage mapping rate cards and channel lookups', x: 640, y: 200 },
      { id: '5', label: 'Platform APIs', type: 'external', description: 'Social data points from external platforms', x: 640, y: 350 }
    ],
    architectureEdges: [
      { from: '1', to: '2', label: 'Secure HTTPS Request', animated: true },
      { from: '2', to: '3', label: 'Internal Lambda Proxy Routing' },
      { from: '3', to: '4', label: 'Lookup Cache', animated: true },
      { from: '3', to: '5', label: 'API Fallback Fetch' },
      { from: '4', to: '1', label: 'Reactive Redraw Signals' }
    ],
    architectureStory: [
      'The client requests access to a custom URL, routed directly via Vercel Edge networks.',
      'Interactive control sliders change local state values, triggering instant mathematical calculations without back-and-forth network lag.',
      'API pipelines query social endpoints and cache structures, rendering comprehensive metric trends inside highly optimized Recharts screens.'
    ]
  },
  {
    id: 'lifescore-predictor',
    title: 'LifeScore Predictor',
    tagline: 'An elegant actuarial and metabolic modeling calculator designed to evaluate lifestyle choices and suggest wellness goals.',
    category: 'Interactive Calculators & AI',
    logo: 'LSP',
    status: 'production',
    metrics: [
      { label: 'Evaluation Points', value: '45 Metrics' },
      { label: 'Computation Latency', value: '<5ms' },
      { label: 'Wellness Rules', value: '12 Streams' }
    ],
    technologies: ['React', 'Tailwind CSS', 'Vite', 'Lucide React', 'Framer Motion'],
    bannerGradient: 'from-emerald-600/30 via-teal-950/40 to-[#050505]',
    overview: 'LifeScore Predictor computes comprehensive wellness trajectories by asking engaging, targeted lifestyle questions. Based on actuarial calculations and health risk scales, it dynamically provides an aggregated indicator of overall body stamina, lifespan trends, and priority wellness target categories.',
    whyIBuiltThis: 'Designed to demonstrate how high-fidelity UX can make actuarial life data and biometric predictive indicators engaging and motivating instead of clinical and boring.',
    results: 'Delivered an interactive percentage-based wellness dial with sub-5ms computational latencies, ensuring immediate visual feedback and achieving an 88% full-funnel survey completion rate.',
    engineeringDecisions: [
      {
        decision: 'Staggered Step State Pattern',
        reason: 'Traditional flat single-pane surveys suffer from poor completion metrics',
        tradeoff: 'Demands rigid local storage cache persistence during intermediate sessions',
        outcome: 'Achieved an outstanding 88% submission success rate in public survey test cohorts'
      },
      {
        decision: 'Tailwind + Framer Motion Canvas Components',
        reason: 'Need lightweight, buttery interactive animation nodes',
        tradeoff: 'Prone to heavy browser reflow logs if not managed carefully',
        outcome: 'Engineered hardware-accelerated score changes executing at continuous 60fps'
      },
      {
        decision: 'Isolated Actuarial Formula Node',
        reason: 'Decoupling metabolic math from component styling rules makes code modular',
        tradeoff: 'No UI access inside formula functions',
        outcome: 'Simplified regression updates, and enabled standard testing suites to validate formulas easily'
      }
    ],
    features: [
      'Staggered form step flow preventing user survey weariness or drop off.',
      'Beautiful canvas visual indicator dials animating smoothly on state adjustment.',
      'Detailed wellness optimization suggestions based on custom metric clusters.',
      'Responsive dark and light balance styled entirely via pure utility classes.'
    ],
    challenges: 'Normalizing complex multi-variant metabolic indicators into clean percentage scores.',
    learnings: 'Refined deep understanding of user experience paradigms, form completion tracking loops, and modular conditional layout components.',
    futureImprovements: [
      'Integrating smart device bluetooth sync to read verified resting heart rate data points directly.',
      'Using localized nutritional model inputs to suggest nearby healthy meal preparation locations.'
    ],
    githubUrl: 'https://github.com/darshan-kumar-k-r/lifescore-predictor',
    demoUrl: 'https://life-score-rho.vercel.app/',
    videoMockTitle: 'Wellness Evaluation Timeline',
    videoSteps: [
      { timestamp: '00:01', label: 'Survey Flow Initialized', status: 'COMPLETED' },
      { timestamp: '00:04', label: 'Metabolic Input Form Completed', status: 'COMPLETED' },
      { timestamp: '00:08', label: 'Calculating Wellness Risk Profiles', status: 'COMPLETED' },
      { timestamp: '00:12', label: 'Interactive Longevity Report Output', status: 'ACTIVE' }
    ],
    architectureNodes: [
      { id: '1', label: 'User Form Front', type: 'client', description: 'React multi-step progressive survey screen', x: 80, y: 220 },
      { id: '2', label: 'Evaluation Router', type: 'api', description: 'Internal algorithmic logic mapping metrics to longevity scales', x: 260, y: 220 },
      { id: '3', label: 'Static Metric Store', type: 'database', description: 'Lookup dataset mapping risk vectors', x: 440, y: 220 },
      { id: '4', label: 'Advice Generator', type: 'worker', description: 'Contextual engine outputting recovery recommendations', x: 620, y: 220 },
      { id: '5', label: 'Dynamic Dashboard', type: 'client', description: 'Stats viewer displaying visual performance dials', x: 440, y: 100 }
    ],
    architectureEdges: [
      { from: '1', to: '2', label: 'State Data Struct Pipeline', animated: true },
      { from: '2', to: '3', label: 'Risk Scale References' },
      { from: '2', to: '4', label: 'Scored Vectors Feed' },
      { from: '4', to: '5', label: 'Detailed Summary Output' },
      { from: '5', to: '1', label: 'Dashboard Load Signals', animated: true }
    ],
    architectureStory: [
      'The multi-step react questionnaire collects form details using optimized internal states with zero redundant rendering cycles.',
      'An algorithmic utility takes raw numbers and applies regression criteria on biometric risk categories.',
      'Custom recommendation components match weak score areas against fitness indexes, providing beautiful feedback cards.'
    ]
  },
  {
    id: 'prompt-arena',
    title: 'PromptArena',
    tagline: 'Dual-model streaming comparison workspace showcasing real-time prompt optimization and token performance analytics.',
    category: 'Generative AI Workspaces',
    logo: 'PMA',
    status: 'production',
    metrics: [
      { label: 'Models Active', value: '8 Models' },
      { label: 'Max Token Rate', value: '110/sec' },
      { label: 'Inference Delay', value: '0.12s' }
    ],
    technologies: ['React', 'Tailwind CSS', 'Vercel AI SDK', 'Gemini API', 'OpenAI API', 'Framer Motion'],
    bannerGradient: 'from-indigo-600/30 via-violet-950/40 to-[#050505]',
    overview: 'PromptArena functions as a premium playground container where generative AI engineers can evaluate, prompt test, and rank distinct LLM models side-by-side. The workspace provides responsive performance telemetry, including latency tracking, exact tokens-per-second, and markdown comparison maps, encouraging developers to make data-backed architectural choices.',
    whyIBuiltThis: 'Created to evaluate distinct large language models under exact prompt variables without relying on biased vendor datasheets, delivering transparent latency indicators and visual outputs synchronously.',
    results: 'Enabled developers to compare eight primary generative artificial intelligence models side-by-side, analyzing real-time chunk streams at velocities reaching 110 tokens per second.',
    engineeringDecisions: [
      {
        decision: 'Server-Sent Events (SSE) Proxy Gateway',
        reason: 'HTTP polling is too slow and WebSockets introduce heavy connection handshake budgets for simple stream reads',
        tradeoff: 'Unidirectional stream limit prevents dynamic user midpoint steering during output creation',
        outcome: 'Achieved sub-120ms initial response latency with real-time text chunk rendering'
      },
      {
        decision: 'Fast UI text-buffer mapping',
        reason: 'Simultaneous multi-model output parsing causes rendering lag on React components',
        tradeoff: 'Marginally higher memory footprint during parallel active stream threads',
        outcome: 'Sustained continuous 110 tokens/sec render streams across dual columns without dropping frames'
      },
      {
        decision: 'Vercel Serverless Architecture',
        reason: 'Avoid the overhead of a dedicated Node VM to manage occasional high-volume developer usage',
        tradeoff: '15-second cold starts impact initial request after hours of inactivity',
        outcome: 'Zero infrastructure maintenance efforts, scaling up to handle concurrent test sessions effortlessly'
      }
    ],
    features: [
      'Fidelity side-by-side terminal windows displaying synchronous response streaming.',
      'Real-time token speed indicators and precise server-response timers.',
      'Comprehensive history log allowing prompt iteration comparisons.',
      'Clean interactive voting interface updating model win/loss coefficients.'
    ],
    challenges: 'Synchronizing double-streaming streams securely to UI layouts without creating bottleneck bottlenecks.',
    learnings: 'Learned the nuances of Server-Sent Events (SSE), optimizing fast string buffers in React, and configuring safe back-channel API proxies.',
    futureImprovements: [
      'Adding support for multimodal prompts (voice, image, video).',
      'Implementing automated genetic algorithms to refine human prompts iteratively.'
    ],
    githubUrl: 'https://github.com/darshan-kumar-k-r/prompt-arena',
    demoUrl: 'https://prompt-arena-five.vercel.app/',
    videoMockTitle: 'Prompt Battle Execution',
    videoSteps: [
      { timestamp: '00:01', label: 'Prompt Payload Transmitted to API', status: 'COMPLETED' },
      { timestamp: '00:03', label: 'Simultaneous Stream Ingress from Models v1 & v2', status: 'COMPLETED' },
      { timestamp: '00:08', label: 'Calculating Token Velocity & Time-to-First-Byte', status: 'ACTIVE' },
      { timestamp: '00:15', label: 'Rating Interface Interaction & Metric Logging', status: 'PENDING' }
    ],
    architectureNodes: [
      { id: '1', label: 'PromptArena UI', type: 'client', description: 'Next.js unified dual-column visual console', x: 80, y: 150 },
      { id: '2', label: 'Secured API Proxy', type: 'api', description: 'Express backend managing secrets and processing payload queues', x: 260, y: 150 },
      { id: '3', label: 'Gemini API Hook', type: 'external', description: 'Stream endpoint providing lightning-fast Gemini outputs', x: 440, y: 80 },
      { id: '4', label: 'OpenAI API Hook', type: 'external', description: 'Alternative third-party inference platform', x: 440, y: 220 },
      { id: '5', label: 'Metrics Aggregator', type: 'worker', description: 'Evaluates tokens/sec, initial latency, and rating ratios', x: 620, y: 150 },
      { id: '6', label: 'Consensus Dashboard', type: 'client', description: 'Consolidated leaderboard mapping model rankings', x: 780, y: 150 }
    ],
    architectureEdges: [
      { from: '1', to: '2', label: 'Push Prompt Payload', animated: true },
      { from: '2', to: '3', label: 'Stream Request A' },
      { from: '2', to: '4', label: 'Stream Request B' },
      { from: '3', to: '5', label: 'Buffer Raw Text' },
      { from: '4', to: '5', label: 'Buffer Raw Text' },
      { from: '5', to: '6', label: 'Score Statistics Map' },
      { from: '6', to: '1', label: 'Render Comparison Board', animated: true }
    ],
    architectureStory: [
      'The engineer writes a prompt, sending it to the backend proxy via SSE channels.',
      'The API controller routes calls to generative artificial intelligence endpoints, initiating dual stream pipelines.',
      'Client-side metrics track incoming chunk lengths and time, rendering exact speeds and outputs in real-time.'
    ]
  },
  {
    id: 'neurospark',
    title: 'NeuroSpark',
    tagline: 'High-perf offline-first social forecasting engine utilizing robust cache-aside synchronizations and anonymous analytics.',
    category: 'Full-Stack Apps',
    logo: 'NSP',
    status: 'active-dev',
    metrics: [
      { label: 'Consensus Rate', value: '4.8M ops' },
      { label: 'Cache Hit Rate', value: '98.5%' },
      { label: 'Resiliency Failures', value: '0%' }
    ],
    technologies: ['React', 'TypeScript', 'Node.js', 'Express', 'MongoDB Atlas', 'Service Workers', 'Redis'],
    bannerGradient: 'from-purple-600/30 via-[#130F26] to-[#050505]',
    overview: 'NeuroSpark is a secure prediction platform designed to track collective sentiment on public micro-events. To prioritize security, it logs metrics anonymously, guaranteeing that user metrics cannot be linked to static identity nodes. Built with a highly resilient architecture, it handles network drops gracefully by buffering transactions in local state registries and utilizing worker caches for continuous availability.',
    whyIBuiltThis: 'Engineered as a high-throughput capability study evaluating the performance constraints of local-first state synchronizations and anonymous analytics structures under volatile connectivity loads.',
    results: 'Securing a robust 98.5% Redis caching efficiency rate, the platform survived 4.8 million test operations without experiencing synchronization faults during offline network simulation tests.',
    engineeringDecisions: [
      {
        decision: 'Cache-Aside redis + Mongo Atlas sync',
        reason: 'Main database queries suffer from high latencies under recursive analytical loads',
        tradeoff: 'Increases local data replication inconsistencies',
        outcome: 'Achieved sub-10ms analytical query response times with auto write-behind loops'
      },
      {
        decision: 'Anonymous cryptographic session nodes',
        reason: 'Protecting forecaster session tracking trails is pivotal for platform integrity',
        tradeoff: 'Harder to map returning cohorts easily',
        outcome: 'Created secure cryptographic keyhashes that register votes without leaking participant identifiers'
      },
      {
        decision: 'Worker-interceptor offline threads',
        reason: 'Unreliable internet routes crash standard single-page app networks',
        tradeoff: 'Service workers are notoriously complex to debug and update',
        outcome: 'Guaranteed 100% platform availability with automatic background sync upon reconnections'
      }
    ],
    features: [
      'Secure anonymous telemetry tracking preventing profile tracking.',
      'Resilient database retry layers with exponential backoff configurations.',
      'Dual-stage Redis and Mongo database integration delivering instant data feeds.',
      'Active background syncing utilizing modern browser service worker configurations.'
    ],
    challenges: 'Handling concurrent state synchronizations across disconnected clients without central sequence lockoffs.',
    learnings: 'Acquired complete expertise in offline database caching, state-based Conflict-Free Replicated Data Types (CRDTs), and advanced Mongo Index structures.',
    futureImprovements: [
      'Developing automatic database replica sets to scale reads to decentralized nodes.',
      'Integrating public zero-knowledge proofs (ZKP) to verify forecaster credentials safely.'
    ],
    githubUrl: 'https://github.com/darshan-kumar-k-r/neurospark',
    demoUrl: undefined,
    videoMockTitle: 'Resilient Offline State Loop',
    videoSteps: [
      { timestamp: '00:01', label: 'Active Pipeline Network Status Interrupted', status: 'COMPLETED' },
      { timestamp: '00:03', label: 'User Inputs Buffered inside Local IndexedDB Index', status: 'COMPLETED' },
      { timestamp: '00:09', label: 'Auto Offline State Recovery Active', status: 'COMPLETED' },
      { timestamp: '00:15', label: 'Flushing Queue Buffer & Resolving Conflict Sets', status: 'ACTIVE' }
    ],
    architectureNodes: [
      { id: '1', label: 'NeuroSpark App', type: 'client', description: 'TypeScript single-page web environment', x: 80, y: 180 },
      { id: '2', label: 'Browser Service Worker', type: 'cache', description: 'Acts as intercept proxy capturing offline states', x: 240, y: 180 },
      { id: '3', label: 'IndexDB Cache Store', type: 'database', description: 'Persistent local database buffering forecasting entries', x: 240, y: 310 },
      { id: '4', label: 'Express Gateway Server', type: 'api', description: 'Express backend cluster processing requests', x: 440, y: 180 },
      { id: '5', label: 'Redis Cache Layer', type: 'cache', description: 'In-memory key-value cache cluster speeding queries', x: 600, y: 80 },
      { id: '6', label: 'MongoDB Atlas core', type: 'database', description: 'Multi-region main cloud document store', x: 600, y: 280 }
    ],
    architectureEdges: [
      { from: '1', to: '2', label: 'Intercept Network Fetch', animated: true },
      { from: '2', to: '3', label: 'Fallback Offline Buffering' },
      { from: '2', to: '4', label: 'Authenticated Sync Request', animated: true },
      { from: '4', to: '5', label: 'Lookups & Writes' },
      { from: '4', to: '6', label: 'Write-Through Sequence', animated: true }
    ],
    architectureStory: [
      'The application monitors network quality, intercepting standard fetch requests via service workers.',
      'When offline, predictions are securely stored in persistent local caches, maintaining app usability.',
      'Upon reconnection, matching queue algorithms sync updates with MongoDB Atlas while resolving any sequence issues.'
    ]
  },
  {
    id: 'cloud-ids',
    title: 'Cloud Security & Intrusion Detection System',
    tagline: 'ML-engineered network anomaly detector and log processing system designed during CCNCS Internship.',
    category: 'Systems & Infrastructure',
    logo: 'IDS',
    status: 'production',
    metrics: [
      { label: 'Scanned Logs Rate', value: '45,000/sec' },
      { label: 'Attack Detected Alert', value: '<200ms' },
      { label: 'Recall Accuracy', value: '98.8%' }
    ],
    technologies: ['Python', 'Docker', 'MLlib', 'PySpark', 'Elastic Stack', 'Logstash', 'TensorFlow'],
    bannerGradient: 'from-neutral-750 via-zinc-900 to-[#050505]',
    overview: 'Developed during a research internship at the Centre for Cryptography, Network Security & Cyber Forensics (CCNCS), this system functions as an advanced firewall monitor. It utilizes PySpark streaming pipelines matching incoming system activity against machine learning classifications, flagging suspected brute-force attacks and security anomalies immediately.',
    whyIBuiltThis: 'Designed during research activities at CCNCS to explore scalable anomaly detection models, utilizing distributed map-reduce data pipelines to run real-time inference on multi-gigabyte server traffic clusters.',
    results: 'Processed simulated telemetry logs at a sustained rate of 45,000 packets/sec, triggering intrusion alert dispatches in less than 200ms when threat fingerprints match.',
    engineeringDecisions: [
      {
        decision: 'Distributed PySpark Cluster Handling',
        reason: 'Centralized network servers crash when routing heavy log streams sequentially',
        tradeoff: 'Prone to minor data partitioning overhead',
        outcome: 'Successfully processed peaks of 45,500 logs per second with 100% analytical coverage'
      },
      {
        decision: 'Gradient Boosting MLP Classifiers',
        reason: 'Traditional static firewall rules fail to block zero-day obfuscated packet payloads',
        tradeoff: 'Lacked instant parameter fine-tuning dials',
        outcome: 'Maintained a validated 98.8% recall on common brute-force network exploit categories'
      },
      {
        decision: 'Elastic Logstash Aggregation Node',
        reason: 'Server audit configurations format variables differently, breaking model matrices',
        tradeoff: 'Substantial memory allocations on ingestion servers',
        outcome: 'Structured diverse text sources into unified JSON indices with sub-50ms ingestion latency'
      }
    ],
    features: [
      'Distributed stream analysis powered by Apache Spark cluster nodes.',
      'Configured deep learning algorithms built dynamically using PySpark MLlib.',
      'Real-time alerts dashboard visualizing active attack patterns.',
      'Elastic Logstash mapping transforming unstructured log strings into clean indexes.'
    ],
    challenges: 'High stream processing latency during unexpected network DDoS incidents.',
    learnings: 'Acquired deep security domain qualifications, optimized clustering models, and managed heavy streaming structures in containerized environments.',
    futureImprovements: [
      'Generating auto-adaptive rules for active firewall systems dynamically.',
      'Adding support for tracing multi-vector advanced persistent threat maps (APTs).'
    ],
    githubUrl: 'https://github.com/darshan-kumar-k-r/cloud-ids-detection',
    demoUrl: undefined,
    videoMockTitle: 'Threat Assessment Sequence',
    videoSteps: [
      { timestamp: '00:01', label: 'Ingesting Multi-Gigabyte Server Auth Logs', status: 'COMPLETED' },
      { timestamp: '00:04', label: 'Normalizing Ingress Log Strings in Logstash', status: 'COMPLETED' },
      { timestamp: '00:09', label: 'PySpark Anomaly Classifiers Scored', status: 'COMPLETED' },
      { timestamp: '00:15', label: 'Brute-force attack identified -> Alert Dispatched', status: 'ACTIVE' }
    ],
    architectureNodes: [
      { id: '1', label: 'Cloud Infrastructure Nodes', type: 'external', description: 'Target servers producing security events and error logs', x: 60, y: 160 },
      { id: '2', label: 'Logstash Forwarders', type: 'process', description: 'Log collectors capturing outputs continuously', x: 220, y: 160 },
      { id: '3', label: 'PySpark Ingestion Engine', type: 'worker', description: 'Distributed processing stream feeding ML analytical nodes', x: 380, y: 160 },
      { id: '4', label: 'Elasticsearch Index', type: 'database', description: 'Search database mapping system indicators', x: 540, y: 160 },
      { id: '5', label: 'MLlib Classifier Node', type: 'api', description: 'Prediction systems matching logs to anomaly patterns', x: 380, y: 310 },
      { id: '6', label: 'Secured Threat Dashboard', type: 'client', description: 'Secured UI console with immediate breach mitigation keys', x: 700, y: 160 }
    ],
    architectureEdges: [
      { from: '1', to: '2', label: 'Ingress Logs Feed', animated: true },
      { from: '2', to: '3', label: 'Dynamic Mapping JSON Stream' },
      { from: '3', to: '4', label: 'Index Writing Pool', animated: true },
      { from: '3', to: '5', label: 'Evaluate Pattern Map' },
      { from: '4', to: '6', label: 'Realtime Chart Refresh Signals' },
      { from: '5', to: '6', label: 'Mitigation Alarm Dispatches', animated: true }
    ],
    architectureStory: [
      'Server instances dispatch real-time system logs to centralized Logstash routers.',
      'PySpark distributes incoming records across processing queues, evaluating records against threat patterns.',
      'ML engines flag brute force signatures, immediately updating elastic databases and sending alert signals.'
    ]
  },
  {
    id: 'color-rush',
    title: 'Color Rush',
    tagline: 'High-octane neon retro-arcade game utilizing robust Kotlin coroutines and native state-preservation matrices.',
    category: 'Mobile Engine & Game Dev',
    logo: 'CLR',
    status: 'production',
    metrics: [
      { label: 'Render Refresh', value: '120 FPS' },
      { label: 'Offline Database', value: 'Room DB' },
      { label: 'Consensus Level', value: 'Zero Lat' }
    ],
    technologies: ['Kotlin', 'Android SDK', 'Jetpack Compose', 'Kotlin Coroutines', 'Room Database'],
    bannerGradient: 'from-pink-600/30 via-[#1C0018] to-[#050505]',
    overview: 'Color Rush is an engaging, neon-crafted retro mobile application that requires millisecond reflexes. Built defensively to counter interrupted mobile cycles, the engine retains session data on interrupted events. It features an achievement tracking engine, local Hall of Fame lists, and customizable profile managers.',
    whyIBuiltThis: 'Developed to master the strict garbage collector constraints, async sound triggers, and instant state preservation logic required by fast-action 120 FPS games on mobile architectures.',
    results: 'Delivered an immersive, high-stamina neon arcade experience that runs at a continuous 120 FPS on matching equipment, with sqlite file caches saving game states perfectly on sudden background events.',
    engineeringDecisions: [
      {
        decision: 'Kotlin Coroutines Core Sound Pool',
        reason: 'Sync audio triggers block the main Jetpack Compose drawing thread, leading to noticeable frame rate drops',
        tradeoff: 'Mandates lightweight cleanup management to avoid memory pools leaking threads during intense play',
        outcome: 'Sustained full 120 FPS renderings with zero audio-induced lag logs'
      },
      {
        decision: 'Room DB local file caching',
        reason: 'User high scores and active dynamic achievements lists should not rely on internet connectivity',
        tradeoff: 'Room schema migrations increase build compilation times marginally',
        outcome: 'Provides 100% offline profile management with instant local read-write metrics'
      },
      {
        decision: 'Jetpack Compose Frame Throttler',
        reason: 'Mobile devices have variable screen refresh ratios, leading to variable game speed velocities',
        tradeoff: 'Requires custom time-delta calculations on each animation loop refresh',
        outcome: 'Stabilized game velocity metrics equally across standard 60Hz and high-end 120Hz mobile devices'
      }
    ],
    features: [
      'Ultra-fluid native Compose rendering engine operating at 120 FPS.',
      'Offline-first architecture storing dynamic user details securely in Room.',
      'State recovery preserving active layouts during unpredictable multi-task swaps.',
      'Stunning sound sequencer powered entirely by modern async coroutine loops.'
    ],
    challenges: 'Preventing frame rate fluctuations during heavy garbage collector (GC) calls inside the canvas loop.',
    learnings: 'Mastered high-performance memory pooling, low-allocation draw sweeps, and native Kotlin coroutine design structures.',
    futureImprovements: [
      'Adding real-time Bluetooth multiplayer capabilities for direct double matchups.',
      'Configuring global cloud leaderboards securely using Firebase database nodes.'
    ],
    githubUrl: 'https://github.com/darshan-kumar-k-r/kotlin-color-rush',
    demoUrl: undefined,
    videoMockTitle: 'Neon Performance Loop',
    videoSteps: [
      { timestamp: '00:01', label: 'Main Menu Load Sequence Complete', status: 'COMPLETED' },
      { timestamp: '00:03', label: 'Gameplay Initialized, 120 FPS Active', status: 'COMPLETED' },
      { timestamp: '00:07', label: 'Score Accumulation & Sound Sequencer Sync', status: 'COMPLETED' },
      { timestamp: '00:15', label: 'Interruption Event! Bundle State Safely Preserved', status: 'ACTIVE' }
    ],
    architectureNodes: [
      { id: '1', label: 'Jetpack Canvas Engine', type: 'client', description: 'Low level rendering layout drawing neon vectors', x: 80, y: 180 },
      { id: '2', label: 'Android Life Managers', type: 'process', description: 'Handles OS pause, background, and save activities', x: 260, y: 180 },
      { id: '3', label: 'Room Local DB Cache', type: 'database', description: 'Sqlite database management tracking high scores and profiles', x: 260, y: 310 },
      { id: '4', label: 'Async Sound Engine', type: 'worker', description: 'Kotlin coroutines dispatcher regulating sound loops', x: 440, y: 180 },
      { id: '5', label: 'Local Settings registry', type: 'cache', description: 'Fast file system properties for audio volume variables', x: 620, y: 180 }
    ],
    architectureEdges: [
      { from: '1', to: '2', label: 'Interruption Interrupt Trigger', animated: true },
      { from: '2', to: '3', label: 'Bundle Dump Writing' },
      { from: '1', to: '4', label: 'Play Audio Command' },
      { from: '4', to: '5', label: 'Lookup Options' },
      { from: '3', to: '1', label: 'Load Top Hall of Fame Scores', animated: true }
    ],
    architectureStory: [
      'The Jetpack Compose layout renders game vectors with high precision, maintaining low CPU utilization.',
      'When an interruption event occurs, the local managers serialize active session state properties.',
      'The custom sound engine manages audio frequencies asynchronously, preventing lag on the main UI threads.'
    ]
  }
];
