import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/contexts/CartContext";
import Index from "./pages/Index";
import TableMenu from "./pages/TableMenu";
import Cart from "./pages/Cart";
import Payment from "./pages/Payment";
import PaymentSuccess from "./pages/PaymentSuccess";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import Chatbot from "@/components/Chatbot";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CartProvider>
        <Toaster />
        <Sonner />
        <Chatbot />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/table/:tableId" element={<TableMenu />} />
            <Route path="/table/:tableId/cart" element={<Cart />} />
            <Route path="/table/:tableId/payment" element={<Payment />} />
            <Route path="/table/:tableId/success" element={<PaymentSuccess />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
