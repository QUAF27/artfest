import React, { useState } from 'react';
import { useFest } from '../../context/FestContext';
import { Newspaper, Bell, Image, Download, Mail, Plus, Trash2, CheckCircle2 } from 'lucide-react';

export const ContentManager: React.FC = () => {
  const { 
    currentFestival, news, announcements, gallery, downloads, 
    contactMessages, updateMessageStatus 
  } = useFest();

  const [activeSubTab, setActiveSubTab] = useState<'news' | 'announcements' | 'messages'>('messages');

  const festNews = news.filter(n => n.festivalId === currentFestival.id);
  const festAnnouncements = announcements.filter(a => a.festivalId === currentFestival.id);
  const festMessages = contactMessages.filter(m => m.festivalId === currentFestival.id);

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-neutral-900 flex items-center gap-2">
          <Newspaper className="w-5 h-5 text-amber-600" />
          <span>Website Content, Notices & Secretariat Inbox</span>
        </h2>
        <p className="text-xs text-neutral-500 mt-0.5">
          Publish public news bulletins, urgent venue banners, and manage visitor inquiries
        </p>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-1 p-1 bg-neutral-200/70 rounded-lg text-xs w-fit">
        <button
          onClick={() => setActiveSubTab('messages')}
          className={`px-3.5 py-1.5 font-medium rounded-md transition-colors ${
            activeSubTab === 'messages' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          Inquiries Inbox ({festMessages.filter(m => m.status === 'unread').length} unread)
        </button>
        <button
          onClick={() => setActiveSubTab('announcements')}
          className={`px-3.5 py-1.5 font-medium rounded-md transition-colors ${
            activeSubTab === 'announcements' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          Announcements ({festAnnouncements.length})
        </button>
        <button
          onClick={() => setActiveSubTab('news')}
          className={`px-3.5 py-1.5 font-medium rounded-md transition-colors ${
            activeSubTab === 'news' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          Press Releases ({festNews.length})
        </button>
      </div>

      {/* Sub Tab: Messages Inbox */}
      {activeSubTab === 'messages' && (
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-xs">
          <div className="p-4 bg-neutral-50 border-b border-neutral-200 flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
              Secretariat Inquiries & Grievances
            </span>
            <span className="text-xs text-neutral-400">{festMessages.length} total received</span>
          </div>

          <div className="divide-y divide-neutral-100">
            {festMessages.map(msg => (
              <div key={msg.id} className="p-4 hover:bg-neutral-50 transition-colors space-y-2">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-neutral-900 text-sm">{msg.name}</span>
                      <span className="text-xs text-neutral-400">({msg.email})</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        msg.status === 'unread'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-neutral-100 text-neutral-600'
                      }`}>
                        {msg.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-neutral-700 mt-1">
                      Subject: {msg.subject}
                    </div>
                  </div>

                  <div className="text-[11px] text-neutral-400 shrink-0">
                    {new Date(msg.date).toLocaleDateString()}
                  </div>
                </div>

                <p className="text-xs text-neutral-600 leading-relaxed bg-neutral-50 p-3 rounded-lg border border-neutral-100">
                  {msg.message}
                </p>

                <div className="flex justify-end gap-2 pt-1 text-xs">
                  {msg.status !== 'read' && (
                    <button
                      onClick={() => updateMessageStatus(msg.id, 'read')}
                      className="px-2.5 py-1 text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded font-medium"
                    >
                      Mark as Read
                    </button>
                  )}
                  {msg.status !== 'replied' && (
                    <button
                      onClick={() => updateMessageStatus(msg.id, 'replied')}
                      className="px-2.5 py-1 text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded font-medium"
                    >
                      Mark Replied
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub Tab: Announcements */}
      {activeSubTab === 'announcements' && (
        <div className="space-y-4">
          <div className="space-y-3">
            {festAnnouncements.map(ann => (
              <div key={ann.id} className="p-4 rounded-xl border bg-white border-neutral-200 flex items-start justify-between gap-4 shadow-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-100 text-amber-800">
                      {ann.priority}
                    </span>
                    <h4 className="text-sm font-bold text-neutral-900">{ann.title}</h4>
                  </div>
                  <p className="text-xs text-neutral-600 leading-relaxed">{ann.message}</p>
                </div>
                <div className="text-[11px] text-neutral-400 shrink-0">{ann.date}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub Tab: News */}
      {activeSubTab === 'news' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {festNews.map(item => (
              <div key={item.id} className="p-4 rounded-xl border bg-white border-neutral-200 shadow-xs space-y-2">
                <div className="text-[10px] text-neutral-400">{item.date} · {item.author}</div>
                <h4 className="text-sm font-bold text-neutral-900">{item.title}</h4>
                <p className="text-xs text-neutral-600 leading-relaxed">{item.excerpt}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
