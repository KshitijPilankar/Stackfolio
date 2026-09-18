import { runRecruiterAgent } from './agents/recruiter';
import { runArchitectAgent } from './agents/architect';
import { runCriticAgent } from './agents/critic';
import { runSentinelAgent } from './agents/sentinel';

import { CandidateDocument } from './schemas/resume.schema';
import { LayoutBlueprint } from './schemas/layout.schema';
import { CriticAudit, SentinelAudit, PipelineAuditResult } from './schemas/audit.schema';

export interface StackFolioPipelineResult {
  candidate: CandidateDocument;
  blueprint: LayoutBlueprint;
  criticAudit: CriticAudit;
  sentinelAudit: SentinelAudit;
  pipelineAudit: PipelineAuditResult;
  success: boolean;
  executedAt: string;
}

/**
 * Master Orchestrator - StackFolio Agentic Pipeline
 * Sequentially chains the 4 core agents:
 * Recruiter (Parse) -> Architect (Style & Layout Matching) -> Critic (Taste & Quality Audit) -> Sentinel (DOM & Security Audit)
 */
export async function runStackFolioPipeline(
  rawResumeText: string,
  llmCaller?: (prompt: string) => Promise<string>
): Promise<StackFolioPipelineResult> {
  const executedAt = new Date().toISOString();

  // Step 1: Recruiter Agent (Parsing & Google XYZ Impact Extraction)
  const candidate = await runRecruiterAgent(rawResumeText, llmCaller);

  // Step 2: Architect Agent (5 Archetype Clusters Style & Layout Blueprinting)
  const blueprint = await runArchitectAgent(candidate, llmCaller);

  // Step 3: Critic Agent (Taste, Contrast & Bullet Impact Audit)
  const criticAudit = await runCriticAgent(candidate, blueprint, llmCaller);

  // Step 4: Sentinel Agent (DOM Security, XSS, PII & CLS Audit)
  // Render simulated HTML structure for DOM inspection
  const simulatedHtml = `
    <div class="portfolio-container ${blueprint.designTokens.colors.background}">
      <header class="${blueprint.designTokens.colors.textPrimary}">
        <h1>${candidate.fullName}</h1>
        <p>${candidate.headline}</p>
      </header>
      <main class="${blueprint.designTokens.spacing.sectionGap}">
        <section class="projects">
          ${candidate.projects.map(p => `
            <div class="project-card ${blueprint.designTokens.colors.surface} ${blueprint.designTokens.borderRadius.card}">
              <h2>${p.title}</h2>
              <p>${p.description}</p>
            </div>
          `).join('')}
        </section>
      </main>
    </div>
  `;
  const sentinelAudit = await runSentinelAgent(simulatedHtml, blueprint.designTokens);

  // Consolidate Pipeline Audit Result
  const overallScore = Math.round((criticAudit.impactScore + sentinelAudit.qualityScore) / 2);
  const passedPipeline = criticAudit.passedThreshold && sentinelAudit.passedThreshold;

  const pipelineAudit: PipelineAuditResult = {
    overallScore,
    criticAudit,
    sentinelAudit,
    passedPipeline,
    thresholds: {
      minOverallScore: 70,
      minImpactScore: 65,
      minQualityScore: 75
    },
    auditedAt: executedAt
  };

  return {
    candidate,
    blueprint,
    criticAudit,
    sentinelAudit,
    pipelineAudit,
    success: passedPipeline,
    executedAt
  };
}
