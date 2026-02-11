
import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft } from '../common/Icons';
import { useStore } from '../../context/StoreContext';
import { Link } from 'react-router-dom';
import VideoPlayer from '../common/VideoPlayer';

const HeroSlider: React.FC = () => {
  const { siteMedia } = useStore();
  const slides = siteMedia.heroSlides;
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent(prev => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 6000); 
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => setCurrent(prev => (prev === slides.length - 1 ? 0 : prev + 1));
  const prevSlide = () => setCurrent(prev => (prev === 0 ? slides.length - 1 : prev - 1));

  if (!slides || slides.length === 0) return null;

  return (
    <div className="relative w-full h-full overflow-hidden group shadow-lg rounded-lg bg-gray-900">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          {slide.type === 'image' ? (
            <img src={slide.url} alt={slide.title} className="w-full h-full object-cover" />
          ) : (
            <VideoPlayer url={slide.url} className="w-full h-full object-cover" />
          )}
          
          <div className="absolute inset-0 bg-black/30 flex items-center px-6 sm:px-12 lg:px-32 z-20">
            <div className="max-w-4xl text-white">
              {index === current && (
                <div className="flex flex-col items-start">
                  <h2 className="text-4xl sm:text-6xl md:text-8xl font-black mb-6 leading-tight animate-in fade-in slide-in-from-bottom-20 duration-700 ease-out">
                    {slide.title}
                  </h2>
                  <p className="text-base sm:text-xl md:text-3xl mb-12 text-gray-100 font-medium max-w-2xl line-clamp-2 animate-in fade-in slide-in-from-bottom-20 duration-1000 delay-200 ease-out">
                    {slide.subtitle}
                  </p>
                  <Link 
                    to={slide.link || '/top-sellers'}
                    className="inline-block bg-white text-gray-900 px-10 md:px-16 py-4 md:py-5 rounded-sm font-black hover:bg-[#f85606] hover:text-white transition-all transform hover:scale-110 active:scale-95 text-sm md:text-base uppercase tracking-[0.2em] animate-in fade-in slide-in-from-bottom-20 duration-1000 delay-500 ease-out shadow-2xl"
                  >
                    {slide.cta || 'Shop Now'}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button 
        onClick={prevSlide}
        className="absolute left-6 md:left-10 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/30 p-3 md:p-5 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all z-30 backdrop-blur-md"
      >
        <ChevronLeft size={32} />
      </button>
      <button 
        onClick={nextSlide}
        className="absolute right-6 md:right-10 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/30 p-3 md:p-5 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all z-30 backdrop-blur-md"
      >
        <ChevronRight size={32} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 flex gap-3 md:gap-5 z-30">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2 md:h-2.5 rounded-full transition-all duration-500 ${
              i === current ? 'bg-white w-10 md:w-16' : 'bg-white/30 w-4 md:w-5 hover:bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;
