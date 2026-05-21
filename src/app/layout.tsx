import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Panel — Marketing Dashboard",
  description: "Dashboard para freelancer de marketing",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased bg-bg text-text">{children}</body>
    </html>
  );
}
