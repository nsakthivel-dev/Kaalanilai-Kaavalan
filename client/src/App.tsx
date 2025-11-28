import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import Home from "@/pages/Home";
import Diagnose from "@/pages/Diagnose";
import Library from "@/pages/Library";
import Chat from "@/pages/Chat";
import Dashboard from "@/pages/Dashboard";
import Experts from "@/pages/Experts";
import Weather from "@/pages/Weather";
import Contact from "@/pages/Contact";
import Admin from "@/pages/Admin";
import DataStorage from "@/pages/DataStorage";
import FarmConnect from "@/pages/FarmConnect";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/diagnose" component={Diagnose} />
      <Route path="/library" component={Library} />
      <Route path="/chat" component={Chat} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/experts" component={Experts} />
      <Route path="/alerts" component={Weather} />
      <Route path="/contact" component={Contact} />
      <Route path="/admin" component={Admin} />
      <Route path="/data-storage" component={DataStorage} />
      <Route path="/farm-connect" component={FarmConnect} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <LanguageProvider>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1 pt-14 sm:pt-16 lg:pt-20">
                <Router />
              </main>
              <Footer />
            </div>
            <Toaster />
          </LanguageProvider>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;