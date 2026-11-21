import React, { useState } from 'react';
import {
  FileText,
  Cloud,
  UploadCloud,
  Sparkles,
  Download,
  Trash2,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Zap,
  Clock,
  Search,
  Plus,
  Lock,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DocumentItem, UserProfile } from '../types';

interface DocumentsCloudViewProps {
  documents: DocumentItem[];
  user: UserProfile;
  initialSubTab?: 'documents' | 'cloud' | 'upload';
  onAddDocument: (doc: DocumentItem) => void;
  onDeleteDocument: (id: string) => void;
}

export function DocumentsCloudView({
  documents,
  user,
  initialSubTab = 'documents',
  onAddDocument,
  onDeleteDocument,
}: DocumentsCloudViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<'documents' | 'cloud' | 'upload'>(initialSubTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScanningAts, setIsScanningAts] = useState(false);
  const [atsAnalysisResult, setAtsAnalysisResult] = useState<any>({
    atsScore: 92,
    matchSummary: 'Strong match for Google SDE III & AWS Cloud roles. High density of distributed systems, React 19, TypeScript, and microservices keywords.',
    matchedKeywords: ['React', 'TypeScript', 'Node.js', 'System Design', 'Kubernetes', 'Cloud/AWS', 'Distributed Caching', 'REST APIs'],
    missingKeywords: ['Redis Lua Scripts', 'Chaos Engineering', 'eBPF Profiling', 'Multi-Region Replication'],
    bulletPointFixes: [
      "Improve bullet: 'Developed backend services' ➔ 'Architected distributed event streaming backend processing 500k RPS with sub-10ms P99 latency.'",
      "Quantify metrics: State database read reduction percentage (e.g., 'Reduced cache misses by 65% via Redis read-through').",
    ],
  });

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [customResumeText, setCustomResumeText] = useState(
    'Alex Vance - Senior Software Engineer. Built high-scale React, TypeScript, Node.js systems. Architected distributed cloud infrastructure and microservices with 99.99% uptime.'
  );

  const handleRunAtsScan = async () => {
    setIsScanningAts(true);
    try {
      const res = await fetch('/api/resume-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText: customResumeText,
          targetRole: user.targetRole,
          targetCompany: user.targetCompany,
        }),
      });
      const data = await res.json();
      setAtsAnalysisResult(data);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    } catch (err) {
      console.error('ATS scan error:', err);
    } finally {
      setIsScanningAts(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const file = e.target.files[0];
    const newDoc: DocumentItem = {
      id: `doc-${Date.now()}`,
      title: file.name,
      category: file.name.toLowerCase().includes('resume') ? 'Resume' : 'Certificate',
      fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      uploadedAt: 'Just now',
      atsScore: 92,
      tags: ['Uploaded File', 'Verified'],
    };
    onAddDocument(newDoc);
    confetti({ particleCount: 40, spread: 50, origin: { y: 0.7 } });
  };

  const filteredDocs = documents.filter(
    (d) =>
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner with Sub-tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="h-6 w-6 text-blue-600" />
            Documents & MNC Cloud Drive
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Secure cloud storage for resumes, transcripts, certifications, and AI ATS keyword alignment.
          </p>
        </div>

        {/* Sub-tab Switcher */}
        <div className="flex items-center rounded-2xl bg-slate-100 p-1 dark:bg-slate-800">
          <button
            id="tab-btn-documents"
            onClick={() => setActiveSubTab('documents')}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition ${
              activeSubTab === 'documents'
                ? 'bg-white text-blue-600 shadow-xs dark:bg-slate-700 dark:text-white'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-300'
            }`}
          >
            <FileCheck className="h-3.5 w-3.5" />
            <span>ATS Analyzer</span>
          </button>

          <button
            id="tab-btn-cloud"
            onClick={() => setActiveSubTab('cloud')}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition ${
              activeSubTab === 'cloud'
                ? 'bg-white text-blue-600 shadow-xs dark:bg-slate-700 dark:text-white'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-300'
            }`}
          >
            <Cloud className="h-3.5 w-3.5" />
            <span>Cloud Drive</span>
          </button>

          <button
            id="tab-btn-upload"
            onClick={() => setActiveSubTab('upload')}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition ${
              activeSubTab === 'upload'
                ? 'bg-white text-blue-600 shadow-xs dark:bg-slate-700 dark:text-white'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-300'
            }`}
          >
            <UploadCloud className="h-3.5 w-3.5" />
            <span>Upload & Parse</span>
          </button>
        </div>
      </div>

      {/* 1. Documents & ATS Analyzer Sub-Tab */}
      {activeSubTab === 'documents' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Resume ATS Scanner */}
          <div className="lg:col-span-2 space-y-4">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-850 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-blue-600" />
                    AI Resume ATS Compatibility Scanner
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Benchmarked against Google, Amazon, and Microsoft hiring filters
                  </p>
                </div>

                <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700 border border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800">
                  <Zap className="h-3.5 w-3.5" />
                  <span>ATS Score: {atsAnalysisResult.atsScore || 92}%</span>
                </div>
              </div>

              {/* Editable Resume Text for live audit */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Resume Content / Bullet Points
                </label>
                <textarea
                  id="textarea-resume-content"
                  rows={4}
                  value={customResumeText}
                  onChange={(e) => setCustomResumeText(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Target Role: {user.targetRole}</span>
                <button
                  id="btn-scan-resume-ats"
                  onClick={handleRunAtsScan}
                  disabled={isScanningAts}
                  className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-blue-500 disabled:opacity-50"
                >
                  <Zap className="h-4 w-4" />
                  <span>{isScanningAts ? 'Scanning ATS Filters...' : 'Re-Analyze ATS Compatibility'}</span>
                </button>
              </div>
            </div>

            {/* Keyword Breakdown Card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-4 dark:border-emerald-900/40 dark:bg-emerald-950/20 space-y-2">
                <h4 className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" />
                  High-Value Matched Keywords ({atsAnalysisResult.matchedKeywords?.length || 8})
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {(atsAnalysisResult.matchedKeywords || []).map((kw: string, idx: number) => (
                    <span
                      key={idx}
                      className="rounded-lg bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200"
                    >
                      ✓ {kw}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-amber-200 bg-amber-50/40 p-4 dark:border-amber-900/40 dark:bg-amber-950/20 space-y-2">
                <h4 className="text-xs font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                  <AlertCircle className="h-4 w-4" />
                  Recommended Missing Keywords
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {(atsAnalysisResult.missingKeywords || []).map((kw: string, idx: number) => (
                    <span
                      key={idx}
                      className="rounded-lg bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-800 dark:bg-amber-900 dark:text-amber-200"
                    >
                      + {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* High-Impact Bullet Point Rewrites */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-850 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-blue-600" />
                Google XYZ Bullet Point Optimizations
              </h3>

              <div className="space-y-2">
                {(atsAnalysisResult.bulletPointFixes || []).map((fix: string, idx: number) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-xs leading-relaxed text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                  >
                    {fix}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right 1 Col: Saved Documents list */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Active Resumes & Docs</h3>
              <span className="text-xs text-slate-400">{documents.length} Files</span>
            </div>

            <div className="space-y-2.5">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-2xs transition hover:border-blue-300 dark:border-slate-800 dark:bg-slate-850 space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-slate-800 dark:text-blue-400">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[160px]">
                          {doc.title}
                        </h4>
                        <p className="text-[10px] text-slate-400">
                          {doc.category} • {doc.fileSize}
                        </p>
                      </div>
                    </div>

                    {doc.atsScore && (
                      <span className="rounded-md bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                        {doc.atsScore}% ATS
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400">
                    <span>{doc.uploadedAt}</span>
                    <button
                      onClick={() => onDeleteDocument(doc.id)}
                      className="text-rose-500 hover:text-rose-600 p-1"
                      title="Delete document"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. Cloud Drive Sub-Tab */}
      {activeSubTab === 'cloud' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search files in Cloud Drive..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-4 text-xs text-slate-900 placeholder:text-slate-400 dark:border-slate-800 dark:bg-slate-850 dark:text-white"
              />
            </div>

            <div className="flex items-center gap-2">
              <label
                htmlFor="file-upload-input-cloud"
                className="cursor-pointer flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-500 transition"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Upload New Document</span>
              </label>
              <input
                id="file-upload-input-cloud"
                type="file"
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredDocs.map((doc) => (
              <div
                key={doc.id}
                className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs hover:border-blue-400 hover:shadow-md transition dark:border-slate-800 dark:bg-slate-850"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-slate-800 dark:text-blue-400">
                      <FileText className="h-5 w-5" />
                    </div>
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      {doc.category}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-blue-600 transition">
                      {doc.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {doc.fileSize} • {doc.uploadedAt}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {doc.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="rounded-md bg-slate-50 px-1.5 py-0.5 text-[9px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-2 dark:border-slate-800">
                  <span className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                    <Lock className="h-3 w-3" />
                    Cloud Encrypted
                  </span>
                  <button
                    onClick={() => onDeleteDocument(doc.id)}
                    className="rounded-lg p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-slate-800"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Upload & Parse Sub-Tab */}
      {activeSubTab === 'upload' && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="rounded-3xl border-2 border-dashed border-blue-300 bg-blue-50/50 p-8 text-center dark:border-blue-900 dark:bg-blue-950/20 space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
              <UploadCloud className="h-7 w-7" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Drag & Drop or Click to Upload MNC Resume
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Supports PDF, DOCX, TXT up to 25MB. Instant ATS parsing and keyword gap extraction.
              </p>
            </div>

            <label
              htmlFor="main-file-upload-input"
              className="cursor-pointer inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-blue-500 transition"
            >
              <FileCheck className="h-4 w-4" />
              <span>Select File from Device</span>
            </label>
            <input
              id="main-file-upload-input"
              type="file"
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-850 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              What our ATS Parser verifies:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                <span>Tier-1 Tech Stack Taxonomy</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                <span>Quantified Google XYZ Metrics</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                <span>System Design & Scale Keywords</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                <span>Automated Section Formatting</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
