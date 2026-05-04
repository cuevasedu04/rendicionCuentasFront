'use client';

import { useSession } from 'next-auth/react';

export default function PlecaBackground() {
  const { status } = useSession();
  const opacity = status === 'authenticated' ? 'opacity-[0.035]' : 'opacity-[0.22]';
  return (
    <div
      className={`absolute inset-0 -z-10 bg-[url('/pleca.png')] bg-cover bg-no-repeat transition-opacity duration-700 ${opacity}`}
    />
  );
}
