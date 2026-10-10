import React, { useState } from 'react';
import { useFest } from '../../context/FestContext';
import { Image, Maximize2, X, Filter } from 'lucide-react';

export const GallerySection: React.FC = () => {
  const { currentFestival, gallery, language } = useFest();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activePhoto, setActivePhoto] = useState<string | null>(null);

  const festGallery = gallery.filter(g => g.festivalId === currentFestival.id);
  const categories = Array.from(new Set(festGallery.map(g => g.category)));

  const filtered = selectedCategory === 'all'
    ? festGallery
    : festGallery.filter(g => g.category === selectedCategory);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900 flex items-center gap-2">
            <Image className="w-6 h-6 text-amber-600" />
            <span>{language === 'ml' ? 'ഫോട്ടോ ഗാലറി' : 'Festival Photo Gallery'}</span>
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Glimpses of vibrant performances, classical arts, ceremonies, and championship celebrations
          </p>
        </div>

        {/* Category filter */}
        <div className="flex items-center gap-1 p-1 bg-neutral-100 rounded-lg text-xs overflow-x-auto">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 font-medium rounded-md whitespace-nowrap transition-colors ${
              selectedCategory === 'all' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            All Moments
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 font-medium rounded-md whitespace-nowrap transition-colors ${
                selectedCategory === cat ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Photo Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(item => (
          <div
            key={item.id}
            className="group relative rounded-xl overflow-hidden bg-neutral-900 border border-neutral-200 shadow-sm aspect-4/3 cursor-pointer"
            onClick={() => setActivePhoto(item.imageUrl)}
          >
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4 text-white">
              <span className="text-[11px] font-semibold text-amber-300 uppercase tracking-wider">{item.category}</span>
              <h4 className="text-sm font-bold text-white leading-snug">{item.title}</h4>
              <span className="text-[10px] text-neutral-300 mt-1">{item.date}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {activePhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setActivePhoto(null)}
        >
          <button
            onClick={() => setActivePhoto(null)}
            className="absolute top-6 right-6 text-white/70 hover:text-white p-2 rounded-full bg-neutral-800"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={activePhoto}
            alt="Fullscreen view"
            className="max-w-full max-h-[85vh] rounded-lg shadow-2xl object-contain"
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};
