"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface GuestUser {
  id: string;
  name: string;
  isGuest: boolean;
  sessionStartedAt: string;
}

interface GuestSessionContextType {
  isGuest: boolean;
  guestUser: GuestUser;
  startGuestSession: () => void;
  showLoginPrompt: boolean;
  setShowLoginPrompt: (show: boolean) => void;
}

const GUEST_STORAGE_KEY = "openblind_guest_session";

const defaultGuest: GuestUser = {
  id: "guest_local_01",
  name: "Usuario Invitado (Movilidad Libre)",
  isGuest: true,
  sessionStartedAt: new Date().toISOString(),
};

const GuestSessionContext = createContext<GuestSessionContextType | undefined>(undefined);

export function GuestSessionProvider({ children }: { children: React.ReactNode }) {
  const [isGuest, setIsGuest] = useState<boolean>(true);
  const [guestUser, setGuestUser] = useState<GuestUser>(defaultGuest);
  const [showLoginPrompt, setShowLoginPrompt] = useState<boolean>(false);

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        setIsGuest(false);
      } else {
        const storedGuest = localStorage.getItem(GUEST_STORAGE_KEY);
        if (storedGuest) {
          setGuestUser(JSON.parse(storedGuest));
        } else {
          localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(defaultGuest));
        }
      }
    } catch (e) {
      console.warn("Could not check guest session storage", e);
    }
  }, []);

  const startGuestSession = () => {
    setIsGuest(true);
    setGuestUser(defaultGuest);
    try {
      localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(defaultGuest));
    } catch (e) {
      console.warn("Failed to persist guest session", e);
    }
  };

  return (
    <GuestSessionContext.Provider
      value={{
        isGuest,
        guestUser,
        startGuestSession,
        showLoginPrompt,
        setShowLoginPrompt,
      }}
    >
      {children}
    </GuestSessionContext.Provider>
  );
}

export function useGuestSession() {
  const context = useContext(GuestSessionContext);
  if (!context) {
    throw new Error("useGuestSession must be used within a GuestSessionProvider");
  }
  return context;
}
