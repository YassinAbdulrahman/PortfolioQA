'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Award, Calendar, Building2 } from 'lucide-react';

interface Certificate {
  id: string;
  title: string;
  issuer: string;
  date: string;
}

const certGradients = [
  'from-[#2563EB]/10 to-[#38BDF8]/5',
  'from-[#818CF8]/10 to-[#2563EB]/5',
  'from-[#34D399]/10 to-[#38BDF8]/5',
  'from-[#FBBF24]/10 to-[#F97316]/5',
  'from-[#EC4899]/10 to-[#818CF8]/5',
  'from-[#38BDF8]/10 to-[#34D399]/5',
  'from-[#2563EB]/10 to-[#EC4899]/5',
];

export default function Certificates() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  useEffect(() => {
    fetch('/api/certificates').then(r => r.json()).then(setCertificates).catch(() => {});
  }, []);

  return (
    <section id="certificates" className="py-24 md:py-32 relative">
      <div className="absolute inset-0 gradient-bg opacity-30" />
      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-[#38BDF8] text-sm font-medium tracking-widest uppercase">Credentials</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mt-2">Certificates</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-[#2563EB] to-[#38BDF8] mx-auto mt-4 rounded-full" />
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {certificates.map((cert, index) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className={`group relative bg-gradient-to-br ${certGradients[index % certGradients.length]} glass rounded-2xl p-6 hover:border-[#2563EB]/30 transition-all duration-300 overflow-hidden`}
            >
              {/* Decorative corner */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-[#2563EB]/10 to-transparent rounded-bl-3xl" />

              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-[#2563EB]/15 flex items-center justify-center mb-4 group-hover:bg-[#2563EB]/25 transition-colors">
                  <Award className="h-6 w-6 text-[#38BDF8]" />
                </div>

                <h3 className="text-base font-semibold text-white group-hover:text-[#38BDF8] transition-colors mb-2 line-clamp-2">
                  {cert.title}
                </h3>

                <div className="space-y-1.5 text-sm text-slate-400">
                  <p className="flex items-center gap-1.5">
                    <Building2 className="h-3.5 w-3.5 text-[#2563EB]" />
                    {cert.issuer}
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-[#2563EB]" />
                    {cert.date}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}