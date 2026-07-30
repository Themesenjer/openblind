import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OpenBlind",
  description: "Plataforma de navegación asistida y accesible.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
