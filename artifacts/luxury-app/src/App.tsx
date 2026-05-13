import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ToastProvider } from "@/components/ui/LuxToast";
import NotFound from "@/pages/not-found";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { HomePage } from "@/app/HomePage";
import { LoginPage } from "@/app/login/LoginPage";
import { SignupPage } from "@/app/signup/SignupPage";
import { DashboardPage } from "@/app/dashboard/DashboardPage";
import { SetupPage } from "@/app/dashboard/setup/SetupPage";
import { MenuPage } from "@/app/dashboard/menus/MenuPage";
import { VideosPage } from "@/app/dashboard/videos/VideosPage";
import { QRPage } from "@/app/dashboard/qr/QRPage";
import { AnalyticsPage } from "@/app/dashboard/analytics/AnalyticsPage";
import { BillingPage } from "@/app/dashboard/billing/BillingPage";
import { DashboardLayout } from "@/app/dashboard/DashboardLayout";
import { RestaurantPage } from "@/app/restaurant/RestaurantPage";
import { ReelsPage } from "@/app/restaurant/ReelsPage";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { useLoading } from "@/hooks/useLoading";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "wouter";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2,
      retry: 1,
    },
  },
});

const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
  exit: { opacity: 0, y: -6, transition: { duration: 0.2 } },
};

function PageTransition({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="h-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/signup" component={SignupPage} />

      {/* Public restaurant pages — no auth needed */}
      <Route path="/restaurant/:slug/reels" component={ReelsPage} />
      <Route path="/restaurant/:slug" component={RestaurantPage} />

      {/* Dashboard — protected */}
      <Route path="/dashboard/setup">
        <ProtectedRoute>
          <SetupPage />
        </ProtectedRoute>
      </Route>
      <Route path="/dashboard/menu">
        <ProtectedRoute>
          <DashboardLayout>
            <PageTransition><MenuPage /></PageTransition>
          </DashboardLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/dashboard/videos">
        <ProtectedRoute>
          <DashboardLayout>
            <PageTransition><VideosPage /></PageTransition>
          </DashboardLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/dashboard/qr">
        <ProtectedRoute>
          <DashboardLayout>
            <PageTransition><QRPage /></PageTransition>
          </DashboardLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/dashboard/analytics">
        <ProtectedRoute>
          <DashboardLayout>
            <PageTransition><AnalyticsPage /></PageTransition>
          </DashboardLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/dashboard/billing">
        <ProtectedRoute>
          <DashboardLayout>
            <PageTransition><BillingPage /></PageTransition>
          </DashboardLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/dashboard">
        <ProtectedRoute>
          <DashboardLayout>
            <PageTransition><DashboardPage /></PageTransition>
          </DashboardLayout>
        </ProtectedRoute>
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function AppWithLoading() {
  const { isLoading, progress } = useLoading({ duration: 2200 });

  return (
    <>
      <LoadingScreen
        isVisible={isLoading}
        progress={progress}
        brandName="MENULUX"
        tagline="Crafted for the Extraordinary"
      />
      {!isLoading && (
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
      )}
    </>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <ToastProvider>
            <AppWithLoading />
            <Toaster />
          </ToastProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
