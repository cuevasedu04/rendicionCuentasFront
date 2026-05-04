import Link from 'next/link';

export default function Banner() {
  return (
    <nav className="fixed top-0 left-0 w-full bg-[#621f32] h-12 flex items-center z-50">
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 flex justify-between items-center">
        <Link href="/" className="flex items-center flex-shrink-0">
          <img
            src="https://framework-gb.cdn.gob.mx/gobmx/img/logo_blanco.svg"
            alt="Logo Gobierno de México"
            className="h-7 w-auto"
          />
        </Link>
        <div className="flex items-center gap-5 text-white text-sm">
          <Link href="/tramites" className="hover:underline underline-offset-4 transition-all">
            Trámites
          </Link>
          <Link href="/gobierno" className="hover:underline underline-offset-4 transition-all">
            Gobierno
          </Link>
          <button aria-label="Buscar" className="text-white hover:text-white/70 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}
