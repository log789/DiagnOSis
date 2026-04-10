"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AppUser, UserRole } from "@/types/user";

interface AppState {
  user: AppUser | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  setSession: (user: AppUser) => void;
  clearSession: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      role: null,
      isAuthenticated: false,
      setSession: (user) =>
        set({
          user,
          role: user.role,
          isAuthenticated: true
        }),
      clearSession: () =>
        set({
          user: null,
          role: null,
          isAuthenticated: false
        })
    }),
    { name: "diagnosis-app-store" }
  )
);
