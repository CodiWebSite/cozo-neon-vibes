import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

const BackToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Monitorizează scroll-ul pentru a afișa/ascunde butonul
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  // Funcția pentru scroll la top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 group
                     bg-gradient-to-r from-purple-600 to-pink-600 
                     hover:from-purple-700 hover:to-pink-700
                     text-white p-3 rounded-full shadow-lg 
                     transition-all duration-300 ease-in-out
                     hover:scale-110 hover:shadow-xl
                     focus:outline-none focus:ring-4 focus:ring-purple-300
                     animate-bounce-slow
                     md:bottom-8 md:right-8 md:p-4
                     lg:bottom-10 lg:right-10"
          aria-label="Înapoi sus"
          title="Înapoi sus"
        >
          <ChevronUp 
            className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 
                       transition-transform duration-300 
                       group-hover:-translate-y-1" 
          />
          
          {/* Efect de glow */}
          <div className="absolute inset-0 rounded-full 
                          bg-gradient-to-r from-purple-600 to-pink-600 
                          opacity-0 group-hover:opacity-30 
                          transition-opacity duration-300 
                          blur-md -z-10"></div>
          
          {/* Particule animate */}
          <div className="absolute -top-1 -right-1 w-2 h-2 
                          bg-yellow-400 rounded-full 
                          animate-ping opacity-75"></div>
          <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 
                          bg-blue-400 rounded-full 
                          animate-pulse opacity-60"></div>
        </button>
      )}
    </>
  );
};

export default BackToTop;