import { useState, useEffect } from 'react';

export type CookieConsentStatus = 'pending' | 'accepted' | 'rejected';

interface CookieConsentState {
  status: CookieConsentStatus;
  showBanner: boolean;
  timestamp: number;
}

const STORAGE_KEY = 'dj-cozo-cookie-consent';
const CONSENT_EXPIRY_DAYS = 365; // Cookie consent valid for 1 year

export const useCookieConsent = () => {
  const [consentState, setConsentState] = useState<CookieConsentState>({
    status: 'pending',
    showBanner: false,
    timestamp: 0
  });

  // Load consent from localStorage on mount
  useEffect(() => {
    const loadConsentFromStorage = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsedState: CookieConsentState = JSON.parse(stored);
          const now = Date.now();
          const expiryTime = parsedState.timestamp + (CONSENT_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
          
          // Check if consent has expired
          if (now > expiryTime) {
            // Consent expired, reset to pending
            setConsentState({
              status: 'pending',
              showBanner: true,
              timestamp: 0
            });
            localStorage.removeItem(STORAGE_KEY);
          } else {
            // Valid consent found
            setConsentState({
              ...parsedState,
              showBanner: false
            });
          }
        } else {
          // No consent found, show banner
          setConsentState(prev => ({
            ...prev,
            showBanner: true
          }));
        }
      } catch (error) {
        console.error('Error loading cookie consent:', error);
        // On error, show banner
        setConsentState(prev => ({
          ...prev,
          showBanner: true
        }));
      }
    };

    // Small delay to ensure DOM is ready
    const timer = setTimeout(loadConsentFromStorage, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Save consent to localStorage
  const saveConsent = (status: CookieConsentStatus) => {
    const newState: CookieConsentState = {
      status,
      showBanner: false,
      timestamp: Date.now()
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      setConsentState(newState);
      
      // Trigger Google Analytics or other tracking based on consent
      if (status === 'accepted') {
        enableTracking();
      } else {
        disableTracking();
      }
    } catch (error) {
      console.error('Error saving cookie consent:', error);
    }
  };

  // Enable tracking services
  const enableTracking = () => {
    // Enable Google Analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'granted'
      });
    }
    
    // You can add other tracking services here
    console.log('🍪 Tracking enabled - cookies accepted');
  };

  // Disable tracking services
  const disableTracking = () => {
    // Disable Google Analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'denied'
      });
    }
    
    // Clear existing tracking cookies if needed
    console.log('🚫 Tracking disabled - cookies rejected');
  };

  // Accept cookies
  const acceptCookies = () => {
    saveConsent('accepted');
  };

  // Reject cookies
  const rejectCookies = () => {
    saveConsent('rejected');
  };

  // Hide banner without saving preference
  const hideBanner = () => {
    setConsentState(prev => ({
      ...prev,
      showBanner: false
    }));
  };

  // Reset consent (for testing or user preference change)
  const resetConsent = () => {
    localStorage.removeItem(STORAGE_KEY);
    setConsentState({
      status: 'pending',
      showBanner: true,
      timestamp: 0
    });
  };

  // Check if cookies are accepted
  const areCookiesAccepted = () => {
    return consentState.status === 'accepted';
  };

  // Check if user has made a choice
  const hasUserDecided = () => {
    return consentState.status !== 'pending';
  };

  return {
    // State
    status: consentState.status,
    showBanner: consentState.showBanner,
    timestamp: consentState.timestamp,
    
    // Actions
    acceptCookies,
    rejectCookies,
    hideBanner,
    resetConsent,
    
    // Helpers
    areCookiesAccepted,
    hasUserDecided
  };
};

// Type declaration for gtag (Google Analytics)
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}