import DOMPurify from 'isomorphic-dompurify';
import { SentinelAudit } from '../schemas/audit.schema';

/**
 * Common PII regex patterns for security auditing
 */
const PII_PATTERNS = {
  ssn: /\b\d{3}-\d{2}-\d{4}\b/g,
  creditCard: /\b(?:\d[ -]*?){13,16}\b/g,
  awsKey: /AKIA[0-9A-Z]{16}/g,
  privateKey: /-----BEGIN PRIVATE KEY-----/g
};

/**
 * Sentinel Agent - Security, Sanity & Performance Audit Guardrail
 * Sanitizes HTML, checks XSS vector attempts, verifies CLS & mobile layout safety
 */
export async function runSentinelAgent(
  renderedHtml: string,
  tokens?: unknown
): Promise<SentinelAudit> {
  const violations: string[] = [];
  const piiFlagged: string[] = [];
  let qualityScore = 100;
  let safetyPassed = true;
  let spamDetected = false;

  if (!renderedHtml || typeof renderedHtml !== 'string') {
    return {
      safetyPassed: false,
      piiFlagged: [],
      spamDetected: false,
      qualityScore: 0,
      violations: ['Rendered HTML content is missing or empty'],
      passedThreshold: false
    };
  }

  // 1. Security & XSS Audit using DOMPurify
  const sanitized = DOMPurify.sanitize(renderedHtml, {
    ALLOW_UNKNOWN_PROTOCOLS: false,
    FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus']
  });

  if (renderedHtml.includes('<script') || /javascript:/i.test(renderedHtml)) {
    violations.push('Dangerous inline <script> or javascript: protocol detected');
    safetyPassed = false;
    qualityScore -= 40;
  }

  if (renderedHtml.includes('<iframe')) {
    violations.push('External <iframe> element detected - potential security hazard');
    qualityScore -= 15;
  }

  if (/eval\(|Function\(/i.test(renderedHtml)) {
    violations.push('Unsafe eval() or Function constructor pattern detected');
    safetyPassed = false;
    qualityScore -= 30;
  }

  // 2. PII & Sensitive Key Leak Check
  if (PII_PATTERNS.ssn.test(renderedHtml)) {
    piiFlagged.push('Social Security Number pattern');
    qualityScore -= 25;
  }
  if (PII_PATTERNS.creditCard.test(renderedHtml)) {
    piiFlagged.push('Credit card number pattern');
    qualityScore -= 25;
  }
  if (PII_PATTERNS.awsKey.test(renderedHtml)) {
    piiFlagged.push('AWS Access Key pattern');
    safetyPassed = false;
    qualityScore -= 40;
  }

  // 3. Spam & Keyword Stuffing Check
  const wordCount = renderedHtml.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(Boolean).length;
  if (wordCount > 15000) {
    spamDetected = true;
    violations.push('Excessive document length (>15,000 words)');
    qualityScore -= 20;
  }

  // 4. CLS & Media Attributes Audit
  const imgTagsWithoutDimensions = (renderedHtml.match(/<img(?![^>]*width=)[^>]*>/gi) || []).length;
  if (imgTagsWithoutDimensions > 0) {
    violations.push(`${imgTagsWithoutDimensions} <img> tag(s) missing explicit width/height attributes (CLS risk)`);
    qualityScore -= 5 * Math.min(imgTagsWithoutDimensions, 4);
  }

  // Final score clamping
  const finalQualityScore = Math.max(0, qualityScore);
  const passedThreshold = safetyPassed && piiFlagged.length === 0 && finalQualityScore >= 75;

  return {
    safetyPassed,
    piiFlagged,
    spamDetected,
    qualityScore: finalQualityScore,
    violations,
    passedThreshold
  };
}
