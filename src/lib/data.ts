/**
 * Central content source for the studio site.
 * Kept framework-agnostic so it can be swapped for a CMS later.
 */

export type Game = {
  id: string;
  title: string;
  genre: string;
  release: string;
  status: "Released" | "In Development" | "Announced";
  platforms: string[];
  tagline: string;
  description: string;
  /** two hex stops used to procedurally render cinematic key art */
  palette: [string, string];
  accent: string;
};

export const games: Game[] = [
  {
    id: "king-is-sticks",
    title: "King is Sticks",
    genre: "Roguelike · Action",
    release: "2024",
    status: "Released",
    platforms: ["PC", "Steam", "Android"],
    tagline: "A kingdom balanced on the edge of a blade.",
    description:
      "A hand-drawn roguelike where every run rewrites the throne. Master reactive combat, bend fate with relics, and out-wit a kingdom that never stops scheming.",
    palette: ["#6c63ff", "#0a0a1a"],
    accent: "#6c63ff",
  },
  {
    id: "agent-rat",
    title: "Agent Rat",
    genre: "Stealth · Platformer",
    release: "2025",
    status: "In Development",
    platforms: ["PC", "Steam", "Console"],
    tagline: "The smallest agent. The biggest heist.",
    description:
      "Slip through neon-soaked ducts as the world's most unlikely spy. A tactile stealth-platformer built on shadow, timing, and a very good nose.",
    palette: ["#00e5ff", "#04121a"],
    accent: "#00e5ff",
  },
  {
    id: "closer",
    title: "Closer",
    genre: "Narrative · Atmospheric",
    release: "2026",
    status: "Announced",
    platforms: ["PC", "Console"],
    tagline: "Some distances were never meant to be crossed.",
    description:
      "A slow-burn narrative experience about proximity, memory, and the things left unsaid. Every step forward is a decision you cannot take back.",
    palette: ["#8a7dff", "#0c0c14"],
    accent: "#8a7dff",
  },
  {
    id: "signal-lost",
    title: "Signal Lost",
    genre: "Survival · Sci-Fi",
    release: "TBA",
    status: "Announced",
    platforms: ["PC"],
    tagline: "In the dark between stars, no one is coming.",
    description:
      "Drift through a derelict station where the only currency is oxygen and the only enemy is the silence. A tense survival prototype in the works.",
    palette: ["#00c2b8", "#04140f"],
    accent: "#00c2b8",
  },
];

export const featuredGame = games[0];

export type JourneyEvent = {
  year: string;
  title: string;
  description: string;
};

export const journey: JourneyEvent[] = [
  {
    year: "2024",
    title: "Studio Founded",
    description:
      "Out Of Box Studio opens its doors — a small team with an oversized ambition: to build worlds that linger long after the screen goes dark.",
  },
  {
    year: "2024",
    title: "King is Sticks",
    description:
      "Our debut roguelike ships to players worldwide, proving that a tiny team can punch far above its weight.",
  },
  {
    year: "2025",
    title: "Agent Rat",
    description:
      "We dive into stealth-platforming, refining a tactile movement system and a shadow-driven world.",
  },
  {
    year: "2026",
    title: "Closer",
    description:
      "A narrative-first pivot — our most personal project yet, exploring the space between people.",
  },
  {
    year: "Beyond",
    title: "Future Projects",
    description:
      "New worlds are already taking shape in the dark. The camera keeps moving.",
  },
];

export type ProcessStep = {
  index: string;
  title: string;
  description: string;
};

export const process: ProcessStep[] = [
  {
    index: "01",
    title: "Idea",
    description: "A single spark — a feeling we want the player to carry home.",
  },
  {
    index: "02",
    title: "Concept Art",
    description: "We paint the mood before we build the mechanic.",
  },
  {
    index: "03",
    title: "Prototype",
    description: "Ugly, fast, honest. If it isn't fun grey-boxed, it never will be.",
  },
  {
    index: "04",
    title: "Gameplay",
    description: "Systems, feel, and feedback loops tuned frame by frame.",
  },
  {
    index: "05",
    title: "Testing",
    description: "Real players, real friction. We listen more than we talk.",
  },
  {
    index: "06",
    title: "Launch",
    description: "We open the box — and start watching the next spark.",
  },
];

export type BehindScene = {
  title: string;
  category: string;
  palette: [string, string];
  span: "tall" | "wide" | "square";
};

export const behindScenes: BehindScene[] = [
  { title: "Concept Art", category: "Art", palette: ["#6c63ff", "#0a0a1a"], span: "tall" },
  { title: "Unity Development", category: "Engine", palette: ["#00e5ff", "#04121a"], span: "wide" },
  { title: "Blender Models", category: "3D", palette: ["#ff7ac2", "#160812"], span: "square" },
  { title: "Wireframes", category: "Design", palette: ["#8a7dff", "#0c0c14"], span: "square" },
  { title: "Game Testing", category: "QA", palette: ["#00c2b8", "#04140f"], span: "wide" },
  { title: "Motion & VFX", category: "Video", palette: ["#ffb84d", "#1a1204"], span: "tall" },
];

export type Stat = {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
};

export const stats: Stat[] = [
  { label: "Games Created", value: 4 },
  { label: "Hours Developed", value: 18400, suffix: "+" },
  { label: "Coffee Consumed", value: 9120, suffix: " cups" },
  { label: "Players", value: 240, suffix: "K" },
  { label: "Downloads", value: 512, suffix: "K" },
];

export type Devlog = {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readingTime: string;
  tag: string;
  palette: [string, string];
};

export const devlogs: Devlog[] = [
  {
    id: "shadows-of-agent-rat",
    title: "Building the Shadows of Agent Rat",
    excerpt:
      "How we rebuilt our lighting pipeline three times to make darkness feel like a place you can hide inside.",
    date: "Jun 2026",
    readingTime: "6 min",
    tag: "Rendering",
    palette: ["#00e5ff", "#04121a"],
  },
  {
    id: "roguelike-balance",
    title: "The Math Behind a Fair Roguelike",
    excerpt:
      "Tuning King is Sticks so that every death feels earned, not cheated. A deep dive into our reward curves.",
    date: "Apr 2026",
    readingTime: "8 min",
    tag: "Design",
    palette: ["#6c63ff", "#0a0a1a"],
  },
  {
    id: "closer-narrative",
    title: "Writing Closer Without Words",
    excerpt:
      "Our attempt at environmental storytelling — letting a hallway say what a cutscene never could.",
    date: "Feb 2026",
    readingTime: "5 min",
    tag: "Narrative",
    palette: ["#8a7dff", "#0c0c14"],
  },
];

export const navLinks = [
  { label: "Games", href: "#games" },
  { label: "About", href: "#about" },
  { label: "Journey", href: "#journey" },
  { label: "Devlogs", href: "#devlogs" },
  { label: "Contact", href: "#contact" },
] as const;
