'use client'

import Image from "next/image";
import { Zoom } from "react-awesome-reveal";
import RotatingText from "@/components/ui/RotatingText";
import { motion } from "motion/react";

export default function Home() {
  return (
    // Regresamos al min-h original de 200px
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center w-full relative">

      {/* Contenedor del contenido (Logo, Texto, Botón) */}
      <div className="relative isolate px-6 lg:px-8 w-full z-10">
        <div className="mx-auto max-w-3xl py-10">

          <Zoom>
            <div className="flex justify-center mb-5">
              <Image
                src="/anam.png"
                alt="Logo"
                width={150}
                height={150}
              />
            </div>

            {/* Contenido central */}
            <div className="text-center">
              {/* Mantenemos el badge con RotatingText pero ajustamos escala para que combine con el hero grande */}
              <div className="flex justify-center mb-6">
                <motion.div 
                  layout
                  transition={{ type: 'spring', damping: 25, stiffness: 120 }}
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#621f32]/20 bg-[#621f32]/5 text-[#621f32] text-sm sm:text-base font-medium"
                >
                  <span className="flex h-2.5 w-2.5 rounded-full bg-[#621f32] animate-pulse"></span>
                  Plataforma de
                  <RotatingText
                    texts={['Rendición de Cuentas', 'Informes de Gestión', 'Actas Entrega-Recepción', 'Transparencia']}
                    mainClassName="font-bold ml-1"
                    staggerFrom={"last"}
                    initial={{ y: "100%", opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: "-120%", opacity: 0 }}
                    staggerDuration={0.02}
                    splitLevelClassName="overflow-hidden"
                    transition={{ type: 'spring', damping: 25, stiffness: 120 }}
                    rotationInterval={3500}
                  />
                </motion.div>
              </div>

              <h1 className="text-3xl font-semibold text-gray-900 sm:text-6xl">
                Bienvenida/o al Sistema de Monitoreo de <br className="hidden sm:block" />
                <span className="text-[#621f32] font-bold">Rendición de Cuentas</span>
              </h1>
              <p className="mt-8 text-sm font-medium text-pretty text-gray-600 sm:text-xl/8">
                En este sistema podrás llevar a cabo un seguimiento y control el estado de entrega de las Actas Entrega-Recepción e Informes de Gestión individual de los servidores públicos de tu unidad administrativa.
              </p>
              <div className="mt-8 flex items-center justify-center gap-x-6">
                <a
                  href="/login"
                  className="rounded-md bg-[#621f32] px-4 py-2 text-base font-semibold text-white shadow-sm hover:bg-[#621f32]/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#621f32]/60 hover:scale-105 transition-all duration-300"
                >
                  Iniciar Sesión
                </a>
              </div>
            </div>
          </Zoom>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="absolute top-0 left-0 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-[calc(100vh/3)]"
      >
        <div
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
          className="relative -top-[10rem] -left-[10rem] aspect-[1155/678] w-[36.125rem] translate-x-0 bg-gradient-to-tr from-[#9089fc] to-[#ff80b5] opacity-30 sm:-top-[15rem] sm:-left-[20rem] sm:w-[72.1875rem]"
        />
      </div>

    </div>
  )
}
