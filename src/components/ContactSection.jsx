import React, { useState } from 'react';
import { 
  Mail, Send, CheckCircle2, AlertCircle, Sparkles, 
  User, MessageSquare, Tag, Inbox
} from 'lucide-react';
import { sendContactMessage } from '../js/storage';

export default function ContactSection({ profileEmail }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: 'General Inquiry',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // { type: 'success'|'error', msg: '' }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setStatus({ type: 'error', msg: 'Please fill in your name, email, and message.' });
      return;
    }

    setLoading(true);
    setStatus(null);

    const res = await sendContactMessage(formData);
    setLoading(false);

    if (res.success) {
      setStatus({
        type: 'success',
        msg: `Message successfully sent directly to ${profileEmail || 'billalhossen.self@gmail.com'}!`
      });
      setFormData({ name: '', email: '', subject: '', category: 'General Inquiry', message: '' });
    } else {
      setStatus({ type: 'error', msg: res.error || 'Failed to send message. Please try again.' });
    }
  };

  return (
    <section id="contact-section" className="max-w-4xl mx-auto px-4 sm:px-6 mb-16 scroll-mt-24">
      <div className="bg-white dark:bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xl relative overflow-hidden">
        
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex items-center gap-2 mb-2">
          <Mail className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h2 className="font-heading text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Direct Contact Portal
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-6">
          Send a message directly to <strong className="text-slate-800 dark:text-slate-200">{profileEmail || 'billalhossen.self@gmail.com'}</strong>.
        </p>

        {status && (
          <div className={`p-4 rounded-2xl mb-6 flex items-start gap-3 border ${
            status.type === 'success' 
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-200 dark:border-emerald-800'
              : 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/60 dark:text-rose-200 dark:border-rose-800'
          }`}>
            {status.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
            )}
            <p className="text-xs sm:text-sm font-semibold">{status.msg}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Sender Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Your Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Sender Email */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Your Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Subject */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Subject
              </label>
              <input
                type="text"
                placeholder="Project proposal or inquiry"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Inquiry Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="General Inquiry">General Inquiry</option>
                <option value="Project Hiring / Consulting">Project Hiring / Consulting</option>
                <option value="Open Source Collaboration">Open Source Collaboration</option>
                <option value="Speaking / Workshop">Speaking / Workshop</option>
              </select>
            </div>
          </div>

          {/* Message Textarea */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Message Content *
            </label>
            <textarea
              required
              rows={4}
              placeholder="Type your message here..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full p-4 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <a 
              href={`mailto:${profileEmail || 'billalhossen.self@gmail.com'}`} 
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-semibold"
            >
              <Inbox className="w-3.5 h-3.5" /> Open in Mail Client
            </a>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-500/25 transition-all flex items-center gap-2 hover:scale-[1.02] active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <span>Sending...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send Direct Email</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </section>
  );
}
