import type { Metadata } from "next";
import "./globals.css";
import SidebarShell from "@/components/SidebarShell";

export const metadata: Metadata = {
  title: "Fraktia - No-Code Agent Builder",
  description:
    "Build powerful AI agents visually with Fraktia's no-code flow builder",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <SidebarShell>{children}</SidebarShell>
      </body>
    </html>
  );
}
