'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import CodigoVerificacionDrawer from '@/components/CodigoVerificacionDrawer';
import DotField from '@/components/DotField';
import { authApi } from '@/lib/api';

const spring = { type: 'spring', stiffness: 100, damping: 22 };

export default function Login() {
  const router = useRouter();
  const [correo, setCorreo] = useState('');
  const [step, setStep] = useState('email');
  const [adminPassword, setAdminPassword] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await authApi.requestOtp(correo.trim().toLowerCase());
      if (res?.is_admin) {
        setStep('admin_password');
      } else {
        setStep('drawer');
        setDrawerOpen(true);
      }
    } catch (err) {
      const msg = err.message ?? '';
      if (msg.includes('403')) {
        setError('Este correo no está autorizado para acceder al sistema.');
      } else {
        setError('No se pudo enviar el código. Verifica tu correo e intenta de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await authApi.login(correo.trim().toLowerCase(), adminPassword);
      await signIn('credentials', { email: correo, drfToken: res.token, redirect: false });
      router.push('/dashboard');
    } catch (err) {
      const msg = err.message ?? '';
      setError(msg.includes('401') ? 'Contraseña incorrecta.' : 'Error al iniciar sesión. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError('');
    try {
      await authApi.requestOtp(correo.trim().toLowerCase());
    } catch {
      setError('No se pudo reenviar el código.');
    }
  };

  return (
    <>
      {/* DotField background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <DotField
            dotRadius={2}
            dotSpacing={21}
            cursorRadius={500}
            cursorForce={0.66}
            bulgeOnly={true}
            bulgeStrength={28}
            glowRadius={80}
            waveAmplitude={5}
            sparkle={true}
            gradientFrom="rgba(98, 31, 50, 0.33)"
            gradientTo="rgba(138, 42, 60, 0.22)"
            glowColor="#ffffff1b"
          />
      </div>

      {/* Login layout */}
      <div className="relative z-10 flex min-h-[calc(100dvh-112px)] items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ ...spring, delay: 0.08 }}
          className="w-full max-w-md"
        >
          {/* Card — liquid glass refraction */}
          <div className="rounded-3xl bg-white/72 backdrop-blur-2xl border border-white/70 shadow-[0_20px_60px_rgba(0,0,0,0.10),inset_0_1px_0_rgba(255,255,255,0.85)] px-8 py-10">

            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, delay: 0.18 }}
              className="flex flex-col items-center mb-8"
            >
              <img
                alt="Logo ANAM"
                src="/anam.png"
                className="h-16 w-auto drop-shadow-sm mb-4"
              />
              <h1 className="text-xl font-bold tracking-tight text-zinc-900">
                Inicia sesión
              </h1>
              <p className="text-sm text-zinc-500 mt-1">Acceso al sistema de monitoreo</p>
            </motion.div>

            {/* Steps */}
            <AnimatePresence mode="wait">

              {/* Step: email */}
              {step === 'email' && (
                <motion.form
                  key="email"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={spring}
                  onSubmit={handleEmailSubmit}
                  className="space-y-5"
                >
                  <div className="space-y-1.5">
                    <label htmlFor="email" className="block text-xs font-semibold text-zinc-600 uppercase tracking-wider">
                      Correo institucional
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      value={correo}
                      onChange={(e) => setCorreo(e.target.value)}
                      className="block w-full rounded-xl bg-white/80 border border-zinc-200 px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#621f32]/30 focus:border-[#621f32] transition-all shadow-[inset_0_1px_3px_rgba(0,0,0,0.04)]"
                      placeholder="usuario@anam.gob.mx"
                    />
                  </div>

                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs text-red-600 rounded-xl bg-red-50 border border-red-200/80 px-3.5 py-2.5"
                    >
                      {error}
                    </motion.p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#621f32] px-4 py-3 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(98,31,50,0.32)] hover:bg-[#4a1726] hover:shadow-[0_6px_20px_rgba(98,31,50,0.44)] hover:-translate-y-[1px] active:translate-y-0 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
                  >
                    {loading ? 'Verificando…' : (
                      <>
                        Continuar
                        <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      </>
                    )}
                  </button>
                </motion.form>
              )}

              {/* Step: admin password */}
              {step === 'admin_password' && (
                <motion.form
                  key="admin"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={spring}
                  onSubmit={handleAdminLogin}
                  className="space-y-5"
                >
                  <div className="rounded-xl bg-zinc-50 border border-zinc-200 px-4 py-3">
                    <p className="text-xs text-zinc-500 mb-0.5 font-medium">Correo</p>
                    <p className="text-sm text-zinc-800 font-semibold truncate">{correo}</p>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="admin-password" className="block text-xs font-semibold text-zinc-600 uppercase tracking-wider">
                      Contraseña de administrador
                    </label>
                    <input
                      id="admin-password"
                      type="password"
                      required
                      autoFocus
                      autoComplete="current-password"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      className="block w-full rounded-xl bg-white/80 border border-zinc-200 px-4 py-2.5 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#621f32]/30 focus:border-[#621f32] transition-all shadow-[inset_0_1px_3px_rgba(0,0,0,0.04)]"
                    />
                  </div>

                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs text-red-600 rounded-xl bg-red-50 border border-red-200/80 px-3.5 py-2.5"
                    >
                      {error}
                    </motion.p>
                  )}

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => { setStep('email'); setError(''); setAdminPassword(''); }}
                      className="flex items-center gap-1.5 flex-1 justify-center rounded-xl border border-zinc-200 px-3 py-2.5 text-sm font-medium text-zinc-600 hover:bg-zinc-50 transition-colors"
                    >
                      <ArrowLeftIcon className="h-3.5 w-3.5" />
                      Volver
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 rounded-xl bg-[#621f32] px-3 py-2.5 text-sm font-semibold text-white hover:bg-[#4a1726] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 shadow-[0_4px_14px_rgba(98,31,50,0.28)]"
                    >
                      {loading ? 'Ingresando…' : 'Acceder'}
                    </button>
                  </div>
                </motion.form>
              )}

              {/* Step: drawer (OTP sent) */}
              {step === 'drawer' && (
                <motion.div
                  key="drawer"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={spring}
                  className="space-y-4"
                >
                  <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-center">
                    <p className="text-xs text-emerald-700">Código enviado a</p>
                    <p className="text-sm font-semibold text-emerald-900 mt-0.5 truncate">{correo}</p>
                  </div>
                  <button
                    onClick={() => setDrawerOpen(true)}
                    className="w-full rounded-xl border-2 border-[#621f32] px-4 py-2.5 text-sm font-semibold text-[#621f32] hover:bg-[#621f32]/6 active:scale-[0.98] transition-all duration-200"
                  >
                    Ingresar código de verificación
                  </button>
                  <button
                    onClick={() => { setStep('email'); setError(''); }}
                    className="w-full text-xs text-zinc-400 hover:text-zinc-600 transition-colors py-1"
                  >
                    Usar otro correo
                  </button>
                </motion.div>
              )}

            </AnimatePresence>

            <p className="mt-8 text-center text-xs text-zinc-400 leading-snug">
              Acceso exclusivo para personal de la{' '}
              <span className="font-semibold text-[#621f32]">Agencia Nacional de Aduanas de México</span>
            </p>
          </div>
        </motion.div>
      </div>

      <CodigoVerificacionDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        correo={correo}
        onResend={handleResend}
        onSuccess={() => router.push('/dashboard')}
      />
    </>
  );
}
