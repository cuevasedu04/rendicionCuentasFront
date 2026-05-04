import { Noto_Sans } from "next/font/google";
import "./globals.css";
import Banner from "@/components/Banner";
import Navbar from "@/components/Navbar";
import PillNavBar from "@/components/PillNavBar";
import { SessionProvider } from "next-auth/react";
import { Fade } from "react-awesome-reveal";

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
        <div className="absolute inset-0 -z-10 bg-[url('/pleca.png')] bg-cover bg-no-repeat opacity-30"></div>

        <SessionProvider>
          {/* Banner gobierno (fixed top-0 h-20) */}
          <Banner />

          {/* Navbar blanco (fixed top-20 h-16) */}
          <Navbar />

          {/* PillNav — solo visible cuando autenticado (fixed top-36) */}
          <PillNavBar />

          <Fade>
            {/*
              pt-[210px]: 80px (banner) + 64px (navbar) + 56px (pillnav + gap) + 10px extra
              Esto evita que el contenido quede debajo de los headers fijos.
            */}
            <main className="flex-grow relative z-10 flex flex-col pt-[210px]">
              {children}
            </main>
          </Fade>
        </SessionProvider>
      </body>
    </html>
  );
}
