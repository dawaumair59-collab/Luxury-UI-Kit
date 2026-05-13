import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { HomePage } from "@/app/HomePage";
import { LoginPage } from "@/app/login/LoginPage";
import { SignupPage } from "@/app/signup/SignupPage";
import { DashboardPage } from "@/app/dashboard/DashboardPage";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { useLoading } from "@/hooks/useLoading";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/signup" component={SignupPage} />
      <Route path="/dashboard">
        <ProtectedRoute>
          <DashboardPage />
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
        <AppWithLoading />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
