import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AdminProvider } from "./contexts/AdminContext";
import { DataProvider } from "./contexts/DataContext";
import Home from "./pages/Home";
import Schedule from "./pages/Schedule";
import Directory from "./pages/Directory";
import Programs from "./pages/Programs";
import AdminPanel from "./pages/AdminPanel";
import AppLayout from "./components/AppLayout";
function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <AppLayout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/schedule" component={Schedule} />
        <Route path="/directory" component={Directory} />
        <Route path="/programs" component={Programs} />
        <Route path="/admin" component={AdminPanel} />
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <AdminProvider>
          <DataProvider>
            <TooltipProvider>
              <Toaster
                position="bottom-right"
                toastOptions={{
                  style: {
                    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
                  },
                }}
              />
              <Router />
            </TooltipProvider>
          </DataProvider>
        </AdminProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
