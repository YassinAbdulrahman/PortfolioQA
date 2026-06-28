'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Briefcase, MapPin, Calendar } from 'lucide-react';

interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  responsibilities: string;
}

export default function Experience() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  useEffect(() => {
    fetch('/api/experience').then(r => r.json()).then(setExperiences).catch(() => {});
  }, []);

  return (
    <section id="experience" className="py-24 md:py-32 relative">
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-[#38BDF8] text-sm font-medium tracking-widest uppercase">Career Path</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mt-2">Work Experience</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-[#2563EB] to-[#38BDF8] mx-auto mt-4 rounded-full" />
        </motion.div>

        <div className="relative">
          {/* Timeline line - desktop */}
          <div className="hidden md:block timeline-line" />

          <div className="space-y-12 md:space-y-0">
            {experiences.map((exp, index) => {
              const isLeft = index % 2 === 0;
              const responsibilities = exp.responsibilities.split('.').filter(Boolean).map(s => s.trim()).filter(Boolean);

              return (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  className={`relative md:flex md:items-start md:mb-16 ${
                    isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Timeline dot */}
                  <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#2563EB] border-4 border-[#020617] z-10 mt-6 glow-blue" />

                  {/* Content */}
                  <div className={`md:w-[calc(50%-2rem)] ${isLeft ? 'md:pr-0' : 'md:pl-0'}`}>
                    <motion.div
                      whileHover={{ y: -4 }}
                      className="glass rounded-2xl p-6 group hover:border-[#2563EB]/30 transition-all duration-300"
                    >
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2563EB]/10 text-[#38BDF8] text-xs font-medium">
                          <Calendar className="h-3 w-3" />
                          {exp.startDate} — {exp.endDate}
                        </span>
                        {exp.current && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium">
                            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                            Current
                          </span>
                        )}
                      </div>

                      <h3 className="text-lg font-semibold text-white group-hover:text-[#38BDF8] transition-colors">
                        {exp.position}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400 mt-1">
                        <span className="flex items-center gap-1">
                          <Briefcase className="h-3.5 w-3.5 text-[#2563EB]" />
                          {exp.company}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-[#2563EB]" />
                          {exp.location}
                        </span>
                      </div>

                      <ul className="mt-4 space-y-2">
                        {responsibilities.slice(0, 4).map((resp, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                            <span className="mt-1.5 w-1.5 h-1.5 bg-[#2563EB] rounded-full flex-shrink-0" />
                            {resp}
                          </li>
                        ))}
                        {responsibilities.length > 4 && (
                          <li className="text-sm text-slate-500 pl-3.5">
                            +{responsibilities.length - 4} more responsibilities
                          </li>
                        )}
                      </ul>
                    </motion.div>
                  </div>

                  {/* Spacer for the other side */}
                  <div className="hidden md:block md:w-[calc(50%-2rem)]" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}