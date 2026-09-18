import { CandidateDocument } from '../schemas/resume.schema';
import { LayoutBlueprint } from '../schemas/layout.schema';

/**
 * Generates standalone, production-ready Next.js 14 / React component code 
 * featuring Tailwind CSS styling and Emil Kowalski motion curve integration.
 */
export function generateProductionNextjsCode(
  candidate: CandidateDocument,
  blueprint: LayoutBlueprint
): string {
  const name = candidate.fullName || 'Candidate';
  const role = candidate.primaryRole || 'Software Engineer';
  const headline = candidate.headline || '';
  const bio = candidate.bio || '';
  const email = candidate.email || '';
  const github = candidate.github || '';
  const linkedin = candidate.linkedin || '';
  const skills = candidate.skills || [];
  const experiences = candidate.workExperience || [];
  const projects = candidate.projects || [];
  const archetype = blueprint.archetypeCluster || 'product-fullstack';
  const preset = blueprint.preset || 'linear-sleek';
  const tokens = blueprint.designTokens;

  return `// StackFolio Production Export - Next.js 14 / Tailwind Component
// Archetype Cluster: ${archetype}
// Style Preset: ${preset}
// Generated at: ${new Date().toISOString()}

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, ExternalLink, Sparkles, CheckCircle, ShieldCheck } from 'lucide-react';

// Emil Kowalski spring motion curve presets
const SPRING_SMOOTH = { type: 'spring', stiffness: 250, damping: 30, mass: 1 };
const SPRING_SNAPPY = { type: 'spring', stiffness: 400, damping: 25, mass: 0.8 };

const FADE_UP = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: SPRING_SMOOTH
};

export default function PortfolioPage() {
  const [contactSent, setContactSent] = useState(false);

  return (
    <div className="${tokens.colors.background} min-h-screen ${tokens.colors.textPrimary} ${tokens.fontFamily.body} antialiased selection:bg-amber-400 selection:text-black">
      <div className="max-w-6xl mx-auto ${tokens.spacing.containerPadding} ${tokens.spacing.sectionGap}">
        
        {/* HERO SECTION */}
        <motion.header {...FADE_UP} className="space-y-6 pt-12 min-w-0 flex-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 ${tokens.colors.accentSecondary} border ${tokens.colors.accentBorder} text-xs font-mono font-bold ${tokens.borderRadius.badge}">
            <Sparkles className="w-3.5 h-3.5" />
            <span>${role}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl ${tokens.fontFamily.heading} font-black tracking-tight leading-tight break-words overflow-visible whitespace-normal [word-break:keep-all] sm:[word-break:normal] ${tokens.colors.textPrimary}">
            ${name}
          </h1>

          <p className="text-lg sm:text-xl font-medium ${tokens.colors.textMuted} max-w-2xl leading-relaxed">
            ${headline}
          </p>

          ${bio ? `<p className="text-sm sm:text-base ${tokens.colors.textMuted} max-w-2xl leading-relaxed">
            ${bio.replace(/"/g, '&quot;')}
          </p>` : ''}

          <div className="flex flex-wrap items-center gap-4 pt-4">
            ${email ? `<a href="mailto:${email}" className="px-6 py-3 ${tokens.colors.accentPrimary} font-bold text-xs ${tokens.borderRadius.button} ${tokens.effects.cardShadow} ${tokens.effects.hoverTransform} flex items-center gap-2">
              <Mail className="w-4 h-4" /> Get In Touch
            </a>` : ''}
            ${github ? `<a href="${github}" target="_blank" rel="noreferrer" className="px-5 py-3 ${tokens.colors.surface} ${tokens.colors.surfaceBorder} border font-bold text-xs ${tokens.borderRadius.button} ${tokens.effects.hoverTransform} flex items-center gap-2">
              <Github className="w-4 h-4" /> GitHub
            </a>` : ''}
          </div>
        </motion.header>

        {/* WORK EXPERIENCE */}
        ${experiences.length > 0 ? `
        <motion.section {...FADE_UP} className="space-y-6">
          <h2 className="text-xl font-bold font-mono border-b ${tokens.colors.surfaceBorder} pb-3 flex items-center gap-2">
            // Work Experience
          </h2>
          <div className="space-y-4">
            ${experiences.map(exp => `
            <div className="p-6 ${tokens.colors.surface} border ${tokens.colors.surfaceBorder} ${tokens.borderRadius.card} ${tokens.effects.cardShadow} space-y-3">
              <div className="flex justify-between items-start flex-wrap gap-2">
                <div>
                  <h3 className="font-bold text-base text-white">${exp.role}</h3>
                  <p className="text-xs text-amber-400 font-mono">${exp.company}</p>
                </div>
                <span className="text-xs ${tokens.colors.textMuted} font-mono">${exp.startDate || ''} - ${exp.endDate || 'Present'}</span>
              </div>
              <p className="text-xs ${tokens.colors.textMuted} leading-relaxed whitespace-pre-line">${exp.description.replace(/"/g, '&quot;')}</p>
            </div>`).join('\n')}
          </div>
        </motion.section>` : ''}

        {/* FEATURED PROJECTS */}
        ${projects.length > 0 ? `
        <motion.section {...FADE_UP} className="space-y-6">
          <h2 className="text-xl font-bold font-mono border-b ${tokens.colors.surfaceBorder} pb-3 flex items-center gap-2">
            // Featured Projects
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            ${projects.map(proj => `
            <div className="p-6 ${tokens.colors.surface} border ${tokens.colors.surfaceBorder} ${tokens.borderRadius.card} ${tokens.effects.cardShadow} ${tokens.effects.hoverTransform} flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <h3 className="font-bold text-lg text-white">${proj.title}</h3>
                <p className="text-xs ${tokens.colors.textMuted} leading-relaxed">${proj.description.replace(/"/g, '&quot;')}</p>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono pt-3 border-t ${tokens.colors.surfaceBorder}">
                ${proj.githubUrl ? `<a href="${proj.githubUrl}" target="_blank" rel="noreferrer" className="text-amber-400 hover:underline flex items-center gap-1">
                  <Github className="w-3.5 h-3.5" /> Code
                </a>` : ''}
                ${proj.liveUrl ? `<a href="${proj.liveUrl}" target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline flex items-center gap-1">
                  <ExternalLink className="w-3.5 h-3.5" /> Demo
                </a>` : ''}
              </div>
            </div>`).join('\n')}
          </div>
        </motion.section>` : ''}

        {/* SKILLS */}
        ${skills.length > 0 ? `
        <motion.section {...FADE_UP} className="space-y-4">
          <h2 className="text-xl font-bold font-mono border-b ${tokens.colors.surfaceBorder} pb-3">
            // Tech Stack & Competencies
          </h2>
          <div className="flex flex-wrap gap-2">
            ${skills.map(skill => `
            <span className="px-3 py-1.5 ${tokens.colors.surface} border ${tokens.colors.surfaceBorder} ${tokens.borderRadius.badge} text-xs font-mono font-bold">
              ${skill}
            </span>`).join('\n')}
          </div>
        </motion.section>` : ''}

        {/* FOOTER */}
        <footer className="pt-12 border-t ${tokens.colors.surfaceBorder} text-center text-xs ${tokens.colors.textMuted} font-mono">
          <p>© {new Date().getFullYear()} ${name}. Built with StackFolio.</p>
        </footer>

      </div>
    </div>
  );
}
`;
}
