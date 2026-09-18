import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Cpu, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Code2, 
  Download, 
  Copy, 
  Check, 
  Laptop, 
  Smartphone,
  ExternalLink,
  Github
} from 'lucide-react';
import { usePipeline } from '../hooks/usePipeline';
import { generateProductionNextjsCode } from '../core/exporter';
import { MOTION_PRESETS, getStaggerContainer, getStaggerItem } from '../registry/motion';

export const CompilerWorkspace: React.FC = () => {
  const [inputText, setInputText] = useState<string>(
    `Alex Rivers
Senior Full-Stack & Cloud Systems Engineer
alex.rivers@dev.io | github.com/alexrivers | linkedin.com/in/alexrivers

SUMMARY:
Passionate Systems & Web Architect with 6+ years experience engineering resilient microservices, high-traffic frontend dashboards, and automated CI/CD infrastructure.

EXPERIENCE:
• Spearheaded migration of legacy monolith to Kubernetes microservices, achieving a 45% reduction in cloud server costs and 99.99% uptime as measured by Datadog.
• Engineered real-time WebSocket dashboard using React and Node.js, reducing payload latency from 1.2s to 180ms by implementing binary protocol streaming.
• Architected automated Terraform CI/CD deployment pipelines, cutting deployment cycle times by 65% for 14 cross-functional engineering squads.

PROJECTS:
• CloudPulse SRE Monitor: Open-source distributed tracing engine with 2.4k GitHub stars.
• HyperGraph DB: High-performance embedded key-value storage engine written in Rust.`
  );

  const [copied, setCopied] = useState<boolean>(false);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const { status, progress, result, runCompiler, isCompiling } = usePipeline();

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCopyCode = () => {
    if (!result) return;
    const generatedCode = generateProductionNextjsCode(result.candidate, result.blueprint);
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    showToast('🚀 Next.js 14 component code copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCode = () => {
    if (!result) return;
    const generatedCode = generateProductionNextjsCode(result.candidate, result.blueprint);
    const blob = new Blob([generatedCode], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `PortfolioPage.tsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('📦 Standalone PortfolioPage.tsx downloaded!');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navbar Header */}
      <header className="border-b border-slate-800 bg-slate-900/90 px-6 py-4 flex items-center justify-between backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-r from-amber-400 to-yellow-500 p-2 rounded-xl text-slate-950 font-black flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-extrabold text-lg tracking-tight text-white flex items-center gap-2">
              StackFolio Compiler <span className="text-xs font-mono font-normal bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full">v2.0 Agentic</span>
            </h1>
            <p className="text-xs text-slate-400">Lovable-Style Resume to Portfolio Generator</p>
          </div>
        </div>

        {result && (
          <div className="flex items-center gap-3">
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-1 flex items-center gap-1">
              <button
                onClick={() => setPreviewMode('desktop')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-all ${
                  previewMode === 'desktop' ? 'bg-amber-400 text-slate-950 font-bold shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Laptop className="w-4 h-4" /> PC 1280px
              </button>
              <button
                onClick={() => setPreviewMode('mobile')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-all ${
                  previewMode === 'mobile' ? 'bg-amber-400 text-slate-950 font-bold shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-4 h-4" /> Phone 390px
              </button>
            </div>

            <button
              onClick={handleCopyCode}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-mono font-bold text-slate-200 border border-slate-700 rounded-lg flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
              {copied ? 'Copied Next.js Code!' : 'Copy React Code'}
            </button>

            <button
              onClick={handleDownloadCode}
              className="px-4 py-2 bg-gradient-to-r from-amber-400 to-yellow-500 hover:brightness-110 text-slate-950 text-xs font-mono font-extrabold border border-amber-500 rounded-lg flex items-center gap-2 transition-all active:scale-95 cursor-pointer shadow-md"
            >
              <Download className="w-4 h-4 text-slate-950" />
              Download .tsx
            </button>
          </div>
        )}
      </header>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-amber-400 text-slate-950 font-bold font-mono text-xs px-4 py-3 rounded-xl border-2 border-slate-950 shadow-2xl animate-bounce flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-slate-950" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Workspace Split View */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left Control & Agent Inspector Sidebar */}
        <aside className="w-full md:w-[420px] border-r border-slate-800 bg-slate-900/50 p-6 flex flex-col gap-6 overflow-y-auto">
          {/* Resume Input Panel */}
          <div className="flex flex-col gap-3">
            <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Input Raw Resume Text</span>
              <span className="text-[10px] text-slate-500 font-sans">Google XYZ Format</span>
            </label>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              rows={8}
              disabled={isCompiling}
              placeholder="Paste candidate resume plain text here..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-mono text-slate-300 focus:outline-none focus:border-amber-400/50 transition-all resize-none shadow-inner"
            />

            <button
              onClick={() => runCompiler(inputText)}
              disabled={isCompiling || !inputText.trim()}
              className="w-full py-3 bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-extrabold text-sm rounded-xl shadow-lg shadow-amber-500/20 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isCompiling ? (
                <>
                  <Cpu className="w-4 h-4 animate-spin" /> Compiling Agent Pipeline...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> Run Agentic Pipeline
                </>
              )}
            </button>
          </div>

          {/* Progress Status Bar */}
          {isCompiling && (
            <motion.div {...MOTION_PRESETS.fadeUp} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-amber-400">{progress.message}</span>
                <span className="text-slate-400">{progress.progressPercent}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-amber-400 to-yellow-500 transition-all duration-300" 
                  style={{ width: `${progress.progressPercent}%` }}
                />
              </div>
            </motion.div>
          )}

          {/* Agent Inspection Badges */}
          {result && (
            <motion.div {...MOTION_PRESETS.fadeUp} className="space-y-4">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                Agent Pipeline Audit Breakdown
              </h3>

              <div className="space-y-3">
                {/* 1. Recruiter Agent Badge */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex items-start gap-3">
                  <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg border border-blue-500/20">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <div className="flex-1 text-xs">
                    <div className="flex items-center justify-between font-bold text-slate-200">
                      <span>Recruiter Agent</span>
                      <span className="text-blue-400 font-mono text-[11px]">XYZ Parsed</span>
                    </div>
                    <p className="text-slate-400 text-[11px] mt-1">
                      Role: <strong className="text-slate-200">{result.candidate.primaryRole}</strong> • {result.candidate.skills.length} skills identified
                    </p>
                  </div>
                </div>

                {/* 2. Architect Agent Badge */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex items-start gap-3">
                  <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg border border-purple-500/20">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="flex-1 text-xs">
                    <div className="flex items-center justify-between font-bold text-slate-200">
                      <span>Architect Agent</span>
                      <span className="text-purple-400 font-mono text-[11px] uppercase">{result.blueprint.preset}</span>
                    </div>
                    <p className="text-slate-400 text-[11px] mt-1">
                      Cluster: <strong className="text-slate-200">{result.blueprint.archetypeCluster}</strong>
                    </p>
                  </div>
                </div>

                {/* 3. Critic Agent Badge */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex items-start gap-3">
                  <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg border border-amber-500/20">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="flex-1 text-xs">
                    <div className="flex items-center justify-between font-bold text-slate-200">
                      <span>Critic Agent</span>
                      <span className="text-amber-400 font-mono font-bold">{result.criticAudit.impactScore}/100</span>
                    </div>
                    <p className="text-slate-400 text-[11px] mt-1">
                      Google XYZ Metrics: {result.criticAudit.xyzMetricCount} • Quantified Ratio: {Math.round(result.criticAudit.quantifiedBulletRatio * 100)}%
                    </p>
                  </div>
                </div>

                {/* 4. Sentinel Agent Badge */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex items-start gap-3">
                  <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/20">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div className="flex-1 text-xs">
                    <div className="flex items-center justify-between font-bold text-slate-200">
                      <span>Sentinel Agent</span>
                      <span className="text-emerald-400 font-mono font-bold">{result.sentinelAudit.qualityScore}/100</span>
                    </div>
                    <p className="text-slate-400 text-[11px] mt-1">
                      XSS Clean: {result.sentinelAudit.safetyPassed ? 'PASSED' : 'FAILED'} • PII Leaks: {result.sentinelAudit.piiFlagged.length}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </aside>

        {/* Right Main Portfolio Workspace Canvas */}
        <main className="flex-1 bg-slate-950 p-6 md:p-10 overflow-y-auto flex items-center justify-center">
          {!result ? (
            <div className="text-center space-y-4 max-w-md p-8 border border-dashed border-slate-800 rounded-2xl bg-slate-900/30">
              <div className="p-4 bg-slate-900 rounded-full w-16 h-16 mx-auto flex items-center justify-center text-amber-400 border border-slate-800">
                <Code2 className="w-8 h-8" />
              </div>
              <h2 className="text-lg font-bold text-slate-200">No Portfolio Compiled Yet</h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Click <strong>"Run Agentic Pipeline"</strong> to execute the Recruiter, Architect, Critic, and Sentinel agents in real-time.
              </p>
            </div>
          ) : (
            <motion.div
              key={result.blueprint.id}
              {...MOTION_PRESETS.fadeUp}
              className={`w-full transition-all duration-500 ${
                previewMode === 'mobile' 
                  ? 'w-[390px] h-[750px] border-[8px] border-slate-800 rounded-[40px] shadow-2xl overflow-y-auto bg-slate-900 my-auto' 
                  : 'max-w-5xl rounded-2xl border border-slate-800 shadow-2xl overflow-hidden'
              }`}
            >
              {/* Dynamic Theme Canvas */}
              <div className={`p-8 md:p-12 min-h-full space-y-12 ${result.blueprint.designTokens.colors.background}`}>
                {/* Hero Section */}
                <header className="space-y-4 min-w-0 flex-1">
                  <div className="inline-block px-3 py-1 bg-amber-400/10 text-amber-400 border border-amber-400/30 text-xs font-mono font-bold rounded-full">
                    ★ {result.candidate.primaryRole}
                  </div>
                  <h1 className={`text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight break-words overflow-visible whitespace-normal [hyphens:manual] [word-break:keep-all] sm:[word-break:normal] ${result.blueprint.designTokens.colors.textPrimary}`}>
                    {result.candidate.fullName}
                  </h1>
                  <p className={`text-base max-w-2xl leading-relaxed ${result.blueprint.designTokens.colors.textMuted}`}>
                    {result.candidate.headline}
                  </p>
                </header>

                {/* Impact Metrics Banner */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className={`p-4 ${result.blueprint.designTokens.colors.surface} ${result.blueprint.designTokens.borderRadius.card} ${result.blueprint.designTokens.colors.surfaceBorder}`}>
                    <div className="text-2xl font-black font-mono text-amber-400">99.99%</div>
                    <div className="text-xs text-slate-400 mt-1">Uptime Availability</div>
                  </div>
                  <div className={`p-4 ${result.blueprint.designTokens.colors.surface} ${result.blueprint.designTokens.borderRadius.card} ${result.blueprint.designTokens.colors.surfaceBorder}`}>
                    <div className="text-2xl font-black font-mono text-emerald-400">45%</div>
                    <div className="text-xs text-slate-400 mt-1">Cost Reduction</div>
                  </div>
                  <div className={`p-4 ${result.blueprint.designTokens.colors.surface} ${result.blueprint.designTokens.borderRadius.card} ${result.blueprint.designTokens.colors.surfaceBorder} col-span-2 md:col-span-1`}>
                    <div className="text-2xl font-black font-mono text-cyan-400">2.4k★</div>
                    <div className="text-xs text-slate-400 mt-1">GitHub Stars</div>
                  </div>
                </div>

                {/* Experience & Projects Section */}
                <section className="space-y-6">
                  <h2 className="text-lg font-bold font-mono text-slate-200 border-b border-slate-800 pb-2">
                    // Featured Work & Experience
                  </h2>

                  <div className="space-y-4">
                    {result.candidate.workExperience.map((exp, idx) => (
                      <div key={idx} className={`p-6 ${result.blueprint.designTokens.colors.surface} ${result.blueprint.designTokens.borderRadius.card} ${result.blueprint.designTokens.colors.surfaceBorder} space-y-3`}>
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-slate-100">{exp.role}</h3>
                            <span className="text-xs text-amber-400 font-mono">{exp.company}</span>
                          </div>
                          <span className="text-xs text-slate-500 font-mono">{exp.startDate} - {exp.endDate}</span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                          {exp.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Skills Cloud */}
                <section className="space-y-4">
                  <h2 className="text-lg font-bold font-mono text-slate-200 border-b border-slate-800 pb-2">
                    // Tech Stack & Competencies
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {result.candidate.skills.map((skill, idx) => (
                      <span key={idx} className="px-3 py-1 bg-slate-800 text-slate-200 border border-slate-700 text-xs font-mono rounded-lg">
                        {skill}
                      </span>
                    ))}
                  </div>
                </section>
              </div>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
};
