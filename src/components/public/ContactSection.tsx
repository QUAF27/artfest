import React, { useState } from 'react';
import { useFest } from '../../context/FestContext';
import { Mail, Phone, MapPin, Send, CheckCircle2, ShieldCheck } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const { currentFestival, submitContactMessage, language } = useFest();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    submitContactMessage({
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim() || 'General Festival Inquiry',
      message: message.trim()
    });

    setSubmitted(true);
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-neutral-900">
          Festival Secretariat & Help Desk
        </h2>
        <p className="text-xs sm:text-sm text-neutral-500 mt-1">
          Reach out to the organizing committee, technical desks, or submit grievance queries
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Contact Info Cards */}
        <div className="space-y-4">
          <div className="p-5 bg-white rounded-xl border border-neutral-200 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="text-xs font-semibold text-neutral-400 uppercase">Headquarters</div>
            <div className="text-sm font-bold text-neutral-900">{currentFestival.venue}</div>
            <div className="text-xs text-neutral-500">{currentFestival.location}</div>
          </div>

          <div className="p-5 bg-white rounded-xl border border-neutral-200 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Phone className="w-4 h-4" />
            </div>
            <div className="text-xs font-semibold text-neutral-400 uppercase">Helpline Desk</div>
            <div className="text-sm font-bold text-neutral-900">{currentFestival.contactPhone}</div>
            <div className="text-xs text-neutral-500">Available 08:00 AM - 10:00 PM during fest days</div>
          </div>

          <div className="p-5 bg-white rounded-xl border border-neutral-200 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Mail className="w-4 h-4" />
            </div>
            <div className="text-xs font-semibold text-neutral-400 uppercase">Official Email</div>
            <div className="text-sm font-bold text-neutral-900">{currentFestival.contactEmail}</div>
            <div className="text-xs text-neutral-500">Directly routed to the central secretariat</div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-2 bg-white rounded-2xl border border-neutral-200 p-6 sm:p-8 shadow-sm">
          {submitted ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-neutral-900">Inquiry Logged Successfully</h3>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                Your message has been safely recorded in the Festival Secretariat Inbox. The relevant coordinator will review your request.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 px-4 py-2 text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Salim K."
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">Subject / Query Topic</label>
                <input
                  type="text"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  placeholder="e.g. Clarification on Stage 1 accompaniment instruments"
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">Detailed Message *</label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Please state your query, including chest number or programme code if relevant..."
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-[11px] text-neutral-400">
                  Protected under festival privacy guidelines
                </span>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Inquiry</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
