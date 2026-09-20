import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect, lazy, Suspense } from "react";
import Index from "./pages/Index";
import CookieBanner from "./components/CookieBanner";
import LoadingScreen from "./components/LoadingScreen";
import BackToTop from "./components/BackToTop";
import { useCookieConsent } from "./hooks/use-cookie-consent";

// Paginile secundare se încarcă doar când sunt cerute — prima pagină rămâne ușoară
const SimpleTest = lazy(() => import("./pages/SimpleTest"));
const NotFound = lazy(() => import("./pages/NotFound"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const Admin = lazy(() => import("./pages/Admin"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const SEEN_KEY = "djcozo_intro_seen";

const App = () => {
  const isAdminRoute =
    typeof window !== "undefined" && window.location.pathname.startsWith("/admin");
  const alreadySeen =
    typeof window !== "undefined" && sessionStorage.getItem(SEEN_KEY) === "1";

  const [isLoading, setIsLoading] = useState(!isAdminRoute && !alreadySeen);
  const { showBanner, acceptCookies, rejectCookies, hideBanner } = useCookieConsent();

  useEffect(() => {
    if (!isLoading) return;
    const timer = setTimeout(() => {
      setIsLoading(false);
      sessionStorage.setItem(SEEN_KEY, "1");
    }, 1200);
    return () => clearTimeout(timer);
  }, [isLoading]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />

        <LoadingScreen isVisible={isLoading} />

        {!isLoading && (
          <BrowserRouter>
            <Suspense fallback={null}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/test" element={<SimpleTest />} />
                <Route path="/politici" element={<PrivacyPolicy />} />
                <Route path="/admin" element={<Admin />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>

            {showBanner && (
              <CookieBanner
                onAccept={acceptCookies}
                onReject={rejectCookies}
                onClose={hideBanner}
              />
            )}

            <BackToTop />
          </BrowserRouter>
        )}
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
