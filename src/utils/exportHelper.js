import { generateProductionNextjsCode } from '../core/exporter';

export function getExportableCode(data) {
  if (!data) return '';

  let candidate = {
    fullName: data.fullName || data.full_name || 'Christopher Amos',
    primaryRole: data.primaryRole || data.role || 'Software Engineer & Systems Architect',
    headline: data.headline || 'Building scalable cloud architecture and intuitive web experiences.',
    bio: data.bio || '',
    email: data.email || 'christopher.amos@dev.io',
    github: data.github || data.github_url || 'https://github.com/christopher-amos',
    linkedin: data.linkedin || data.linkedin_url || 'https://linkedin.com/in/christopher-amos',
    skills: [],
    workExperience: [],
    projects: []
  };

  // If data comes from Studio Editor schema with blocks:
  if (data.blocks && Array.isArray(data.blocks)) {
    const hero = data.blocks.find(b => b.type === 'HeroBlock');
    if (hero?.content) {
      if (hero.content.name) candidate.fullName = hero.content.name;
      if (hero.content.role) candidate.primaryRole = hero.content.role;
      if (hero.content.headline) candidate.headline = hero.content.headline;
      if (hero.content.bio) candidate.bio = hero.content.bio;
      if (hero.content.email) candidate.email = hero.content.email;
      if (hero.content.github) candidate.github = hero.content.github;
    }
    const projectsBlock = data.blocks.find(b => b.type === 'ProjectGridBlock');
    if (projectsBlock?.content?.items) {
      candidate.projects = projectsBlock.content.items.map(p => ({
        title: p.title || '',
        description: p.description || '',
        githubUrl: p.link || p.github_url || '',
        liveUrl: p.link || p.live_url || '',
        technologies: p.tags || []
      }));
    }
    const skillsBlock = data.blocks.find(b => b.type === 'SkillsBlock' || b.type === 'PillarsBlock');
    if (skillsBlock?.content?.categories) {
      candidate.skills = skillsBlock.content.categories.flatMap(c => c.skills || []);
    }
    const expBlock = data.blocks.find(b => b.type === 'WorkExperienceBlock' || b.type === 'ExperienceBlock');
    if (expBlock?.content?.items) {
      candidate.workExperience = expBlock.content.items.map(e => ({
        company: e.company || '',
        role: e.role || '',
        startDate: e.startDate || e.start_date || '',
        endDate: e.endDate || e.end_date || 'Present',
        description: e.description || ''
      }));
    }
  } else {
    // Standard portfolio object structure
    if (Array.isArray(data.skills)) {
      candidate.skills = data.skills.map(s => typeof s === 'string' ? s : (s.name || s.title || ''));
    }
    if (Array.isArray(data.experiences || data.workExperience)) {
      const exps = data.experiences || data.workExperience;
      candidate.workExperience = exps.map(exp => ({
        company: exp.company || exp.company_name || '',
        role: exp.role || exp.job_title || '',
        startDate: exp.startDate || exp.start_date || '',
        endDate: exp.endDate || exp.end_date || 'Present',
        description: exp.description || ''
      }));
    }
    if (Array.isArray(data.projects)) {
      candidate.projects = data.projects.map(p => ({
        title: p.title || '',
        description: p.description || '',
        githubUrl: p.github_url || p.githubUrl || '',
        liveUrl: p.live_url || p.liveUrl || '',
        technologies: p.technologies || p.tags || []
      }));
    }
  }

  // Ensure default skills if empty
  if (!candidate.skills || candidate.skills.length === 0) {
    candidate.skills = ['React 18', 'TypeScript', 'Tailwind CSS', 'Next.js 14', 'Node.js', 'PostgreSQL'];
  }

  // Ensure default work experience if empty
  if (!candidate.workExperience || candidate.workExperience.length === 0) {
    candidate.workExperience = [
      {
        company: 'CloudPulse Systems',
        role: 'Senior Staff Engineer',
        startDate: '2022',
        endDate: 'Present',
        description: 'Engineered cloud infrastructure microservices handling 50k requests/sec with 99.99% uptime.'
      }
    ];
  }

  // Determine active archetype / preset & derive dynamic theme tokens
  const rawArchetype = data.archetype || data.selected_template || data.preset || data.theme?.template || 'bento-minimal';
  const normArchetype = String(rawArchetype).toLowerCase();

  let tokens = {
    fontFamily: { heading: 'font-sans', body: 'font-sans', mono: 'font-mono' },
    colors: {
      background: 'bg-slate-50',
      surface: 'bg-white border-slate-200 shadow-sm',
      surfaceBorder: 'border-slate-200',
      textPrimary: 'text-slate-900',
      textMuted: 'text-slate-600',
      accentPrimary: 'bg-slate-900 text-white hover:bg-slate-800',
      accentSecondary: 'bg-amber-100 text-amber-900',
      accentBorder: 'border-amber-300'
    },
    borderRadius: { card: 'rounded-2xl', badge: 'rounded-lg', button: 'rounded-xl' },
    spacing: { containerPadding: 'p-6 md:p-12', sectionGap: 'space-y-16' },
    effects: { cardShadow: 'shadow-md', hoverTransform: 'hover:-translate-y-1 transition-transform' }
  };

  if (normArchetype.includes('cyber') || normArchetype.includes('terminal') || normArchetype.includes('dark')) {
    tokens.colors = {
      background: 'bg-slate-950',
      surface: 'bg-slate-900',
      surfaceBorder: 'border-cyan-500/30',
      textPrimary: 'text-slate-100',
      textMuted: 'text-slate-400',
      accentPrimary: 'bg-cyan-400 text-slate-950 font-bold',
      accentSecondary: 'bg-cyan-950 text-cyan-400',
      accentBorder: 'border-cyan-500/30'
    };
    tokens.borderRadius = { card: 'rounded-xl', badge: 'rounded-md', button: 'rounded-lg' };
  } else if (normArchetype.includes('brutalist')) {
    tokens.colors = {
      background: 'bg-[#FFFDF8]',
      surface: 'bg-white',
      surfaceBorder: 'border-2 border-black',
      textPrimary: 'text-black',
      textMuted: 'text-slate-700',
      accentPrimary: 'bg-[#FFE600] text-black font-black',
      accentSecondary: 'bg-pink-300 text-black',
      accentBorder: 'border-2 border-black'
    };
    tokens.borderRadius = { card: 'rounded-xl', badge: 'rounded-md', button: 'rounded-lg' };
    tokens.effects = { cardShadow: 'shadow-[4px_4px_0px_#000]', hoverTransform: 'hover:translate-x-[1px] hover:translate-y-[1px] transition-transform' };
  } else if (normArchetype.includes('editorial') || normArchetype.includes('warm')) {
    tokens.colors = {
      background: 'bg-[#FDFBF7]',
      surface: 'bg-white',
      surfaceBorder: 'border-amber-200/60',
      textPrimary: 'text-stone-900',
      textMuted: 'text-stone-600',
      accentPrimary: 'bg-[#C2410C] text-white font-bold',
      accentSecondary: 'bg-orange-100 text-orange-900',
      accentBorder: 'border-orange-200'
    };
  }

  const blueprint = {
    id: 'blueprint-export',
    preset: rawArchetype,
    archetypeCluster: rawArchetype,
    designTokens: tokens,
    sectionOrder: ['hero', 'experience', 'projects', 'skills'],
    sectionVariants: { hero: 'hero-split' }
  };

  return generateProductionNextjsCode(candidate, blueprint);
}
