/*
 * Admin Context — Integrates with Manus OAuth for role-based access
 * Admin users are determined by their database role (set via DB or owner auto-promotion)
 * Activity logging and editing state management
 */
import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user";
  openId: string;
}

interface AdminContextType {
  isAdmin: boolean;
  isAuthenticated: boolean;
  authLoading: boolean;
  currentUser: AdminUser | null;
  loginAsAdmin: (password: string) => boolean;
  logout: () => void;
  editingField: string | null;
  setEditingField: (field: string | null) => void;
  activityLog: ActivityEntry[];
  logActivity: (action: string, detail: string) => void;
}

export interface ActivityEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  detail: string;
}

// Fallback password for local admin mode when not logged in via OAuth
const LOCAL_ADMIN_PASSWORD = "admin2025";

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const { user: authUser, loading: authLoading, isAuthenticated, logout: authLogout } = useAuth();

  // Local admin mode fallback (for when OAuth is not used)
  const [localAdminMode, setLocalAdminMode] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [activityLog, setActivityLog] = useState<ActivityEntry[]>([
    { id: "log-1", timestamp: "2025-02-10T09:00:00Z", user: "System", action: "Program Updated", detail: "Wave 2 training schedule published" },
    { id: "log-2", timestamp: "2025-02-10T08:30:00Z", user: "System", action: "SME Assigned", detail: "Farrukh Ahmed assigned to Live Video Training" },
    { id: "log-3", timestamp: "2025-02-09T16:00:00Z", user: "System", action: "Wave Created", detail: "Wave 3 — Advanced Review & Certification created" },
  ]);

  // Determine admin status: OAuth user with admin role OR local admin mode
  const isAdmin = useMemo(() => {
    if (isAuthenticated && authUser && authUser.role === "admin") return true;
    return localAdminMode;
  }, [isAuthenticated, authUser, localAdminMode]);

  const currentUser = useMemo((): AdminUser | null => {
    if (isAuthenticated && authUser) {
      return {
        id: authUser.id,
        name: authUser.name ?? "User",
        email: authUser.email ?? "",
        role: authUser.role as "admin" | "user",
        openId: authUser.openId,
      };
    }
    if (localAdminMode) {
      return {
        id: 0,
        name: "Local Admin",
        email: "admin@local",
        role: "admin",
        openId: "local",
      };
    }
    return null;
  }, [isAuthenticated, authUser, localAdminMode]);

  const logActivity = useCallback((action: string, detail: string) => {
    setActivityLog(prev => [
      {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString(),
        user: currentUser?.name ?? "Admin",
        action,
        detail,
      },
      ...prev,
    ].slice(0, 50));
  }, [currentUser]);

  // Login: If OAuth user is already admin, just confirm. Otherwise use local password.
  const loginAsAdmin = useCallback((password: string): boolean => {
    if (isAuthenticated && authUser && authUser.role === "admin") {
      toast.success("Admin mode activated", {
        description: "You're logged in as admin via your account.",
        duration: 3000,
      });
      return true;
    }
    if (password === LOCAL_ADMIN_PASSWORD) {
      setLocalAdminMode(true);
      toast.success("Admin mode activated", {
        description: "You can now edit all content directly on the website.",
        duration: 3000,
      });
      return true;
    }
    toast.error("Invalid password", {
      description: "Please enter the correct admin password.",
      duration: 3000,
    });
    return false;
  }, [isAuthenticated, authUser]);

  const logout = useCallback(() => {
    if (localAdminMode) {
      setLocalAdminMode(false);
      setEditingField(null);
      toast("Switched to Viewer mode", {
        description: "View-only mode restored.",
        duration: 2000,
      });
    } else if (isAuthenticated) {
      authLogout();
      setEditingField(null);
      toast("Logged out", {
        description: "You have been logged out.",
        duration: 2000,
      });
    }
  }, [localAdminMode, isAuthenticated, authLogout]);

  return (
    <AdminContext.Provider value={{
      isAdmin,
      isAuthenticated,
      authLoading,
      currentUser,
      loginAsAdmin,
      logout,
      editingField,
      setEditingField,
      activityLog,
      logActivity,
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used within AdminProvider");
  return ctx;
}
