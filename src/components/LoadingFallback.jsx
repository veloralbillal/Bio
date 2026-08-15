import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, Sparkles } from 'lucide-react';

export default function LoadingFallback({ message = 'Loading component...' }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="flex items-center justify-center p-8 w-full min-h-[200px]"
    >
      <div className="flex flex-col items-center gap-3 p-6 rounded-3xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/60 shadow-lg text-slate-600 dark:text-slate-300">
        <div className="relative">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500 dark:text-indigo-400" />
          <motion.div
            animate={{ scale: [1, 1.25, 1], opacity: [0.3, 0.8, 0.3] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
            className="absolute -top-1 -right-1 text-amber-400"
          >
            <Sparkles className="w-3.5 h-3.5" />
          </motion.div>
        </div>
        <span className="text-xs font-semibold tracking-wide font-mono">{message}</span>
      </div>
    </motion.div>
  );
}
