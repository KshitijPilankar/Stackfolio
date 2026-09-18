import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { initialPortfolioSchema } from '../types/schema';
import { Sparkles, Download, ExternalLink } from 'lucide-react';
import SiteHeaderNavbar from '../components/studio/sections/SiteHeaderNavbar';
import HeroSection from '../components/studio/sections/HeroSection';
import WorksGridSection from '../components/studio/sections/WorksGridSection';
import PillarsSection from '../components/studio/sections/PillarsSection';
import StorySection from '../components/studio/sections/StorySection';
import ContactSection from '../components/studio/sections/ContactSection';
import FooterSection from '../components/studio/sections/FooterSection';
import ExportModal from '../components/studio/ExportModal';

const loadSchemaFromStorage = () => {
  try {
    const savedStudio = localStorage.getItem('stackfolio_studio_draft');
    if (savedStudio) {
      return JSON.parse(savedStudio);
    }
    const savedPortfolio = localStorage.getItem('stackfolio_portfolio_schema') || localStorage.getItem('stackfolio_active_draft');
    if (savedPortfolio) {
      return JSON.parse(savedPortfolio);
    }
  } catch (e) {
    console.error("Error reading live preview schema:", e);
  }
  return initialPortfolioSchema;
};

export default function LivePortfolioPreview() {
  const [schema, setSchema] = useState(() => loadSchemaFromStorage());
  const [isExportOpen, setIsExportOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'stackfolio_studio_draft' || e.key === 'stackfolio_portfolio_schema') {
        setSchema(loadSchemaFromStorage());
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  if (!schema) return null;

  const customDomain = schema?.metadata?.customDomain;
  const slug = schema?.metadata?.slug || 'christopher-amos';

  // Render dummy wrapper component for read-only preview mode
  const DummyEditableCanvasItem = ({ children }) => <>{children}</>;

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100 relative">
      
      {/* Persistent Site Header Navbar */}
      <SiteHeaderNavbar
        title={schema?.metadata?.title || "Kshitij Pilankar"}
        archetype={schema?.archetype}
        scrollToProjects={() => {
          const el = document.getElementById('projects-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        scrollToContact={() => {
          const el = document.getElementById('contact-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Polymorphic Section Stream */}
      {schema.blocks && schema.blocks.length > 0 ? (
        schema.blocks.map((block, index) => {
          return (
            <div key={block.id} className="w-full border-b last:border-b-0 border-slate-100">
              
              {block.type === 'HeroBlock' && (
                <HeroSection
                  block={block}
                  index={index}
                  schema={schema}
                  handleInlineChange={() => {}}
                  EditableCanvasItem={DummyEditableCanvasItem}
                />
              )}

              {block.type === 'ProjectGridBlock' && (
                <WorksGridSection
                  block={block}
                  index={index}
                  schema={schema}
                  handleInlineChange={() => {}}
                  EditableCanvasItem={DummyEditableCanvasItem}
                />
              )}

              {(block.type === 'PillarsBlock' || block.type === 'SkillsBlock') && (
                <PillarsSection
                  block={block}
                  index={index}
                  schema={schema}
                  handleInlineChange={() => {}}
                  EditableCanvasItem={DummyEditableCanvasItem}
                />
              )}

              {block.type === 'StoryBlock' && (
                <StorySection
                  block={block}
                  index={index}
                  schema={schema}
                  handleInlineChange={() => {}}
                  EditableCanvasItem={DummyEditableCanvasItem}
                />
              )}

              {block.type === 'ContactBlock' && (
                <ContactSection
                  block={block}
                  index={index}
                  schema={schema}
                  handleInlineChange={() => {}}
                  EditableCanvasItem={DummyEditableCanvasItem}
                />
              )}

              {block.type === 'FooterBlock' && (
                <FooterSection archetype={schema?.archetype} theme={schema?.theme} />
              )}

            </div>
          );
        })
      ) : null}

      {/* Floating Bottom-Right StackFolio Live Site Badge */}
      <div className="fixed bottom-5 right-5 z-50 bg-white/95 border-2 border-black shadow-[4px_4px_0px_#000] rounded-2xl px-4 py-2 flex items-center gap-3 text-xs font-sans text-slate-800 backdrop-blur-md animate-in fade-in duration-300">
        <div className="flex items-center gap-2 font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <Link to={`/p/${slug}`} className="text-slate-900 font-mono text-[11px] hover:underline flex items-center gap-1">
            <span>/p/{slug}</span>
            <ExternalLink className="w-3 h-3 text-slate-500" />
          </Link>
        </div>

        <div className="w-px h-4 bg-slate-300" />

        <button
          type="button"
          onClick={() => setIsExportOpen(true)}
          className="bg-[#FFE600] hover:bg-[#ebd300] text-black font-extrabold text-xs px-3.5 py-1.5 rounded-xl border border-black shadow-[2px_2px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer flex items-center gap-1.5"
        >
          <Download className="w-3.5 h-3.5 text-black" />
          <span>Export Code</span>
        </button>

        <button
          type="button"
          onClick={() => navigate('/studio')}
          className="bg-[#0053ff] hover:bg-[#0043cc] text-white font-bold text-xs px-3.5 py-1.5 rounded-xl shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <span>Edit Site</span>
          <Sparkles className="w-3 h-3 text-white" />
        </button>
      </div>

      {/* Export Code Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        schema={schema}
      />

    </div>
  );
}
