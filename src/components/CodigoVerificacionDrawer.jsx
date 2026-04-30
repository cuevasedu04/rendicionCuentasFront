import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { useState, useRef } from "react"

export default function CodigoVerificacionDrawer({ open, onOpenChange }) {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const inputs = useRef([]);

    const handleChange = (element, index) => {
        if (isNaN(element.value)) return false;

        setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

        // Focus next input
        if (element.value !== '' && index < 5) {
            inputs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
            inputs.current[index - 1].focus();
        }
    };

    return (
        <Drawer open={open} onOpenChange={onOpenChange}>            
            <DrawerContent>
                <div className="mx-auto w-full max-w-md">
                    <DrawerHeader className="text-center">
                        <DrawerTitle className="text-2xl font-bold text-[#621f32]">Código de Verificación</DrawerTitle>
                        <DrawerDescription className="text-base">
                            Hemos enviado un código de 6 dígitos a su correo institucional.
                            Por favor, ingréselo a continuación para continuar.
                        </DrawerDescription>
                    </DrawerHeader>
                    
                    <div className="p-6 flex flex-col items-center">
                        <div className="flex gap-2 mb-6">
                            {otp.map((data, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    maxLength="1"
                                    ref={(el) => (inputs.current[index] = el)}
                                    value={data}
                                    onChange={(e) => handleChange(e.target, index)}
                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                    className="w-12 h-14 text-center text-2xl font-bold border-2 rounded-lg border-gray-300 focus:border-[#621f32] focus:ring-1 focus:ring-[#621f32] outline-none transition-all bg-white text-gray-900"
                                />
                            ))}
                        </div>
                        
                        <p className="text-sm text-gray-500 mb-4">
                            ¿No recibiste el código? <button className="text-[#621f32] font-semibold hover:underline">Reenviar</button>
                        </p>
                    </div>

                    <DrawerFooter className="flex-row gap-3">
                        <Button className="flex-1 bg-[#621f32] hover:bg-[#4a1726] h-10 text-base">
                            Verificar Acceso
                        </Button>
                        <DrawerClose asChild>
                            <Button variant="outline" className="flex-1 h-10 text-base">
                                Cancelar
                            </Button>
                        </DrawerClose>
                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer>
    )
}
