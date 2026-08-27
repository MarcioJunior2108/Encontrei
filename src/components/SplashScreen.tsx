'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export function SplashScreen() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Detecta se está rodando como um aplicativo instalado (PWA)
    const isStandalone = 
      window.matchMedia('(display-mode: standalone)').matches || 
      (window.navigator as any).standalone;
    
    // Para testar no navegador (ou se quiser ativar para todos), use `if (true) {`
    if (isStandalone) {
      setIsVisible(true);
      
      // Oculta a splash screen depois de 2.5 segundos
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="splash-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[hsl(var(--background))] overflow-hidden"
        >
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ 
              scale: [0.6, 1.1, 1], 
              opacity: [0, 1, 1],
            }}
            transition={{
              duration: 1.2,
              ease: "easeOut",
              times: [0, 0.7, 1]
            }}
            className="relative w-40 h-40 flex items-center justify-center"
          >
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1.2
              }}
              className="relative w-full h-full"
            >
              {/* O logo claro (usado no tema escuro) e o logo escuro (usado no tema claro) */}
              <Image 
                src="/logo-dark.png" 
                alt="AcheiYou"
                fill
                className="object-contain hidden dark:block"
                priority
              />
              <Image 
                src="/logo.png" 
                alt="AcheiYou"
                fill
                className="object-contain block dark:hidden"
                priority
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
