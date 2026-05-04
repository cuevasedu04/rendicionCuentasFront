'use client';

import { useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { motion } from 'motion/react';
import PillNav from './PillNav';

const NAV_ITEMS = [
  { label: 'Excepciones', href: '/dashboard/excepciones' },
  { label: 'Informe de Gestión', href: '/dashboard/informe-gestion' },
  { label: 'Acta Entrega-Recepción', href: '/dashboard/acta-entrega' },
];

const spring = { type: 'spring', stiffness: 260, damping: 32 };

export default function PillNavBar() {
  const { status } = useSession();
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      // Only hide after scrolling past 80px to avoid triggering at page top
      if (y > 80) {
        setHidden(y > lastY.current);
      } else {
        setHidden(false);
      }
      lastY.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (status !== 'authenticated') return null;

  return (
    <motion.div
      className="fixed top-28 left-0 w-full z-30 flex justify-center py-2"
      animate={{ y: hidden ? '-110%' : '0%' }}
      transition={spring}
      style={{ willChange: 'transform' }}
    >
      <PillNav
        logo="/anam.png"
        logoAlt="ANAM"
        logoHref="/dashboard"
        items={NAV_ITEMS}
        activeHref={pathname}
        baseColor="#621f32"
        pillColor="rgba(255,255,255,0.15)"
        pillTextColor="#ffffff"
        hoveredPillTextColor="#ffffff"
        initialLoadAnimation={false}
      />
    </motion.div>
  );
}
