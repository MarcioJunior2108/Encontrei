'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Search } from 'lucide-react';

const activities = [
  { name: "Ana P.", service: "Reformas", city: "São Paulo, SP" },
  { name: "Carlos M.", service: "Eletricista", city: "Curitiba, PR" },
  { name: "Juliana T.", service: "Limpeza", city: "Belo Horizonte, MG" },
  { name: "Marcos R.", service: "Fretes", city: "Rio de Janeiro, RJ" },
  { name: "Fernanda L.", service: "Pintor", city: "Salvador, BA" },
  { name: "Roberto S.", service: "Encanador", city: "Porto Alegre, RS" },
  { name: "João V.", service: "Jardineiro", city: "Campinas, SP" },
  { name: "Camila F.", service: "Diarista", city: "Goiânia, GO" },
  { name: "Lucas P.", service: "Ar-condicionado", city: "Recife, PE" }
];

export function RecentActivityToast() {
  const [activeActivity, setActiveActivity] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Initial delay before showing the first toast
    const initialTimeout = setTimeout(() => {
      setIsVisible(true);
    }, 4000);

    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        // Random next activity to make it feel organic, but avoiding the same one twice
        setActiveActivity((prev) => {
          let next = Math.floor(Math.random() * activities.length);
          if (next === prev) next = (next + 1) % activities.length;
          return next;
        });
        setIsVisible(true);
      }, 1000); // Wait 1s between hiding and showing the next
    }, 12000); // Show a new notification every 12 seconds

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []);

  const activity = activities[activeActivity];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-auto sm:w-80 z-50 bg-[hsl(var(--background))] border border-[hsl(var(--border))] p-4 rounded-xl shadow-2xl flex items-start gap-4 pointer-events-none"
        >
          <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0 border border-blue-500/20">
            <Search className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <p className="text-sm text-[hsl(var(--foreground))]">
              <span className="font-bold">{activity.name}</span> buscou por <span className="font-bold text-blue-600 dark:text-blue-400">{activity.service}</span>
            </p>
            <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1 flex items-center gap-1">
              <MapPin className="w-3 h-3" /> {activity.city}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
