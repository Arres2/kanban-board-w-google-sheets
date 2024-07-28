import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ContexProvider from "static/components/context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tabla de Leads",
  description: "Challenge",
};


export default function RootLayout({children,}: Readonly<{children: React.ReactNode;}>) {
  return (
    <html lang="en">
      <body>
        <ContexProvider>

            {children}

        </ContexProvider>
      </body>
    </html>
  );
}
