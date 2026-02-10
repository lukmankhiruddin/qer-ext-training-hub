/*
 * AppLayout — Global navigation shell
 * Design: Meta/Facebook — White top bar, blue accents, system font stack
 * Clean, functional navigation with subtle hover states
 */
import { type ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";
import { useAdmin } from "@/contexts/AdminContext";
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
      {/* Top Navigation Bar — Meta style: white bg, bottom border, 56px height */}
      <header className="sticky top-0 z-50 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.1)]">
        <div className="container flex items-center justify-between h-14">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2.5 no-underline">
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-sm tracking-tight">CH</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[17px] font-bold leading-tight text-[#050505]">
                Communication Hub
              </span>
              <span className="text-[11px] text-[#65676B] font-normal hidden sm:block">
                Vendor Training Management
              </span>
            </div>
          </Link>

          {/* Desktop Navigation — Meta style: pill-shaped hover, blue active indicator */}
          <nav className="hidden md:flex items-center gap-0.5">
            {navItems.map(item => {
              const isActive = location === item.path;
              return (
                <Link key={item.path} href={item.path}>
                  <span
                    className={cn(
                      "relative flex items-center gap-2 px-4 py-2 rounded-lg text-[14px] font-medium transition-colors duration-150",
                      isActive
                        ? "text-primary bg-secondary"
                        : "text-[#65676B] hover:bg-[#F2F2F2]"
                    )}
                  >
                    <item.icon className={cn("w-[18px] h-[18px]", isActive && "text-primary")} />
                    {item.label}
                    {isActive && (
                      <span className="absolute -bottom-[9px] left-3 right-3 h-[3px] bg-primary rounded-full" />
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
                "gap-1.5 text-[13px] font-semibold rounded-md h-9 px-3 transition-colors duration-150",
                isAdmin
                  ? "bg-primary text-white hover:bg-[#1565D8] shadow-none"
                  : "border-[#CED0D4] text-[#65676B] hover:bg-[#F2F2F2] bg-white"
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
              className="md:hidden w-9 h-9 rounded-full hover:bg-[#F2F2F2]"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Admin mode indicator bar — Meta style: blue tint */}
        {isAdmin && (
          <div className="bg-[#E7F3FF] border-t border-[#1877F2]/15 px-4 py-1.5">
            <div className="container flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-[13px] text-primary font-semibold">
                Admin editing mode
              </span>
              <span className="text-[13px] text-[#65676B]">
                — Click any editable field to modify
              </span>
            </div>
          </div>
        )}

        {/* Mobile Navigation — Meta style: clean slide down */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#CED0D4]">
            <nav className="container py-2 flex flex-col gap-0.5">
              {navItems.map(item => {
                const isActive = location === item.path;
                return (
                  <Link key={item.path} href={item.path}>
                    <span
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-[15px] font-medium transition-colors duration-150",
                        isActive
                          ? "text-primary bg-[#E7F3FF]"
                          : "text-[#050505] hover:bg-[#F2F2F2]"
                      )}
                    >
                      <item.icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-[#65676B]")} />
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="min-h-[calc(100vh-3.5rem)]">
        {children}
      </main>

      {/* Footer — Meta style: minimal, gray text */}
      <footer className="border-t border-[#CED0D4] bg-white">
        <div className="container py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[13px] text-[#65676B]">
            Communication Hub — Vendor Training Management System
          </p>
          <p className="text-[13px] text-[#8A8D91]">
            Wave 2 Complex Object Training · Dublin
          </p>
        </div>
      </footer>
    </div>
  );
}
