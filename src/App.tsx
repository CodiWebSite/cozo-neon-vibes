import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Index from "./pages/Index";
import SimpleTest from "./pages/SimpleTest";
import NotFound from "./pages/NotFound";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Admin from "./pages/Admin";
import CookieBanner from "./components/CookieBanner";
import LoadingScreen from "./components/LoadingScreen";
import BackToTop from "./components/BackToTop";
import { useCookieConsent } from "./hooks/use-cookie-consent";

const queryClient = new QueryClient();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { 
    showBanner, 
    acceptCookies, 
    rejectCookies, 
    hideBanner 
  } = useCookieConsent();

  useEffect(() => {
    // Simulate loading time - adjust this value as needed
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500); // 2.5 seconds loading time

    return () => clearTimeout(timer);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        
        {/* Loading Screen */}
        <LoadingScreen isVisible={isLoading} />
        
        {/* Main App Content */}
        {!isLoading && (
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/test" element={<SimpleTest />} />
              <Route path="/politici" element={<PrivacyPolicy />} />
              <Route path="/admin" element={<Admin />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            
            {/* Cookie Banner */}
            {showBanner && (
              <CookieBanner
                onAccept={acceptCookies}
                onReject={rejectCookies}
                onClose={hideBanner}
              />
            )}
            
            {/* Back to Top Button */}
            <BackToTop />
          </BrowserRouter>
        )}
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
