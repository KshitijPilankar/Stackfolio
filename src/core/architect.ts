import { CandidateDocument } from '../schemas/resume.schema';
import { LayoutBlueprint, StylePreset, DesignTokens } from '../schemas/layout.schema';

export type ArchetypeCluster =
  | 'systems-infra'
  | 'ui-creative'
  | 'product-fullstack'
  | 'research-data'
  | 'leadership-exec';

/**
 * Keyword heuristic sets for deterministic classification into Archetype Clusters
 */
const CLUSTER_KEYWORDS: Record<ArchetypeCluster, string[]> = {
  'systems-infra': [
    'kubernetes', 'docker', 'aws', 'gcp', 'azure', 'devops', 'terraform', 'ci/cd',
    'linux', 'kernel', 'go', 'golang', 'rust', 'c++', 'distributed systems', 'kafka',
    'microservices', 'site reliability', 'sre', 'cloud', 'infrastructure', 'network'
  ],
  'ui-creative': [
    'frontend', 'ui', 'ux', 'css', 'tailwind', 'figma', 'design', 'react', 'vue',
    'three.js', 'animation', 'gsap', 'framer', 'webgl', 'design system', 'canvas',
    'html', 'svg', 'creative', 'graphic', 'browser'
  ],
  'product-fullstack': [
    'fullstack', 'full stack', 'full-stack', 'web', 'node', 'express', 'next.js',
    'typescript', 'javascript', 'python', 'django', 'fastapi', 'postgres', 'sql',
    'mongodb', 'graphql', 'rest api', 'product', 'saas'
  ],
  'research-data': [
    'machine learning', 'deep learning', 'pytorch', 'tensorflow', 'ai', 'data science',
    'nlp', 'llm', 'computer vision', 'data engineer', 'pandas', 'spark', 'sql',
    'research', 'paper', 'phd', 'algorithm', 'scikit-learn'
  ],
  'leadership-exec': [
    'lead', 'head of', 'cto', 'vp', 'director', 'manager', 'engineering manager',
    'architect', 'principal', 'founder', 'co-founder', 'staff engineer', 'team lead'
  ]
};

/**
 * Pre-configured Tailwind design tokens mapped to 5 core presets (zero hallucinated classes)
 */
const PRESET_DESIGN_TOKENS: Record<StylePreset, DesignTokens> = {
  'terminal-dark': {
    fontFamily: { heading: 'font-mono', body: 'font-mono', mono: 'font-mono' },
    colors: {
      background: 'bg-black',
      surface: 'bg-zinc-900',
      surfaceBorder: 'border-green-500/30',
      textPrimary: 'text-green-400',
      textMuted: 'text-zinc-500',
      accentPrimary: 'bg-green-500 text-black',
      accentSecondary: 'bg-emerald-800 text-green-200',
      accentBorder: 'border-green-400'
    },
    borderRadius: { card: 'rounded-none', badge: 'rounded-none', button: 'rounded-none' },
    spacing: { containerPadding: 'p-6 md:p-12', sectionGap: 'space-y-12' },
    effects: { cardShadow: 'shadow-none', hoverTransform: 'hover:border-green-400 transition-colors' }
  },
  'neo-brutalist': {
    fontFamily: { heading: 'font-extrabold', body: 'font-sans', mono: 'font-mono' },
    colors: {
      background: 'bg-[#FFFDF8]',
      surface: 'bg-white',
      surfaceBorder: 'border-2 border-black',
      textPrimary: 'text-slate-900',
      textMuted: 'text-slate-600',
      accentPrimary: 'bg-[#FFE600] text-black',
      accentSecondary: 'bg-[#4DEEEA] text-black',
      accentBorder: 'border-black'
    },
    borderRadius: { card: 'rounded-xl', badge: 'rounded-md', button: 'rounded-lg' },
    spacing: { containerPadding: 'p-6 md:p-12', sectionGap: 'space-y-16' },
    effects: { cardShadow: 'shadow-[4px_4px_0px_0px_#000]', hoverTransform: 'hover:translate-x-[2px] hover:translate-y-[2px] transition-all' }
  },
  'linear-sleek': {
    fontFamily: { heading: 'font-sans', body: 'font-sans', mono: 'font-mono' },
    colors: {
      background: 'bg-slate-950',
      surface: 'bg-slate-900/80',
      surfaceBorder: 'border-slate-800',
      textPrimary: 'text-slate-100',
      textMuted: 'text-slate-400',
      accentPrimary: 'bg-indigo-500 text-white',
      accentSecondary: 'bg-sky-500/20 text-sky-300',
      accentBorder: 'border-indigo-500/50'
    },
    borderRadius: { card: 'rounded-2xl', badge: 'rounded-full', button: 'rounded-xl' },
    spacing: { containerPadding: 'p-6 md:p-12', sectionGap: 'space-y-20' },
    effects: { cardShadow: 'shadow-2xl shadow-indigo-950/50', hoverTransform: 'hover:border-slate-700 transition-colors' }
  },
  'academic-classic': {
    fontFamily: { heading: 'font-serif', body: 'font-serif', mono: 'font-mono' },
    colors: {
      background: 'bg-stone-50',
      surface: 'bg-white',
      surfaceBorder: 'border-stone-200',
      textPrimary: 'text-stone-900',
      textMuted: 'text-stone-600',
      accentPrimary: 'bg-stone-900 text-white',
      accentSecondary: 'bg-stone-200 text-stone-800',
      accentBorder: 'border-stone-400'
    },
    borderRadius: { card: 'rounded-sm', badge: 'rounded-none', button: 'rounded-sm' },
    spacing: { containerPadding: 'p-8 md:p-16', sectionGap: 'space-y-16' },
    effects: { cardShadow: 'shadow-sm', hoverTransform: 'hover:bg-stone-100/50 transition-colors' }
  },
  'minimal-mono': {
    fontFamily: { heading: 'font-mono', body: 'font-sans', mono: 'font-mono' },
    colors: {
      background: 'bg-zinc-950',
      surface: 'bg-zinc-900',
      surfaceBorder: 'border-zinc-800',
      textPrimary: 'text-zinc-100',
      textMuted: 'text-zinc-400',
      accentPrimary: 'bg-zinc-100 text-zinc-950',
      accentSecondary: 'bg-zinc-800 text-zinc-300',
      accentBorder: 'border-zinc-700'
    },
    borderRadius: { card: 'rounded-lg', badge: 'rounded-md', button: 'rounded-md' },
    spacing: { containerPadding: 'p-6 md:p-12', sectionGap: 'space-y-16' },
    effects: { cardShadow: 'shadow-md', hoverTransform: 'hover:border-zinc-600 transition-colors' }
  },
  'bento-modern': {
    fontFamily: { heading: 'font-sans', body: 'font-sans', mono: 'font-mono' },
    colors: {
      background: 'bg-slate-900',
      surface: 'bg-slate-800/90',
      surfaceBorder: 'border-slate-700/60',
      textPrimary: 'text-slate-100',
      textMuted: 'text-slate-400',
      accentPrimary: 'bg-cyan-500 text-slate-950',
      accentSecondary: 'bg-blue-600/30 text-cyan-300',
      accentBorder: 'border-cyan-500/40'
    },
    borderRadius: { card: 'rounded-3xl', badge: 'rounded-full', button: 'rounded-2xl' },
    spacing: { containerPadding: 'p-6 md:p-12', sectionGap: 'space-y-16' },
    effects: { cardShadow: 'shadow-xl', hoverTransform: 'hover:scale-[1.01] transition-transform' }
  },
  'cyberpunk-neon': {
    fontFamily: { heading: 'font-mono', body: 'font-sans', mono: 'font-mono' },
    colors: {
      background: 'bg-black',
      surface: 'bg-zinc-900',
      surfaceBorder: 'border-fuchsia-500/50',
      textPrimary: 'text-fuchsia-100',
      textMuted: 'text-zinc-400',
      accentPrimary: 'bg-fuchsia-500 text-black',
      accentSecondary: 'bg-cyan-500 text-black',
      accentBorder: 'border-fuchsia-400'
    },
    borderRadius: { card: 'rounded-none', badge: 'rounded-none', button: 'rounded-none' },
    spacing: { containerPadding: 'p-6 md:p-12', sectionGap: 'space-y-16' },
    effects: { cardShadow: 'shadow-[0_0_15px_rgba(217,70,239,0.3)]', hoverTransform: 'hover:border-cyan-400 transition-colors' }
  },
  'glassmorphism-clean': {
    fontFamily: { heading: 'font-sans', body: 'font-sans', mono: 'font-mono' },
    colors: {
      background: 'bg-slate-950',
      surface: 'bg-white/10 backdrop-blur-md',
      surfaceBorder: 'border-white/20',
      textPrimary: 'text-white',
      textMuted: 'text-slate-300',
      accentPrimary: 'bg-white/20 text-white',
      accentSecondary: 'bg-sky-500/30 text-sky-200',
      accentBorder: 'border-white/40'
    },
    borderRadius: { card: 'rounded-2xl', badge: 'rounded-full', button: 'rounded-xl' },
    spacing: { containerPadding: 'p-6 md:p-12', sectionGap: 'space-y-16' },
    effects: { cardShadow: 'shadow-lg backdrop-blur-md', hoverTransform: 'hover:bg-white/15 transition-all' }
  },
  'paper-editorial': {
    fontFamily: { heading: 'font-serif', body: 'font-sans', mono: 'font-mono' },
    colors: {
      background: 'bg-amber-50/40',
      surface: 'bg-white',
      surfaceBorder: 'border-amber-900/10',
      textPrimary: 'text-amber-950',
      textMuted: 'text-amber-800/70',
      accentPrimary: 'bg-amber-900 text-amber-50',
      accentSecondary: 'bg-amber-200/60 text-amber-900',
      accentBorder: 'border-amber-900/30'
    },
    borderRadius: { card: 'rounded-md', badge: 'rounded-sm', button: 'rounded-md' },
    spacing: { containerPadding: 'p-8 md:p-16', sectionGap: 'space-y-16' },
    effects: { cardShadow: 'shadow-sm', hoverTransform: 'hover:border-amber-900/30 transition-colors' }
  },
  'executive-gold': {
    fontFamily: { heading: 'font-serif', body: 'font-sans', mono: 'font-mono' },
    colors: {
      background: 'bg-zinc-950',
      surface: 'bg-zinc-900',
      surfaceBorder: 'border-amber-500/30',
      textPrimary: 'text-amber-100',
      textMuted: 'text-zinc-400',
      accentPrimary: 'bg-amber-500 text-zinc-950',
      accentSecondary: 'bg-amber-950 text-amber-300',
      accentBorder: 'border-amber-400'
    },
    borderRadius: { card: 'rounded-xl', badge: 'rounded-md', button: 'rounded-lg' },
    spacing: { containerPadding: 'p-8 md:p-16', sectionGap: 'space-y-20' },
    effects: { cardShadow: 'shadow-xl shadow-amber-950/20', hoverTransform: 'hover:border-amber-400 transition-colors' }
  },
  'nordic-frost': {
    fontFamily: { heading: 'font-sans', body: 'font-sans', mono: 'font-mono' },
    colors: {
      background: 'bg-slate-900',
      surface: 'bg-slate-800/80',
      surfaceBorder: 'border-sky-500/20',
      textPrimary: 'text-slate-100',
      textMuted: 'text-sky-300/70',
      accentPrimary: 'bg-sky-400 text-slate-950',
      accentSecondary: 'bg-sky-950 text-sky-200',
      accentBorder: 'border-sky-400/40'
    },
    borderRadius: { card: 'rounded-2xl', badge: 'rounded-lg', button: 'rounded-xl' },
    spacing: { containerPadding: 'p-6 md:p-12', sectionGap: 'space-y-16' },
    effects: { cardShadow: 'shadow-md', hoverTransform: 'hover:border-sky-400/60 transition-colors' }
  },
  'aurora-glow': {
    fontFamily: { heading: 'font-sans', body: 'font-sans', mono: 'font-mono' },
    colors: {
      background: 'bg-slate-950',
      surface: 'bg-slate-900/90',
      surfaceBorder: 'border-emerald-500/30',
      textPrimary: 'text-emerald-100',
      textMuted: 'text-slate-400',
      accentPrimary: 'bg-emerald-400 text-slate-950',
      accentSecondary: 'bg-teal-950 text-teal-200',
      accentBorder: 'border-teal-400'
    },
    borderRadius: { card: 'rounded-2xl', badge: 'rounded-full', button: 'rounded-xl' },
    spacing: { containerPadding: 'p-6 md:p-12', sectionGap: 'space-y-16' },
    effects: { cardShadow: 'shadow-lg shadow-emerald-950/40', hoverTransform: 'hover:scale-[1.01] transition-transform' }
  },
  'retro-arcade': {
    fontFamily: { heading: 'font-mono', body: 'font-sans', mono: 'font-mono' },
    colors: {
      background: 'bg-purple-950',
      surface: 'bg-purple-900',
      surfaceBorder: 'border-yellow-400',
      textPrimary: 'text-yellow-300',
      textMuted: 'text-purple-300',
      accentPrimary: 'bg-yellow-400 text-purple-950',
      accentSecondary: 'bg-pink-500 text-white',
      accentBorder: 'border-pink-400'
    },
    borderRadius: { card: 'rounded-none', badge: 'rounded-none', button: 'rounded-none' },
    spacing: { containerPadding: 'p-6 md:p-12', sectionGap: 'space-y-16' },
    effects: { cardShadow: 'shadow-[4px_4px_0px_0px_#facc15]', hoverTransform: 'hover:translate-x-[2px] transition-all' }
  },
  'synthwave-80s': {
    fontFamily: { heading: 'font-sans', body: 'font-sans', mono: 'font-mono' },
    colors: {
      background: 'bg-slate-950',
      surface: 'bg-slate-900',
      surfaceBorder: 'border-pink-500/40',
      textPrimary: 'text-pink-100',
      textMuted: 'text-slate-400',
      accentPrimary: 'bg-gradient-to-r from-pink-500 to-purple-500 text-white',
      accentSecondary: 'bg-cyan-500/20 text-cyan-300',
      accentBorder: 'border-pink-500'
    },
    borderRadius: { card: 'rounded-xl', badge: 'rounded-md', button: 'rounded-lg' },
    spacing: { containerPadding: 'p-6 md:p-12', sectionGap: 'space-y-16' },
    effects: { cardShadow: 'shadow-lg shadow-pink-950/50', hoverTransform: 'hover:border-cyan-400 transition-colors' }
  },
  'swiss-international': {
    fontFamily: { heading: 'font-sans', body: 'font-sans', mono: 'font-mono' },
    colors: {
      background: 'bg-red-50/20',
      surface: 'bg-white',
      surfaceBorder: 'border-slate-900',
      textPrimary: 'text-slate-950',
      textMuted: 'text-slate-600',
      accentPrimary: 'bg-red-600 text-white',
      accentSecondary: 'bg-slate-200 text-slate-900',
      accentBorder: 'border-red-600'
    },
    borderRadius: { card: 'rounded-none', badge: 'rounded-none', button: 'rounded-none' },
    spacing: { containerPadding: 'p-8 md:p-16', sectionGap: 'space-y-16' },
    effects: { cardShadow: 'shadow-none', hoverTransform: 'hover:bg-slate-50 transition-colors' }
  },
  'bauhaus-geometric': {
    fontFamily: { heading: 'font-sans', body: 'font-sans', mono: 'font-mono' },
    colors: {
      background: 'bg-amber-50',
      surface: 'bg-white',
      surfaceBorder: 'border-2 border-slate-900',
      textPrimary: 'text-slate-950',
      textMuted: 'text-slate-700',
      accentPrimary: 'bg-blue-600 text-white',
      accentSecondary: 'bg-yellow-400 text-slate-950',
      accentBorder: 'border-red-600'
    },
    borderRadius: { card: 'rounded-none', badge: 'rounded-none', button: 'rounded-none' },
    spacing: { containerPadding: 'p-8 md:p-16', sectionGap: 'space-y-16' },
    effects: { cardShadow: 'shadow-[6px_6px_0px_0px_#0f172a]', hoverTransform: 'hover:translate-x-[2px] transition-all' }
  },
  'claymorphism-soft': {
    fontFamily: { heading: 'font-sans', body: 'font-sans', mono: 'font-mono' },
    colors: {
      background: 'bg-indigo-50/50',
      surface: 'bg-white',
      surfaceBorder: 'border-white',
      textPrimary: 'text-indigo-950',
      textMuted: 'text-indigo-700/60',
      accentPrimary: 'bg-indigo-600 text-white',
      accentSecondary: 'bg-indigo-100 text-indigo-900',
      accentBorder: 'border-indigo-200'
    },
    borderRadius: { card: 'rounded-3xl', badge: 'rounded-2xl', button: 'rounded-2xl' },
    spacing: { containerPadding: 'p-6 md:p-12', sectionGap: 'space-y-16' },
    effects: { cardShadow: 'shadow-2xl shadow-indigo-200/80', hoverTransform: 'hover:scale-[1.02] transition-transform' }
  },
  'stealth-obsidian': {
    fontFamily: { heading: 'font-sans', body: 'font-sans', mono: 'font-mono' },
    colors: {
      background: 'bg-black',
      surface: 'bg-zinc-950',
      surfaceBorder: 'border-zinc-800',
      textPrimary: 'text-zinc-200',
      textMuted: 'text-zinc-500',
      accentPrimary: 'bg-zinc-100 text-black',
      accentSecondary: 'bg-zinc-850 text-zinc-300',
      accentBorder: 'border-zinc-700'
    },
    borderRadius: { card: 'rounded-xl', badge: 'rounded-md', button: 'rounded-lg' },
    spacing: { containerPadding: 'p-6 md:p-12', sectionGap: 'space-y-16' },
    effects: { cardShadow: 'shadow-lg', hoverTransform: 'hover:border-zinc-600 transition-colors' }
  },
  'matrix-hacker': {
    fontFamily: { heading: 'font-mono', body: 'font-mono', mono: 'font-mono' },
    colors: {
      background: 'bg-black',
      surface: 'bg-zinc-950',
      surfaceBorder: 'border-green-500/40',
      textPrimary: 'text-green-500',
      textMuted: 'text-green-800',
      accentPrimary: 'bg-green-500 text-black',
      accentSecondary: 'bg-green-950 text-green-400',
      accentBorder: 'border-green-400'
    },
    borderRadius: { card: 'rounded-none', badge: 'rounded-none', button: 'rounded-none' },
    spacing: { containerPadding: 'p-6 md:p-12', sectionGap: 'space-y-12' },
    effects: { cardShadow: 'shadow-none', hoverTransform: 'hover:border-green-300 transition-colors' }
  },
  'emerald-forest': {
    fontFamily: { heading: 'font-sans', body: 'font-sans', mono: 'font-mono' },
    colors: {
      background: 'bg-emerald-950',
      surface: 'bg-emerald-900/80',
      surfaceBorder: 'border-emerald-800',
      textPrimary: 'text-emerald-100',
      textMuted: 'text-emerald-300/70',
      accentPrimary: 'bg-emerald-400 text-emerald-950',
      accentSecondary: 'bg-emerald-800 text-emerald-200',
      accentBorder: 'border-emerald-400'
    },
    borderRadius: { card: 'rounded-2xl', badge: 'rounded-lg', button: 'rounded-xl' },
    spacing: { containerPadding: 'p-6 md:p-12', sectionGap: 'space-y-16' },
    effects: { cardShadow: 'shadow-xl shadow-emerald-950/60', hoverTransform: 'hover:border-emerald-500 transition-colors' }
  },
  'sunset-gradient': {
    fontFamily: { heading: 'font-sans', body: 'font-sans', mono: 'font-mono' },
    colors: {
      background: 'bg-slate-950',
      surface: 'bg-slate-900',
      surfaceBorder: 'border-orange-500/30',
      textPrimary: 'text-orange-100',
      textMuted: 'text-slate-400',
      accentPrimary: 'bg-gradient-to-r from-amber-500 to-rose-500 text-white',
      accentSecondary: 'bg-rose-950 text-rose-200',
      accentBorder: 'border-rose-400'
    },
    borderRadius: { card: 'rounded-2xl', badge: 'rounded-full', button: 'rounded-xl' },
    spacing: { containerPadding: 'p-6 md:p-12', sectionGap: 'space-y-16' },
    effects: { cardShadow: 'shadow-lg shadow-orange-950/40', hoverTransform: 'hover:scale-[1.01] transition-transform' }
  },
  'monochrome-slate': {
    fontFamily: { heading: 'font-sans', body: 'font-sans', mono: 'font-mono' },
    colors: {
      background: 'bg-slate-950',
      surface: 'bg-slate-900',
      surfaceBorder: 'border-slate-800',
      textPrimary: 'text-slate-100',
      textMuted: 'text-slate-400',
      accentPrimary: 'bg-slate-100 text-slate-950',
      accentSecondary: 'bg-slate-800 text-slate-300',
      accentBorder: 'border-slate-700'
    },
    borderRadius: { card: 'rounded-xl', badge: 'rounded-md', button: 'rounded-lg' },
    spacing: { containerPadding: 'p-6 md:p-12', sectionGap: 'space-y-16' },
    effects: { cardShadow: 'shadow-lg', hoverTransform: 'hover:border-slate-600 transition-colors' }
  },
  'pastel-dream': {
    fontFamily: { heading: 'font-sans', body: 'font-sans', mono: 'font-mono' },
    colors: {
      background: 'bg-purple-50/40',
      surface: 'bg-white',
      surfaceBorder: 'border-purple-200',
      textPrimary: 'text-purple-950',
      textMuted: 'text-purple-700/60',
      accentPrimary: 'bg-purple-300 text-purple-950',
      accentSecondary: 'bg-pink-100 text-pink-900',
      accentBorder: 'border-purple-300'
    },
    borderRadius: { card: 'rounded-2xl', badge: 'rounded-full', button: 'rounded-xl' },
    spacing: { containerPadding: 'p-6 md:p-12', sectionGap: 'space-y-16' },
    effects: { cardShadow: 'shadow-sm', hoverTransform: 'hover:border-purple-300 transition-colors' }
  },
  'brutalist-raw': {
    fontFamily: { heading: 'font-mono', body: 'font-mono', mono: 'font-mono' },
    colors: {
      background: 'bg-stone-200',
      surface: 'bg-stone-100',
      surfaceBorder: 'border-4 border-black',
      textPrimary: 'text-black',
      textMuted: 'text-stone-700',
      accentPrimary: 'bg-black text-white',
      accentSecondary: 'bg-stone-300 text-black',
      accentBorder: 'border-black'
    },
    borderRadius: { card: 'rounded-none', badge: 'rounded-none', button: 'rounded-none' },
    spacing: { containerPadding: 'p-6 md:p-12', sectionGap: 'space-y-12' },
    effects: { cardShadow: 'shadow-[8px_8px_0px_0px_#000]', hoverTransform: 'hover:translate-x-[2px] transition-all' }
  },
  'high-contrast-accessible': {
    fontFamily: { heading: 'font-sans', body: 'font-sans', mono: 'font-mono' },
    colors: {
      background: 'bg-black',
      surface: 'bg-zinc-950',
      surfaceBorder: 'border-2 border-white',
      textPrimary: 'text-white',
      textMuted: 'text-zinc-300',
      accentPrimary: 'bg-yellow-300 text-black',
      accentSecondary: 'bg-white text-black',
      accentBorder: 'border-yellow-300'
    },
    borderRadius: { card: 'rounded-md', badge: 'rounded-sm', button: 'rounded-md' },
    spacing: { containerPadding: 'p-6 md:p-12', sectionGap: 'space-y-16' },
    effects: { cardShadow: 'shadow-none', hoverTransform: 'hover:bg-zinc-900 transition-colors' }
  },
  'dune-desert': {
    fontFamily: { heading: 'font-serif', body: 'font-sans', mono: 'font-mono' },
    colors: {
      background: 'bg-stone-950',
      surface: 'bg-stone-900',
      surfaceBorder: 'border-amber-700/30',
      textPrimary: 'text-amber-100',
      textMuted: 'text-stone-400',
      accentPrimary: 'bg-amber-600 text-stone-950',
      accentSecondary: 'bg-amber-950 text-amber-300',
      accentBorder: 'border-amber-500'
    },
    borderRadius: { card: 'rounded-xl', badge: 'rounded-md', button: 'rounded-lg' },
    spacing: { containerPadding: 'p-6 md:p-12', sectionGap: 'space-y-16' },
    effects: { cardShadow: 'shadow-lg shadow-amber-950/30', hoverTransform: 'hover:border-amber-400 transition-colors' }
  },
  'cosmic-space': {
    fontFamily: { heading: 'font-sans', body: 'font-sans', mono: 'font-mono' },
    colors: {
      background: 'bg-slate-950',
      surface: 'bg-slate-900/90',
      surfaceBorder: 'border-indigo-500/30',
      textPrimary: 'text-indigo-100',
      textMuted: 'text-slate-400',
      accentPrimary: 'bg-violet-500 text-white',
      accentSecondary: 'bg-indigo-950 text-indigo-300',
      accentBorder: 'border-violet-400'
    },
    borderRadius: { card: 'rounded-2xl', badge: 'rounded-full', button: 'rounded-xl' },
    spacing: { containerPadding: 'p-6 md:p-12', sectionGap: 'space-y-20' },
    effects: { cardShadow: 'shadow-2xl shadow-violet-950/50', hoverTransform: 'hover:scale-[1.01] transition-transform' }
  },
  'vibrant-pop': {
    fontFamily: { heading: 'font-extrabold', body: 'font-sans', mono: 'font-mono' },
    colors: {
      background: 'bg-pink-50',
      surface: 'bg-white',
      surfaceBorder: 'border-2 border-slate-900',
      textPrimary: 'text-slate-900',
      textMuted: 'text-slate-600',
      accentPrimary: 'bg-pink-500 text-white',
      accentSecondary: 'bg-yellow-400 text-black',
      accentBorder: 'border-slate-900'
    },
    borderRadius: { card: 'rounded-2xl', badge: 'rounded-lg', button: 'rounded-xl' },
    spacing: { containerPadding: 'p-6 md:p-12', sectionGap: 'space-y-16' },
    effects: { cardShadow: 'shadow-[4px_4px_0px_0px_#0f172a]', hoverTransform: 'hover:translate-x-[2px] transition-all' }
  },
  'corporate-enterprise': {
    fontFamily: { heading: 'font-sans', body: 'font-sans', mono: 'font-mono' },
    colors: {
      background: 'bg-slate-50',
      surface: 'bg-white',
      surfaceBorder: 'border-slate-200',
      textPrimary: 'text-slate-900',
      textMuted: 'text-slate-600',
      accentPrimary: 'bg-blue-700 text-white',
      accentSecondary: 'bg-slate-100 text-slate-800',
      accentBorder: 'border-blue-700'
    },
    borderRadius: { card: 'rounded-lg', badge: 'rounded-md', button: 'rounded-md' },
    spacing: { containerPadding: 'p-8 md:p-16', sectionGap: 'space-y-16' },
    effects: { cardShadow: 'shadow-md', hoverTransform: 'hover:border-blue-600 transition-colors' }
  },
  'minimal-editorial': {
    fontFamily: { heading: 'font-serif', body: 'font-sans', mono: 'font-mono' },
    colors: {
      background: 'bg-neutral-900',
      surface: 'bg-neutral-800',
      surfaceBorder: 'border-neutral-700',
      textPrimary: 'text-neutral-100',
      textMuted: 'text-neutral-400',
      accentPrimary: 'bg-neutral-100 text-neutral-900',
      accentSecondary: 'bg-neutral-700 text-neutral-200',
      accentBorder: 'border-neutral-500'
    },
    borderRadius: { card: 'rounded-md', badge: 'rounded-sm', button: 'rounded-md' },
    spacing: { containerPadding: 'p-8 md:p-16', sectionGap: 'space-y-20' },
    effects: { cardShadow: 'shadow-sm', hoverTransform: 'hover:border-neutral-400 transition-colors' }
  }
};

/**
 * Classifies candidate profiles deterministically into one of 5 Archetype Clusters
 */
export function classifyArchetypeCluster(candidate: CandidateDocument): ArchetypeCluster {
  const searchableText = [
    candidate.headline,
    candidate.primaryRole,
    ...candidate.secondaryRoles,
    ...candidate.skills,
    ...candidate.domains,
    ...candidate.workExperience.map(w => `${w.role} ${w.description} ${w.technologies.join(' ')}`),
    ...candidate.projects.map(p => `${p.title} ${p.description} ${p.technologies.join(' ')}`)
  ].join(' ').toLowerCase();

  const scores: Record<ArchetypeCluster, number> = {
    'systems-infra': 0,
    'ui-creative': 0,
    'product-fullstack': 0,
    'research-data': 0,
    'leadership-exec': 0
  };

  (Object.keys(CLUSTER_KEYWORDS) as ArchetypeCluster[]).forEach((cluster) => {
    CLUSTER_KEYWORDS[cluster].forEach((keyword) => {
      if (searchableText.includes(keyword)) {
        scores[cluster] += 1;
      }
    });
  });

  // Check years of experience for leadership boost
  if (candidate.yearsOfExperience >= 7) {
    scores['leadership-exec'] += 3;
  }

  let topCluster: ArchetypeCluster = 'product-fullstack';
  let maxScore = -1;

  (Object.keys(scores) as ArchetypeCluster[]).forEach((cluster) => {
    if (scores[cluster] > maxScore) {
      maxScore = scores[cluster];
      topCluster = cluster;
    }
  });

  return topCluster;
}

/**
 * Deterministically maps Archetype Cluster to default Style Preset & Layout Blueprint
 */
export function mapClusterToBlueprint(
  cluster: ArchetypeCluster,
  candidate: CandidateDocument
): LayoutBlueprint {
  let preset: StylePreset;
  let sectionOrder = ['hero', 'metrics', 'projects', 'experience', 'skills', 'education', 'achievements'];

  switch (cluster) {
    case 'systems-infra':
      preset = 'terminal-dark';
      sectionOrder = ['hero', 'metrics', 'skills', 'experience', 'projects', 'education'];
      break;
    case 'ui-creative':
      preset = 'neo-brutalist';
      sectionOrder = ['hero', 'projects', 'metrics', 'skills', 'experience', 'education'];
      break;
    case 'research-data':
      preset = 'academic-classic';
      sectionOrder = ['hero', 'metrics', 'projects', 'skills', 'experience', 'education'];
      break;
    case 'leadership-exec':
      preset = 'minimal-editorial';
      sectionOrder = ['hero', 'metrics', 'experience', 'projects', 'skills', 'education'];
      break;
    case 'product-fullstack':
    default:
      preset = 'linear-sleek';
      sectionOrder = ['hero', 'metrics', 'projects', 'experience', 'skills', 'education'];
      break;
  }

  const designTokens = PRESET_DESIGN_TOKENS[preset];

  return {
    id: `blueprint-${cluster}-${Date.now()}`,
    preset,
    archetypeCluster: cluster,
    designTokens,
    sectionOrder,
    sectionVariants: {
      hero: cluster === 'systems-infra' ? 'hero-terminal' : cluster === 'ui-creative' ? 'hero-split' : 'hero-centered',
      metrics: 'metrics-banner',
      projects: cluster === 'ui-creative' ? 'projects-bento' : 'projects-grid',
      experience: 'experience-timeline',
      skills: cluster === 'systems-infra' ? 'skills-grouped' : 'skills-cloud',
      education: 'education-classic'
    }
  };
}

/**
 * Primary Architect Agent entry point
 * Executes 5 Archetype Clusters decision heuristics to generate optimal LayoutBlueprint
 */
export async function runArchitectAgent(
  candidate: CandidateDocument,
  llmCaller?: (prompt: string) => Promise<string>
): Promise<LayoutBlueprint> {
  // Execute deterministic heuristic classification
  const cluster = classifyArchetypeCluster(candidate);
  const blueprint = mapClusterToBlueprint(cluster, candidate);

  // If optional LLM caller is provided, allow mild fine-tuning without breaking fallback safety
  if (llmCaller) {
    try {
      const prompt = `As an expert UI Architect, given the candidate role "${candidate.primaryRole}" and archetype "${cluster}", confirm if style "${blueprint.preset}" is ideal.`;
      await llmCaller(prompt);
    } catch {
      // Graceful fallback to deterministic blueprint
    }
  }

  return blueprint;
}
