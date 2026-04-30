"use client";

import { Zoom } from "react-awesome-reveal";
import CodigoVerificacionDrawer from "@/components/CodigoVerificacionDrawer";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Login() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [isVerificationSent, setIsVerificationSent] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulación de envío de código
        setIsVerificationSent(true);
        setDrawerOpen(true);
    }

    return (
        <Zoom>
            <div className="flex min-h-[calc(100vh-200px)] flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-md bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-gray-200">
                    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                        <img
                            alt="Logo ANAM"
                            src="/anam.png"
                            className="mx-auto h-20 w-auto drop-shadow-sm"
                        />
                        <h2 className="mt-8 text-center text-2xl font-bold tracking-tight text-gray-900">
                            Inicia sesión en tu cuenta
                        </h2>
                    </div>

                    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-900">
                                    Correo institucional (@anam.gob.mx)
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        autoComplete="email"
                                        disabled={isVerificationSent}
                                        className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-[#621f32] sm:text-sm disabled:bg-gray-100 disabled:text-gray-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={isVerificationSent}
                                    className="flex w-full justify-center rounded-md bg-[#621f32] px-3 py-2 text-sm font-semibold text-white shadow-md hover:bg-[#4a1726] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#621f32] transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
                                >
                                    {isVerificationSent ? "Código Enviado" : "Iniciar sesión"}
                                </button>
                            </div>
                        </form>

                        {isVerificationSent && (
                            <div className="mt-4">
                                <Button 
                                    variant="outline" 
                                    onClick={() => setDrawerOpen(true)}
                                    className="w-full border-[#621f32] text-[#621f32] hover:bg-[#621f32]/10"
                                >
                                    Ingresar código de verificación
                                </Button>
                            </div>
                        )}

                        <p className="mt-10 text-center text-sm text-gray-600">
                            Acceso exclusivo para personal de la{' '}
                            <span className="font-semibold text-[#621f32]">
                                Agencia Nacional de Aduanas de México
                            </span>
                        </p>
                    </div>
                </div>
            </div>
            <CodigoVerificacionDrawer 
                open={drawerOpen} 
                onOpenChange={setDrawerOpen} 
            />
        </Zoom>
    )
}
