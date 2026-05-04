import { Noto_Sans } from "next/font/google";
import "./globals.css";
import Banner from "@/components/Banner";
import Navbar from "@/components/Navbar";
import PillNavBar from "@/components/PillNavBar";
import PlecaBackground from "@/components/PlecaBackground";
import { SessionProvider } from "next-auth/react";
import MainPadding from "@/components/MainPadding";

const notoSans = Noto_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-noto-sans",
});

export const metadata = {
  title: "Sistema de Monitoreo de Rendición de Cuentas — ANAM",
  description: "OIC - Recursos Humanos — Agencia Nacional de Aduanas de México",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="es"
      className={`${notoSans.variable} h-full antialiased font-sans`}
    >
      <body className="min-h-full flex flex-col relative">
        <SessionProvider>
          <PlecaBackground />

          {/* Banner gobierno (fixed top-0 h-20) */}
          <Banner />

          {/* Navbar blanco (fixed top-20 h-16) */}
          <Navbar />

          {/* PillNav — solo visible cuando autenticado (fixed top-36) */}
          <PillNavBar />

          <MainPadding>
            {children}
          </MainPadding>
        </SessionProvider>
      </body>
    </html>
  );
}
