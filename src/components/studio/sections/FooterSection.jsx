import React from 'react';
import { Github, Linkedin, Twitter, Terminal, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function FooterSection({
  block,
  index,
  schema,
  selectedElement,
  hoveredElementKey,
  setHoveredElementKey,
  onSelectElement,
  onUpdateElementStyle,
  onPolishWithAI,
  handleOpenEditModal,
  EditableCanvasItem,
  archetype = "bento-minimal",
  theme,
  viewMode = 'desktop'
}) {
  const name = schema?.hero?.name || schema?.metadata?.title || "Kshitij Pilankar";
  const contact = schema?.contact || {};
  const blockId = block?.id || "footer-block";
  const isMobile = viewMode === 'mobile';

  const renderItem = (key, label, children, className = "") => {
    if (EditableCanvasItem) {
      return (
        <EditableCanvasItem
          elementKey={key}
          label={label}
          schema={schema}
          selectedElement={selectedElement}
          hoveredElementKey={hoveredElementKey}
          setHoveredElementKey={setHoveredElementKey}
          onSelectElement={onSelectElement}
          onUpdateElementStyle={onUpdateElementStyle}
          onPolishWithAI={onPolishWithAI}
          onOpenEditModal={handleOpenEditModal}
          blockId={blockId}
          blockIndex={index || 5}
          className={className}
        >
          {children}
        </EditableCanvasItem>
      );
    }
    return children;
  };

  return (
    <footer className="w-full border-t border-slate-200 bg-white dark:bg-[#050B14] dark:border-cyan-950/60 py-6 sm:py-10 px-4 sm:px-8 select-none font-mono overflow-x-hidden">
      <div className={`max-w-6xl mx-auto flex flex-col ${isMobile ? 'items-center text-center gap-4' : 'md:flex-row items-center justify-between gap-4 sm:gap-6 text-center md:text-left'}`}>
        
        {/* Brand & Copyright */}
        <div className={`flex flex-col gap-1 ${isMobile ? 'text-center items-center' : 'text-center md:text-left'}`}>
          {renderItem('footer-brand', 'Footer Brand Title', (
            <span className="text-slate-900 dark:text-cyan-400 font-mono text-xs sm:text-sm font-bold tracking-wider truncate">
              {name} — Portfolio
            </span>
          ))}

          {renderItem('footer-copyright', 'Footer Copyright', (
            <p className="text-[10px] sm:text-xs text-slate-500 dark:text-neutral-400 font-mono font-medium">
              © {new Date().getFullYear()} All rights reserved. Built with StackFolio Engine.
            </p>
          ))}
        </div>

        {/* Social Links */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5">
          {renderItem('footer-github', 'GitHub Link', (
            <a href={contact.github || "https://github.com"} target="_blank" rel="noreferrer" className="text-xs font-mono font-bold text-slate-700 dark:text-neutral-300 hover:text-cyan-500 flex items-center gap-1.5">
              <Github className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </a>
          ))}

          {renderItem('footer-linkedin', 'LinkedIn Link', (
            <a href={contact.linkedin || "https://linkedin.com"} target="_blank" rel="noreferrer" className="text-xs font-mono font-bold text-slate-700 dark:text-neutral-300 hover:text-cyan-500 flex items-center gap-1.5">
              <Linkedin className="w-3.5 h-3.5" />
              <span>LinkedIn</span>
            </a>
          ))}

          {renderItem('footer-twitter', 'Twitter / X Link', (
            <a href={contact.twitter || "https://x.com"} target="_blank" rel="noreferrer" className="text-xs font-mono font-bold text-slate-700 dark:text-neutral-300 hover:text-cyan-500 flex items-center gap-1.5">
              <Twitter className="w-3.5 h-3.5" />
              <span>X (Twitter)</span>
            </a>
          ))}
        </div>

        {/* Sentinel Security & PII Verified Badge */}
        {renderItem('footer-security-badge', 'Sentinel Security Badge', (
          <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-mono font-extrabold text-emerald-800 bg-emerald-100 border border-emerald-400 dark:text-emerald-300 dark:bg-emerald-950/60 dark:border-emerald-500/40 px-3 py-1 sm:py-1.5 rounded-full shadow-sm shrink-0">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Security & PII Verified</span>
          </div>
        ))}

      </div>
    </footer>
  );
}
