"use client";

import { useState } from "react";
import axios from "axios";
import { useUser, SignInButton, UserButton, useAuth } from "@clerk/nextjs";

export default function Home() {
  const { isSignedIn } = useUser();
  const { getToken } = useAuth();

  const [file, setFile] = useState<File | null>(null);
  const [docId, setDocId] = useState<string>("");
  const [question, setQuestion] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [sources, setSources] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Upload & embed a document
  const handleEmbed = async () => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = await getToken();
      const response = await axios.post("http://localhost:8000/embed", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDocId(response.data.doc_id);
      setAnswer(`Document embedded! ID: ${response.data.doc_id}. You can now ask questions.`);
      setSources([]);
    } catch (error: any) {
      console.error("Embed failed:", error);
      const detail = error.response?.data?.detail || error.message || "Unknown error";
      setAnswer(`Error: ${detail}`);
    } finally {
      setLoading(false);
    }
  };

  // Ask a question
  const handleAsk = async () => {
    if (!question.trim()) return;
    setLoading(true);
    try {
      const token = await getToken();
      const response = await axios.post(
        "http://localhost:8000/ask",
        { question, doc_id: docId || undefined },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAnswer(response.data.answer);
      setSources(response.data.sources.map((s: any) => s.text));
    } catch (error: any) {
      console.error("Ask failed:", error);
      const detail = error.response?.data?.detail || error.message || "Unknown error";
      setAnswer(`Error: ${detail}`);
      setSources([]);
    } finally {
      setLoading(false);
    }
  };

  // If not signed in, show sign-in button
  if (!isSignedIn) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <h1 className="text-4xl font-bold mb-8">QueryDoc</h1>
        <SignInButton mode="modal">
          <button className="px-4 py-2 bg-blue-600 text-white rounded">
            Sign In
          </button>
        </SignInButton>
      </main>
    );
  }

  // Signed in – full app
  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-8">
      <div className="w-full flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">QueryDoc</h1>
        <UserButton />
      </div>

      <div className="flex flex-col items-center gap-4 mb-8 p-4 border rounded">
        <input
          type="file"
          accept=".pdf,.docx"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="file-input"
        />
        <button
          onClick={handleEmbed}
          disabled={!file || loading}
          className="px-4 py-2 bg-green-600 text-white rounded disabled:bg-gray-400"
        >
          {loading ? "Processing..." : "Upload & Embed"}
        </button>
      </div>

      <div className="w-full max-w-2xl flex flex-col gap-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask a question about the document..."
            className="flex-1 p-2 border rounded text-gray-900"
            onKeyDown={(e) => e.key === "Enter" && handleAsk()}
          />
          <button
            onClick={handleAsk}
            disabled={!question.trim() || loading}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
          >
            {loading ? "Asking..." : "Ask"}
          </button>
        </div>

        {answer && (
          <div className="p-4 border rounded bg-gray-50">
            <p className="font-semibold text-gray-900">Answer:</p>
            <p className="whitespace-pre-wrap text-gray-900">{answer}</p>
            {sources.length > 0 && (
              <details className="mt-4">
                <summary className="cursor-pointer text-sm text-gray-700">Sources</summary>
                {sources.map((src, idx) => (
                  <p key={idx} className="text-xs text-gray-500 mt-1">
                    [{idx + 1}] {src}
                  </p>
                ))}
              </details>
            )}
          </div>
        )}
      </div>
    </main>
  );
}