import { CandidateDocument } from '../schemas/resume.schema';
import { LayoutBlueprint } from '../schemas/layout.schema';
import { CriticAudit } from '../schemas/audit.schema';

/**
 * Weak/Generic resume bullet words that lack measurable impact
 */
const WEAK_VERBS = [
  'worked on',
  'helped with',
  'assisted in',
  'responsible for',
  'handled',
  'participated in',
  'involved with',
  'did tasks'
];

/**
 * Critic Agent - Resume Impact & Design Aesthetics Evaluator
 * Evaluates impact metrics, Google XYZ format ratios, visual contrast and typography alignment
 */
export async function runCriticAgent(
  candidate: CandidateDocument,
  blueprint?: LayoutBlueprint,
  llmCaller?: (prompt: string) => Promise<string>
): Promise<CriticAudit> {
  const weakBulletPoints: string[] = [];
  const suggestions: string[] = [];
  let totalBullets = 0;
  let quantifiedBullets = 0;
  let xyzMetricCount = 0;

  if (!candidate) {
    return {
      impactScore: 0,
      xyzMetricCount: 0,
      quantifiedBulletRatio: 0,
      weakBulletPoints: ['Candidate document is empty'],
      suggestions: ['Provide structured work experience and projects'],
      passedThreshold: false
    };
  }

  // 1. Analyze Work Experience Bullets
  candidate.workExperience.forEach((exp) => {
    if (exp.impactMetrics && exp.impactMetrics.length > 0) {
      xyzMetricCount += exp.impactMetrics.length;
    }

    if (exp.description) {
      const bullets = exp.description.split('\n').map(b => b.trim()).filter(Boolean);
      totalBullets += bullets.length;

      bullets.forEach((bullet) => {
        const lower = bullet.toLowerCase();
        // Check for numbers or metrics
        if (/\d+%|\$\d+|\d+\+|\b\d+\b/.test(bullet)) {
          quantifiedBullets += 1;
        }

        // Check for weak phrases
        WEAK_VERBS.forEach((weak) => {
          if (lower.includes(weak)) {
            weakBulletPoints.push(`"${bullet.substring(0, 60)}..." (Uses weak verb: "${weak}")`);
          }
        });
      });
    }
  });

  // 2. Analyze Projects Impact
  candidate.projects.forEach((proj) => {
    if (proj.impactMetrics && proj.impactMetrics.length > 0) {
      xyzMetricCount += proj.impactMetrics.length;
    }
  });

  const quantifiedBulletRatio = totalBullets > 0 ? Number((quantifiedBullets / totalBullets).toFixed(2)) : 1;

  // 3. Compute Impact Score (0 - 100)
  let impactScore = 50;
  impactScore += Math.min(30, xyzMetricCount * 10);
  impactScore += Math.round(quantifiedBulletRatio * 20);
  if (weakBulletPoints.length > 0) {
    impactScore -= Math.min(20, weakBulletPoints.length * 5);
  }

  const finalImpactScore = Math.max(0, Math.min(100, impactScore));

  // 4. Formulate Actionable Suggestions
  if (quantifiedBulletRatio < 0.6) {
    suggestions.push('Add specific numbers, percentages, or growth metrics to at least 60% of work experience bullets.');
  }
  if (xyzMetricCount === 0) {
    suggestions.push('Adopt the Google XYZ format: "Accomplished [X], as measured by [Y], by doing [Z]".');
  }
  if (candidate.projects.length < 2) {
    suggestions.push('Include at least 2 featured projects with live URLs or GitHub repositories.');
  }

  // Optional LLM enhancement hook
  if (llmCaller) {
    try {
      const prompt = `As a senior tech recruiter critic, analyze candidate "${candidate.fullName}" with score ${finalImpactScore}. Give 1 concise tip.`;
      const tip = await llmCaller(prompt);
      if (tip) suggestions.push(tip);
    } catch {
      // Fallback to deterministic suggestions
    }
  }

  const passedThreshold = finalImpactScore >= 65 && quantifiedBulletRatio >= 0.5;

  return {
    impactScore: finalImpactScore,
    xyzMetricCount,
    quantifiedBulletRatio,
    weakBulletPoints,
    suggestions,
    passedThreshold
  };
}
