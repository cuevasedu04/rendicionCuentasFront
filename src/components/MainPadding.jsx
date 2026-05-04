'use client';

import { useSession } from 'next-auth/react';

export default function MainPadding({ children }) {
  const { status } = useSession();
  const isAuthenticated = status === 'authenticated';

  return (
    <main className={`flex-grow relative z-10 flex flex-col ${isAuthenticated ? 'pt-[168px]' : 'pt-[112px]'}`}>
      {children}
    </main>
  );
}
