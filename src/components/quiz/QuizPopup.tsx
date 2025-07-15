'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function QuizPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenDismissed, setHasBeenDismissed] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Only show on main page
    if (pathname !== '/') return;

    // Check if the popup has been shown before
    const hasShown = localStorage.getItem('quizPopupShown');
    
    if (!hasShown) {
      // Show popup after 3 seconds
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [pathname]);

  const handleDismiss = () => {
    setIsVisible(false);
    setHasBeenDismissed(true);
    localStorage.setItem('quizPopupShown', 'true');
  };

  // Don't render anything if not on main page
  if (pathname !== '/' || !isVisible || hasBeenDismissed) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-2xl p-6 max-w-md w-full transform transition-all duration-500 ease-in-out translate-y-0 opacity-100 shadow-xl"
        style={{ 
          animation: 'slideIn 0.5s ease-out'
        }}
      >
        <div className="text-right">
          <button 
            onClick={handleDismiss}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Close popup"
          >
            ✕
          </button>
        </div>
        
        <div className="text-center mb-6">
          <h2 className="text-2xl font-playfair mb-3 text-navy">Discover Your ADHD Structure Style</h2>
          <p className="text-gray-600 mb-4">
            Take our FREE quiz to understand your unique ADHD structure needs and get personalized recommendations.
          </p>
        </div>

        <div className="flex justify-center gap-4">
          <Link 
            href="/quiz"
            className="px-6 py-2 bg-softblue hover:bg-blue-600 text-white rounded-full transition-colors duration-300"
          >
            Take the Quiz
          </Link>
          <button
            onClick={handleDismiss}
            className="px-6 py-2 border border-gray-300 hover:border-gray-400 rounded-full transition-colors duration-300"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
} 