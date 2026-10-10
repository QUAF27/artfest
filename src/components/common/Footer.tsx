import React from 'react';
import { useFest } from '../../context/FestContext';
import { Trophy, Mail, Phone, MapPin, ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  setCurrentView: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentView }) => {
  const { currentFestival, language } = useFest();

  return (
    <footer className="bg-neutral-900 text-neutral-400 border-t border-neutral-800 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand & Edition */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-lg">
              <div className="w-7 h-7 rounded bg-amber-600 flex items-center justify-center text-white">
                <Trophy className="w-4 h-4" />
              </div>
              <span>ArtsFest Pro</span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              {currentFestival.name} · {currentFestival.edition}
            </p>
            <p className="text-xs text-neutral-500 italic">
              "{currentFestival.theme}"
            </p>
            <div className="text-xs text-neutral-500 pt-2 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Official Festival Management System</span>
            </div>
          </div>

          {/* Public Portal Navigation */}
          <div>
            <h4 className="text-xs font-semibold text-neutral-200 uppercase tracking-wider mb-3">
              {language === 'ml' ? 'പ്രധാന ലിങ്കുകൾ' : 'Festival Hub'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setCurrentView('leaderboard')} className="hover:text-white transition-colors">
                  {language === 'ml' ? 'പോയിന്റ് നില' : 'Points Leaderboard'}
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('results')} className="hover:text-white transition-colors">
                  {language === 'ml' ? 'പ്രഖ്യാപിച്ച ഫലങ്ങൾ' : 'Published Results'}
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('schedule')} className="hover:text-white transition-colors">
                  {language === 'ml' ? 'സമയക്രമവും വേദികളും' : 'Event Schedule & Stages'}
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('my-result')} className="hover:text-white transition-colors">
                  {language === 'ml' ? 'ചെസ്റ്റ് നമ്പർ തിരച്ചിൽ' : 'My Result & Candidate Profile'}
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('cert-verify')} className="hover:text-white transition-colors">
                  {language === 'ml' ? 'സർട്ടിഫിക്കറ്റ് പരിശോധന' : 'Certificate Verification'}
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Access */}
          <div>
            <h4 className="text-xs font-semibold text-neutral-200 uppercase tracking-wider mb-3">
              {language === 'ml' ? 'ഡൗൺലോഡുകളും വാർത്തകളും' : 'Media & Downloads'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setCurrentView('news')} className="hover:text-white transition-colors">
                  {language === 'ml' ? 'വാർത്തകളും അറിയിപ്പുകളും' : 'News & Announcements'}
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('gallery')} className="hover:text-white transition-colors">
                  {language === 'ml' ? 'ഫോട്ടോ ഗാലറി' : 'Photo Gallery'}
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('downloads')} className="hover:text-white transition-colors">
                  {language === 'ml' ? 'നിയമാവലി & ഫോമുകൾ' : 'Official Rulebook & Forms'}
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('contact')} className="hover:text-white transition-colors">
                  {language === 'ml' ? 'സഹായ കേന്ദ്രം / പരാതികൾ' : 'Help Desk & Contact'}
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('privacy')} className="hover:text-white transition-colors">
                  Privacy Policy & Festival Terms
                </button>
              </li>
            </ul>
          </div>

          {/* Venue & Help Desk */}
          <div>
            <h4 className="text-xs font-semibold text-neutral-200 uppercase tracking-wider mb-3">
              {language === 'ml' ? 'സഹായ കേന്ദ്രം' : 'Venue & Help Desk'}
            </h4>
            <div className="space-y-2.5 text-xs text-neutral-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>{currentFestival.venue}, {currentFestival.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                <span>{currentFestival.contactPhone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-500 shrink-0" />
                <span>{currentFestival.contactEmail}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div>
            © {new Date().getFullYear()} ArtsFest Pro. All festival data, scores, and certificates are protected.
          </div>
          <div className="flex items-center gap-4">
            <span>Academic Year {currentFestival.academicYear}</span>
            <span>·</span>
            <button onClick={() => setCurrentView('admin-overview')} className="hover:text-neutral-300">
              Control Panel
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
