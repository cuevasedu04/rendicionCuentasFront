'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { createApi } from '@/lib/api';
import { motion, AnimatePresence } from 'motion/react';
import {
  MagnifyingGlassIcon,
  ChevronUpDownIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  UserGroupIcon,
  DocumentCheckIcon,
  DocumentTextIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';

const PAGE_SIZE = 15;
const spring = { type: 'spring', stiffness: 100, damping: 22 };

function SortIcon({ field, sortField, sortDir }) {
  if (sortField !== field) return <ChevronUpDownIcon className="h-3.5 w-3.5 text-zinc-300" />;
  return sortDir === 'asc'
    ? <ChevronUpIcon className="h-3.5 w-3.5 text-[#621f32]" />
    : <ChevronDownIcon className="h-3.5 w-3.5 text-[#621f32]" />;
}

function SkeletonRow() {
  return (
    <tr className="animate-pulse border-b border-zinc-100">
      {[...Array(6)].map((_, i) => (
        <td key={i} className="px-4 py-3.5">
          <div className={`h-3.5 bg-zinc-100 rounded-full ${i === 0 ? 'w-3/4' : i === 4 ? 'w-full' : 'w-1/2'}`} />
        </td>
      ))}
    </tr>
  );
}

export default function ExcepcionesPage() {
  const { data: session, status } = useSession();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState('unidad_administrativa');
  const [sortDir, setSortDir] = useState('asc');
  const [page, setPage] = useState(1);
  const [updating, setUpdating] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (status !== 'authenticated') return;
    const api = createApi(session.drfToken);
    api.excepciones.list()
      .then((data) => setEmployees(data.results ?? []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [status, session?.drfToken]);

  const showToast = (msg, ok) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  const handleToggle = async (emp) => {
    if (updating) return;
    const newValue = !emp.maneja_recursos;
    setUpdating(emp.num_empleado);
    setEmployees((prev) =>
      prev.map((e) => e.num_empleado === emp.num_empleado ? { ...e, maneja_recursos: newValue } : e)
    );
    try {
      await createApi(session?.drfToken).excepciones.update(emp.num_empleado, newValue);
      showToast(`${emp.nombres}: ahora entrega ${newValue ? 'Acta E-R' : 'Informe de Gestión'}`, true);
    } catch {
      setEmployees((prev) =>
        prev.map((e) => e.num_empleado === emp.num_empleado ? { ...e, maneja_recursos: emp.maneja_recursos } : e)
      );
      showToast('No se pudo actualizar. Intenta de nuevo.', false);
    } finally {
      setUpdating(null);
    }
  };

  const handleSort = (field) => {
    if (sortField === field) setSortDir((d) => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
    setPage(1);
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return employees.filter((e) =>
      (e.nombres ?? '').toLowerCase().includes(q) ||
      (e.rfc ?? '').toLowerCase().includes(q) ||
      (e.unidad_administrativa ?? '').toLowerCase().includes(q)
    );
  }, [employees, search]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const av = (a[sortField] ?? '').toString().toLowerCase();
      const bv = (b[sortField] ?? '').toString().toLowerCase();
      return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
    });
  }, [filtered, sortField, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const paginated = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalAer = employees.filter((e) => e.maneja_recursos).length;
  const totalIg = employees.filter((e) => !e.maneja_recursos).length;

  const cols = [
    { field: 'nombres', label: 'Nombre', sortable: true },
    { field: 'rfc', label: 'RFC', sortable: false },
    { field: 'nj', label: 'N.J.', sortable: true },
    { field: 'nivel', label: 'Nivel', sortable: true },
    { field: 'unidad_administrativa', label: 'Unidad Administrativa', sortable: true },
    { field: 'maneja_recursos', label: 'Tipo de Entrega', sortable: true },
  ];

  const stats = [
    { icon: UserGroupIcon, label: 'Personal Nivel 3-5', value: employees.length, color: 'text-zinc-700', bg: 'bg-zinc-50', border: 'border-zinc-200' },
    { icon: DocumentCheckIcon, label: 'Entregan Acta E-R', value: totalAer, color: 'text-[#621f32]', bg: 'bg-[#621f32]/5', border: 'border-[#621f32]/15' },
    { icon: DocumentTextIcon, label: 'Entregan Inf. Gestión', value: totalIg, color: 'text-slate-600', bg: 'bg-slate-50', border: 'border-slate-200' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={spring}
      className="px-4 md:px-8 py-6 max-w-7xl mx-auto space-y-6"
    >
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key="toast"
            initial={{ opacity: 0, y: -12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={spring}
            className={`fixed top-24 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.12)] text-white text-sm font-medium
              ${toast.ok ? 'bg-emerald-600' : 'bg-red-600'}`}
          >
            {toast.ok
              ? <CheckCircleIcon className="h-5 w-5 flex-shrink-0" />
              : <XCircleIcon className="h-5 w-5 flex-shrink-0" />}
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Configuración de Excepciones</h1>
          <p className="mt-1 text-sm text-zinc-500 max-w-[60ch]">
            Marca a los servidores de nivel 3-5 que manejan chequeras o inventarios
            para asignarles{' '}
            <span className="font-semibold text-[#621f32]">Acta Entrega-Recepción</span>{' '}
            en lugar de Informe de Gestión.
          </p>
        </div>
        <button
          onClick={() => {
            setLoading(true);
            createApi(session?.drfToken).excepciones.list()
              .then((d) => setEmployees(d.results ?? []))
              .catch((e) => setError(e.message))
              .finally(() => setLoading(false));
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-zinc-200 text-sm text-zinc-600 hover:bg-zinc-50 hover:border-zinc-300 transition-colors self-start"
        >
          <ArrowPathIcon className="h-4 w-4" />
          Actualizar
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {stats.map(({ icon: Icon, label, value, color, bg, border }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: i * 0.06 }}
            className={`${bg} rounded-2xl p-4 border ${border} shadow-[0_1px_4px_rgba(0,0,0,0.03)]`}
          >
            <div className="flex items-center gap-3">
              <div className={`flex-shrink-0 h-9 w-9 rounded-xl bg-white/70 border ${border} flex items-center justify-center shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]`}>
                <Icon className={`h-5 w-5 ${color}`} />
              </div>
              <div>
                <p className="text-xs text-zinc-500 font-medium leading-tight">{label}</p>
                <p className={`text-2xl font-bold tabular-nums ${color} leading-tight mt-0.5`}>
                  {loading ? '—' : value}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-2xl bg-red-50 border border-red-200 px-5 py-4 text-sm text-red-700">
          <strong>Error al cargar:</strong> {error}
        </div>
      )}

      {/* Table card */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-zinc-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.05)] overflow-hidden">

        {/* Search bar */}
        <div className="px-5 py-4 border-b border-zinc-100 flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Buscar por nombre, RFC o unidad…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-zinc-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#621f32]/25 focus:border-[#621f32] transition-all shadow-[inset_0_1px_3px_rgba(0,0,0,0.03)]"
            />
          </div>
          {!loading && (
            <span className="text-xs text-zinc-400 whitespace-nowrap">
              {filtered.length} de {employees.length} registros
            </span>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-zinc-50/80 border-b border-zinc-100">
                {cols.map(({ field, label, sortable }) => (
                  <th
                    key={field}
                    onClick={() => sortable && handleSort(field)}
                    className={`px-4 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider whitespace-nowrap
                      ${sortable ? 'cursor-pointer select-none hover:text-zinc-700 hover:bg-zinc-100/70 transition-colors' : ''}`}
                  >
                    <div className="flex items-center gap-1.5">
                      {label}
                      {sortable && <SortIcon field={field} sortField={sortField} sortDir={sortDir} />}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {loading
                ? [...Array(8)].map((_, i) => <SkeletonRow key={i} />)
                : paginated.length === 0
                ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-16 text-center">
                      <p className="text-zinc-400 font-medium text-sm">No se encontraron registros</p>
                      <p className="text-zinc-300 text-xs mt-1">Intenta con otro término de búsqueda</p>
                    </td>
                  </tr>
                )
                : paginated.map((emp, rowIndex) => (
                  <motion.tr
                    key={emp.num_empleado}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: rowIndex * 0.02 }}
                    className="hover:bg-zinc-50/60 transition-colors group"
                  >
                    <td className="px-4 py-3 font-medium text-zinc-900">
                      {emp.nombres ?? '—'}
                    </td>
                    <td className="px-4 py-3 text-zinc-500 font-mono text-xs">
                      {emp.rfc ?? '—'}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-zinc-100 text-zinc-600 text-xs font-bold">
                        {emp.nj ?? '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-zinc-500 text-xs">
                      {emp.nivel ?? '—'}
                    </td>
                    <td className="px-4 py-3 text-zinc-500 text-xs max-w-[200px] truncate" title={emp.unidad_administrativa}>
                      {emp.unidad_administrativa ?? '—'}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggle(emp)}
                        disabled={updating === emp.num_empleado}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 border active:scale-95
                          ${emp.maneja_recursos
                            ? 'bg-[#621f32] text-white border-[#621f32] hover:bg-[#4a1726] shadow-[0_2px_6px_rgba(98,31,50,0.25)]'
                            : 'bg-zinc-50 text-zinc-600 border-zinc-200 hover:bg-zinc-100'
                          }
                          ${updating === emp.num_empleado ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        {updating === emp.num_empleado
                          ? <ArrowPathIcon className="h-3 w-3 animate-spin" />
                          : emp.maneja_recursos
                            ? <DocumentCheckIcon className="h-3 w-3" />
                            : <DocumentTextIcon className="h-3 w-3" />
                        }
                        {emp.maneja_recursos ? 'Acta E-R' : 'Inf. Gestión'}
                      </button>
                    </td>
                  </motion.tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="px-5 py-3.5 border-t border-zinc-100 flex items-center justify-between text-sm text-zinc-600">
            <span className="text-xs text-zinc-400">
              Página {page} de {totalPages}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 text-xs rounded-xl border border-zinc-200 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Anterior
              </button>
              {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                const p = i + 1;
                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`px-3 py-1.5 text-xs rounded-xl border transition-colors
                      ${page === p
                        ? 'bg-[#621f32] text-white border-[#621f32]'
                        : 'border-zinc-200 hover:bg-zinc-50'
                      }`}
                  >
                    {p}
                  </button>
                );
              })}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 text-xs rounded-xl border border-zinc-200 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs text-zinc-500 pb-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#621f32] text-white font-semibold">
            <DocumentCheckIcon className="h-3 w-3" /> Acta E-R
          </span>
          <span>Maneja chequeras o inventarios.</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-600 font-semibold">
            <DocumentTextIcon className="h-3 w-3" /> Inf. Gestión
          </span>
          <span>Entrega estándar para niveles 3-5.</span>
        </div>
      </div>
    </motion.div>
  );
}
