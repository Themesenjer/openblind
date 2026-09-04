import type { Metadata } from "next";
import "./globals.css";
import { AccessibilityProvider } from "@/features/accessibility/AccessibilityContext";
import { GuestSessionProvider } from "@/features/auth/GuestSessionContext";

export const metadata: Metadata = {
  title: "OpenBlind",
  description: "Plataforma de navegación asistida y accesible.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>
        <GuestSessionProvider>
          <AccessibilityProvider>{children}</AccessibilityProvider>
        </GuestSessionProvider>
      </body>
    </html>
  );
}
