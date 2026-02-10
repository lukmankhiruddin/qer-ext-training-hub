/*
 * Admin Context — User role management with admin/viewer modes
 * Design: Meta/Facebook — Clean, functional
 * Supports multiple admins, password-protected access, and activity logging
 */
import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { toast } from "sonner";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "viewer";
  addedAt: string;
}

interface AdminContextType {
  isAdmin: boolean;
  currentUser: AdminUser | null;
  adminUsers: AdminUser[];
  loginAsAdmin: (password: string) => boolean;
  logout: () => void;
  addAdminUser: (user: Omit<AdminUser, "id" | "addedAt">) => void;
  removeAdminUser: (id: string) => void;
  updateAdminUser: (id: string, updates: Partial<AdminUser>) => void;
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

const ADMIN_PASSWORD = "admin2025";

const defaultAdmins: AdminUser[] = [
  { id: "admin-1", name: "You (Owner)", email: "owner@comhub.io", role: "admin", addedAt: "2025-01-15" },
];

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(defaultAdmins);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [activityLog, setActivityLog] = useState<ActivityEntry[]>([
    { id: "log-1", timestamp: "2025-02-10T09:00:00Z", user: "System", action: "Program Updated", detail: "Wave 2 training schedule published" },
    { id: "log-2", timestamp: "2025-02-10T08:30:00Z", user: "System", action: "SME Assigned", detail: "Farrukh Ahmed assigned to Live Video Training" },
    { id: "log-3", timestamp: "2025-02-09T16:00:00Z", user: "System", action: "Wave Created", detail: "Wave 3 — Advanced Review & Certification created" },
  ]);

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
    ].slice(0, 50)); // Keep last 50 entries
  }, [currentUser]);

  const loginAsAdmin = useCallback((password: string): boolean => {
    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      setCurrentUser(adminUsers[0]);
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
  }, [adminUsers]);

  const logout = useCallback(() => {
    setIsAdmin(false);
    setCurrentUser(null);
    setEditingField(null);
    toast("Switched to Viewer mode", {
      description: "View-only mode restored.",
      duration: 2000,
    });
  }, []);

  const addAdminUser = useCallback((user: Omit<AdminUser, "id" | "addedAt">) => {
    const newUser: AdminUser = {
      ...user,
      id: `admin-${Date.now()}`,
      addedAt: new Date().toISOString().split("T")[0],
    };
    setAdminUsers(prev => [...prev, newUser]);
    logActivity("User Added", `${newUser.name} (${newUser.email}) added as ${newUser.role}`);
    toast.success("User added", {
      description: `${newUser.name} has been added as ${newUser.role}.`,
    });
  }, [logActivity]);

  const removeAdminUser = useCallback((id: string) => {
    if (id === "admin-1") {
      toast.error("Cannot remove owner", { description: "The owner account cannot be removed." });
      return;
    }
    setAdminUsers(prev => {
      const user = prev.find(u => u.id === id);
      if (user) {
        logActivity("User Removed", `${user.name} (${user.email}) removed`);
      }
      return prev.filter(u => u.id !== id);
    });
    toast("User removed");
  }, [logActivity]);

  const updateAdminUser = useCallback((id: string, updates: Partial<AdminUser>) => {
    setAdminUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
    toast("User updated");
  }, []);

  return (
    <AdminContext.Provider value={{
      isAdmin,
      currentUser,
      adminUsers,
      loginAsAdmin,
      logout,
      addAdminUser,
      removeAdminUser,
      updateAdminUser,
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
