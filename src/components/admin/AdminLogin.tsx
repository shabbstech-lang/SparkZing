import { useState, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, User, AlertCircle, ArrowLeft } from 'lucide-react';

export function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown !== null && countdown > 0) {
      timer = setTimeout(() => setCountdown(prev => prev! - 1), 1000);
    } else if (countdown === 0) {
      navigate('/');
    }
    return () => clearTimeout(timer);
  }, [countdown, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    
    const success = await login(username, password);
    if (!success) {
      setError('Invalid UserId or Password');
      setCountdown(5);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-[2rem] shadow-2xl p-8 border border-slate-100"
      >
        <div className="text-center mb-8">
          <div className="inline-flex p-4 bg-spark-orange/10 rounded-2xl mb-4 text-spark-orange">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black text-deep-charcoal italic uppercase tracking-tight">Admin Portal</h1>
          <p className="text-slate-500 font-medium mt-2">Please authenticate to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Username</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-spark-orange transition-colors" />
              <input 
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoFocus
                disabled={countdown !== null}
                className="w-full bg-slate-50 border-2 border-transparent focus:border-spark-orange focus:bg-white rounded-2xl py-4 pl-12 pr-4 outline-none transition-all font-medium"
                placeholder="Enter username"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-spark-orange transition-colors" />
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={countdown !== null}
                className="w-full bg-slate-50 border-2 border-transparent focus:border-spark-orange focus:bg-white rounded-2xl py-4 pl-12 pr-4 outline-none transition-all font-medium"
                placeholder="••••••••"
              />
            </div>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-3 p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 overflow-hidden"
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <div className="text-sm font-bold">
                  <div>{error}</div>
                  {countdown !== null && (
                    <div className="text-[10px] uppercase opacity-70 mt-1">
                      Redirecting to homepage in {countdown}s...
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <button 
            type="submit"
            disabled={countdown !== null}
            className="w-full bg-deep-charcoal text-white py-4 rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] shadow-xl hover:bg-spark-orange active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale"
          >
            Authenticate Now
          </button>
        </form>

        <button 
          onClick={() => navigate('/')}
          className="w-full mt-6 flex items-center justify-center gap-2 text-slate-400 hover:text-deep-charcoal transition-colors text-xs font-bold uppercase tracking-widest"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Store
        </button>
      </motion.div>
    </div>
  );
}
