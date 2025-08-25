import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import UserLogin from "./pages/UserLogin";
import PgOwnerLogin from "./pages/PgOwnerLogin";
import AdminLogin from "./pages/AdminLogin";
import UserSignup from "./pages/UserSignup";
import PgOwnerSignup from "./pages/PgOwnerSignup";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
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
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
