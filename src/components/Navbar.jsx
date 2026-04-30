import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="fixed top-20 left-0 w-full bg-white/90 backdrop-blur-sm border-b border-gray-200 shadow-sm h-16 flex items-center z-40">
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 flex justify-between items-center">
        {/* Logo and System Name */}
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-3">
            <img
              src="/anam.png"
              alt="Logo ANAM"
              className="h-12 w-auto"
            />
            <div className="hidden md:block h-8 w-[1px] bg-gray-300"></div>
            <span className="text-[#621f32] font-semibold text-sm md:text-lg leading-tight max-w-[200px] md:max-w-none">
              Sistema de Monitoreo de Rendición de Cuentas
            </span>
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center space-x-8">
          <Link
            href="/"
            className="text-gray-700 hover:text-[#621f32] font-medium transition-colors"
          >
            Página de inicio
          </Link>
          <Link
            href="/login"
            className="bg-[#621f32] text-white px-4 py-2 rounded-md hover:bg-[#4d1827] transition-colors font-medium"
          >
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
}
