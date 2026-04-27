import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff, X, RefreshCw } from 'lucide-react';

const OfflineBanner: React.FC = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <AnimatePresence>
      {isOffline && isVisible && (
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          className="fixed top-24 left-1/2 -translate-x-1/2 z-[200] w-[90%] max-w-lg"
        >
          <div className="bg-charcoal text-white p-4 rounded-2xl shadow-2xl border border-white/10 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-error/20 rounded-xl flex items-center justify-center text-error">
                <WifiOff size={20} />
              </div>
              <div>
                <p className="font-bold text-small">You're Offline</p>
                <p className="text-[10px] text-white/50 font-medium uppercase tracking-widest">Submissions will be saved locally</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => window.location.reload()}
                className="p-2 hover:bg-white/5 rounded-lg text-white/40 hover:text-white transition-all"
              >
                <RefreshCw size={18} />
              </button>
              <button 
                onClick={() => setIsVisible(false)}
                className="p-2 hover:bg-white/5 rounded-lg text-white/40 hover:text-white transition-all"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OfflineBanner;
