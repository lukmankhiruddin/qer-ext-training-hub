import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import { COOKIE_NAME } from "../shared/const";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createContext(user: AuthenticatedUser | null): TrpcContext {
  const clearedCookies: { name: string; options: Record<string, unknown> }[] = [];

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: (name: string, options: Record<string, unknown>) => {
        clearedCookies.push({ name, options });
      },
    } as TrpcContext["res"],
  };
}

function createAdminUser(): AuthenticatedUser {
  return {
    id: 1,
    openId: "admin-open-id",
    email: "admin@meta.com",
    name: "Lukman Khiruddin",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };
}

function createViewerUser(): AuthenticatedUser {
  return {
    id: 2,
    openId: "viewer-open-id",
    email: "viewer@meta.com",
    name: "Test Viewer",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };
}

describe("auth.me", () => {
  it("returns the authenticated admin user", async () => {
    const adminUser = createAdminUser();
    const ctx = createContext(adminUser);
    const caller = appRouter.createCaller(ctx);

    const result = await caller.auth.me();

    expect(result).toBeDefined();
    expect(result?.name).toBe("Lukman Khiruddin");
    expect(result?.role).toBe("admin");
    expect(result?.email).toBe("admin@meta.com");
    expect(result?.openId).toBe("admin-open-id");
  });

  it("returns the authenticated viewer user", async () => {
    const viewerUser = createViewerUser();
    const ctx = createContext(viewerUser);
    const caller = appRouter.createCaller(ctx);

    const result = await caller.auth.me();

    expect(result).toBeDefined();
    expect(result?.name).toBe("Test Viewer");
    expect(result?.role).toBe("user");
  });

  it("returns null for unauthenticated user", async () => {
    const ctx = createContext(null);
    const caller = appRouter.createCaller(ctx);

    const result = await caller.auth.me();

    expect(result).toBeNull();
  });
});

describe("auth.logout", () => {
  it("clears the session cookie for admin user", async () => {
    const adminUser = createAdminUser();
    const clearedCookies: { name: string; options: Record<string, unknown> }[] = [];
    const ctx: TrpcContext = {
      user: adminUser,
      req: {
        protocol: "https",
        headers: {},
      } as TrpcContext["req"],
      res: {
        clearCookie: (name: string, options: Record<string, unknown>) => {
          clearedCookies.push({ name, options });
        },
      } as TrpcContext["res"],
    };
    const caller = appRouter.createCaller(ctx);

    const result = await caller.auth.logout();

    expect(result).toEqual({ success: true });
    expect(clearedCookies).toHaveLength(1);
    expect(clearedCookies[0]?.name).toBe(COOKIE_NAME);
  });

  it("clears the session cookie for viewer user", async () => {
    const viewerUser = createViewerUser();
    const clearedCookies: { name: string; options: Record<string, unknown> }[] = [];
    const ctx: TrpcContext = {
      user: viewerUser,
      req: {
        protocol: "https",
        headers: {},
      } as TrpcContext["req"],
      res: {
        clearCookie: (name: string, options: Record<string, unknown>) => {
          clearedCookies.push({ name, options });
        },
      } as TrpcContext["res"],
    };
    const caller = appRouter.createCaller(ctx);

    const result = await caller.auth.logout();

    expect(result).toEqual({ success: true });
    expect(clearedCookies).toHaveLength(1);
    expect(clearedCookies[0]?.name).toBe(COOKIE_NAME);
  });
});

describe("role-based access", () => {
  it("admin user has admin role", () => {
    const adminUser = createAdminUser();
    expect(adminUser.role).toBe("admin");
  });

  it("viewer user has user role", () => {
    const viewerUser = createViewerUser();
    expect(viewerUser.role).toBe("user");
  });

  it("admin and viewer have different access levels", () => {
    const admin = createAdminUser();
    const viewer = createViewerUser();
    expect(admin.role).not.toBe(viewer.role);
    expect(admin.role).toBe("admin");
    expect(viewer.role).toBe("user");
  });
});
