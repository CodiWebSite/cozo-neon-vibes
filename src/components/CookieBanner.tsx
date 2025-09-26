import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Cookie, X, Check, Settings } from 'lucide-react';

interface CookieBannerProps {
  onAccept: () => void;
  onReject: () => void;
  onClose: () => void;
}

const CookieBanner: React.FC<CookieBannerProps> = ({ onAccept, onReject, onClose }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const handleAccept = () => {
    onAccept();
    setIsVisible(false);
    setTimeout(onClose, 300); // Delay pentru animația de fade out
  };

  const handleReject = () => {
    onReject();
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-50 transition-all duration-300 ${
      isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
    }`}>
      {/* Backdrop blur */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
      
      {/* Main banner */}
      <div className="relative bg-gradient-to-r from-slate-900/95 via-purple-900/95 to-slate-900/95 border-t border-purple-500/30 backdrop-blur-md">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
            
            {/* Icon & Content */}
            <div className="flex items-start gap-4 flex-1">
              <div className="flex-shrink-0 p-2 bg-purple-500/20 rounded-lg border border-purple-500/30">
                <Cookie className="w-6 h-6 text-purple-400" />
              </div>
              
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                  🍪 Utilizăm Cookie-uri
                </h3>
                
                <p className="text-gray-300 text-sm leading-relaxed mb-3">
                  Acest site folosește cookie-uri pentru a îmbunătăți experiența ta de navigare, 
                  pentru analiză și pentru funcționalități personalizate. 
                  {!showDetails && (
                    <button
                      onClick={() => setShowDetails(true)}
                      className="text-purple-400 hover:text-purple-300 underline ml-1"
                    >
                      Află mai multe
                    </button>
                  )}
                </p>

                {/* Detailed info */}
                {showDetails && (
                  <div className="bg-black/30 rounded-lg p-4 mb-4 border border-purple-500/20">
                    <h4 className="text-purple-300 font-medium mb-2">Tipuri de cookie-uri utilizate:</h4>
                    <ul className="text-gray-300 text-sm space-y-1">
                      <li>• <strong>Esențiale:</strong> Necesare pentru funcționarea site-ului</li>
                      <li>• <strong>Analiză:</strong> Google Analytics pentru îmbunătățirea site-ului</li>
                      <li>• <strong>Funcționale:</strong> Memorarea preferințelor tale</li>
                    </ul>
                    <div className="mt-3 pt-3 border-t border-purple-500/20">
                      <Link 
                        to="/politici#cookies" 
                        className="text-purple-400 hover:text-purple-300 text-sm underline"
                      >
                        📋 Citește politica completă de cookie-uri
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              {!showDetails && (
                <button
                  onClick={() => setShowDetails(true)}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 rounded-lg transition-colors border border-gray-600/50"
                >
                  <Settings className="w-4 h-4" />
                  <span className="text-sm">Detalii</span>
                </button>
              )}
              
              <button
                onClick={handleReject}
                className="flex items-center justify-center gap-2 px-6 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-300 rounded-lg transition-colors border border-red-500/30"
              >
                <X className="w-4 h-4" />
                <span>Respinge</span>
              </button>
              
              <button
                onClick={handleAccept}
                className="flex items-center justify-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-lg transition-all shadow-lg shadow-purple-500/25"
              >
                <Check className="w-4 h-4" />
                <span>Accept</span>
              </button>
            </div>

            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 lg:relative lg:top-0 lg:right-0 p-2 text-gray-400 hover:text-white transition-colors"
              aria-label="Închide"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Bottom links */}
          <div className="mt-4 pt-4 border-t border-purple-500/20 flex flex-wrap gap-4 text-xs text-gray-400">
            <Link to="/politici" className="hover:text-purple-400 transition-colors">
              📄 Termeni și Condiții
            </Link>
            <Link to="/politici#confidentialitate" className="hover:text-purple-400 transition-colors">
              🔒 Politica de Confidențialitate
            </Link>
            <Link to="/politici#cookies" className="hover:text-purple-400 transition-colors">
              🍪 Politica de Cookie-uri
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;