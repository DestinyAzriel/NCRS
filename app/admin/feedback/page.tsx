'use client';

import React, { useEffect, useState } from 'react';
import { getFeedback, updateFeedbackStatus, getStoredUser } from '@/lib/api-client';
import { MessageSquare, ShieldAlert, CheckCircle2, AlertCircle, Clock, Check, AlertTriangle } from 'lucide-react';

export default function AdminFeedbackPage() {
  const [feedback, setFeedback] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const data = await getFeedback();
      setFeedback(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setUser(getStoredUser());
    fetchItems();
  }, []);

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await updateFeedbackStatus(id, status);
      setSuccess(`Status marked as ${status}.`);
      fetchItems();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-station-border pb-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-station-ink">
            Feedback & Complaints Inbox
          </h1>
          <p className="text-xs text-station-subtle font-sans mt-0.5">
            Public listener submissions, song requests, community inquiries, and formal complaints subject to MACRA & Media Council oversight.
          </p>
        </div>
      </div>

      {/* Regulatory Context Notice */}
      <div className="bg-station-sand/40 border border-station-border p-3.5 rounded flex items-start gap-2.5 text-xs text-station-subtle font-sans">
        <ShieldAlert className="w-4 h-4 text-accent-live shrink-0 mt-0.5" />
        <div>
          <strong className="text-station-ink">Regulatory Compliance Requirement:</strong> All editorial complaints must be logged, addressed by station management, and retained for regulatory inspection under the Media Council of Malawi and MACRA Broadcasting Regulations.
        </div>
      </div>

      {success && (
        <div className="p-3 rounded bg-accent-community/10 border border-accent-community/30 text-xs text-accent-community font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{success}</span>
        </div>
      )}

      {/* Inbox Submissions List */}
      <div className="bg-white rounded-lg border border-station-border shadow-sm divide-y divide-station-border/60 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-station-subtle font-sans">
            Loading submissions...
          </div>
        ) : feedback.length === 0 ? (
          <div className="p-8 text-center text-xs text-station-subtle font-sans">
            No submissions in the inbox yet. Test submissions sent from the public website will appear here in real time.
          </div>
        ) : (
          feedback.map((item) => (
            <div key={item.id} className="p-5 hover:bg-station-sand/20 transition-colors space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-station-ink text-sm font-sans">
                    {item.sender_name || 'Anonymous Listener'}
                  </span>
                  {item.phone_or_email && (
                    <span className="text-xs text-station-subtle font-mono">
                      ({item.phone_or_email})
                    </span>
                  )}
                  {item.is_urgent && (
                    <span className="px-2 py-0.5 rounded bg-accent-live/20 text-accent-live text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      <span>Urgent</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 rounded bg-station-sand text-station-ink text-[11px] font-medium font-sans">
                    {item.category}
                  </span>
                  <span className="text-xs text-station-subtle font-mono">
                    {new Date(item.created_at).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="text-xs text-station-ink leading-relaxed font-sans bg-station-bg p-3 rounded border border-station-border/60">
                {item.message}
              </div>

              <div className="flex items-center justify-between pt-1 text-xs font-sans">
                <div className="flex items-center gap-2">
                  <span className="text-station-subtle">Current Status:</span>
                  <span
                    className={`font-semibold capitalize px-2 py-0.5 rounded text-[11px] ${
                      item.status === 'resolved'
                        ? 'bg-accent-community/20 text-accent-community'
                        : item.status === 'reviewed'
                        ? 'bg-accent-gold/20 text-accent-gold'
                        : item.status === 'escalated_macra'
                        ? 'bg-accent-live/20 text-accent-live'
                        : 'bg-station-sand text-station-ink'
                    }`}
                  >
                    {item.status.replace('_', ' ')}
                  </span>
                </div>

                {user?.role === 'manager' && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleStatusChange(item.id, 'reviewed')}
                      className="px-2.5 py-1 rounded bg-station-sand hover:bg-station-sand/80 text-station-ink text-[11px] font-medium"
                    >
                      Mark Reviewed
                    </button>
                    <button
                      onClick={() => handleStatusChange(item.id, 'resolved')}
                      className="px-2.5 py-1 rounded bg-accent-community hover:bg-accent-community/90 text-white text-[11px] font-semibold"
                    >
                      Mark Resolved
                    </button>
                    <button
                      onClick={() => handleStatusChange(item.id, 'escalated_macra')}
                      className="px-2.5 py-1 rounded bg-accent-live/10 hover:bg-accent-live/20 text-accent-live text-[11px] font-semibold"
                    >
                      Escalate to MACRA
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
