import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { FirebaseClientProvider } from "@/firebase/client-provider";
import { RouteShell } from "@/components/route-shell";

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: '--font-playfair',
});

export const metadata: Metadata = {
  title: "Voxen",
  description: "Central de Inteligência e Operações Estratégicas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body className={`${inter.variable} ${playfair.variable}`}>
        <FirebaseClientProvider>
          <RouteShell>{children}</RouteShell>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
