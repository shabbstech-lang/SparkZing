import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Timer } from 'lucide-react';

export function CountdownBanner() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 2,
    minutes: 45,
    seconds: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const format = (num: number) => num.toString().padStart(2, '0');

  return (
    <div className="bg-deep-teal py-2.5 px-4 flex items-center justify-center gap-4 text-white overflow-hidden relative group cursor-pointer lg:hidden">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-2"
      >
        <div className="bg-spark-orange p-1 rounded-full animate-pulse">
          <Timer className="w-3 h-3 text-white" />
        </div>
        <span className="text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap">
          Summer Zing Sale Ends In:
        </span>
      </motion.div>
      
      <div className="flex gap-1.5 font-mono text-xs font-black">
        <div className="bg-white/10 px-1.5 py-0.5 rounded border border-white/20">
          {format(timeLeft.hours)}
        </div>
        <span className="text-white/50">:</span>
        <div className="bg-white/10 px-1.5 py-0.5 rounded border border-white/20">
          {format(timeLeft.minutes)}
        </div>
        <span className="text-white/50">:</span>
        <div className="bg-white/10 px-1.5 py-0.5 rounded border border-white/20 text-spark-orange">
          {format(timeLeft.seconds)}
        </div>
      </div>

      <motion.div 
        animate={{ x: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute right-4 hidden sm:block"
      >
        <span className="text-[8px] font-bold underline decoration-spark-orange underline-offset-4">GRAB NOW</span>
      </motion.div>
    </div>
  );
}
