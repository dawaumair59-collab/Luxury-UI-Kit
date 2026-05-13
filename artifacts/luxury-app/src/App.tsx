import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ToastProvider } from "@/components/ui/LuxToast";
import NotFound from "@/pages/not-found";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { HomePage } from "@/app/HomePage";
import { LoginPage } from "@/app/login/LoginPage";
import { SignupPage } from "@/app/signup/SignupPage";
import { DashboardPage } from "@/app/dashboard/DashboardPage";
import { SetupPage } from "@/app/dashboard/setup/SetupPage";
import { MenuPage } from "@/app/dashboard/menus/MenuPage";
import { VideosPage } from "@/app/dashboard/videos/VideosPage";
import { DashboardLayout } from "@/app/dashboard/DashboardLayout";
import { RestaurantPage } from "@/app/restaurant/RestaurantPage";
import { ReelsPage } from "@/app/restaurant/ReelsPage";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { useLoading } from "@/hooks/useLoading";

const queryClient = new QueryClient();

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
            <MenuPage />
          </DashboardLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/dashboard/videos">
        <ProtectedRoute>
          <DashboardLayout>
            <VideosPage />
          </DashboardLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/dashboard">
        <ProtectedRoute>
          <DashboardLayout>
            <DashboardPage />
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
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ToastProvider>
          <AppWithLoading />
          <Toaster />
        </ToastProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
