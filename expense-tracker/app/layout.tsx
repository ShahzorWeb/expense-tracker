import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Expense Tracker",
  description: "Track your expenses smarter with AI-powered insights.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
