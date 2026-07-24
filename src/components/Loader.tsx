import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Loader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let completeTimeout: ReturnType<typeof setTimeout> | null = null;
    const timer = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(timer);
          completeTimeout = setTimeout(onComplete, 800);
          return 100;
        }
        return p + Math.floor(Math.random() * 15) + 5;
      });
    }, 150);

    return () => {
      clearInterval(timer);
      if (completeTimeout) {
        clearTimeout(completeTimeout);
      }
    };
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[200] bg-[#050505] flex flex-col items-center justify-center text-white"
      initial={{ opacity: 1 }}
      exit={{ 
        y: '-100%', 
        opacity: 0,
        transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } 
      }}
    >
      <div className="w-full max-w-md px-8 flex flex-col items-center">
        <motion.div 
          className="text-4xl md:text-6xl font-light tracking-tighter mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          K S K<span className="text-white/40">.</span>
        </motion.div>
        
        <div className="w-full h-[1px] bg-white/10 relative overflow-hidden">
          <motion.div 
            className="absolute top-0 left-0 h-full bg-white"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(progress, 100)}%` }}
            transition={{ ease: 'circOut' }}
          />
        </div>
        
        <div className="w-full flex justify-between mt-4 text-xs font-mono text-white/50 tracking-widest uppercase">
          <span>Loading Experience</span>
          <span>{Math.min(progress, 100)}%</span>
        </div>
      </div>
    </motion.div>
  );
}
