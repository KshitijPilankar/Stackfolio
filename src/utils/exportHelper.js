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

  const blueprint = {
    id: 'blueprint-export',
    preset: data.preset || data.selected_template || 'linear-sleek',
    archetypeCluster: data.archetype || 'product-fullstack',
    designTokens: {
      fontFamily: { heading: 'font-sans', body: 'font-sans', mono: 'font-mono' },
      colors: {
        background: 'bg-slate-950',
        surface: 'bg-slate-900',
        surfaceBorder: 'border-slate-800',
        textPrimary: 'text-slate-100',
        textMuted: 'text-slate-400',
        accentPrimary: 'bg-amber-400 text-slate-950',
        accentSecondary: 'bg-amber-400/10 text-amber-400',
        accentBorder: 'border-amber-400/30'
      },
      borderRadius: { card: 'rounded-xl', badge: 'rounded-md', button: 'rounded-lg' },
      spacing: { containerPadding: 'p-6 md:p-12', sectionGap: 'space-y-16' },
      effects: { cardShadow: 'shadow-lg', hoverTransform: 'hover:-translate-y-1 transition-transform' }
    },
    sectionOrder: ['hero', 'experience', 'projects', 'skills'],
    sectionVariants: { hero: 'hero-split' }
  };

  return generateProductionNextjsCode(candidate, blueprint);
}
