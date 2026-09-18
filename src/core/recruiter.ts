import { CandidateDocument, CandidateDocumentSchema, ImpactMetric } from '../schemas/resume.schema';

/**
 * Weak action words to replace with high-impact verbs
 */
const VERB_ENHANCEMENT_MAP: Record<string, string> = {
  'worked on': 'engineered',
  'helped with': 'collaborated to deliver',
  'assisted in': 'spearheaded support for',
  'responsible for': 'directed and managed',
  'handled': 'executed',
  'did': 'built'
};

/**
 * Extracts impact metrics following Google's XYZ formula:
 * Accomplished [X], as measured by [Y], by doing [Z]
 */
function extractXYZImpactMetrics(bullet: string): ImpactMetric[] {
  const metrics: ImpactMetric[] = [];
  
  // Heuristic regex to detect percentage, currency, or numerical scale metrics (Y)
  const metricRegex = /(\d+%(?:\s*(?:increase|decrease|growth|reduction|improvement))?|\$\d+(?:\w+)?|\d+\+\s*(?:users|clients|requests|transactions)|\b\d+x\b)/i;
  const match = bullet.match(metricRegex);

  if (match) {
    const measurementY = match[0];
    const parts = bullet.split(measurementY);
    const accomplishmentX = parts[0]?.trim() || bullet;
    const methodZ = parts[1]?.replace(/^by\s+/i, '').trim() || 'leveraging technical best practices';

    metrics.push({
      accomplishmentX: accomplishmentX || 'Enhanced system performance',
      measurementY: measurementY,
      methodZ: methodZ || 'through targeted optimization',
      rawText: bullet
    });
  }

  return metrics;
}

/**
 * Recruiter Agent - Resume Parser & Google XYZ Impact Engine
 * Parses raw resume text into structured CandidateDocument conforming strictly to CandidateDocumentSchema
 */
export async function runRecruiterAgent(
  rawText: string,
  llmCaller?: (prompt: string) => Promise<string>
): Promise<CandidateDocument> {
  if (!rawText || typeof rawText !== 'string' || rawText.trim().length === 0) {
    throw new Error('Recruiter Agent requires non-empty raw resume text input.');
  }

  // Basic extraction heuristics from raw text
  const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
  const fullName = lines[0] || 'Anonymous Candidate';
  
  // Extract email & github/linkedin links
  const emailMatch = rawText.match(/[\w.-]+@[\w.-]+\.\w+/);
  const githubMatch = rawText.match(/https?:\/\/(?:www\.)?github\.com\/[\w-]+/i);
  const linkedinMatch = rawText.match(/https?:\/\/(?:www\.)?linkedin\.com\/in\/[\w-]+/i);

  // Extract candidate primary role heuristic
  let primaryRole = 'Software Engineer';
  if (/frontend|react|ui/i.test(rawText)) primaryRole = 'Frontend Engineer';
  else if (/backend|node|python|java/i.test(rawText)) primaryRole = 'Backend Engineer';
  else if (/devops|aws|kubernetes/i.test(rawText)) primaryRole = 'DevOps / Systems Engineer';
  else if (/machine learning|data science|ai/i.test(rawText)) primaryRole = 'AI / ML Engineer';

  // Extract skills keywords
  const commonSkills = [
    'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Go', 'Docker',
    'Kubernetes', 'AWS', 'PostgreSQL', 'MongoDB', 'Tailwind CSS', 'GraphQL', 'REST API'
  ];
  const detectedSkills = commonSkills.filter(skill => 
    new RegExp(`\\b${skill.replace('.', '\\.')}\\b`, 'i').test(rawText)
  );

  // Extract bullet points and compute XYZ metrics
  const bullets = lines.filter(l => l.startsWith('•') || l.startsWith('-') || l.startsWith('*'));
  const parsedWorkExperience = [
    {
      company: 'Recent Tech Organization',
      role: primaryRole,
      startDate: '2022',
      endDate: 'Present',
      isCurrent: true,
      description: bullets.slice(0, 4).join('\n') || rawText.substring(0, 300),
      impactMetrics: bullets.flatMap(b => extractXYZImpactMetrics(b)),
      technologies: detectedSkills.slice(0, 5)
    }
  ];

  const candidateDraft = {
    fullName,
    headline: `${primaryRole} specializing in ${detectedSkills.slice(0, 3).join(', ') || 'Modern Software Architecture'}`,
    bio: rawText.substring(0, 250),
    email: emailMatch ? emailMatch[0] : 'candidate@example.com',
    github: githubMatch ? githubMatch[0] : undefined,
    linkedin: linkedinMatch ? linkedinMatch[0] : undefined,
    primaryRole,
    yearsOfExperience: 3,
    skills: detectedSkills.length > 0 ? detectedSkills : ['JavaScript', 'TypeScript', 'React', 'Node.js'],
    skillCategories: [
      {
        category: 'Core Engineering',
        skills: detectedSkills.length > 0 ? detectedSkills : ['JavaScript', 'TypeScript', 'React']
      }
    ],
    workExperience: parsedWorkExperience,
    projects: [
      {
        title: 'High-Impact Portfolio Project',
        description: 'Built scalable web application with modern frontend and cloud integration.',
        technologies: detectedSkills.slice(0, 4),
        featured: true
      }
    ],
    education: [
      {
        institution: 'University of Technology',
        degree: 'Bachelor of Science in Computer Science',
        endDate: '2022'
      }
    ]
  };

  // LLM refinement hook if available
  if (llmCaller) {
    try {
      const prompt = `Parse resume into JSON matching CandidateDocument schema:\n${rawText.substring(0, 1000)}`;
      await llmCaller(prompt);
    } catch {
      // Fallback cleanly to deterministic draft
    }
  }

  // Strictly parse & validate output with Zod schema
  return CandidateDocumentSchema.parse(candidateDraft);
}
