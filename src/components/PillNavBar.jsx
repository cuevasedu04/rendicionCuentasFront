'use client';

import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import PillNav from './PillNav';

const NAV_ITEMS = [
  { label: 'Excepciones', href: '/dashboard/excepciones' },
  { label: 'Informe de Gestión', href: '/dashboard/informe-gestion' },
  { label: 'Acta Entrega-Recepción', href: '/dashboard/acta-entrega' },
];

export default function PillNavBar() {
  const { status } = useSession();
  const pathname = usePathname();

  if (status !== 'authenticated') return null;

  return (
    <div className="fixed top-36 left-0 w-full z-30 flex justify-center py-2">
      <PillNav
        logo="/anam.png"
        logoAlt="ANAM"
        logoHref="/dashboard"
        items={NAV_ITEMS}
        activeHref={pathname}
        baseColor="#621f32"
        pillColor="#ffffff"
        pillTextColor="#621f32"
        hoveredPillTextColor="#ffffff"
        initialLoadAnimation={false}
      />
    </div>
  );
}
