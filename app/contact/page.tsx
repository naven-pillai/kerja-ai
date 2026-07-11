"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Send, MessageSquare, Building2, Briefcase, Bug, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const topics = [
  { value: "general", label: "General question", desc: "Ask me anything", icon: MessageSquare },
  { value: "employer", label: "Hiring", desc: "Post a role or hire AI/data talent", icon: Briefcase },
  { value: "partnership", label: "Partnership", desc: "Build something together", icon: Building2 },
  { value: "bug", label: "Report a bug", desc: "Found something broken", icon: Bug },
];

const inputClass =
  "w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20 focus:border-[#1D4ED8] focus:bg-white transition";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [selectedTopic, setSelectedTopic] = useState("general");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");

    const form = e.currentTarget;
    const formData = new FormData(form);

    if ((formData.get("website") as string)?.length) {
      setStatus("error");
      toast.error("Bot detected.");
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...Object.fromEntries(formData as unknown as Iterable<[string, FormDataEntryValue]>),
          topic: selectedTopic,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Something went wrong");

      setStatus("success");
      toast.success("Thanks \u2014 I\u2019ve got your message.");
      form.reset();
      setSelectedTopic("general");
    } catch (err: unknown) {
      setStatus("error");
      toast.error(err instanceof Error ? err.message : "Failed to send message.");
    }
  }

  if (status === "success") {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center px-4 py-24">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-6">
            <Mail className="w-7 h-7 text-emerald-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Message sent</h1>
          <p className="text-gray-500 text-base leading-relaxed mb-8">
            I&apos;ll get back to you within 1–2 business days.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: "radial-gradient(circle, #e5e7eb 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />
        <div className="relative max-w-3xl mx-auto px-6 pt-28 pb-14 text-center">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-[#1D4ED8] mb-4">
            Contact
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
            Let&apos;s talk
          </h1>
          <p className="text-base sm:text-lg text-gray-500 max-w-lg mx-auto leading-relaxed">
            A question about a role, hiring on Kerja-AI, a partnership, or feedback — send it over and I&apos;ll reply within 1–2 business days.
          </p>
        </div>
      </section>

      {/* Form section */}
      <section className="max-w-2xl mx-auto px-6 pb-28">
        {/* Topic selector */}
        <p className="text-sm font-medium text-gray-700 mb-3">What&apos;s this about?</p>
        <div className="grid grid-cols-2 gap-3 mb-10">
          {topics.map(({ value, label, desc, icon: Icon }) => (
            <button
              key={value}
              type="button"
              onClick={() => setSelectedTopic(value)}
              className={`flex items-start gap-4 p-5 rounded-2xl border text-left transition-all ${
                selectedTopic === value
                  ? "border-[#1D4ED8] bg-blue-50/60 ring-1 ring-[#1D4ED8]/10"
                  : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/50"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                  selectedTopic === value
                    ? "bg-[#1D4ED8]/10 text-[#1D4ED8]"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <span
                  className={`block text-sm font-semibold transition-colors ${
                    selectedTopic === value ? "text-[#1D4ED8]" : "text-gray-800"
                  }`}
                >
                  {label}
                </span>
                <span className="block text-xs text-gray-400 mt-0.5">{desc}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="space-y-6">
          <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <input
                id="name"
                name="name"
                required
                className={inputClass}
                placeholder="Your name"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className={inputClass}
                placeholder="you@company.com"
              />
            </div>
          </div>

          {selectedTopic === "employer" && (
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                Company name
              </label>
              <input
                id="company"
                name="company"
                className={inputClass}
                placeholder="Acme Corp"
              />
            </div>
          )}

          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
              Subject
            </label>
            <input
              id="subject"
              name="subject"
              className={inputClass}
              placeholder="What is this about?"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={6}
              required
              className={`${inputClass} resize-none`}
              placeholder="Tell me a bit more..."
            />
          </div>

          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full flex items-center justify-center gap-2.5 bg-[#1D4ED8] text-white text-sm font-semibold px-6 py-3.5 rounded-xl hover:bg-[#c62806] disabled:opacity-60 transition cursor-pointer"
          >
            {status === "loading" ? (
              "Sending\u2026"
            ) : (
              <>
                Send message
                <Send className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Alternative */}
        <div className="mt-10 pt-8 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-400">
            Prefer email? Reach me at{" "}
            <a
              href="mailto:info@kerja-ai.com"
              className="text-gray-600 font-medium hover:text-gray-900 transition"
            >
              info@kerja-ai.com
            </a>
          </p>
        </div>
      </section>
    </main>
  );
}
