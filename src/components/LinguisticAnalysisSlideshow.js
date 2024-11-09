import React, { useState } from 'react';

// Import images
import adjs from '../assets/black-power-visualisations/adjs.png';
import smith from '../assets/black-power-visualisations/smith.png';
import edwards from '../assets/black-power-visualisations/edwards.png';
import carlos from '../assets/black-power-visualisations/carlos.png';

const LinguisticAnalysisSlideshow = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: adjs,
      title: 'Article Analysis 1',
      description: 'Linguistic patterns in Dutch media coverage about our protagonists'
    },
    {
      image: smith,
      title: 'Article Analysis 2',
      description: 'Linguistic patterns in Dutch media coverage about Tommy Smith'
    },
    {
      image: edwards,
      title: 'Article Analysis 3',
      description: 'Linguistic patterns in Dutch media coverage about Harry Edwards'
    },
    {
      image: carlos,
      title: 'Article Analysis 4',
      description: 'Semantic network of articles about John Carlos'
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  // Simple SVG arrow components
  const LeftArrow = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );

  const RightArrow = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 18l6-6-6-6" />
    </svg>
  );

  return (
    <div className="bg-white rounded-lg overflow-hidden border-l-4 border-olympic-blue mt-8">
      <div className="p-6">
        <h2 className="text-2xl font-light mb-6">
          Linguistic Analysis of Dutch National Library Articles
        </h2>
        
        <div className="relative w-full aspect-video bg-gray-100 rounded-lg overflow-hidden">
          {/* Main Image */}
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src={slides[currentSlide].image}
              alt={slides[currentSlide].title}
              className="max-w-full max-h-full object-contain"
            />
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white shadow-lg transition-all"
            aria-label="Previous slide"
          >
            <LeftArrow />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white shadow-lg transition-all"
            aria-label="Next slide"
          >
            <RightArrow />
          </button>

          {/* Slide Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  currentSlide === index 
                    ? 'bg-blue-600 w-4' 
                    : 'bg-gray-400'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Caption */}
        <div className="mt-4 text-center">
          <h3 className="text-xl font-medium text-gray-800">
            {slides[currentSlide].title}
          </h3>
          <p className="text-gray-600 mt-2">
            {slides[currentSlide].description}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Source: Dutch National Library Archives
          </p>
        </div>
      </div>
    </div>
  );
};

export default LinguisticAnalysisSlideshow;