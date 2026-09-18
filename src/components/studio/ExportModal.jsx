import React, { useState } from 'react';
import { X, Copy, Download, Check, Sparkles, Code2, ExternalLink, FileCode } from 'lucide-react';
import { getExportableCode } from '../../utils/exportHelper';

export default function ExportModal({ isOpen, onClose, schema, portfolio }) {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  if (!isOpen) return null;

  const activeData = schema || portfolio;
  const generatedCode = getExportableCode(activeData);
  const slug = schema?.metadata?.slug || portfolio?.public_slug || 'christopher-amos';
  const publicUrl = `${window.location.origin}/p/${slug}`;

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCopyReactCode = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopiedCode(true);
    showToast('🚀 Next.js 14 component code copied to clipboard!');
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleDownloadTsx = () => {
    const blob = new Blob([generatedCode], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'PortfolioPage.tsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('📦 Self-contained PortfolioPage.tsx downloaded!');
  };

  const handleDownloadJson = () => {
    const jsonStr = JSON.stringify(activeData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `portfolio-schema-${slug}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('📄 Schema JSON downloaded!');
  };

  const handleCopyPublicUrl = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopiedLink(true);
    showToast('🔗 Live public URL copied!');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-200 select-none">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-[#FFE600] text-black font-extrabold font-mono text-xs px-4 py-3 rounded-xl border-2 border-black shadow-[4px_4px_0px_#000] flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-black" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Modal Dialog Card */}
      <div className="w-full max-w-2xl bg-white border-3 border-black rounded-2xl shadow-[6px_6px_0px_#000] overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-[#FFE600] border-b-3 border-black flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-black text-[#FFE600] rounded-lg flex items-center justify-center font-black text-sm border-2 border-black">
              ⚡
            </div>
            <div>
              <h2 className="text-base font-black tracking-tight text-black flex items-center gap-2">
                Export & Publish Code <Sparkles className="w-4 h-4 fill-black text-black" />
              </h2>
              <p className="text-[11px] font-bold text-black/80">Self-Contained Next.js 14 / React & Tailwind Component</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-black/10 rounded-lg text-black transition-colors cursor-pointer border-2 border-black bg-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          
          {/* Action CTAs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={handleCopyReactCode}
              className="py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs rounded-xl border-2 border-black shadow-[3px_3px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-amber-400" />}
              <span>{copiedCode ? 'Code Copied!' : 'Copy React Code'}</span>
            </button>

            <button
              onClick={handleDownloadTsx}
              className="py-3 px-4 bg-[#FFE600] hover:bg-[#ebd300] text-black font-black text-xs rounded-xl border-2 border-black shadow-[3px_3px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4 text-black" />
              <span>Download PortfolioPage.tsx</span>
            </button>
          </div>

          {/* Public Sharing URL Bar */}
          <div className="p-4 bg-slate-50 border-2 border-black rounded-xl space-y-2">
            <label className="text-[11px] font-black font-mono uppercase text-slate-700 flex items-center justify-between">
              <span>Live Shareable URL</span>
              <span className="text-[10px] text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-400">PUBLISHED 🟢</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={publicUrl}
                className="flex-1 bg-white border-2 border-black rounded-lg px-3 py-1.5 text-xs font-mono font-bold text-slate-900 focus:outline-none"
              />
              <button
                onClick={handleCopyPublicUrl}
                className="px-3 py-1.5 bg-white hover:bg-slate-100 text-black border-2 border-black font-bold text-xs rounded-lg shadow-[2px_2px_0px_#000] flex items-center gap-1 cursor-pointer shrink-0"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Copied' : 'Copy'}</span>
              </button>
              <a
                href={`/p/${slug}`}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 bg-[#0053ff] hover:bg-[#0043cc] text-white border-2 border-black font-bold text-xs rounded-lg shadow-[2px_2px_0px_#000] flex items-center gap-1 cursor-pointer shrink-0"
              >
                <span>View</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Code Preview Box */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-700">
              <span className="flex items-center gap-1.5">
                <FileCode className="w-4 h-4 text-slate-900" />
                PortfolioPage.tsx Snippet
              </span>
              <button
                onClick={handleDownloadJson}
                className="text-[11px] text-slate-600 hover:text-black underline cursor-pointer"
              >
                Download Schema JSON
              </button>
            </div>
            <div className="bg-slate-950 border-2 border-black rounded-xl p-4 overflow-x-auto max-h-48 text-[11px] font-mono text-slate-300 leading-relaxed">
              <pre>{generatedCode.slice(0, 800)}...</pre>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-100 border-t-2 border-black flex items-center justify-between text-xs text-slate-600 font-mono">
          <span>Format: Next.js 14 + Tailwind CSS + Framer Motion</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-white border-2 border-black rounded-lg font-bold text-black shadow-[2px_2px_0px_#000] hover:bg-slate-200 cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
