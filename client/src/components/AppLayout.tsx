/*
 * AppLayout — Global navigation shell
 * Design: "Anthropic Warmth" — Top navigation bar (64px) with horizontal tabs
 * Warm, editorial feel with Instrument Serif for the brand name
 */
import { type ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";
import { useAdmin } from "@/contexts/AdminContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarDays,
  LayoutDashboard,
  Users,
  FolderKanban,
  Shield,
  ShieldOff,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/schedule", label: "Schedule", icon: CalendarDays },
  { path: "/directory", label: "SME Directory", icon: Users },
  { path: "/programs", label: "Programs", icon: FolderKanban },
];

export default function AppLayout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const { isAdmin, toggleAdmin } = useAdmin();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="container flex items-center justify-between h-16">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-3 no-underline">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">CH</span>
            </div>
            <div className="flex flex-col">
              <span className="font-display text-xl leading-tight text-foreground">
                Communication Hub
              </span>
              <span className="text-[11px] text-muted-foreground tracking-wide uppercase hidden sm:block">
                Vendor Training Management
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(item => {
              const isActive = location === item.path;
              return (
                <Link key={item.path} href={item.path}>
                  <span
                    className={cn(
                      "relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                      isActive
                        ? "text-foreground bg-accent"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                    )}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                    {isActive && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full"
                        transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                      />
                    )}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Right side: Admin toggle + Mobile menu */}
          <div className="flex items-center gap-2">
            <Button
              variant={isAdmin ? "default" : "outline"}
              size="sm"
              onClick={toggleAdmin}
              className={cn(
                "gap-2 transition-all duration-300 text-xs",
                isAdmin && "shadow-md"
              )}
            >
              {isAdmin ? (
                <>
                  <Shield className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Admin Mode</span>
                </>
              ) : (
                <>
                  <ShieldOff className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Viewer Mode</span>
                </>
              )}
            </Button>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Admin mode indicator bar */}
        <AnimatePresence>
          {isAdmin && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="bg-primary/5 border-t border-primary/10 px-4 py-1.5">
                <div className="container flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  <span className="text-xs text-primary font-medium">
                    Admin editing mode — Click any editable field to modify
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="md:hidden overflow-hidden border-t border-border/60"
            >
              <nav className="container py-3 flex flex-col gap-1">
                {navItems.map(item => {
                  const isActive = location === item.path;
                  return (
                    <Link key={item.path} href={item.path}>
                      <span
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
                          isActive
                            ? "text-foreground bg-accent"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                        )}
                      >
                        <item.icon className="w-4 h-4" />
                        {item.label}
                      </span>
                    </Link>
                  );
                })}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="min-h-[calc(100vh-4rem)]">
        <AnimatePresence mode="wait">
          <motion.div
            key={location}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-muted/30">
        <div className="container py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            Communication Hub — Vendor Training Management System
          </p>
          <p className="font-mono-label text-muted-foreground/60">
            Wave 2 Complex Object Training · Dublin
          </p>
        </div>
      </footer>
    </div>
  );
}
