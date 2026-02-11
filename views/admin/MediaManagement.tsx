
import React, { useState, useRef, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';
import { 
  Plus, 
  Trash2, 
  Image as ImageIcon, 
  Video, 
  Save, 
  Layout, 
  X,
  PlusCircle,
  AlertCircle,
  Upload,
  FolderOpen,
  FileVideo,
  FileImage,
  ChevronRight,
  ChevronLeft,
  Link as LinkIcon
} from '../../components/common/Icons';
import Toast, { ToastType } from '../../components/common/Toast';
import { MediaItem, LibraryItem } from '../../types';
import VideoPlayer from '../../components/common/VideoPlayer';

const MediaManagement: React.FC = () => {
  const { siteMedia, setSiteMedia, mediaLibrary, setMediaLibrary } = useStore();
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const [isLibraryModalOpen, setIsLibraryModalOpen] = useState(false);
  
  // State for tracking which part of the UI is being edited
  const [activePickerTarget, setActivePickerTarget] = useState<{ type: 'hero' | 'promo', id?: string } | null>(null);
  const [editingHeroId, setEditingHeroId] = useState<string | null>(siteMedia.heroSlides[0]?.id || null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (message: string, type: ToastType = 'success') => {
    setToast({ message, type });
  };

  const handleUpdatePromoBanner = (updates: Partial<MediaItem>) => {
    setSiteMedia(prev => ({
      ...prev,
      promoBanner: { ...prev.promoBanner, ...updates }
    }));
  };

  const handleUpdateHeroSlide = (id: string, updates: Partial<MediaItem>) => {
    setSiteMedia(prev => ({
      ...prev,
      heroSlides: prev.heroSlides.map(s => s.id === id ? { ...s, ...updates } : s)
    }));
  };

  const handleAddHeroSlide = () => {
    const newSlide: MediaItem = {
      id: `h-${Date.now()}`,
      type: 'image',
      url: '',
      title: 'New Slide Title',
      subtitle: 'New slide description goes here.',
      cta: 'Shop Now',
      link: '/top-sellers'
    };
    setSiteMedia(prev => ({
      ...prev,
      heroSlides: [...prev.heroSlides, newSlide]
    }));
    setEditingHeroId(newSlide.id);
    showToast('New hero slide added');
  };

  const handleDeleteHeroSlide = (id: string) => {
    if (siteMedia.heroSlides.length <= 1) {
      showToast('Cannot delete the last slide', 'error');
      return;
    }
    setSiteMedia(prev => ({
      ...prev,
      heroSlides: prev.heroSlides.filter(s => s.id !== id)
    }));
    if (editingHeroId === id) {
      setEditingHeroId(siteMedia.heroSlides.find(s => s.id !== id)?.id || null);
    }
    showToast('Slide removed');
  };

  const saveAll = () => {
    showToast('All changes saved and published!');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const type = file.type.startsWith('video') ? 'video' : 'image';
      
      const newItem: LibraryItem = {
        id: `lib-${Date.now()}`,
        name: file.name.split('.').slice(0, -1).join('.') || 'New Asset',
        url: dataUrl,
        type: type as 'video' | 'image',
        createdAt: new Date().toISOString().split('T')[0]
      };

      setMediaLibrary(prev => [newItem, ...prev]);
      
      const target = activePickerTarget;
      if (target?.type === 'promo') {
        handleUpdatePromoBanner({ url: newItem.url, type: newItem.type });
      } else if (target?.type === 'hero' && target.id) {
        handleUpdateHeroSlide(target.id, { url: newItem.url, type: newItem.type });
      }

      showToast('File uploaded to library');
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsDataURL(file);
  };

  const openPicker = (target: { type: 'hero' | 'promo', id?: string }) => {
    setActivePickerTarget(target);
    setIsLibraryModalOpen(true);
  };

  const selectFromLibrary = (item: LibraryItem) => {
    if (activePickerTarget?.type === 'promo') {
      handleUpdatePromoBanner({ url: item.url, type: item.type });
    } else if (activePickerTarget?.type === 'hero' && activePickerTarget.id) {
      handleUpdateHeroSlide(activePickerTarget.id, { url: item.url, type: item.type });
    }
    setIsLibraryModalOpen(false);
    setActivePickerTarget(null);
  };

  const currentHero = siteMedia.heroSlides.find(s => s.id === editingHeroId);

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-32">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*,video/*" onChange={handleFileChange} />

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-gray-800 tracking-tight">Media Manager</h1>
          <p className="text-sm text-gray-500 mt-1 font-medium">Manage your site's banners, sliders, and visual content.</p>
        </div>
        <button 
          onClick={saveAll}
          className="flex items-center gap-2 px-8 py-3 bg-[#f85606] text-white rounded-xl shadow-lg hover:bg-[#d04a05] transition-all transform active:scale-95 font-bold text-xs uppercase tracking-widest"
        >
          <Save size={18} />
          Save & Publish
        </button>
      </div>

      {/* Hero Sliders Management Section */}
      <section className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
             <div className="p-1.5 bg-gray-100 rounded-lg">
                <Layout size={18} className="text-gray-400" />
             </div>
             <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">HERO SLIDER MANAGEMENT</span>
          </div>
          <button 
            onClick={handleAddHeroSlide}
            className="flex items-center gap-2 px-4 py-2 bg-orange-50 text-[#f85606] rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-orange-100 transition-colors"
          >
            <Plus size={14} /> Add New Slide
          </button>
        </div>

        {/* Slide List (Horizontal Thumbnails) */}
        <div className="flex gap-4 mb-10 overflow-x-auto pb-4 custom-scrollbar scroll-smooth snap-x">
          {siteMedia.heroSlides.map((slide, index) => (
            <div 
              key={slide.id}
              onClick={() => setEditingHeroId(slide.id)}
              className={`relative flex-shrink-0 w-48 h-28 rounded-2xl overflow-hidden cursor-pointer border-2 transition-all group ${editingHeroId === slide.id ? 'border-[#f85606] shadow-xl scale-105' : 'border-gray-100 opacity-60 hover:opacity-100'}`}
            >
              {slide.url ? (
                slide.type === 'image' ? (
                  <img src={slide.url} className="w-full h-full object-cover" alt="slide" />
                ) : (
                  <div className="relative w-full h-full">
                    <VideoPlayer url={slide.url} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <Video size={20} className="text-white opacity-50" />
                    </div>
                  </div>
                )
              ) : (
                <div className="w-full h-full bg-gray-50 flex items-center justify-center text-gray-300 text-xs font-bold">NO MEDIA</div>
              )}
              <div className="absolute top-2 left-2 bg-black/60 text-white text-[8px] font-black px-2 py-0.5 rounded-full">#{index + 1}</div>
              <button 
                onClick={(e) => { e.stopPropagation(); handleDeleteHeroSlide(slide.id); }}
                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>

        {/* Editing Area for Current Slide */}
        {currentHero && (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 items-start border-t pt-10 animate-in fade-in slide-in-from-top-2 duration-500">
            {/* Left: Preview & Tabs */}
            <div className="xl:col-span-4 space-y-6">
              <div className="bg-gray-100/80 p-1 rounded-xl flex items-center gap-1 w-full border">
                <button 
                  onClick={() => handleUpdateHeroSlide(currentHero.id, { type: 'image' })}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${currentHero.type === 'image' ? 'bg-white text-gray-800 shadow-sm border border-gray-100' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <ImageIcon size={14} /> PHOTO
                </button>
                <button 
                  onClick={() => handleUpdateHeroSlide(currentHero.id, { type: 'video' })}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${currentHero.type === 'video' ? 'bg-[#f85606] text-white shadow-md border border-orange-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <Video size={14} /> VIDEO
                </button>
              </div>

              <div className="relative aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl border-[6px] border-white group bg-gray-900">
                {currentHero.url ? (
                  currentHero.type === 'image' ? (
                    <img src={currentHero.url} className="w-full h-full object-cover opacity-80" alt="slide-preview" />
                  ) : (
                    <VideoPlayer url={currentHero.url} className="w-full h-full object-cover opacity-80" />
                  )
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-white/20 p-8 text-center">
                    <Layout size={48} strokeWidth={1} />
                    <span className="text-[10px] font-black uppercase tracking-widest mt-4">Upload or Select Media to Preview</span>
                  </div>
                )}
                {/* Overlay Mockup */}
                <div className="absolute inset-0 flex flex-col justify-center items-start px-10 pointer-events-none z-20">
                  <h3 className="text-xl font-black text-white uppercase italic tracking-tighter leading-tight line-clamp-1 drop-shadow-lg">
                    {currentHero.title || "TITLE"}
                  </h3>
                  <p className="text-[7px] font-bold text-white/90 uppercase tracking-widest mt-1 line-clamp-2 drop-shadow">
                    {currentHero.subtitle || "SUBTITLE"}
                  </p>
                  <div className="mt-4 px-4 py-1.5 bg-white text-black text-[7px] font-black uppercase tracking-widest shadow-lg">
                    {currentHero.cta || "SHOP NOW"}
                  </div>
                </div>
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 z-30">
                  <button onClick={() => openPicker({ type: 'hero', id: currentHero.id })} className="bg-white text-gray-800 px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest">Library</button>
                  <button onClick={() => { setActivePickerTarget({ type: 'hero', id: currentHero.id }); fileInputRef.current?.click(); }} className="bg-[#f85606] text-white px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest">Upload</button>
                </div>
              </div>
            </div>

            {/* Right: Form Controls */}
            <div className="xl:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">MEDIA SOURCE</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Upload or enter URL"
                      className="flex-grow px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none text-xs font-bold text-gray-800"
                      value={currentHero.url.startsWith('data:') ? 'Local file uploaded' : currentHero.url}
                      onChange={e => handleUpdateHeroSlide(currentHero.id, { url: e.target.value })}
                    />
                    <button onClick={() => { setActivePickerTarget({ type: 'hero', id: currentHero.id }); fileInputRef.current?.click(); }} className="p-3 bg-orange-50 text-[#f85606] border border-orange-100 rounded-xl hover:bg-orange-100 transition-colors">
                      <Upload size={18} />
                    </button>
                    <button onClick={() => openPicker({ type: 'hero', id: currentHero.id })} className="p-3 bg-gray-50 text-gray-400 border border-gray-100 rounded-xl hover:bg-gray-100 transition-colors">
                      <FolderOpen size={18} />
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">SLIDE TITLE</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-4 focus:ring-[#f85606]/5 text-sm font-bold text-gray-800"
                    value={currentHero.title}
                    onChange={e => handleUpdateHeroSlide(currentHero.id, { title: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">BUTTON TEXT (CTA)</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-4 focus:ring-[#f85606]/5 text-sm font-bold text-gray-800"
                      value={currentHero.cta}
                      onChange={e => handleUpdateHeroSlide(currentHero.id, { cta: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">REDIRECT LINK</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="/top-sellers"
                        className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-4 focus:ring-[#f85606]/5 text-sm font-bold text-gray-800"
                        value={currentHero.link || ''}
                        onChange={e => handleUpdateHeroSlide(currentHero.id, { link: e.target.value })}
                      />
                      <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">SLIDE SUBTITLE</label>
                  <textarea 
                    rows={2}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-4 focus:ring-[#f85606]/5 text-sm font-medium text-gray-600 resize-none"
                    value={currentHero.subtitle}
                    onChange={e => handleUpdateHeroSlide(currentHero.id, { subtitle: e.target.value })}
                  />
                </div>
                <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100 flex gap-4">
                  <AlertCircle size={24} className="text-[#f85606] shrink-0" />
                  <div>
                    <p className="text-[10px] font-black text-orange-800 uppercase tracking-widest mb-1 italic">Pro Tip</p>
                    <p className="text-[9px] font-bold text-orange-700/80 leading-relaxed uppercase">
                      Videos make your homepage dynamic. Use 16:9 aspect ratio media for best results on the hero section.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Single Banner Management Section */}
      <section className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden p-8">
        <div className="flex items-center gap-2 mb-8">
           <div className="p-1.5 bg-gray-100 rounded-lg">
              <ImageIcon size={18} className="text-gray-400" />
           </div>
           <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">PROMO BANNER (BELOW CATEGORIES)</span>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 items-start">
          <div className="xl:col-span-4 space-y-6">
            <div className="bg-gray-100/80 p-1 rounded-xl flex items-center gap-1 w-full border">
               <button 
                onClick={() => handleUpdatePromoBanner({ type: 'image' })}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${siteMedia.promoBanner.type === 'image' ? 'bg-white text-gray-800 shadow-sm border border-gray-100' : 'text-gray-400 hover:text-gray-600'}`}
               >
                 <ImageIcon size={14} /> PHOTO
               </button>
               <button 
                onClick={() => handleUpdatePromoBanner({ type: 'video' })}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${siteMedia.promoBanner.type === 'video' ? 'bg-[#f85606] text-white shadow-md border border-orange-600' : 'text-gray-400 hover:text-gray-600'}`}
               >
                 <Video size={14} /> VIDEO
               </button>
            </div>

            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl border-[6px] border-white group bg-[#430d4b]">
              {siteMedia.promoBanner.url ? (
                siteMedia.promoBanner.type === 'image' ? (
                  <img src={siteMedia.promoBanner.url} className="w-full h-full object-cover opacity-80" alt="promo-banner" />
                ) : (
                  <VideoPlayer url={siteMedia.promoBanner.url} className="w-full h-full object-cover opacity-80" />
                )
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-800 to-purple-950">
                  <span className="text-white text-xs font-black opacity-30 italic uppercase tracking-[0.2em]">Promo Preview</span>
                </div>
              )}
              {/* Dynamic Text Overlay */}
              <div className="absolute inset-0 flex flex-col justify-center items-start px-8 pointer-events-none z-20">
                <h3 className="text-xl font-black text-white uppercase italic tracking-tighter drop-shadow-lg leading-tight">
                  {siteMedia.promoBanner.title || "BANNER TITLE"}
                </h3>
                <p className="text-[8px] font-bold text-white uppercase tracking-widest mt-1 opacity-90 drop-shadow">
                  {siteMedia.promoBanner.subtitle || "CLICK HERE TO EXPLORE & SAVE BIG"}
                </p>
              </div>
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 z-30">
                <button onClick={() => openPicker({ type: 'promo' })} className="bg-white text-gray-800 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest">Library</button>
                <button onClick={() => { setActivePickerTarget({ type: 'promo' }); fileInputRef.current?.click(); }} className="bg-[#f85606] text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest">Upload</button>
              </div>
            </div>
          </div>

          <div className="xl:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">MEDIA SOURCE</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="URL or Uploaded"
                    className="flex-grow px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none text-xs font-bold text-gray-800"
                    value={siteMedia.promoBanner.url.startsWith('data:') ? 'Local file uploaded' : siteMedia.promoBanner.url}
                    onChange={e => handleUpdatePromoBanner({ url: e.target.value })}
                  />
                  <button onClick={() => { setActivePickerTarget({ type: 'promo' }); fileInputRef.current?.click(); }} className="p-3 bg-orange-50 text-[#f85606] border border-orange-100 rounded-xl hover:bg-orange-100 transition-colors">
                    <Upload size={18} />
                  </button>
                  <button onClick={() => openPicker({ type: 'promo' })} className="p-3 bg-gray-50 text-gray-400 border border-gray-100 rounded-xl hover:bg-gray-100 transition-colors">
                    <FolderOpen size={18} />
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">BANNER TITLE</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-4 focus:ring-[#f85606]/5 text-sm font-bold text-gray-800"
                  value={siteMedia.promoBanner.title}
                  onChange={e => handleUpdatePromoBanner({ title: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">BANNER SUBTITLE</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-4 focus:ring-[#f85606]/5 text-sm font-medium text-gray-600"
                  value={siteMedia.promoBanner.subtitle}
                  onChange={e => handleUpdatePromoBanner({ subtitle: e.target.value })}
                />
              </div>
              <div className="bg-purple-50 p-6 rounded-2xl border border-purple-100 flex gap-4">
                <AlertCircle size={24} className="text-purple-600 shrink-0" />
                <div>
                   <p className="text-[10px] font-black text-purple-800 uppercase tracking-widest mb-1 italic">Composition</p>
                   <p className="text-[9px] font-bold text-purple-700/80 leading-relaxed uppercase">
                    This banner is prominent on the home page. Ensure the title is catchy and high-contrast against the background.
                   </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Media Files Library Section */}
      <section className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b bg-gray-50/20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
              <FolderOpen size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-gray-800 tracking-tight uppercase italic">MEDIA FILES (LIBRARY)</h2>
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">MANAGE ALL YOUR VISUAL ASSETS IN ONE PLACE</p>
            </div>
          </div>
          <button 
            onClick={() => { setActivePickerTarget(null); fileInputRef.current?.click(); }}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#9333ea] text-white rounded-xl shadow-lg shadow-purple-500/20 hover:bg-[#7e22ce] transition-all transform active:scale-95 font-black text-[10px] uppercase tracking-widest"
          >
            <Upload size={18} /> UPLOAD FILE
          </button>
        </div>

        <div className="p-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-6">
          {mediaLibrary.length > 0 ? mediaLibrary.map(item => (
            <div key={item.id} className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300">
              <div className="aspect-[4/3] overflow-hidden bg-gray-50 relative">
                {item.type === 'image' ? (
                  <img src={item.url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={item.name} />
                ) : (
                  <VideoPlayer url={item.url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                )}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <button 
                  onClick={() => setMediaLibrary(prev => prev.filter(i => i.id !== item.id))}
                  className="absolute top-2 right-2 p-1.5 bg-white/90 text-red-500 rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                >
                  <Trash2 size={12} />
                </button>
              </div>
              <div className="p-4 bg-white">
                <p className="text-[10px] font-black text-gray-800 truncate uppercase tracking-tight">{item.name}</p>
                <p className="text-[8px] text-gray-400 uppercase font-black mt-1 flex items-center gap-1 tracking-widest">
                  {item.type === 'video' ? <FileVideo size={8} className="text-purple-500" /> : <FileImage size={8} className="text-blue-500" />}
                  {item.type} • {item.createdAt}
                </p>
              </div>
            </div>
          )) : (
            <div className="col-span-full py-20 flex flex-col items-center text-gray-300">
              <ImageIcon size={64} strokeWidth={1} />
              <p className="mt-4 font-black uppercase tracking-[0.2em] text-xs">Library is Empty</p>
            </div>
          )}
        </div>
      </section>

      {/* Selection Modal for Library */}
      {isLibraryModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsLibraryModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl flex flex-col max-h-[85vh] animate-in zoom-in duration-300 overflow-hidden border border-gray-100">
            <div className="p-8 border-b flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center">
                  <FolderOpen size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-gray-800 uppercase tracking-tight italic">Choose from Library</h3>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Selecting asset for {activePickerTarget?.type === 'hero' ? 'Hero Slide' : 'Promo Banner'}</p>
                </div>
              </div>
              <button onClick={() => setIsLibraryModalOpen(false)} className="p-2 hover:bg-white rounded-full transition-colors text-gray-400 hover:text-gray-800">
                <X size={24} />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 custom-scrollbar bg-white">
              {mediaLibrary.map(item => (
                <div 
                  key={item.id} 
                  className="group cursor-pointer bg-white rounded-2xl border-2 border-transparent hover:border-[#f85606] overflow-hidden transition-all flex flex-col shadow-sm"
                  onClick={() => selectFromLibrary(item)}
                >
                  <div className="aspect-square overflow-hidden bg-gray-50 relative">
                    {item.type === 'image' ? (
                      <img src={item.url} className="w-full h-full object-cover" alt={item.name} />
                    ) : (
                      <div className="w-full h-full">
                        <VideoPlayer url={item.url} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                           <Video size={24} className="text-white opacity-50" />
                        </div>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  <div className="p-4 bg-white border-t">
                    <p className="text-[10px] font-black text-gray-800 truncate uppercase tracking-tight">{item.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                       {item.type === 'video' ? <FileVideo size={8} className="text-purple-500" /> : <FileImage size={8} className="text-blue-500" />}
                       <p className="text-[8px] text-gray-400 uppercase font-black tracking-widest">{item.type}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-8 border-t bg-gray-50/50 flex justify-end">
               <button 
                onClick={() => setIsLibraryModalOpen(false)}
                className="px-8 py-3 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-gray-800"
               >
                 Cancel
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaManagement;
