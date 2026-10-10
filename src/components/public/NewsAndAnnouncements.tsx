import React, { useState } from 'react';
import { useFest } from '../../context/FestContext';
import { Bell, Newspaper, Calendar, User, ArrowRight } from 'lucide-react';

export const NewsAndAnnouncements: React.FC = () => {
  const { currentFestival, news, announcements, language } = useFest();
  const [activeTab, setActiveTab] = useState<'all' | 'news' | 'announcements'>('all');

  const festNews = news.filter(n => n.festivalId === currentFestival.id && n.published);
  const festAnnouncements = announcements.filter(a => a.festivalId === currentFestival.id && a.active);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-neutral-900 flex items-center gap-2">
          <Newspaper className="w-6 h-6 text-amber-600" />
          <span>{language === 'ml' ? 'വാർത്തകളും ഔദ്യോഗിക അറിയിപ്പുകളും' : 'News & Official Announcements'}</span>
        </h2>
        <p className="text-xs sm:text-sm text-neutral-500 mt-1">
          Stay updated with competition reports, time shifts, and general festival alerts
        </p>
      </div>

      {/* Announcements Banner Section */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-neutral-700 uppercase tracking-wider flex items-center gap-1.5">
          <Bell className="w-4 h-4 text-amber-600" />
          <span>Active Notices</span>
        </h3>

        <div className="space-y-2.5">
          {festAnnouncements.map(ann => (
            <div
              key={ann.id}
              className={`p-4 rounded-xl border flex items-start justify-between gap-4 ${
                ann.priority === 'urgent'
                  ? 'bg-amber-50/70 border-amber-300'
                  : ann.priority === 'high'
                  ? 'bg-blue-50/60 border-blue-200'
                  : 'bg-white border-neutral-200'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    ann.priority === 'urgent'
                      ? 'bg-amber-600 text-white'
                      : 'bg-neutral-200 text-neutral-700'
                  }`}>
                    {ann.priority}
                  </span>
                  <span className="text-sm font-bold text-neutral-900">{ann.title}</span>
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed">{ann.message}</p>
              </div>
              <div className="text-[11px] text-neutral-400 shrink-0 font-medium">
                {ann.date}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured News Articles */}
      <div className="space-y-4 pt-4 border-t border-neutral-200">
        <h3 className="text-sm font-semibold text-neutral-700 uppercase tracking-wider">
          Festival Highlights & Press Releases
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {festNews.map(item => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-sm flex flex-col justify-between"
            >
              {item.imageUrl && (
                <div className="aspect-video w-full overflow-hidden bg-neutral-100">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}

              <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-neutral-400">
                    <span>{item.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{item.date}</span>
                    <span aria-hidden="true">·</span>
                    <span>By {item.author}</span>
                  </div>

                  <h4 className="text-lg font-bold text-neutral-900 leading-snug">
                    {item.title}
                  </h4>

                  <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                    {item.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
