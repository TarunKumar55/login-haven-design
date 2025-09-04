import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import UserLogin from "./pages/UserLogin";
import PgOwnerLogin from "./pages/PgOwnerLogin";
import AdminLogin from "./pages/AdminLogin";
import UserSignup from "./pages/UserSignup";
import PgOwnerSignup from "./pages/PgOwnerSignup";
import Dashboard from "./pages/Dashboard";
import PgListings from "@/pages/PgListings";
import PgOwnerForm from "@/pages/PgOwnerForm";
import AdminPanel from "@/pages/AdminPanel";
import ForgotPassword from "@/pages/ForgotPassword";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/user-login" element={<UserLogin />} />
            <Route path="/pg-owner-login" element={<PgOwnerLogin />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/user-signup" element={<UserSignup />} />
            <Route path="/pg-owner-signup" element={<PgOwnerSignup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/pg-listings" element={<PgListings />} />
            <Route path="/pg-owner-form" element={<PgOwnerForm />} />
            <Route path="/admin-panel" element={<AdminPanel />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
