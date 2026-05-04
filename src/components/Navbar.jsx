'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

export default function Navbar() {
  const pathname = usePathname();
  const { status } = useSession();
  const isLandingPage = pathname === '/';
  const isLoginPage = pathname === '/login';

  const logoContent = (
    <>
      <img src="/anam.png" alt="Logo ANAM" className="h-12 w-auto" />
      <div className="hidden md:block h-8 w-[1px] bg-gray-300" />
      <span className="text-[#621f32] font-semibold text-sm md:text-lg leading-tight max-w-[200px] md:max-w-none">
        Sistema de Monitoreo de Rendición de Cuentas
      </span>
    </>
  );

  return (
    <nav className="fixed top-20 left-0 w-full bg-white/90 backdrop-blur-sm border-b border-gray-200 shadow-sm h-16 flex items-center z-40">
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 flex justify-between items-center">

        {/* Logo y nombre del sistema — sin link en landing, link a dashboard si autenticado */}
        <div className="flex items-center space-x-4">
          {status === 'authenticated' && !isLandingPage ? (
            <Link href="/dashboard" className="flex items-center space-x-3">
              {logoContent}
            </Link>
          ) : (
            <div className="flex items-center space-x-3">
              {logoContent}
            </div>
          )}
        </div>

        {/* Botón Salir — solo visible cuando hay sesión activa y no es la login ni la landing */}
        {status === 'authenticated' && !isLoginPage && !isLandingPage && (
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:text-[#621f32] hover:border-[#621f32]/40 hover:bg-[#621f32]/5 transition-colors"
          >
            <ArrowRightOnRectangleIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Salir</span>
          </button>
        )}
      </div>
    </nav>
  );
}
