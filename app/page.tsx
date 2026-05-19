"use client";

import { useState } from "react";
import axios from "axios";
import { useUser, SignInButton, UserButton, useAuth } from "@clerk/nextjs";

// ── Logo ──────────────────────────────────────────────────────────────────────

function QueryDocLogo({ size = 48 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="qd-bg" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4f46e5" />
          <stop offset="0.55" stopColor="#7c3aed" />
          <stop offset="1" stopColor="#0891b2" />
        </linearGradient>
        <linearGradient id="qd-lens" x1="28" y1="30" x2="44" y2="46" gradientUnits="userSpaceOnUse">
          <stop stopColor="#22d3ee" />
          <stop offset="1" stopColor="#818cf8" />
        </linearGradient>
      </defs>

      {/* Rounded background */}
      <rect width="48" height="48" rx="13" fill="url(#qd-bg)" />

      {/* Document */}
      <rect x="10" y="7" width="20" height="26" rx="2.5" fill="white" opacity="0.92" />
      {/* Folded corner */}
      <path d="M24 7 L30 7 L30 13 L24 13 Z" fill="#a5b4fc" opacity="0.55" />
      <path d="M24 7 L30 13 L24 13 Z" fill="white" opacity="0.45" />
      {/* Text lines */}
      <rect x="13.5" y="18" width="11" height="1.8" rx="0.9" fill="#6366f1" opacity="0.65" />
      <rect x="13.5" y="22.5" width="14" height="1.8" rx="0.9" fill="#6366f1" opacity="0.45" />
      <rect x="13.5" y="27" width="8" height="1.8" rx="0.9" fill="#6366f1" opacity="0.3" />

      {/* Magnifying glass backing */}
      <circle cx="35" cy="37" r="9.5" fill="#0f0c29" opacity="0.6" />
      {/* Lens ring */}
      <circle cx="34" cy="36" r="5" stroke="url(#qd-lens)" strokeWidth="2.2" fill="none" />
      {/* Handle */}
      <line x1="37.8" y1="39.8" x2="41.5" y2="43.5"
        stroke="url(#qd-lens)" strokeWidth="2.4" strokeLinecap="round" />
      {/* Inner sparkle */}
      <circle cx="32.5" cy="34.5" r="1.1" fill="white" opacity="0.45" />
    </svg>
  );
}

// ── Icons ─────────────────────────────────────────────────────────────────────

const UploadCloudIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 16 12 12 8 16" />
    <line x1="12" y1="12" x2="12" y2="21" />
    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
  </svg>
);

const FileTextIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
    stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);

const LayersIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
    stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 2 7 12 12 22 7 12 2" />
    <polyline points="2 17 12 22 22 17" />
    <polyline points="2 12 12 17 22 12" />
  </svg>
);

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const SendIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
    stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const SparklesIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="#67e8f9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3 L13.5 8.5 L19 10 L13.5 11.5 L12 17 L10.5 11.5 L5 10 L10.5 8.5 Z" />
    <path d="M5 3 L5.8 5.2 L8 6 L5.8 6.8 L5 9 L4.2 6.8 L2 6 L4.2 5.2 Z" />
    <path d="M19 15 L19.6 16.4 L21 17 L19.6 17.6 L19 19 L18.4 17.6 L17 17 L18.4 16.4 Z" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const SpinnerIcon = () => (
  <svg className="animate-spin-slow" width="16" height="16" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.25)" strokeWidth="2.5" />
    <path d="M12 2 A10 10 0 0 1 22 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

// ── Background orbs ───────────────────────────────────────────────────────────

function BackgroundOrbs() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden>
      <div className="absolute -top-32 left-1/4 w-[520px] h-[520px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(79,70,229,0.14) 0%, transparent 70%)" }} />
      <div className="absolute -bottom-32 right-1/4 w-[440px] h-[440px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)" }} />
      <div className="absolute top-1/2 -left-20 w-[300px] h-[300px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(8,145,178,0.08) 0%, transparent 70%)" }} />
      {/* Grid */}
      <div className="absolute inset-0 opacity-[0.025]" style={{
        backgroundImage:
          "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
        backgroundSize: "44px 44px",
      }} />
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function Home() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const { isSignedIn } = useUser();
  const { getToken } = useAuth();

  const [file, setFile] = useState<File | null>(null);
  const [docId, setDocId] = useState<string>("");
  const [question, setQuestion] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [sources, setSources] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [embedLoading, setEmbedLoading] = useState(false);

  const handleEmbed = async () => {
    if (!file) return;
    setEmbedLoading(true);
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = await getToken({ skipCache: true });
      const response = await axios.post(`${API_URL}/embed`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDocId(response.data.doc_id);
      setAnswer(`Document embedded successfully. You can now ask questions about it.`);
      setSources([]);
    } catch (error: any) {
      const detail = error.response?.data?.detail || error.message || "Unknown error";
      setAnswer(`Error: ${detail}`);
    } finally {
      setEmbedLoading(false);
      setLoading(false);
    }
  };

  const handleAsk = async () => {
    if (!question.trim()) return;
    setLoading(true);
    try {
      const token = await getToken({ skipCache: true });
      const response = await axios.post(
        `${API_URL}/ask`,
        { question, doc_id: docId || undefined },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAnswer(response.data.answer);
      setSources(response.data.sources.map((s: any) => s.text));
    } catch (error: any) {
      const detail = error.response?.data?.detail || error.message || "Unknown error";
      setAnswer(`Error: ${detail}`);
      setSources([]);
    } finally {
      setLoading(false);
    }
  };

  // ── Sign-in view ─────────────────────────────────────────────────────────

  if (!isSignedIn) {
    return (
      <main className="relative min-h-screen overflow-hidden flex items-center justify-center"
        style={{ background: "#080812" }}>
        <BackgroundOrbs />

        <div className="relative z-10 flex flex-col items-center gap-7 p-10 rounded-3xl glass
          shadow-[0_0_60px_rgba(99,102,241,0.07)] max-w-sm w-full mx-4 animate-fade-in-up">

          {/* Logo with float + glow */}
          <div className="animate-float animate-glow-pulse">
            <QueryDocLogo size={68} />
          </div>

          {/* Wordmark */}
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight gradient-text mb-2">
              QueryDoc
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed">
              Upload a document. Ask anything.<br />
              Get instant, AI-powered answers.
            </p>
          </div>

          {/* Feature pills */}
          <div className="flex gap-2 flex-wrap justify-center">
            {[
              { label: "PDF & DOCX", color: "indigo" },
              { label: "AI-Powered", color: "violet" },
              { label: "Instant", color: "cyan" },
            ].map(({ label, color }) => (
              <span key={label} className="px-3 py-1 rounded-full text-xs font-medium"
                style={{
                  background: color === "indigo" ? "rgba(99,102,241,0.12)"
                    : color === "violet" ? "rgba(139,92,246,0.12)"
                    : "rgba(34,211,238,0.10)",
                  color: color === "indigo" ? "#a5b4fc"
                    : color === "violet" ? "#c4b5fd"
                    : "#67e8f9",
                  border: `1px solid ${color === "indigo" ? "rgba(99,102,241,0.22)"
                    : color === "violet" ? "rgba(139,92,246,0.22)"
                    : "rgba(34,211,238,0.18)"}`,
                }}>
                {label}
              </span>
            ))}
          </div>

          {/* Sign-in button */}
          <SignInButton mode="modal">
            <button className="btn-primary w-full py-3.5 px-6 rounded-xl text-white
              font-semibold text-sm tracking-wide cursor-pointer">
              Get Started — Sign In
            </button>
          </SignInButton>

          <p className="text-xs text-slate-600">Secured by Clerk authentication</p>
        </div>
      </main>
    );
  }

  // ── App view ─────────────────────────────────────────────────────────────

  return (
    <main className="relative min-h-screen" style={{ background: "#080812", color: "#f1f5f9" }}>
      <BackgroundOrbs />

      <div className="relative z-10 max-w-2xl mx-auto px-4 pt-6 pb-16 flex flex-col gap-5 animate-fade-in">

        {/* Header */}
        <header className="flex justify-between items-center py-1">
          <div className="flex items-center gap-3">
            <QueryDocLogo size={38} />
            <div>
              <p className="text-base font-bold gradient-text tracking-tight leading-tight">
                QueryDoc
              </p>
              <p className="text-[11px] text-slate-500 leading-tight">AI Document Intelligence</p>
            </div>
          </div>
          <UserButton />
        </header>

        {/* Divider */}
        <div className="h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.25), transparent)" }} />

        {/* Upload card */}
        <section
          className={`glass rounded-2xl p-5 glass-hover transition-all duration-300 ${
            isDragging ? "border-indigo-500/40 shadow-[0_0_30px_rgba(99,102,241,0.12)]" : ""
          }`}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            const dropped = e.dataTransfer.files[0];
            if (dropped) setFile(dropped);
          }}
        >
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: "rgba(99,102,241,0.15)" }}>
              <UploadCloudIcon />
            </div>
            <span className="font-semibold text-slate-200 text-sm">Upload Document</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            <label className="flex-1 flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl
              cursor-pointer transition-all duration-200 group"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLLabelElement).style.background = "rgba(255,255,255,0.06)";
                (e.currentTarget as HTMLLabelElement).style.borderColor = "rgba(99,102,241,0.3)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLLabelElement).style.background = "rgba(255,255,255,0.03)";
                (e.currentTarget as HTMLLabelElement).style.borderColor = "rgba(255,255,255,0.07)";
              }}
            >
              <FileTextIcon />
              <span className="text-xs text-slate-400 truncate">
                {file ? file.name : "Choose PDF or DOCX…"}
              </span>
              <input
                type="file"
                accept=".pdf,.docx"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="hidden"
              />
            </label>

            <button
              onClick={handleEmbed}
              disabled={!file || loading}
              className="btn-primary px-5 py-2.5 rounded-xl text-white text-xs font-semibold
                flex items-center justify-center gap-2 whitespace-nowrap min-w-[148px]"
            >
              {embedLoading ? (
                <><SpinnerIcon /> Processing…</>
              ) : (
                <><LayersIcon /> Upload & Embed</>
              )}
            </button>
          </div>

          {file && (
            <p className="mt-2.5 text-[11px] text-slate-500">
              {(file.size / 1024 / 1024).toFixed(2)} MB ·{" "}
              {file.name.split(".").pop()?.toUpperCase() ?? "FILE"}
            </p>
          )}
          {!file && (
            <p className="mt-2.5 text-[11px] text-slate-600 text-center">
              or drag &amp; drop a file here
            </p>
          )}
        </section>

        {/* Question card */}
        <section className="glass rounded-2xl p-5">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: "rgba(139,92,246,0.15)" }}>
              <SearchIcon />
            </div>
            <span className="font-semibold text-slate-200 text-sm">Ask a Question</span>
          </div>

          <div className="flex gap-2.5">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !loading && handleAsk()}
              placeholder="What does this document say about…?"
              className="flex-1 px-4 py-3 rounded-xl text-sm input-field"
            />
            <button
              onClick={handleAsk}
              disabled={!question.trim() || loading}
              className="btn-primary px-4 py-3 rounded-xl text-white text-xs font-semibold
                flex items-center justify-center gap-2 min-w-[80px]"
            >
              {loading && !embedLoading ? <SpinnerIcon /> : <SendIcon />}
              {loading && !embedLoading ? "…" : "Ask"}
            </button>
          </div>

          {docId && (
            <p className="mt-2.5 text-[11px] flex items-center gap-1.5" style={{ color: "rgba(129,140,248,0.65)" }}>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-400 opacity-70" />
              Document loaded · ID {docId.slice(0, 8)}…
            </p>
          )}
        </section>

        {/* Answer card */}
        {answer && (
          <section className="glass rounded-2xl p-5 animate-fade-in-up">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: "rgba(34,211,238,0.12)" }}>
                <SparklesIcon />
              </div>
              <span className="font-semibold text-slate-200 text-sm">Answer</span>
            </div>

            <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{answer}</p>

            {sources.length > 0 && (
              <details className="mt-4 group">
                <summary className="cursor-pointer text-xs text-slate-500 hover:text-slate-400
                  transition-colors select-none flex items-center gap-1.5 list-none">
                  <ChevronDownIcon />
                  {sources.length} source{sources.length > 1 ? "s" : ""} used
                </summary>
                <div className="mt-3 flex flex-col gap-2">
                  {sources.map((src, idx) => (
                    <div key={idx} className="px-3 py-2.5 rounded-xl text-xs text-slate-500
                      leading-relaxed"
                      style={{
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.06)",
                      }}>
                      <span className="font-semibold mr-1.5" style={{ color: "#818cf8" }}>
                        [{idx + 1}]
                      </span>
                      {src}
                    </div>
                  ))}
                </div>
              </details>
            )}
          </section>
        )}
      </div>
    </main>
  );
}
