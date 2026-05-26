import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/auth/auth-provider";
import { ThemeScript } from "@/components/common/theme-script";

export const metadata: Metadata = {
  title: "Dental Validation Platform",
  description: "External validation benchmark for AI-assisted dental radiograph diagnosis."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
