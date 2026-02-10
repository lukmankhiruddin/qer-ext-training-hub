/*
 * AppLayout — Modern Meta/Apple hybrid navigation shell
 * Design: Frosted glass nav, vibrant blue-purple accents, Inter font,
 * smooth spring animations, gradient admin bar, pill-shaped nav items
 * Branding: QER External Training Centre — Meta internal platform
 * Auth: Manus OAuth + local admin fallback
 */
import { type ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";
import { useAdmin } from "@/contexts/AdminContext";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
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
  Sparkles,
  LogIn,
  User,
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

const META_LOGO = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663316909266/PANOQMtFAncFFhQj.png";

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
  const { isAdmin, loginAsAdmin, logout: adminLogout, currentUser } = useAdmin();
  const { isAuthenticated, user: authUser, loading: authLoading, logout: authLogout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [localLoginDialogOpen, setLocalLoginDialogOpen] = useState(false);
  const [password, setPassword] = useState("");

  const navItems = isAdmin ? adminNavItems : viewerNavItems;

  const handleLocalLogin = () => {
    const success = loginAsAdmin(password);
    if (success) {
      setLocalLoginDialogOpen(false);
      setPassword("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleLocalLogin();
  };

  const handleLogout = async () => {
    if (isAuthenticated) {
      await authLogout();
    }
    adminLogout();
  };

  return (
    <div className="min-h-screen gradient-mesh">
      {/* Frosted Glass Navigation */}
      <header className="sticky top-0 z-50 frosted-nav">
        <div className="container flex items-center justify-between h-[64px]">
          {/* Brand — Meta Logo + QER External Training Centre */}
          <Link href="/" className="flex items-center gap-3 no-underline group">
            <img
              src={META_LOGO}
              alt="Meta"
              className="w-10 h-10 object-contain group-hover:scale-105 transition-transform duration-300"
            />
            <div className="flex flex-col">
              <span className="text-[17px] font-bold leading-tight text-foreground tracking-[-0.02em]">
                QER External Training Centre
              </span>
              <span className="text-[11px] text-muted-foreground font-medium hidden sm:block tracking-wide">
                Meta — Vendor Training Management
              </span>
            </div>
          </Link>

          {/* Desktop Navigation — Pill-shaped items */}
          <nav className="hidden md:flex items-center gap-1 bg-secondary/60 rounded-2xl p-1 backdrop-blur-sm">
            {navItems.map(item => {
              const isActive = location === item.path;
              return (
                <Link key={item.path} href={item.path}>
                  <span
                    className={cn(
                      "relative flex items-center gap-1.5 px-3.5 py-[7px] rounded-xl text-[13px] font-medium transition-all duration-300",
                      isActive
                        ? "bg-white text-foreground shadow-[0_1px_3px_oklch(0.4_0.1_270_/_10%),0_1px_2px_oklch(0.4_0.1_270_/_6%)]"
                        : "text-muted-foreground hover:text-foreground hover:bg-white/50"
                    )}
                  >
                    <item.icon className={cn(
                      "w-[15px] h-[15px] transition-colors duration-300",
                      isActive ? "text-primary" : ""
                    )} />
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Right side — Auth controls */}
          <div className="flex items-center gap-2.5">
            {isAuthenticated && authUser ? (
              /* Logged in via OAuth */
              <div className="flex items-center gap-2.5">
                <span className="hidden lg:flex items-center gap-2 text-[13px] text-muted-foreground font-medium">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary/15 to-purple-500/15 flex items-center justify-center ring-1 ring-primary/10">
                    <span className="text-[10px] font-bold gradient-text">
                      {authUser.name?.split(" ").map(n => n[0]).join("").slice(0, 2) ?? "U"}
                    </span>
                  </div>
                  {authUser.name ?? "User"}
                </span>
                {isAdmin && (
                  <span className="hidden lg:flex items-center gap-1 vibrant-badge vibrant-badge-blue text-[11px]">
                    <Shield className="w-3 h-3" />
                    Admin
                  </span>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="gap-1.5 text-[12px] font-semibold rounded-xl h-8 px-3.5 border-border/60 text-muted-foreground hover:text-foreground hover:bg-white/80 bg-white/50 backdrop-blur-sm transition-all duration-300"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </div>
            ) : isAdmin ? (
              /* Local admin mode (password-based) */
              <div className="flex items-center gap-2.5">
                <span className="hidden lg:flex items-center gap-2 text-[13px] text-muted-foreground font-medium">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary/15 to-purple-500/15 flex items-center justify-center ring-1 ring-primary/10">
                    <span className="text-[10px] font-bold gradient-text">
                      {currentUser?.name?.split(" ").map(n => n[0]).join("").slice(0, 2) ?? "AD"}
                    </span>
                  </div>
                  {currentUser?.name ?? "Admin"}
                </span>
                <Button
                  variant="default"
                  size="sm"
                  onClick={adminLogout}
                  className="gap-1.5 text-[12px] font-semibold rounded-xl h-8 px-3.5 gradient-hero text-white hover:opacity-90 shadow-[0_2px_8px_oklch(0.55_0.22_264_/_25%)] transition-all duration-300 border-0"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Exit Admin</span>
                </Button>
              </div>
            ) : (
              /* Not logged in — show Sign In + local admin option */
              <div className="flex items-center gap-2">
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => { window.location.href = getLoginUrl(); }}
                  className="gap-1.5 text-[12px] font-semibold rounded-xl h-8 px-3.5 gradient-hero text-white hover:opacity-90 shadow-[0_2px_8px_oklch(0.55_0.22_264_/_25%)] transition-all duration-300 border-0"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Sign In</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setLocalLoginDialogOpen(true)}
                  className="gap-1.5 text-[12px] font-semibold rounded-xl h-8 px-3.5 border-border/60 text-muted-foreground hover:text-foreground hover:bg-white/80 bg-white/50 backdrop-blur-sm transition-all duration-300"
                >
                  <ShieldOff className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Admin</span>
                </Button>
              </div>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden w-9 h-9 rounded-xl hover:bg-white/60"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Admin mode gradient indicator bar */}
        {isAdmin && (
          <div className="bg-gradient-to-r from-primary/8 via-purple-500/6 to-primary/8 border-t border-primary/10 px-4 py-1.5">
            <div className="container flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span className="text-[12px] font-semibold gradient-text">
                Admin editing mode
              </span>
              <span className="text-[12px] text-muted-foreground">
                — Click any field to edit · Add/remove items · Manage users in Control Panel
              </span>
            </div>
          </div>
        )}

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border/40 bg-white/80 backdrop-blur-xl">
            <nav className="container py-2 flex flex-col gap-0.5">
              {navItems.map(item => {
                const isActive = location === item.path;
                return (
                  <Link key={item.path} href={item.path}>
                    <span
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-medium transition-all duration-200",
                        isActive
                          ? "text-primary bg-primary/8"
                          : "text-foreground hover:bg-secondary/80"
                      )}
                    >
                      <item.icon className={cn("w-[18px] h-[18px]", isActive ? "text-primary" : "text-muted-foreground")} />
                      {item.label}
                    </span>
                  </Link>
                );
              })}
              {/* Mobile auth actions */}
              <div className="border-t border-border/30 mt-1 pt-1">
                {isAuthenticated ? (
                  <button
                    onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-medium text-foreground hover:bg-secondary/80 w-full"
                  >
                    <LogOut className="w-[18px] h-[18px] text-muted-foreground" />
                    Logout
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => { window.location.href = getLoginUrl(); }}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-medium text-primary hover:bg-primary/8 w-full"
                    >
                      <LogIn className="w-[18px] h-[18px]" />
                      Sign In with Manus
                    </button>
                    <button
                      onClick={() => { setMobileMenuOpen(false); setLocalLoginDialogOpen(true); }}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-medium text-foreground hover:bg-secondary/80 w-full"
                    >
                      <Lock className="w-[18px] h-[18px] text-muted-foreground" />
                      Admin Login
                    </button>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Local Admin Login Dialog — Fallback when OAuth is not used */}
      <Dialog open={localLoginDialogOpen} onOpenChange={setLocalLoginDialogOpen}>
        <DialogContent className="sm:max-w-[400px] rounded-2xl border-border/40 bg-white/90 backdrop-blur-xl shadow-[0_8px_40px_oklch(0.4_0.1_270_/_12%)]">
          <DialogHeader>
            <DialogTitle className="text-[18px] font-semibold text-foreground flex items-center gap-2 tracking-[-0.01em]">
              <div className="w-8 h-8 rounded-xl gradient-hero flex items-center justify-center">
                <Lock className="w-4 h-4 text-white" />
              </div>
              Admin Login
            </DialogTitle>
          </DialogHeader>
          <div className="mt-3 space-y-4">
            <p className="text-[13px] text-muted-foreground leading-relaxed">
              Enter the admin password to enable editing mode. Alternatively, you can <button onClick={() => { setLocalLoginDialogOpen(false); window.location.href = getLoginUrl(); }} className="text-primary font-semibold hover:underline">sign in with your Manus account</button> for persistent access.
            </p>
            <div>
              <Label className="text-[12px] text-muted-foreground mb-1.5 block font-semibold uppercase tracking-wider">Password</Label>
              <Input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter admin password"
                className="rounded-xl h-10 border-border/50 bg-secondary/40 focus:bg-white focus:border-primary/30 focus:ring-primary/20 transition-all duration-200"
                autoFocus
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleLocalLogin}
                className="flex-1 gradient-hero text-white font-semibold rounded-xl shadow-[0_2px_8px_oklch(0.55_0.22_264_/_25%)] hover:opacity-90 h-10 border-0 transition-all duration-300"
                disabled={!password}
              >
                <Shield className="w-4 h-4 mr-1.5" />
                Login as Admin
              </Button>
              <Button
                variant="outline"
                onClick={() => { setLocalLoginDialogOpen(false); setPassword(""); }}
                className="border-border/50 text-muted-foreground rounded-xl h-10 hover:bg-secondary/60"
              >
                Cancel
              </Button>
            </div>
            <p className="text-[11px] text-muted-foreground/70 text-center">
              Default password: <code className="bg-secondary/80 px-1.5 py-0.5 rounded-md text-[10px] font-mono text-foreground/60">admin2025</code>
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Main Content */}
      <main className="min-h-[calc(100vh-4rem)]">
        {children}
      </main>

      {/* Footer — Minimal, modern */}
      <footer className="border-t border-border/30 bg-white/40 backdrop-blur-sm">
        <div className="container py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <img src={META_LOGO} alt="Meta" className="w-5 h-5 object-contain opacity-60" />
            <p className="text-[12px] text-muted-foreground font-medium">
              QER External Training Centre — Meta Vendor Training Management
            </p>
          </div>
          <p className="text-[12px] text-muted-foreground/60">
            {isAdmin ? "Admin Mode · " : ""}Training Waves 1–3 · Dublin
          </p>
        </div>
      </footer>
    </div>
  );
}
