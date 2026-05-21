import { Link } from "react-router-dom";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";

export default function FinalCTA() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} className="relative overflow-hidden bg-charcoal py-24 sm:py-32 text-white">
      <div className="absolute inset-0 bg-grid-dark opacity-30" />
      <div className="absolute left-0 top-0 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-[120px]" />
      <div className="absolute right-0 bottom-0 h-[600px] w-[600px] translate-x-1/2 translate-y-1/2 rounded-full bg-accent/15 blur-[120px]" />
      
      <div className="container-page relative grid gap-12 lg:grid-cols-12 lg:items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="lg:col-span-8"
        >
          <h2 className="text-display font-extrabold leading-[1.1] text-balance text-white">
            <span style={{ color: 'white' }}>Your</span> <span style={{ color: '#EFD173' }}>WASTE</span> <span style={{ color: 'white' }}>is somebody's</span> <span style={{ color: '#EFD173' }}>raw material.</span>
          </h2>
          <p className="mt-6 max-w-xl text-lg" style={{ color: 'white', opacity: 1 }}>
            Join 62,000 Africans cashing out every drop. Bank, airtime, bills — paid in seconds.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2 }}
          className="flex flex-col gap-3 sm:flex-row lg:col-span-4 lg:flex-col"
        >
          <Link to="/auth/register" className="btn-gold btn-lg">Start earning <ArrowRight size={16} /></Link>
          <Link 
            to="/find-hub" 
            className="btn-lg inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/8 px-7 py-4 text-base font-bold text-white backdrop-blur transition hover:bg-white/15"
          >
            <MapPin size={16} /> Find a hub
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
