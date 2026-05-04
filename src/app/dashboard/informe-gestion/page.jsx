'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { createApi } from '@/lib/api';
import { motion, AnimatePresence } from 'motion/react';
import {
  ClockIcon,
  ExclamationTriangleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ArrowPathIcon,
  BuildingOffice2Icon,
  UserIcon,
  CalendarDaysIcon,
} from '@heroicons/react/24/outline';

const spring = { type: 'spring', stiffness: 100, damping: 22 };

function diasColor(restantes) {
  if (restantes >= 8) return { bar: 'bg-emerald-500', badge: 'bg-emerald-100 text-emerald-800', ring: 'ring-emerald-200' };
  if (restantes >= 4) return { bar: 'bg-amber-400', badge: 'bg-amber-100 text-amber-800', ring: 'ring-amber-200' };
  return { bar: 'bg-red-500', badge: 'bg-red-100 text-red-800', ring: 'ring-red-200' };
}

function ProgressBar({ transcurridos, total = 15 }) {
  const pct = Math.min(100, (transcurridos / total) * 100);
  const { bar } = diasColor(total - transcurridos);
  return (
    <div className="w-full bg-zinc-100 rounded-full h-1 overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ ...spring, delay: 0.1 }}
        className={`h-1 rounded-full ${bar}`}
      />
    </div>
  );
}

function EmpleadoCardActivo({ emp, index }) {
  const restantes = emp.dias_habiles_restantes ?? 0;
  const { badge } = diasColor(restantes);
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...spring, delay: index * 0.04 }}
      className="bg-white rounded-2xl border border-zinc-200/80 p-4 hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:-translate-y-[1px] transition-all duration-200 shadow-[0_1px_4px_rgba(0,0,0,0.04)]"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-zinc-100 flex items-center justify-center ring-1 ring-zinc-200">
            <UserIcon className="h-4 w-4 text-zinc-400" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-zinc-900 text-sm leading-tight truncate">
              {emp.nombre_completo ?? '—'}
            </p>
            <p className="text-xs text-zinc-400 font-mono mt-0.5">{emp.rfc ?? '—'}</p>
          </div>
        </div>
        <span className={`flex-shrink-0 px-2.5 py-1 rounded-full text-xs font-bold ${badge}`}>
          {restantes === 0 ? 'Vence hoy' : `${restantes}d`}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-zinc-500 mb-3">
        <span>Grado <span className="font-medium text-zinc-700">{emp.grado ?? '—'}</span></span>
        <span>Nivel <span className="font-medium text-zinc-700">{emp.nivel_desc ?? emp.nivel ?? '—'}</span></span>
        <span className="flex items-center gap-1 col-span-2">
          <CalendarDaysIcon className="h-3 w-3 text-[#621f32] flex-shrink-0" />
          Límite: <span className="font-semibold text-[#621f32] ml-0.5">{emp.fecha_limite_entrega ?? '—'}</span>
        </span>
      </div>

      <div className="space-y-1">
        <div className="flex justify-between text-xs text-zinc-400">
          <span>{emp.dias_habiles_transcurridos} días</span>
          <span>15 días plazo</span>
        </div>
        <ProgressBar transcurridos={emp.dias_habiles_transcurridos ?? 0} />
      </div>
    </motion.div>
  );
}

function EmpleadoCardExcedido({ emp, index }) {
  const excedidos = emp.dias_habiles_excedidos ?? 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...spring, delay: index * 0.04 }}
      className="bg-white rounded-2xl border border-red-200/80 p-4 hover:shadow-[0_4px_16px_rgba(239,68,68,0.08)] hover:-translate-y-[1px] transition-all duration-200 shadow-[0_1px_4px_rgba(0,0,0,0.04)]"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-red-50 flex items-center justify-center ring-1 ring-red-200">
            <ExclamationTriangleIcon className="h-4 w-4 text-red-500" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-zinc-900 text-sm leading-tight truncate">
              {emp.nombre_completo ?? '—'}
            </p>
            <p className="text-xs text-zinc-400 font-mono mt-0.5">{emp.rfc ?? '—'}</p>
          </div>
        </div>
        <span className="flex-shrink-0 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">
          +{excedidos}d
        </span>
      </div>

      <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-zinc-500 mb-3">
        <span>Grado <span className="font-medium text-zinc-700">{emp.grado ?? '—'}</span></span>
        <span>Nivel <span className="font-medium text-zinc-700">{emp.nivel_desc ?? emp.nivel ?? '—'}</span></span>
        <span className="flex items-center gap-1 col-span-2">
          <CalendarDaysIcon className="h-3 w-3 text-red-500 flex-shrink-0" />
          Límite fue: <span className="font-semibold text-red-600 ml-0.5">{emp.fecha_limite_entrega ?? '—'}</span>
        </span>
      </div>

      <div className="pt-2 border-t border-red-100">
        <div className="w-full h-1 rounded-full bg-red-100 overflow-hidden">
          <div className="h-1 rounded-full bg-red-500 w-full" />
        </div>
        <p className="text-xs text-red-500 font-medium mt-1.5">{emp.dias_habiles_transcurridos} días transcurridos</p>
      </div>
    </motion.div>
  );
}

function GrupoUnidad({ nombre, empleados, tipo, globalIndex }) {
  const [open, setOpen] = useState(true);
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...spring, delay: globalIndex * 0.06 }}
      className="rounded-2xl border border-zinc-200/80 overflow-hidden bg-white/60 shadow-[0_1px_4px_rgba(0,0,0,0.04)]"
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-3.5 bg-white/80 hover:bg-zinc-50/80 transition-colors text-left"
      >
        <div className="flex items-center gap-2.5">
          <BuildingOffice2Icon className="h-4.5 w-4.5 text-[#621f32] flex-shrink-0" />
          <span className="font-semibold text-zinc-800 text-sm">{nombre}</span>
          <span className="px-2 py-0.5 rounded-full bg-[#621f32]/10 text-[#621f32] text-xs font-bold">
            {empleados.length}
          </span>
        </div>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={spring}>
          <ChevronDownIcon className="h-4 w-4 text-zinc-400" />
        </motion.div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ ...spring, opacity: { duration: 0.15 } }}
            className="overflow-hidden"
          >
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {empleados.map((emp, i) =>
                tipo === 'activos'
                  ? <EmpleadoCardActivo key={emp.rfc ?? i} emp={emp} index={i} />
                  : <EmpleadoCardExcedido key={emp.rfc ?? i} emp={emp} index={i} />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function DockCard({ num, title, subtitle, icon: Icon, count, active, loading, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={spring}
      className={`w-full text-left rounded-2xl border-2 p-5 transition-colors duration-200 group
        ${active
          ? 'border-[#621f32] bg-[#621f32]/5 shadow-[0_4px_20px_rgba(98,31,50,0.12)]'
          : 'border-zinc-200/80 bg-white/80 hover:border-[#621f32]/35 hover:shadow-[0_2px_12px_rgba(0,0,0,0.06)]'
        }`}
    >
      <div className="flex items-center gap-4">
        <div className={`flex-shrink-0 h-10 w-10 rounded-xl flex items-center justify-center text-base font-bold transition-all duration-200
          ${active ? 'bg-[#621f32] text-white shadow-[0_2px_8px_rgba(98,31,50,0.3)]' : 'bg-zinc-100 text-zinc-500 group-hover:bg-[#621f32]/10 group-hover:text-[#621f32]'}`}>
          {num}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <Icon className={`h-4 w-4 flex-shrink-0 ${active ? 'text-[#621f32]' : 'text-zinc-400'}`} />
            <p className={`font-semibold text-sm ${active ? 'text-[#621f32]' : 'text-zinc-800'}`}>{title}</p>
          </div>
          <p className="text-xs text-zinc-500 mt-0.5">{subtitle}</p>
        </div>
        <div className="flex-shrink-0">
          {loading
            ? <div className="h-7 w-10 bg-zinc-100 rounded-lg animate-pulse" />
            : (
              <span className={`px-3 py-1 rounded-lg text-sm font-bold tabular-nums transition-colors duration-200
                ${active ? 'bg-[#621f32] text-white' : 'bg-zinc-100 text-zinc-600'}`}>
                {count ?? 0}
              </span>
            )}
        </div>
      </div>
    </motion.button>
  );
}

export default function InformeGestionPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState(null);
  const [data, setData] = useState({ activos: null, excedidos: null });
  const [loading, setLoading] = useState({ activos: false, excedidos: false });
  const [error, setError] = useState({ activos: null, excedidos: null });

  const fetchTab = async (tab) => {
    if (data[tab]) { setActiveTab(tab); return; }
    setActiveTab(tab);
    setLoading((l) => ({ ...l, [tab]: true }));
    const api = createApi(session?.drfToken);
    try {
      const res = await (tab === 'activos' ? api.informeGestion.activos() : api.informeGestion.excedidos());
      setData((d) => ({ ...d, [tab]: res }));
    } catch (e) {
      setError((err) => ({ ...err, [tab]: e.message }));
    } finally {
      setLoading((l) => ({ ...l, [tab]: false }));
    }
  };

  const refresh = () => {
    if (!activeTab) return;
    setData((d) => ({ ...d, [activeTab]: null }));
    fetchTab(activeTab);
  };

  const currentData = activeTab ? data[activeTab] : null;
  const currentLoading = activeTab ? loading[activeTab] : false;
  const currentError = activeTab ? error[activeTab] : null;
  const grupos = currentData?.grupos ?? {};
  const grupoKeys = Object.keys(grupos);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={spring}
      className="px-4 md:px-8 py-6 max-w-7xl mx-auto space-y-6"
    >
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Informe de Gestión</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Personal de nivel 3-5 sin manejo de recursos. Selecciona una etapa para ver el detalle.
        </p>
      </div>

      {/* Dock */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DockCard num="1" title="En Plazo" subtitle="0 – 15 días hábiles transcurridos"
          icon={ClockIcon} count={data.activos?.count} loading={loading.activos}
          active={activeTab === 'activos'} onClick={() => fetchTab('activos')} />
        <DockCard num="2" title="Excedidos" subtitle="Más de 15 días hábiles — penalización"
          icon={ExclamationTriangleIcon} count={data.excedidos?.count} loading={loading.excedidos}
          active={activeTab === 'excedidos'} onClick={() => fetchTab('excedidos')} />
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeTab ? (
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={spring}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-zinc-700 flex items-center gap-2">
                {activeTab === 'activos'
                  ? <><ClockIcon className="h-4 w-4 text-[#621f32]" /> Servidores en plazo</>
                  : <><ExclamationTriangleIcon className="h-4 w-4 text-red-500" /> Servidores excedidos</>}
                {currentData && (
                  <span className="font-normal text-zinc-400">
                    — {currentData.count} en {grupoKeys.length} unidades
                  </span>
                )}
              </h2>
              <button
                onClick={refresh}
                disabled={currentLoading}
                className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-[#621f32] transition-colors disabled:opacity-40"
              >
                <ArrowPathIcon className={`h-3.5 w-3.5 ${currentLoading ? 'animate-spin' : ''}`} />
                Actualizar
              </button>
            </div>

            {currentError && (
              <div className="rounded-2xl bg-red-50 border border-red-200 px-5 py-4 text-sm text-red-700">
                <strong>Error al cargar:</strong> {currentError}
              </div>
            )}

            {currentLoading && (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="rounded-2xl border border-zinc-200 overflow-hidden">
                    <div className="h-12 bg-zinc-100 animate-pulse" />
                    <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {[...Array(3)].map((_, j) => (
                        <div key={j} className="h-28 bg-zinc-100 rounded-2xl animate-pulse" />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!currentLoading && !currentError && currentData && grupoKeys.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-zinc-400">
                <ClockIcon className="h-10 w-10 mb-3 opacity-35" />
                <p className="font-medium text-sm">Sin registros en esta categoría</p>
              </div>
            )}

            {!currentLoading && !currentError && grupoKeys.length > 0 && (
              <div className="space-y-3">
                {grupoKeys.map((unidad, i) => (
                  <GrupoUnidad key={unidad} nombre={unidad}
                    empleados={grupos[unidad]} tipo={activeTab} globalIndex={i} />
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col items-center justify-center py-20 rounded-2xl border border-dashed border-zinc-200 bg-white/50"
          >
            <div className="flex gap-4 mb-4">
              <ClockIcon className="h-9 w-9 text-zinc-300" />
              <ExclamationTriangleIcon className="h-9 w-9 text-zinc-300" />
            </div>
            <p className="font-medium text-zinc-500 text-sm">Selecciona una etapa para ver el detalle</p>
            <p className="text-xs text-zinc-400 mt-1">Haz clic en cualquiera de los recuadros de arriba</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
