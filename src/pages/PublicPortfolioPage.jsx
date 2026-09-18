import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import TemplateRenderer from '../components/templates/TemplateRenderer';
import { Loader2, ArrowLeft } from 'lucide-react';

const getActiveTemplateForDemo = () => {
  try {
    for (const key of ['stackfolio_studio_draft', 'stackfolio_portfolio_schema', 'stackfolio_active_draft']) {
      const s = localStorage.getItem(key);
      if (s) {
        const p = JSON.parse(s);
        const a = p.archetype || p.selected_template || p.theme?.template;
        if (a) {
          if (a === 'bento-minimal' || a === 'bento_minimal' || a === 'bento-modern') return 'bento_grid';
          if (a === 'cyber-terminal' || a === 'cyber_terminal') return 'dark_terminal';
          if (a === 'neo-brutalist' || a === 'neo_brutalist') return 'neo_brutalist';
          if (a === 'warm-editorial' || a === 'warm_editorial') return 'minimal_editorial';
          return a;
        }
      }
    }
  } catch (e) {}
  return 'bento_grid';
};

const demoChristopherAmosProfile = {
  id: "demo-christopher-amos",
  full_name: "Christopher Amos",
  headline: "Senior Software & Cloud Systems Engineer",
  bio: "Passionate Systems Architect with 6+ years experience engineering resilient microservices, high-traffic frontend dashboards, and automated CI/CD infrastructure.",
  profile_image_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
  location: "San Francisco, CA",
  email: "christopher.amos@dev.io",
  github_url: "https://github.com/christopher-amos",
  linkedin_url: "https://linkedin.com/in/christopher-amos",
  selected_template: "bento_grid",
  archetype: "bento-minimal",
  is_published: true,
  public_slug: "christopher-amos",
  experiences: [
    {
      id: "exp-1",
      company: "CloudPulse Systems",
      role: "Senior Staff Systems Engineer",
      start_date: "2022",
      end_date: "Present",
      description: "Spearheaded migration of legacy monolith to Kubernetes microservices, achieving a 45% reduction in cloud server costs and 99.99% uptime.",
      display_order: 1
    },
    {
      id: "exp-2",
      company: "TechNexus Solutions",
      role: "Lead Fullstack Architect",
      start_date: "2020",
      end_date: "2022",
      description: "Engineered real-time WebSocket dashboard using React and Node.js, reducing payload latency from 1.2s to 180ms by implementing binary protocol streaming.",
      display_order: 2
    }
  ],
  education: [
    {
      id: "edu-1",
      institution: "UC Berkeley",
      degree: "B.S. Computer Science",
      field: "Systems Architecture",
      start_year: "2016",
      end_year: "2020",
      description: "High Distinction, Focus on Distributed Systems & Network Protocols.",
      display_order: 1
    }
  ],
  projects: [
    {
      id: "proj-1",
      title: "CloudPulse SRE Monitor",
      description: "Open-source distributed tracing engine with 2.4k GitHub stars.",
      technologies: ["React", "TypeScript", "Node.js", "Kubernetes"],
      github_url: "https://github.com/christopher-amos/cloudpulse",
      live_url: "https://cloudpulse.dev",
      display_order: 1
    },
    {
      id: "proj-2",
      title: "HyperGraph DB Engine",
      description: "High-performance embedded key-value storage engine written in Rust.",
      technologies: ["Rust", "Wasm", "React", "Tailwind CSS"],
      github_url: "https://github.com/christopher-amos/hypergraph",
      live_url: "https://hypergraph.dev",
      display_order: 2
    }
  ],
  skills: [
    { id: "s-1", name: "React 18", category: "Technical", display_order: 1 },
    { id: "s-2", name: "TypeScript", category: "Technical", display_order: 2 },
    { id: "s-3", name: "Tailwind CSS", category: "Technical", display_order: 3 },
    { id: "s-4", name: "Next.js 14", category: "Technical", display_order: 4 },
    { id: "s-5", name: "Kubernetes & Docker", category: "Technical", display_order: 6 }
  ],
  achievements: [
    {
      id: "ach-1",
      title: "Open Source Contributor of the Year",
      issuer: "CNCF",
      date: "2024",
      description: "Recognized for top performance contributions to cloud observability tools.",
      display_order: 1
    }
  ]
};

function loadDraftFromStorage(public_slug) {
  const keys = ['stackfolio_studio_draft', 'stackfolio_portfolio_schema', 'stackfolio_active_draft'];
  for (const key of keys) {
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed) {
          const rawArchetype = parsed.archetype || parsed.selected_template || parsed.theme?.template || parsed.metadata?.archetype || 'bento-minimal';
          let templateKey = rawArchetype;

          if (templateKey === 'bento-minimal' || templateKey === 'bento_minimal' || templateKey === 'bento-modern' || templateKey === 'bento') {
            templateKey = 'bento_grid';
          } else if (templateKey === 'cyber-terminal' || templateKey === 'cyber_terminal' || templateKey === 'cyber-ai') {
            templateKey = 'dark_terminal';
          } else if (templateKey === 'neo-brutalist' || templateKey === 'neo_brutalist') {
            templateKey = 'neo_brutalist';
          } else if (templateKey === 'warm-editorial' || templateKey === 'warm_editorial' || templateKey === 'humanist-light') {
            templateKey = 'minimal_editorial';
          }

          // If schema object format (from studio with blocks), convert to portfolio component format:
          if (parsed.blocks && Array.isArray(parsed.blocks)) {
            const heroBlock = parsed.blocks.find(b => b.type === 'HeroBlock');
            const workBlock = parsed.blocks.find(b => b.type === 'ProjectGridBlock');
            const expBlock = parsed.blocks.find(b => b.type === 'WorkExperienceBlock' || b.type === 'ExperienceBlock');
            const skillBlock = parsed.blocks.find(b => b.type === 'SkillsBlock' || b.type === 'PillarsBlock');

            return {
              id: parsed.id || 'studio-draft-local',
              full_name: heroBlock?.content?.name || parsed.fullName || 'Christopher Amos',
              headline: heroBlock?.content?.headline || parsed.headline || 'Senior Software & Cloud Systems Engineer',
              bio: heroBlock?.content?.bio || parsed.bio || 'Passionate Systems Architect building scalable web engines.',
              email: heroBlock?.content?.email || parsed.email || 'christopher.amos@dev.io',
              github_url: heroBlock?.content?.github || parsed.github_url || 'https://github.com/christopher-amos',
              linkedin_url: parsed.linkedin_url || 'https://linkedin.com/in/christopher-amos',
              selected_template: templateKey,
              archetype: rawArchetype,
              is_published: true,
              public_slug: public_slug,
              experiences: expBlock?.content?.items?.map((e, i) => ({
                id: `exp-${i}`,
                company: e.company || '',
                role: e.role || '',
                start_date: e.startDate || e.start_date || '',
                end_date: e.endDate || e.end_date || 'Present',
                description: e.description || '',
                display_order: i + 1
              })) || demoChristopherAmosProfile.experiences,
              projects: workBlock?.content?.items?.map((p, i) => ({
                id: `proj-${i}`,
                title: p.title || '',
                description: p.description || '',
                technologies: p.tags || p.technologies || ['React', 'TypeScript'],
                github_url: p.link || p.github_url || 'https://github.com',
                live_url: p.link || p.live_url || 'https://example.com',
                display_order: i + 1
              })) || demoChristopherAmosProfile.projects,
              skills: skillBlock?.content?.categories?.flatMap((c, ci) => (c.skills || []).map((s, si) => ({
                id: `s-${ci}-${si}`,
                name: s,
                category: c.category || 'Technical',
                display_order: ci * 10 + si
              }))) || demoChristopherAmosProfile.skills,
              education: demoChristopherAmosProfile.education,
              achievements: demoChristopherAmosProfile.achievements
            };
          }

          return {
            ...parsed,
            selected_template: templateKey,
            archetype: rawArchetype
          };
        }
      }
    } catch (e) {}
  }
  return null;
}

export default function PublicPortfolioPage() {
  const { public_slug } = useParams();
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPublicPortfolio = async () => {
      setLoading(true);
      setError(null);
      try {
        // 1. Check local draft storage across all studio keys
        const localDraft = loadDraftFromStorage(public_slug);
        if (localDraft) {
          setPortfolio(localDraft);
          setLoading(false);
          return;
        }

        // 2. Fetch from Supabase database
        const { data, error: fetchError } = await supabase
          .from('profiles')
          .select(`
            id,
            full_name,
            headline,
            bio,
            profile_image_url,
            location,
            email,
            github_url,
            linkedin_url,
            selected_template,
            is_published,
            public_slug,
            experiences (*),
            education (*),
            projects (*),
            skills (*),
            achievements (*)
          `)
          .eq('public_slug', public_slug)
          .eq('is_published', true)
          .maybeSingle();

        if (fetchError) console.warn('Supabase public fetch notice:', fetchError.message);

        if (data) {
          const sortByDisplayOrder = (arr) => {
            return [...(arr || [])].sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
          };

          const activeTpl = data.selected_template || getActiveTemplateForDemo();

          setPortfolio({
            ...data,
            selected_template: activeTpl,
            experiences: sortByDisplayOrder(data.experiences),
            education: sortByDisplayOrder(data.education),
            projects: sortByDisplayOrder(data.projects),
            skills: sortByDisplayOrder(data.skills),
            achievements: sortByDisplayOrder(data.achievements)
          });
        } else if (public_slug === 'christopher-amos' || public_slug === 'preview' || public_slug === 'aarya-shah-r4x9') {
          // Direct local fallback for christopher-amos & demo slugs
          const fallbackProfile = {
            ...demoChristopherAmosProfile,
            selected_template: getActiveTemplateForDemo()
          };
          setPortfolio(fallbackProfile);
        } else {
          setPortfolio(null);
        }
      } catch (err) {
        console.error('Error fetching public portfolio:', err);
        if (public_slug === 'christopher-amos' || public_slug === 'preview') {
          setPortfolio({
            ...demoChristopherAmosProfile,
            selected_template: getActiveTemplateForDemo()
          });
        } else {
          setError(err.message || 'Failed to load portfolio.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (public_slug) {
      fetchPublicPortfolio();
    }
  }, [public_slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-grid-pattern flex flex-col items-center justify-center text-slate-800">
        <Loader2 className="w-10 h-10 animate-spin text-black mb-4" />
        <p className="text-sm font-mono font-bold">Retrieving portfolio details...</p>
      </div>
    );
  }

  if (error || !portfolio) {
    return (
      <div className="min-h-screen bg-grid-pattern text-[#0F172A] font-sans flex flex-col items-center justify-center p-6 border-t-8 border-black">
        <div className="max-w-md w-full bg-white border-3 border-black p-8 rounded-2xl shadow-brutal text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-[#FF70A6] border-2 border-black flex items-center justify-center text-black font-black text-xl mx-auto shadow-[2px_2px_0px_0px_#000]">
            !
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-heading font-black tracking-tight text-[#0F172A]">Portfolio Private</h1>
            <p className="text-sm font-medium text-slate-600">
              This portfolio is currently private or does not exist. Check with the owner or ensure the link is typed correctly.
            </p>
          </div>
          <Link
            to="/"
            className="inline-flex items-center space-x-2 bg-[#FFE600] text-black font-extrabold px-6 py-3 border-2 border-black rounded-lg shadow-[4px_4px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[3px_3px_0px_0px_#000] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go to Home Page</span>
          </Link>
        </div>
      </div>
    );
  }

  // Render clean dynamic portfolio template matching exact active archetype
  return <TemplateRenderer portfolio={portfolio} />;
}
