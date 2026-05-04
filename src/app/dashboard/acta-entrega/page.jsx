'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { createApi } from '@/lib/api';
import { motion, AnimatePresence } from 'motion/react';
import {
  ClockIcon,
  ExclamationTriangleIcon,
  BuildingOffice2Icon,
  UserIcon,
  CalendarDaysIcon,
  ArrowPathIcon,
  ChevronRightIcon,
  Squares2X2Icon,
  ArrowLeftIcon,
  ClipboardDocumentCheckIcon,
} from '@heroicons/react/24/outline';
import Dock from '@/components/ui/Dock';

const spring = { type: 'spring', stiffness: 100, damping: 22 };

// ── Helpers ──────────────────────────────────────────────────────────
function urgencyClass(restantes) {
  if (restantes >= 8) return { bar: 'bg-emerald-500', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-400' };
  if (restantes >= 4) return { bar: 'bg-amber-400', badge: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-400' };
  return { bar: 'bg-red-500', badge: 'bg-red-50 text-red-700 border-red-200', dot: 'bg-red-500' };
}

function getUnidadUrgency(empleados) {
  if (!empleados?.length) return 'emerald';
  const min = Math.min(...empleados.map(e => e.dias_habiles_restantes ?? 99));
  if (min < 4) return 'red';
  if (min < 8) return 'amber';
  return 'emerald';
}

const unidadUrgencyStyle = {
  red: 'border-l-red-400 bg-red-50/40',
  amber: 'border-l-amber-400 bg-amber-50/30',
  emerald: 'border-l-emerald-400 bg-white/60',
};

// ── Sub-components ────────────────────────────────────────────────────
function ProgressBar({ transcurridos, total = 15, color = 'bg-emerald-500' }) {
  const pct = Math.min(100, (transcurridos / total) * 100);
  return (
    <div className="w-full bg-zinc-100 rounded-full h-1 overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ ...spring, delay: 0.1 }}
        className={`h-1 rounded-full ${color}`}
      />
    </div>
  );
}

function EmpleadoRow({ emp, index, tipo }) {
  const restantes = emp.dias_habiles_restantes ?? 0;
  const excedidos = emp.dias_habiles_excedidos ?? 0;
  const { badge, bar } = urgencyClass(restantes);
  const esNivel12 = ['1', '2'].includes(String(emp.nivel ?? ''));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.15, delay: Math.min(index * 0.018, 0.25) }}
      className="grid items-center px-5 py-3
        grid-cols-[32px_1fr_auto]
        md:grid-cols-[32px_1fr_72px_110px_90px_68px]
        border-b border-zinc-100/80 hover:bg-zinc-50/60 transition-colors last:border-b-0"
    >
      {/* Avatar */}
      <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0
        ${tipo === 'excedidos' ? 'bg-red-50 text-red-600 ring-1 ring-red-200' : 'bg-zinc-100 text-zinc-600 ring-1 ring-zinc-200'}`}>
        {(emp.nombre_completo ?? '?').charAt(0).toUpperCase()}
      </div>

      {/* Nombre + RFC */}
      <div className="min-w-0 px-3">
        <div className="flex items-center gap-1.5 min-w-0">
          <p
            className="text-sm font-semibold text-zinc-900 truncate leading-tight cursor-default"
            title={emp.nombre_completo ?? ''}
          >
            {emp.nombre_completo ?? '—'}
          </p>
          {esNivel12 && (
            <span className="flex-shrink-0 px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#621f32]/10 text-[#621f32] uppercase tracking-wide leading-none">
              N{emp.nivel}
            </span>
          )}
        </div>
        <p className="text-xs text-zinc-400 font-mono mt-0.5" title={emp.rfc ?? ''}>{emp.rfc ?? '—'}</p>
      </div>

      {/* Grado / Nivel — md+ */}
      <div className="hidden md:flex flex-col items-center gap-0.5">
        <span className="text-xs font-semibold text-zinc-700">{emp.grado ?? '—'}</span>
        <span className="text-[10px] text-zinc-400 leading-none">{emp.nivel_desc ?? emp.nivel ?? '—'}</span>
      </div>

      {/* Fecha límite — md+ */}
      <div className="hidden md:flex items-center justify-center gap-1 text-xs text-zinc-500">
        <CalendarDaysIcon className={`h-3 w-3 flex-shrink-0 ${tipo === 'excedidos' ? 'text-red-400' : 'text-[#621f32]'}`} />
        <span className="font-medium tabular-nums">{emp.fecha_limite_entrega ?? '—'}</span>
      </div>

      {/* Progreso — md+ */}
      <div className="hidden md:block px-3">
        {tipo === 'activos'
          ? <ProgressBar transcurridos={emp.dias_habiles_transcurridos ?? 0} color={bar} />
          : <div className="w-full bg-red-100 rounded-full h-1"><div className="h-1 rounded-full bg-red-500 w-full" /></div>
        }
      </div>

      {/* Badge días */}
      <div className="flex justify-center">
        {tipo === 'activos' ? (
          <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${badge}`}>
            {restantes === 0 ? 'Hoy' : `${restantes}d`}
          </span>
        ) : (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200">
            +{excedidos}d
          </span>
        )}
      </div>
    </motion.div>
  );
}

function UnidadItem({ nombre, empleados, selected, onClick, tipo, index }) {
  const urgency = tipo === 'excedidos' ? 'red' : getUnidadUrgency(empleados);
  return (
    <motion.button
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ ...spring, delay: index * 0.04 }}
      onClick={onClick}
      className={`w-full text-left flex items-center gap-3 px-4 py-3 border-l-2 rounded-r-xl transition-all duration-150
        ${selected
          ? 'border-l-[#621f32] bg-[#621f32]/6 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]'
          : `${unidadUrgencyStyle[urgency]} hover:border-l-[#621f32]/50 hover:bg-zinc-50/80`
        }`}
    >
      <BuildingOffice2Icon className={`h-4 w-4 flex-shrink-0 ${selected ? 'text-[#621f32]' : 'text-zinc-400'}`} />
      <span
        className={`flex-1 text-sm font-medium leading-tight truncate ${selected ? 'text-[#621f32]' : 'text-zinc-700'}`}
        title={nombre}
      >
        {nombre}
      </span>
      <span className={`flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-bold
        ${selected ? 'bg-[#621f32] text-white' : 'bg-zinc-100 text-zinc-500'}`}>
        {empleados.length}
      </span>
      {selected && <ChevronRightIcon className="h-3.5 w-3.5 text-[#621f32] flex-shrink-0" />}
    </motion.button>
  );
}

function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 px-5 py-3.5 border-b border-zinc-100 animate-pulse">
      <div className="h-8 w-8 rounded-full bg-zinc-100 flex-shrink-0" />
      <div className="flex-1 space-y-1.5">
        <div className="h-3 bg-zinc-100 rounded-full w-2/3" />
        <div className="h-2.5 bg-zinc-100 rounded-full w-1/3" />
      </div>
      <div className="h-6 w-14 bg-zinc-100 rounded-full flex-shrink-0" />
      <div className="h-6 w-16 bg-zinc-100 rounded-full flex-shrink-0" />
    </div>
  );
}

// ── Resumen View ──────────────────────────────────────────────────────
function ResumenView({ data, loading, onNavigate }) {
  const activos = data.activos;
  const excedidos = data.excedidos;
  const totalActivos = activos?.count ?? 0;
  const totalExcedidos = excedidos?.count ?? 0;
  const total = totalActivos + totalExcedidos;

  const unidadesActivas = Object.keys(activos?.grupos ?? {}).length;
  const unidadesExcedidas = Object.keys(excedidos?.grupos ?? {}).length;

  const topExcedidas = Object.entries(excedidos?.grupos ?? {})
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 5);

  return (
    <motion.div
      key="resumen"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={spring}
      className="space-y-8"
    >
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Acta Entrega-Recepción</h1>
        <p className="mt-1 text-sm text-zinc-500 max-w-[55ch]">
          Niveles 1-2 (directivos) y niveles 3-5 con manejo de chequeras o inventarios.
        </p>
      </div>

      {/* Stats — asymmetric 2-col */}
      <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr] gap-5">

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.06 }}
          onClick={() => onNavigate('activos')}
          className="group relative rounded-2xl bg-white/80 border border-zinc-200/80 p-6 cursor-pointer hover:border-[#621f32]/30 hover:shadow-[0_4px_20px_rgba(98,31,50,0.08)] transition-all duration-200 overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,0.04)] backdrop-blur-sm"
        >
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-emerald-50 blur-2xl opacity-60 -translate-y-8 translate-x-8 pointer-events-none" />
          <div className="relative flex items-start justify-between mb-4">
            <div className="h-10 w-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
              <ClockIcon className="h-5 w-5 text-emerald-600" />
            </div>
            <span className="text-xs text-zinc-400 flex items-center gap-1 group-hover:text-[#621f32] transition-colors">
              Ver detalle <ChevronRightIcon className="h-3 w-3" />
            </span>
          </div>
          {loading.activos ? (
            <div className="h-10 w-24 bg-zinc-100 rounded-xl animate-pulse mb-1" />
          ) : (
            <p className="text-4xl font-bold tracking-tight text-zinc-900 tabular-nums mb-1">{totalActivos}</p>
          )}
          <p className="text-sm font-medium text-zinc-600">En Plazo</p>
          <p className="text-xs text-zinc-400 mt-0.5">{unidadesActivas} unidades — 0 a 15 días hábiles</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.12 }}
          onClick={() => onNavigate('excedidos')}
          className="group relative rounded-2xl bg-white/80 border border-zinc-200/80 p-6 cursor-pointer hover:border-red-300/60 hover:shadow-[0_4px_20px_rgba(239,68,68,0.08)] transition-all duration-200 overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,0.04)] backdrop-blur-sm"
        >
          <div className="absolute top-0 right-0 w-28 h-28 rounded-full bg-red-50 blur-2xl opacity-60 -translate-y-6 translate-x-6 pointer-events-none" />
          <div className="relative flex items-start justify-between mb-4">
            <div className="h-10 w-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
            </div>
            <span className="text-xs text-zinc-400 flex items-center gap-1 group-hover:text-red-500 transition-colors">
              Ver detalle <ChevronRightIcon className="h-3 w-3" />
            </span>
          </div>
          {loading.excedidos ? (
            <div className="h-10 w-24 bg-zinc-100 rounded-xl animate-pulse mb-1" />
          ) : (
            <p className="text-4xl font-bold tracking-tight text-red-600 tabular-nums mb-1">{totalExcedidos}</p>
          )}
          <p className="text-sm font-medium text-zinc-600">Excedidos</p>
          <p className="text-xs text-zinc-400 mt-0.5">{unidadesExcedidas} unidades — más de 15 días hábiles</p>
        </motion.div>
      </div>

      {/* Top unidades excedidas */}
      {(topExcedidas.length > 0 || loading.excedidos) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.2 }}
          className="rounded-2xl bg-white/80 border border-zinc-200/80 overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,0.04)] backdrop-blur-sm"
        >
          <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-zinc-800">Unidades con más excedidos</h2>
            {!loading.excedidos && (
              <button
                onClick={() => onNavigate('excedidos')}
                className="text-xs text-[#621f32] hover:underline font-medium"
              >
                Ver todos
              </button>
            )}
          </div>
          <div className="divide-y divide-zinc-50">
            {loading.excedidos
              ? [...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 px-5 py-3 animate-pulse">
                  <div className="h-3 bg-zinc-100 rounded-full flex-1" />
                  <div className="h-5 w-8 bg-zinc-100 rounded-full" />
                </div>
              ))
              : topExcedidas.map(([nombre, empleados], i) => (
                <motion.div
                  key={nombre}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ ...spring, delay: 0.22 + i * 0.04 }}
                  className="flex items-center gap-3 px-5 py-3 hover:bg-zinc-50/70 transition-colors cursor-pointer"
                  onClick={() => onNavigate('excedidos')}
                >
                  <span className="w-5 text-xs font-bold text-zinc-300 tabular-nums">{i + 1}</span>
                  <BuildingOffice2Icon className="h-3.5 w-3.5 text-zinc-400 flex-shrink-0" />
                  <span className="flex-1 text-sm text-zinc-700 truncate" title={nombre}>{nombre}</span>
                  <span className="px-2.5 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold border border-red-100">
                    {empleados.length}
                  </span>
                </motion.div>
              ))
            }
          </div>
        </motion.div>
      )}

      {!loading.excedidos && !loading.activos && total === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-zinc-400">
          <ClipboardDocumentCheckIcon className="h-10 w-10 mb-3 opacity-30" />
          <p className="font-medium text-sm">Sin registros activos en este periodo</p>
        </div>
      )}
    </motion.div>
  );
}

// ── Master-Detail View ────────────────────────────────────────────────
function MasterDetailView({ data, loading, error, tipo, onRefresh }) {
  const [selectedUnidad, setSelectedUnidad] = useState(null);
  const grupos = data?.grupos ?? {};
  const grupoKeys = Object.keys(grupos);

  const displayEmpleados = selectedUnidad
    ? (grupos[selectedUnidad] ?? [])
    : grupoKeys.flatMap(k => grupos[k]);

  const isExcedidos = tipo === 'excedidos';
  const accentColor = isExcedidos ? 'text-red-600' : 'text-emerald-600';
  const TipoIcon = isExcedidos ? ExclamationTriangleIcon : ClockIcon;

  return (
    <motion.div
      key={tipo}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={spring}
      className="space-y-5"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 flex items-center gap-2.5">
            <TipoIcon className={`h-6 w-6 ${accentColor}`} />
            {isExcedidos ? 'Excedidos' : 'En Plazo'}
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            {loading ? 'Cargando…' : data
              ? `${data.count} servidores en ${grupoKeys.length} unidades`
              : '—'
            }
          </p>
        </div>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-[#621f32] transition-colors disabled:opacity-40 flex-shrink-0 mt-1"
        >
          <ArrowPathIcon className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          Actualizar
        </button>
      </div>

      {error && (
        <div className="rounded-2xl bg-red-50 border border-red-200 px-5 py-4 text-sm text-red-700">
          <strong>Error al cargar:</strong> {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[272px_1fr] gap-4 items-start">

        {/* LEFT — Unidades */}
        <div className="lg:sticky lg:top-[184px]">
          <div className="rounded-2xl bg-white/80 border border-zinc-200/80 overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,0.04)] backdrop-blur-sm">
            <div className="px-4 py-3 border-b border-zinc-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Unidades</span>
              {selectedUnidad && (
                <button
                  onClick={() => setSelectedUnidad(null)}
                  className="text-xs text-[#621f32] hover:underline flex items-center gap-1"
                >
                  <ArrowLeftIcon className="h-3 w-3" /> Todas
                </button>
              )}
            </div>
            <div className="p-2 space-y-0.5 max-h-[55vh] overflow-y-auto">
              {loading
                ? [...Array(5)].map((_, i) => (
                  <div key={i} className="h-11 bg-zinc-100 rounded-xl animate-pulse" />
                ))
                : grupoKeys.length === 0
                ? <div className="px-4 py-8 text-center text-zinc-400 text-xs">Sin unidades</div>
                : grupoKeys.map((nombre, i) => (
                  <UnidadItem
                    key={nombre}
                    nombre={nombre}
                    empleados={grupos[nombre]}
                    selected={selectedUnidad === nombre}
                    onClick={() => setSelectedUnidad(prev => prev === nombre ? null : nombre)}
                    tipo={tipo}
                    index={i}
                  />
                ))
              }
            </div>
          </div>
        </div>

        {/* RIGHT — Employees */}
        <div className="rounded-2xl bg-white/80 border border-zinc-200/80 overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,0.04)] backdrop-blur-sm">
          <div className="px-5 py-3.5 border-b border-zinc-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {selectedUnidad
                ? <BuildingOffice2Icon className="h-4 w-4 text-[#621f32]" />
                : <UserIcon className="h-4 w-4 text-zinc-400" />
              }
              <span
                className="text-sm font-semibold text-zinc-800 truncate max-w-[280px]"
                title={selectedUnidad ?? 'Todos los servidores'}
              >
                {selectedUnidad ?? 'Todos los servidores'}
              </span>
            </div>
            {!loading && (
              <span className="text-xs text-zinc-400 flex-shrink-0 ml-2">
                {displayEmpleados.length} registro{displayEmpleados.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          {/* Column headers — matches EmpleadoRow grid exactly */}
          <div className="hidden md:grid items-center px-5 py-2 bg-zinc-50/60 border-b border-zinc-100 grid-cols-[32px_1fr_72px_110px_90px_68px]">
            <div />
            <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider pl-3">Servidor</span>
            <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider text-center">Grado</span>
            <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider text-center">Fecha límite</span>
            <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider text-center">Progreso</span>
            <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider text-center">Días</span>
          </div>

          <div className="divide-y divide-zinc-50">
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {[...Array(7)].map((_, i) => <SkeletonRow key={i} />)}
                </motion.div>
              ) : displayEmpleados.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-16 text-zinc-400"
                >
                  <TipoIcon className="h-9 w-9 mb-3 opacity-25" />
                  <p className="text-sm font-medium">Sin registros en esta categoría</p>
                </motion.div>
              ) : (
                <motion.div
                  key={`list-${selectedUnidad ?? '__all__'}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  {displayEmpleados.map((emp, i) => (
                    <EmpleadoRow key={emp.rfc ?? i} emp={emp} index={i} tipo={tipo} />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────
export default function ActaEntregaPage() {
  const { data: session, status } = useSession();
  const [view, setView] = useState('resumen');
  const [data, setData] = useState({ activos: null, excedidos: null });
  const [loading, setLoading] = useState({ activos: true, excedidos: true });
  const [error, setError] = useState({ activos: null, excedidos: null });

  useEffect(() => {
    if (status !== 'authenticated' || !session?.drfToken) return;
    const api = createApi(session.drfToken);

    api.actaEntrega.activos()
      .then(r => setData(d => ({ ...d, activos: r })))
      .catch(e => setError(err => ({ ...err, activos: e.message })))
      .finally(() => setLoading(l => ({ ...l, activos: false })));

    api.actaEntrega.excedidos()
      .then(r => setData(d => ({ ...d, excedidos: r })))
      .catch(e => setError(err => ({ ...err, excedidos: e.message })))
      .finally(() => setLoading(l => ({ ...l, excedidos: false })));
  }, [status, session?.drfToken]);

  const handleRefresh = (tipo) => {
    if (!session?.drfToken) return;
    setData(d => ({ ...d, [tipo]: null }));
    setLoading(l => ({ ...l, [tipo]: true }));
    setError(err => ({ ...err, [tipo]: null }));
    const api = createApi(session.drfToken);
    const call = tipo === 'activos' ? api.actaEntrega.activos() : api.actaEntrega.excedidos();
    call
      .then(r => setData(d => ({ ...d, [tipo]: r })))
      .catch(e => setError(err => ({ ...err, [tipo]: e.message })))
      .finally(() => setLoading(l => ({ ...l, [tipo]: false })));
  };

  const dockItems = [
    {
      icon: <Squares2X2Icon className="h-[18px] w-[18px]" />,
      label: 'Resumen',
      onClick: () => setView('resumen'),
      className: view === 'resumen' ? 'dock-active' : '',
    },
    {
      icon: <ClockIcon className="h-[18px] w-[18px]" />,
      label: 'En Plazo',
      onClick: () => setView('activos'),
      className: view === 'activos' ? 'dock-active' : '',
    },
    {
      icon: <ExclamationTriangleIcon className="h-[18px] w-[18px]" />,
      label: 'Excedidos',
      onClick: () => setView('excedidos'),
      className: view === 'excedidos' ? 'dock-active' : '',
    },
  ];

  return (
    <>
      <div className="px-4 md:px-8 py-6 pb-32 max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          {view === 'resumen' && (
            <ResumenView
              key="resumen"
              data={data}
              loading={loading}
              onNavigate={setView}
            />
          )}
          {view === 'activos' && (
            <MasterDetailView
              key="activos"
              data={data.activos}
              loading={loading.activos}
              error={error.activos}
              tipo="activos"
              onRefresh={() => handleRefresh('activos')}
            />
          )}
          {view === 'excedidos' && (
            <MasterDetailView
              key="excedidos"
              data={data.excedidos}
              loading={loading.excedidos}
              error={error.excedidos}
              tipo="excedidos"
              onRefresh={() => handleRefresh('excedidos')}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Dock — fixed bottom center */}
      <div
        className="fixed bottom-0 left-0 w-full flex justify-center z-20 pointer-events-none"
        style={{ height: '160px' }}
      >
        <div
          className="pointer-events-auto"
          style={{ position: 'relative', height: '160px', width: '340px' }}
        >
          <Dock
            items={dockItems}
            panelHeight={58}
            baseItemSize={46}
            magnification={66}
            dockHeight={148}
            distance={180}
          />
        </div>
      </div>
    </>
  );
}
