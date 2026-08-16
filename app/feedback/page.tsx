'use client';

import React, { useState } from 'react';
import { MessageSquare, ShieldAlert, Send, CheckCircle2, AlertCircle, Building2, Scale } from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export default function FeedbackPage() {
  const [senderName, setSenderName] = useState('');
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [category, setCategory] = useState('General Feedback');
  const [message, setMessage] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/v1/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender_name: senderName || 'Anonymous Listener',
          phone_or_email: phoneOrEmail || null,
          category,
          message,
          is_urgent: isUrgent,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to submit feedback. Please try again.');
      }

      setSuccess(true);
      setSenderName('');
      setPhoneOrEmail('');
      setMessage('');
      setIsUrgent(false);
    } catch (err: any) {
      setError(err.message || 'An error occurred during submission.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b border-station-border pb-6">
        <div className="inline-flex items-center gap-2 text-xs font-sans font-bold text-accent-live uppercase tracking-wider mb-2">
          <MessageSquare className="w-4 h-4" />
          <span>Community Voice & Public Accountability</span>
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-bold text-station-ink">
          Feedback & Complaints Channel
        </h1>
        <p className="text-sm text-station-subtle font-sans mt-2 max-w-2xl">
          Nyanthepa Community Radio is committed to high journalistic integrity, fairness, and prompt responsiveness to our listeners in Nsanje District.
        </p>
      </div>

      {/* Main Submission Form */}
      <div className="bg-white border border-station-border rounded-lg p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <h2 className="font-display text-xl font-bold text-station-ink">
            Submit Listener Feedback or Formal Editorial Complaint
          </h2>
          <p className="text-xs text-station-subtle font-sans mt-1">
            You may choose to submit anonymously or provide your contact details if you require a formal written response from the station manager within 7 working days.
          </p>
        </div>

        {success ? (
          <div className="p-5 rounded-lg bg-accent-community/10 border border-accent-community/30 text-accent-community space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5" />
              <span>Zikomo kwambiri! Your submission has been securely logged.</span>
            </div>
            <p className="text-xs text-station-ink font-sans leading-relaxed">
              Your feedback has been routed to the Station Manager and Editorial Review Desk. If you provided contact information, our team will review the matter in accordance with the Media Council of Malawi guidelines.
            </p>
            <button
              onClick={() => setSuccess(false)}
              className="mt-2 text-xs font-bold underline text-accent-community"
            >
              Submit another feedback entry
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
            {error && (
              <div className="p-3 rounded bg-accent-live/10 border border-accent-live/30 text-xs text-accent-live font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-station-ink mb-1">
                  Your Name (Optional / Anonymous allowed)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Kondwani Phiri"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  className="w-full p-2.5 border border-station-border rounded bg-station-bg outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-station-ink mb-1">
                  Phone Number or Email (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. +265 888 123 456 or email@example.com"
                  value={phoneOrEmail}
                  onChange={(e) => setPhoneOrEmail(e.target.value)}
                  className="w-full p-2.5 border border-station-border rounded bg-station-bg outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-station-ink mb-1">
                Feedback Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2.5 border border-station-border rounded bg-station-bg outline-none font-sans text-xs"
              >
                <option value="General Feedback">General Station Feedback</option>
                <option value="Editorial Complaint">Formal Editorial / News Accuracy Complaint</option>
                <option value="Programming Suggestion">Program Schedule & Content Suggestion</option>
                <option value="Copyright Takedown">Audio Copyright / Intellectual Property Takedown</option>
                <option value="Song Request">Listener Song Request</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-station-ink mb-1">
                Detailed Message / Complaint Description *
              </label>
              <textarea
                rows={5}
                required
                placeholder="Please describe the incident, broadcast date/time, program title, or feedback in as much detail as possible..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-2.5 border border-station-border rounded bg-station-bg outline-none font-sans text-xs"
              />
            </div>

            <div className="p-3.5 bg-station-sand/40 rounded border border-station-border">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isUrgent}
                  onChange={(e) => setIsUrgent(e.target.checked)}
                  className="rounded text-accent-live focus:ring-accent-live"
                />
                <span className="font-semibold text-station-ink">
                  Mark as urgent matter (e.g. immediate flood safety advisory error or active dispute)
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-station-ink hover:bg-station-ink/90 text-white rounded font-bold shadow transition-colors disabled:opacity-50 inline-flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>{loading ? 'Submitting...' : 'Submit to Station Management'}</span>
            </button>
          </form>
        )}
      </div>

      {/* External Regulatory Escalation Notice naming MACRA and Media Council of Malawi per RFP */}
      <div className="bg-station-sand/40 border border-station-border rounded-lg p-6 sm:p-8 space-y-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-sans font-bold text-accent-community uppercase tracking-wider">
            <Scale className="w-4 h-4" />
            <span>Third-Party Regulatory Escalation Channels</span>
          </div>
          <h2 className="font-display text-2xl font-bold text-station-ink">
            Independent Regulatory Oversight
          </h2>
          <p className="text-xs text-station-subtle font-sans leading-relaxed">
            If you have submitted a formal complaint to Nyanthepa Community Radio and have not received a satisfactory resolution within 14 calendar days, you are entitled under the Malawi Communications Act and national media governance frameworks to escalate your complaint directly to our regulators:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* MACRA Card */}
          <div className="bg-white p-5 rounded-lg border border-station-border space-y-2">
            <div className="flex items-center gap-2 text-station-ink font-bold font-display text-base">
              <Building2 className="w-4 h-4 text-accent-live" />
              <span>Malawi Communications Regulatory Authority (MACRA)</span>
            </div>
            <p className="text-xs text-station-subtle font-sans leading-relaxed">
              The statutory regulator of broadcasting frequency licenses, spectrum management, and broadcasting compliance in Malawi.
            </p>
            <div className="pt-2 text-[11px] font-sans text-station-subtle space-y-1 bg-station-sand/30 p-2.5 rounded">
              <div><strong>Headquarters:</strong> MACRA House, 9 Salmin Amour Road, Ginnery Corner, Blantyre</div>
              <div><strong>Website:</strong> www.macra.mw</div>
              <div><strong>Email:</strong> dg@macra.mw / complaints@macra.mw</div>
              <div><strong>Hotline:</strong> +265 1 810 497 / Toll-Free 263</div>
            </div>
          </div>

          {/* Media Council of Malawi Card */}
          <div className="bg-white p-5 rounded-lg border border-station-border space-y-2">
            <div className="flex items-center gap-2 text-station-ink font-bold font-display text-base">
              <Scale className="w-4 h-4 text-accent-community" />
              <span>Media Council of Malawi (MCM)</span>
            </div>
            <p className="text-xs text-station-subtle font-sans leading-relaxed">
              The independent self-regulatory body overseeing media ethics, professional journalistic conduct, and the national Media Code of Ethics.
            </p>
            <div className="pt-2 text-[11px] font-sans text-station-subtle space-y-1 bg-station-sand/30 p-2.5 rounded">
              <div><strong>Secretariat:</strong> Media Council of Malawi House, Area 4, Lilongwe</div>
              <div><strong>Website:</strong> www.mediacouncilofmalawi.org</div>
              <div><strong>Email:</strong> info@mediacouncil.mw / complaints@mediacouncil.mw</div>
              <div><strong>Phone:</strong> +265 1 758 003</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
