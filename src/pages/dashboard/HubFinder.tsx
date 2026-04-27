import React, { useState } from 'react';
import { 
  MapPin, 
  Search, 
  Navigation, 
  Phone, 
  Clock, 
  ChevronRight,
  Filter,
  Maximize2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '../../components/ui/GlassCard';
import Button from '../../components/ui/Button';
import TextField from '../../components/ui/TextField';

const HubFinder: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHub, setSelectedHub] = useState<number | null>(null);

  const hubs = [
    { id: 1, name: 'Ikeja Central Hub', address: '12 Obafemi Awolowo Way, Ikeja', distance: '1.2km', capacity: 'High', status: 'Open', coords: { x: 30, y: 40 } },
    { id: 2, name: 'Lekki Green Point', address: 'Plot 5, Admiralty Way, Lekki', distance: '3.5km', capacity: 'Medium', status: 'Open', coords: { x: 70, y: 60 } },
    { id: 3, name: 'Maryland Satellite', address: '42 Ikorodu Road, Maryland', distance: '5.8km', capacity: 'Low', status: 'Closing Soon', coords: { x: 50, y: 20 } },
    { id: 4, name: 'Yaba Tech Hub', address: 'Yaba College of Technology', distance: '8.1km', capacity: 'High', status: 'Open', coords: { x: 45, y: 75 } },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto h-[calc(100vh-140px)] flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Find Collection Hubs</h1>
          <p className="text-white/50">Locate the nearest point to deposit your waste and earn rewards.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <TextField 
            placeholder="Search city or area..." 
            icon={<Search size={18} />} 
            className="md:w-80"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button variant="outline"><Filter size={18} /></Button>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden">
        {/* Hub List */}
        <div className="w-full lg:w-96 flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
          {hubs.map((hub) => (
            <button
              key={hub.id}
              onClick={() => setSelectedHub(hub.id)}
              className={cn(
                "text-left transition-all group",
                selectedHub === hub.id ? "scale-[0.98]" : "hover:scale-[1.01]"
              )}
            >
              <GlassCard 
                className={cn(
                  "p-5 border-white/5",
                  selectedHub === hub.id ? "bg-forest/20 border-forest shadow-glow" : "hover:border-white/20"
                )}
                animate={false}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-forest">
                      <MapPin size={18} />
                    </div>
                    <h3 className="font-bold text-white text-sm">{hub.name}</h3>
                  </div>
                  <span className="text-[10px] font-mono text-white/40">{hub.distance}</span>
                </div>
                <p className="text-xs text-white/60 mb-4 line-clamp-1">{hub.address}</p>
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    {[1, 2, 3].map((s) => (
                      <div 
                        key={s} 
                        className={cn(
                          "w-4 h-1 rounded-full",
                          hub.capacity === 'High' ? "bg-forest" : hub.capacity === 'Medium' ? "bg-gold" : "bg-red-500"
                        )} 
                      />
                    ))}
                  </div>
                  <span className={cn(
                    "text-[10px] font-bold px-2 py-0.5 rounded-full",
                    hub.status === 'Open' ? "bg-forest/20 text-forest-light" : "bg-red-500/20 text-red-400"
                  )}>
                    {hub.status}
                  </span>
                </div>
              </GlassCard>
            </button>
          ))}
        </div>

        {/* Interactive Map Simulation */}
        <div className="flex-1 relative rounded-3xl overflow-hidden border border-white/5 bg-charcoal-dark shadow-2xl">
          {/* Simulated Map Grid */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 border border-white/5" />
            <svg className="absolute inset-0 w-full h-full">
              <path d="M0,100 Q400,150 800,50" stroke="white" strokeWidth="2" fill="none" />
              <path d="M200,0 Q250,400 150,800" stroke="white" strokeWidth="2" fill="none" />
              <path d="M0,600 Q400,550 800,650" stroke="white" strokeWidth="2" fill="none" />
            </svg>
          </div>

          {/* Map Markers */}
          {hubs.map((hub) => (
            <motion.button
              key={hub.id}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.2 }}
              onClick={() => setSelectedHub(hub.id)}
              className="absolute z-20"
              style={{ left: `${hub.coords.x}%`, top: `${hub.coords.y}%` }}
            >
              <div className={cn(
                "relative flex flex-col items-center",
                selectedHub === hub.id ? "text-gold" : "text-forest"
              )}>
                <MapPin size={32} fill="currentColor" fillOpacity={0.2} />
                {selectedHub === hub.id && (
                  <motion.div 
                    layoutId="pulse"
                    className="absolute -inset-2 bg-gold/20 rounded-full animate-ping"
                  />
                )}
              </div>
            </motion.button>
          ))}

          {/* Map Controls */}
          <div className="absolute bottom-6 right-6 flex flex-col gap-2">
            <button className="w-10 h-10 glass-panel flex items-center justify-center text-white hover:bg-white/10 transition-all">
              <Maximize2 size={18} />
            </button>
            <button className="w-10 h-10 glass-panel flex items-center justify-center text-white hover:bg-white/10 transition-all">
              <Navigation size={18} />
            </button>
          </div>

          {/* Selection Detail Overlay */}
          <AnimatePresence>
            {selectedHub && (
              <motion.div
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 100 }}
                className="absolute bottom-6 left-6 right-20 lg:right-6"
              >
                <GlassCard className="p-6 shadow-2xl border-white/10 bg-charcoal/90 backdrop-blur-xl">
                  <div className="flex flex-col md:flex-row justify-between gap-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h2 className="text-2xl font-bold text-white">
                          {hubs.find(h => h.id === selectedHub)?.name}
                        </h2>
                        <span className="text-xs bg-forest/20 text-forest px-2 py-1 rounded-full font-bold">VERIFIED</span>
                      </div>
                      <p className="text-white/60 text-sm">
                        {hubs.find(h => h.id === selectedHub)?.address}
                      </p>
                      <div className="flex gap-4 pt-2">
                        <div className="flex items-center gap-2 text-white/40 text-xs">
                          <Clock size={14} /> 8:00 AM - 6:00 PM
                        </div>
                        <div className="flex items-center gap-2 text-white/40 text-xs">
                          <Phone size={14} /> +234 801 234 5678
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3 items-center">
                      <Button variant="outline" className="flex-1 md:flex-none">
                        Get Directions <ChevronRight size={16} />
                      </Button>
                      <Button variant="gold" className="flex-1 md:flex-none">
                        Start Submission
                      </Button>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

export default HubFinder;
