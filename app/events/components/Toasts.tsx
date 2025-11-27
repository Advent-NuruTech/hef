// app/events/components/Toasts.tsx
"use client";
import React from "react";
import { AnimatePresence, motion } from "framer-motion";

export function useToasts() {
  const [toasts, setToasts] = React.useState<{ id: string; title: string; body?: string }[]>([]);

  function push(title: string, body?: string, ttl = 5000) {
    const id = String(Date.now()) + Math.random().toString(36).slice(2, 7);
    setToasts((t) => [...t, { id, title, body }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), ttl);
  }

  function remove(id: string) {
    setToasts((t) => t.filter((x) => x.id !== id));
  }

  const Toasts = () => (
    <div className="fixed right-4 bottom-4 z-50 w-[320px] space-y-2">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            className="bg-white border rounded-lg p-3 shadow"
          >
            <div className="flex justify-between gap-3">
              <div>
                <div className="font-semibold text-sm">{t.title}</div>
                {t.body && <div className="text-xs text-gray-600">{t.body}</div>}
              </div>
              <button onClick={() => remove(t.id)} className="text-xs text-gray-400">✕</button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );

  return { push, Toasts };
}
