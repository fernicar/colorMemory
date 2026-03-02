import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface SpicyOverlayProps {
  isOpen: boolean;
  onKeep: () => void;
  onChange: () => void;
}

export function SpicyOverlay({ isOpen, onKeep, onChange }: SpicyOverlayProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-6"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-zinc-900 rounded-2xl p-6 w-full max-w-sm border border-zinc-800 shadow-2xl"
          >
            <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Whoa there.</h2>
            <p className="text-zinc-400 mb-6 leading-relaxed">
              That name is a bit spicy. Are you sure you want to use it?
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={onChange}
                className="w-full py-3 bg-white text-black font-semibold rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-transform"
              >
                Change it
              </button>
              <button
                onClick={onKeep}
                className="w-full py-3 bg-zinc-800 text-zinc-300 font-medium rounded-xl hover:bg-zinc-700 hover:text-white transition-colors"
              >
                Keep it
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
