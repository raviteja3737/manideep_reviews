import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: "variable",
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "A Reader's First Review — Zidd",
  description:
    "Manideep Polepalli's first-ever book review. Zidd — a little madness, a lot of love, and a ₹10 crore revenge plan.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      // Font variables must live on :root — the @theme font tokens in
      // globals.css reference them there (next/font variable classes on
      // <body> would leave --font-sans undefined at the html level).
      className={`${playfair.variable} ${inter.variable}`}
    >
      <body className="bg-paper font-sans text-ink antialiased">
        {children}
      </body>
    </html>
  );
}
