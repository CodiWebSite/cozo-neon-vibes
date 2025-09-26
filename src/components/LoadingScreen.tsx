import React from 'react';
import { Music } from 'lucide-react';
import djCozoLogo from "@/assets/dj-cozo-logo.png";

interface LoadingScreenProps {
  isVisible: boolean;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Background animated particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -top-4 -right-4 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main loading content */}
      <div className="relative z-10 flex flex-col items-center space-y-8">
        {/* Logo with bounce animation and glow effect */}
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-xl opacity-60 animate-pulse scale-110"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full blur-lg opacity-40 animate-ping"></div>
            <img 
              src={djCozoLogo} 
              alt="DJ Cozo Logo" 
              className="relative h-32 w-auto mx-auto animate-bounce drop-shadow-2xl"
            />
          </div>

        {/* Loading spinner */}
        <div className="relative">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-pink-400 rounded-full animate-spin-reverse"></div>
        </div>

        {/* Loading text */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold text-white animate-pulse">
            DJ Cozo
          </h2>
          <p className="text-purple-200 text-lg animate-fade-in-out">
            Se încarcă experiența...
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-64 h-1 bg-purple-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-loading-bar"></div>
        </div>
      </div>

      {/* Floating music notes */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 text-purple-300 text-2xl animate-float">♪</div>
        <div className="absolute top-1/3 right-1/4 text-pink-300 text-xl animate-float-delayed">♫</div>
        <div className="absolute bottom-1/3 left-1/3 text-blue-300 text-lg animate-float-slow">♪</div>
        <div className="absolute bottom-1/4 right-1/3 text-purple-300 text-xl animate-float">♫</div>
      </div>
    </div>
  );
};

export default LoadingScreen;