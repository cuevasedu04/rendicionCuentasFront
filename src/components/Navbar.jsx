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
      <img src="/anam.png" alt="Logo ANAM" className="h-10 w-auto brightness-0 invert" />
      <div className="hidden md:block h-7 w-[1px] bg-white/20" />
      <span className="text-white font-semibold text-sm md:text-base leading-tight max-w-[200px] md:max-w-none">
        Sistema de Monitoreo de Rendición de Cuentas
      </span>
    </>
  );

  return (
    <nav className="fixed top-12 left-0 w-full bg-[#4a1726] h-16 flex items-center z-40 border-b border-white/8 shadow-[0_2px_8px_rgba(0,0,0,0.25)]">
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 flex justify-between items-center">

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

        {status === 'authenticated' && !isLoginPage && !isLandingPage && (
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/25 text-sm font-medium text-white/85 hover:text-white hover:border-white/50 hover:bg-white/10 transition-all duration-200"
          >
            <ArrowRightOnRectangleIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Salir</span>
          </button>
        )}
      </div>
    </nav>
  );
}
