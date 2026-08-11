import React, { useState } from 'react';
import { 
  FolderGit2, ExternalLink, Star, Image, Sparkles, 
  Layers, X, ChevronRight, Eye 
} from 'lucide-react';

export default function PortfolioSection({ projects, galleryPhotos }) {
  const [activeTab, setActiveTab] = useState('projects');
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 mb-12">
      
      {/* Tab Switcher (Projects vs Photos) */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Portfolio & Media Gallery
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Featured open-source apps, digital tools, and creative photography.
          </p>
        </div>

        <div className="flex items-center gap-1 bg-slate-200/80 dark:bg-slate-800 p-1 rounded-2xl border border-slate-300/60 dark:border-slate-700 shrink-0">
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'projects'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Projects ({projects?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('gallery')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'gallery'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Gallery ({galleryPhotos?.length || 0})
          </button>
        </div>
      </div>

      {/* Projects Grid */}
      {activeTab === 'projects' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {projects.map((proj) => (
            <div 
              key={proj.id}
              className="group bg-white dark:bg-slate-900/90 rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl flex flex-col justify-between"
            >
              <div>
                {/* Image Header */}
                <div className="h-36 w-full overflow-hidden relative">
                  <img 
                    src={proj.image} 
                    alt={proj.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md text-amber-400 text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-400" />
                    <span>{proj.stars}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                    {proj.category}
                  </span>
                  <h3 className="font-heading font-bold text-slate-900 dark:text-white text-base mt-0.5 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {proj.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-2">
                    {proj.description}
                  </p>

                  {/* Tech Tags */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {proj.tags?.map((tag) => (
                      <span key={tag} className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Demo Link */}
              <div className="p-4 pt-0">
                <a
                  href={proj.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5"
                >
                  <span>Explore Demo</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Gallery Grid */}
      {activeTab === 'gallery' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {galleryPhotos.map((photo) => (
            <div 
              key={photo.id}
              onClick={() => setSelectedPhoto(photo)}
              className="group cursor-pointer bg-white dark:bg-slate-900/90 rounded-2xl overflow-hidden relative h-48 border border-slate-200/80 dark:border-slate-800"
            >
              <img 
                src={photo.url} 
                alt={photo.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <h4 className="text-xs font-bold text-white">{photo.title}</h4>
                <p className="text-[10px] text-slate-300">{photo.caption}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal for Gallery */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-2xl w-full glass-card p-4 rounded-3xl bg-slate-900 text-white">
            <button 
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-slate-800 text-slate-300 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <img src={selectedPhoto.url} alt={selectedPhoto.title} className="w-full max-h-[70vh] object-contain rounded-2xl" />
            <div className="mt-4">
              <h3 className="font-heading text-lg font-bold">{selectedPhoto.title}</h3>
              <p className="text-xs text-slate-400 mt-1">{selectedPhoto.caption}</p>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
