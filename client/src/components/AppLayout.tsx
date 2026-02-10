/*
 * AppLayout — Global navigation shell with admin login
 * Design: Meta/Facebook — White top bar, blue accents, system font stack
 * Includes admin login dialog, Control Panel nav, and admin indicator bar
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
  Settings,
  LogOut,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const viewerNavItems = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/schedule", label: "Schedule", icon: CalendarDays },
  { path: "/directory", label: "SME Directory", icon: Users },
  { path: "/programs", label: "Programs", icon: FolderKanban },
];

const adminNavItems = [
  ...viewerNavItems,
  { path: "/admin", label: "Control Panel", icon: Settings },
];

export default function AppLayout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const { isAdmin, loginAsAdmin, logout, currentUser } = useAdmin();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [password, setPassword] = useState("");

  const navItems = isAdmin ? adminNavItems : viewerNavItems;

  const handleLogin = () => {
    const success = loginAsAdmin(password);
    if (success) {
      setLoginDialogOpen(false);
      setPassword("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation Bar */}
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

          {/* Desktop Navigation */}
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
            {isAdmin ? (
              <div className="flex items-center gap-2">
                <span className="hidden lg:flex items-center gap-1.5 text-[13px] text-[#65676B] font-medium">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-primary">
                      {currentUser?.name?.split(" ").map(n => n[0]).join("").slice(0, 2) ?? "AD"}
                    </span>
                  </div>
                  {currentUser?.name ?? "Admin"}
                </span>
                <Button
                  variant="default"
                  size="sm"
                  onClick={logout}
                  className="gap-1.5 text-[13px] font-semibold rounded-md h-9 px-3 bg-primary text-white hover:bg-[#1565D8] shadow-none"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Exit Admin</span>
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLoginDialogOpen(true)}
                className="gap-1.5 text-[13px] font-semibold rounded-md h-9 px-3 border-[#CED0D4] text-[#65676B] hover:bg-[#F2F2F2] bg-white"
              >
                <ShieldOff className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Viewer Mode</span>
              </Button>
            )}

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

        {/* Admin mode indicator bar */}
        {isAdmin && (
          <div className="bg-[#E7F3FF] border-t border-[#1877F2]/15 px-4 py-1.5">
            <div className="container flex items-center gap-2">
              <Shield className="w-3.5 h-3.5 text-primary" />
              <span className="text-[13px] text-primary font-semibold">
                Admin editing mode
              </span>
              <span className="text-[13px] text-[#65676B]">
                — Click any field to edit · Add/remove items · Manage users in Control Panel
              </span>
            </div>
          </div>
        )}

        {/* Mobile Navigation */}
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

      {/* Admin Login Dialog */}
      <Dialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen}>
        <DialogContent className="sm:max-w-[400px] rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-[20px] font-bold text-[#050505] flex items-center gap-2">
              <Lock className="w-5 h-5 text-primary" />
              Admin Login
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            <p className="text-[14px] text-[#65676B] leading-relaxed">
              Enter the admin password to enable editing mode. You'll be able to add, edit, and remove sessions, programs, SMEs, and manage users.
            </p>
            <div>
              <Label className="text-[13px] text-[#65676B] mb-1.5 block font-semibold">Password</Label>
              <Input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter admin password"
                className="rounded-lg h-10"
                autoFocus
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleLogin}
                className="flex-1 bg-primary hover:bg-[#1565D8] text-white font-semibold rounded-lg shadow-none h-10"
                disabled={!password}
              >
                <Shield className="w-4 h-4 mr-1.5" />
                Login as Admin
              </Button>
              <Button
                variant="outline"
                onClick={() => { setLoginDialogOpen(false); setPassword(""); }}
                className="border-[#CED0D4] text-[#65676B] rounded-lg h-10"
              >
                Cancel
              </Button>
            </div>
            <p className="text-[12px] text-[#8A8D91] text-center">
              Default password: <code className="bg-[#F0F2F5] px-1.5 py-0.5 rounded text-[11px] font-mono">admin2025</code>
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Main Content */}
      <main className="min-h-[calc(100vh-3.5rem)]">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#CED0D4] bg-white">
        <div className="container py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[13px] text-[#65676B]">
            Communication Hub — Vendor Training Management System
          </p>
          <p className="text-[13px] text-[#8A8D91]">
            {isAdmin ? "Admin Mode · " : ""}Training Waves 1–3 · Dublin
          </p>
        </div>
      </footer>
    </div>
  );
}
