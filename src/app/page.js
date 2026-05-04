'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import DotField from '@/components/DotField';
import RotatingText from '@/components/ui/RotatingText';
import {
  DocumentTextIcon,
  ClipboardDocumentCheckIcon,
  AdjustmentsHorizontalIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';

const spring = { type: 'spring', stiffness: 90, damping: 22 };

const modules = [
  {
    icon: AdjustmentsHorizontalIcon,
    title: 'Excepciones',
    desc: 'Configura qué servidores entregan Acta vs. Informe de Gestión',
    delay: 0.38,
    style: { top: 0, left: '1.5rem', rotate: '-2deg' },
    accent: 'text-slate-600',
    dot: 'bg-slate-400',
  },
  {
    icon: DocumentTextIcon,
    title: 'Informe de Gestión',
    desc: 'Personal nivel 3-5 sin manejo de recursos asignados',
    delay: 0.50,
    style: { top: '5.5rem', right: 0, rotate: '1.5deg' },
    accent: 'text-[#621f32]',
    dot: 'bg-[#621f32]',
  },
  {
    icon: ClipboardDocumentCheckIcon,
    title: 'Acta Entrega-Recepción',
    desc: 'Niveles 1-2 y servidores con chequeras o inventarios',
    delay: 0.62,
    style: { bottom: 0, left: '0.75rem', rotate: '-1deg' },
    accent: 'text-amber-700',
    dot: 'bg-amber-500',
  },
];

export default function Home() {
  return (
    <div className="relative min-h-[calc(100dvh-144px)] flex items-center">

      <div className="fixed inset-0 z-0 pointer-events-none">
        <DotField
          dotRadius={4}
          dotSpacing={21}
          cursorRadius={500}
          cursorForce={0.66}
          bulgeOnly={true}
          bulgeStrength={68}
          glowRadius={160}
          waveAmplitude={9}
          sparkle={true}
          gradientFrom="rgba(98, 31, 50, 0.6)"
          gradientTo="rgba(138, 42, 59, 0.4)"
          glowColor="#ffffff"
        />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-10 xl:px-8 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-12 xl:gap-20 items-center">

          {/* ── Left: content ─────────────────────────── */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, delay: 0.06 }}
              className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-[#621f32]/25 bg-[#621f32]/8 text-[#621f32] text-sm font-medium mb-7"
            >
              <span className="h-2 w-2 rounded-full bg-[#621f32] animate-pulse flex-shrink-0" />
              Monitoreo de{' '}
              <RotatingText
                texts={['Rendición de Cuentas', 'Informes de Gestión', 'Actas Entrega-Recepción']}
                mainClassName="font-bold ml-0.5"
                staggerFrom="last"
                initial={{ y: '100%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: '-120%', opacity: 0 }}
                staggerDuration={0.02}
                splitLevelClassName="overflow-hidden"
                transition={{ type: 'spring', damping: 25, stiffness: 120 }}
                rotationInterval={3500}
              />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, delay: 0.16 }}
              className="text-5xl md:text-6xl xl:text-7xl font-bold tracking-tighter leading-[0.93] text-zinc-900 mb-7"
            >
              Sistema de
              <br />
              Monitoreo de
              <br />
              <span className="text-[#621f32]">Rendición</span>
              <br />
              <span className="text-[#621f32]">de Cuentas</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, delay: 0.24 }}
              className="text-base text-zinc-500 leading-relaxed max-w-[52ch] mb-10"
            >
              Seguimiento y control del estado de entrega de Actas Entrega-Recepción
              e Informes de Gestión del personal de tu unidad administrativa.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, delay: 0.30 }}
              className="flex items-center gap-5"
            >
              <Link
                href="/login"
                className="group inline-flex items-center gap-2.5 rounded-xl bg-[#621f32] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_4px_20px_rgba(98,31,50,0.38)] hover:bg-[#4a1726] hover:shadow-[0_8px_28px_rgba(98,31,50,0.48)] hover:-translate-y-[2px] active:translate-y-0 active:scale-[0.98] transition-all duration-200"
              >
                Iniciar Sesión
                <ArrowRightIcon className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
              <span className="text-xs text-zinc-400 leading-snug max-w-[18ch]">
                Acceso exclusivo personal ANAM
              </span>
            </motion.div>
          </div>

          {/* ── Right: module preview cards ───────────── */}
          <div className="hidden lg:block relative h-[400px]">
            {modules.map(({ icon: Icon, title, desc, delay, style, accent, dot }) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 28, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ ...spring, delay }}
                style={style}
                className="absolute w-60 xl:w-64 rounded-2xl bg-white/68 backdrop-blur-xl border border-white/65 shadow-[0_8px_32px_rgba(0,0,0,0.07),inset_0_1px_0_rgba(255,255,255,0.85)] p-5"
              >
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="h-8 w-8 rounded-xl bg-white/80 border border-white/60 flex items-center justify-center shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
                    <Icon className={`h-4.5 w-4.5 ${accent}`} />
                  </div>
                  <span className={`h-1.5 w-1.5 rounded-full ${dot} ml-auto`} />
                </div>
                <p className="text-sm font-semibold text-zinc-800 leading-tight mb-1.5">{title}</p>
                <p className="text-xs text-zinc-500 leading-snug">{desc}</p>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
