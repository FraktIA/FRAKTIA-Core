import type { Metadata } from "next";
import "./globals.css";
import WalletProvider from "@/providers/WalletProvider";
import { headers } from "next/headers";
import { ReduxProvider } from "@/redux/provider";

export const metadata: Metadata = {
  title: "Fraktia - No-Code Agent Builder",
  description:
    "Build powerful AI agents visually with Fraktia's no-code flow builder",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersObj = await headers();
  const cookies = headersObj.get("cookie");
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <WalletProvider cookies={cookies}>
          <ReduxProvider>
            <main className="h-full">{children}</main>
          </ReduxProvider>
        </WalletProvider>
      </body>
    </html>
  );
}
