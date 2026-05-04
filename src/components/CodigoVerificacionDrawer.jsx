'use client';

import { useState, useRef } from 'react';
import { signIn } from 'next-auth/react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { authApi } from '@/lib/api';

// step: 'otp' → 'set_password' (new user) | 'enter_password' (returning) → done

export default function CodigoVerificacionDrawer({ open, onOpenChange, correo, onResend, onSuccess }) {
  const [step, setStep] = useState('otp');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [verifiedToken, setVerifiedToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [otpExpired, setOtpExpired] = useState(false);
  const inputs = useRef([]);

  const resetOtp = () => {
    setOtp(['', '', '', '', '', '']);
    setError('');
    setOtpExpired(false);
    setTimeout(() => inputs.current[0]?.focus(), 50);
  };

  const handleOtpChange = (el, index) => {
    if (isNaN(el.value)) return;
    const next = [...otp];
    next[index] = el.value;
    setOtp(next);
    if (el.value !== '' && index < 5) inputs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const code = otp.join('');
    if (code.length < 6) { setError('Ingresa los 6 dígitos del código.'); return; }
    setError('');
    setLoading(true);
    try {
      const res = await authApi.verifyOtp(correo, code);
      setVerifiedToken(res.verified_token);
      setStep(res.status === 'new_user' ? 'set_password' : 'enter_password');
    } catch (err) {
      const msg = err.message ?? '';
      if (msg.includes('400')) {
        setError('Código inválido o expirado.');
        setOtpExpired(true);
      } else {
        setError('Error al verificar. Intenta de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    resetOtp();
    await onResend?.();
  };

  const handleSetPassword = async () => {
    if (!password) { setError('Ingresa una contraseña.'); return; }
    if (password !== confirmPassword) { setError('Las contraseñas no coinciden.'); return; }
    if (password.length < 8) { setError('La contraseña debe tener al menos 8 caracteres.'); return; }
    setError('');
    setLoading(true);
    try {
      const res = await authApi.setPassword(correo, verifiedToken, password);
      await signIn('credentials', { email: correo, drfToken: res.token, redirect: false });
      onSuccess?.();
    } catch {
      setError('No se pudo registrar la contraseña. El token puede haber expirado.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!password) { setError('Ingresa tu contraseña.'); return; }
    setError('');
    setLoading(true);
    try {
      const res = await authApi.login(correo, password);
      await signIn('credentials', { email: correo, drfToken: res.token, redirect: false });
      onSuccess?.();
    } catch (err) {
      const msg = err.message ?? '';
      if (msg.includes('403')) {
        setError('Tu acceso expiró. Cierra este panel y solicita un nuevo código.');
      } else if (msg.includes('401')) {
        setError('Contraseña incorrecta.');
      } else {
        setError('Error al iniciar sesión. Intenta de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (val) => {
    if (!val) {
      // Reset state when drawer closes
      setStep('otp');
      setOtp(['', '', '', '', '', '']);
      setPassword('');
      setConfirmPassword('');
      setError('');
      setOtpExpired(false);
    }
    onOpenChange(val);
  };

  return (
    <Drawer open={open} onOpenChange={handleOpenChange}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-md">

          {/* ── Step: OTP ─────────────────────────────────────────── */}
          {step === 'otp' && (
            <>
              <DrawerHeader className="text-center">
                <DrawerTitle className="text-2xl font-bold text-[#621f32]">
                  Código de Verificación
                </DrawerTitle>
                <DrawerDescription className="text-base">
                  Hemos enviado un código de 6 dígitos a{' '}
                  <span className="font-semibold text-gray-800">{correo}</span>.
                  Ingrésalo a continuación para continuar.
                </DrawerDescription>
              </DrawerHeader>

              <div className="p-6 flex flex-col items-center">
                <div className="flex gap-2 mb-4">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      type="text"
                      inputMode="numeric"
                      maxLength="1"
                      ref={(el) => (inputs.current[index] = el)}
                      value={digit}
                      onChange={(e) => handleOtpChange(e.target, index)}
                      onKeyDown={(e) => handleOtpKeyDown(e, index)}
                      className="w-12 h-14 text-center text-2xl font-bold border-2 rounded-lg border-gray-300 focus:border-[#621f32] focus:ring-1 focus:ring-[#621f32] outline-none transition-all bg-white text-gray-900"
                    />
                  ))}
                </div>

                {error && (
                  <p className="text-sm text-red-600 mb-3 text-center">{error}</p>
                )}

                <p className="text-sm text-gray-500">
                  ¿No recibiste el código?{' '}
                  <button
                    onClick={handleResend}
                    className="text-[#621f32] font-semibold hover:underline"
                  >
                    Reenviar
                  </button>
                </p>
              </div>

              <DrawerFooter className="flex-row gap-3">
                <Button
                  onClick={handleVerifyOtp}
                  disabled={loading || otpExpired}
                  className="flex-1 bg-[#621f32] hover:bg-[#4a1726] h-10 text-base"
                >
                  {loading ? 'Verificando…' : 'Verificar Acceso'}
                </Button>
                <DrawerClose asChild>
                  <Button variant="outline" className="flex-1 h-10 text-base">
                    Cancelar
                  </Button>
                </DrawerClose>
              </DrawerFooter>
            </>
          )}

          {/* ── Step: Set password (new user) ─────────────────────── */}
          {step === 'set_password' && (
            <>
              <DrawerHeader className="text-center">
                <DrawerTitle className="text-2xl font-bold text-[#621f32]">
                  Registra tu Contraseña
                </DrawerTitle>
                <DrawerDescription className="text-base">
                  Es la primera vez que accedes. Crea una contraseña para ingresar en el futuro.
                  Recuerda que tendrá vigencia de{' '}
                  <span className="font-semibold text-gray-800">24 horas</span>.
                </DrawerDescription>
              </DrawerHeader>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nueva contraseña
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo 8 caracteres"
                    className="block w-full rounded-md bg-white px-3 py-2 text-sm text-gray-900 outline outline-1 outline-gray-300 focus:outline-2 focus:outline-[#621f32]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirmar contraseña
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repite la contraseña"
                    className="block w-full rounded-md bg-white px-3 py-2 text-sm text-gray-900 outline outline-1 outline-gray-300 focus:outline-2 focus:outline-[#621f32]"
                  />
                </div>
                {error && (
                  <p className="text-sm text-red-600 rounded-md bg-red-50 px-3 py-2 border border-red-200">
                    {error}
                  </p>
                )}
              </div>

              <DrawerFooter className="flex-row gap-3">
                <Button
                  onClick={handleSetPassword}
                  disabled={loading}
                  className="flex-1 bg-[#621f32] hover:bg-[#4a1726] h-10 text-base"
                >
                  {loading ? 'Guardando…' : 'Registrar y Acceder'}
                </Button>
                <DrawerClose asChild>
                  <Button variant="outline" className="flex-1 h-10 text-base">
                    Cancelar
                  </Button>
                </DrawerClose>
              </DrawerFooter>
            </>
          )}

          {/* ── Step: Enter password (returning user) ─────────────── */}
          {step === 'enter_password' && (
            <>
              <DrawerHeader className="text-center">
                <DrawerTitle className="text-2xl font-bold text-[#621f32]">
                  Ingresa tu Contraseña
                </DrawerTitle>
                <DrawerDescription className="text-base">
                  Código verificado correctamente. Ingresa tu contraseña para acceder al sistema.
                </DrawerDescription>
              </DrawerHeader>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contraseña
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                    placeholder="Tu contraseña de acceso"
                    autoFocus
                    className="block w-full rounded-md bg-white px-3 py-2 text-sm text-gray-900 outline outline-1 outline-gray-300 focus:outline-2 focus:outline-[#621f32]"
                  />
                </div>
                {error && (
                  <p className="text-sm text-red-600 rounded-md bg-red-50 px-3 py-2 border border-red-200">
                    {error}
                  </p>
                )}
              </div>

              <DrawerFooter className="flex-row gap-3">
                <Button
                  onClick={handleLogin}
                  disabled={loading}
                  className="flex-1 bg-[#621f32] hover:bg-[#4a1726] h-10 text-base"
                >
                  {loading ? 'Ingresando…' : 'Acceder al Sistema'}
                </Button>
                <DrawerClose asChild>
                  <Button variant="outline" className="flex-1 h-10 text-base">
                    Cancelar
                  </Button>
                </DrawerClose>
              </DrawerFooter>
            </>
          )}

        </div>
      </DrawerContent>
    </Drawer>
  );
}
