'use client';

import { useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { GraduationCap, Calendar, Award, Briefcase, Globe, BookOpen } from 'lucide-react';

interface Profile {
  aboutText: string;
}

const stats = [
  { label: 'Years Experience', value: '4+', icon: Briefcase },
  { label: 'Projects', value: '15+', icon: Award },
  { label: 'Certificates', value: '7', icon: GraduationCap },
  { label: 'Tools & Skills', value: '19', icon: BookOpen },
];

const education = {
  degree: 'Bachelor in Business Information Technology (BIT)',
  university: 'Twintech International University',
  year: '2017 – 2021',
  gpa: '3.59',
};

const languages = [
  { name: 'Arabic', level: 'Native', percent: 100 },
  { name: 'English', level: 'Professional', percent: 85 },
];

function CountUp({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 2000;
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

export default function About() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  useEffect(() => {
    fetch('/api/profile').then(r => r.json()).then(setProfile).catch(() => {});
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <section id="about" className="py-24 md:py-32 relative">
      <div className="absolute inset-0 gradient-bg opacity-50" />
      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-[#38BDF8] text-sm font-medium tracking-widest uppercase">Get to know me</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mt-2">About Me</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-[#2563EB] to-[#38BDF8] mx-auto mt-4 rounded-full" />
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid lg:grid-cols-5 gap-10"
        >
          {/* Story column */}
          <motion.div variants={itemVariants} className="lg:col-span-3">
            <div className="glass rounded-2xl p-6 md:p-8 h-full">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Globe className="h-5 w-5 text-[#2563EB]" />
                My Story
              </h3>
              <div className="text-slate-300 text-sm leading-relaxed space-y-4">
                {(profile?.aboutText || 'Loading...').split('\n').filter(Boolean).map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>

              {/* Languages */}
              <div className="mt-8 pt-6 border-t border-white/10">
                <h4 className="text-sm font-medium text-slate-400 mb-4">Languages</h4>
                <div className="grid grid-cols-2 gap-4">
                  {languages.map((lang) => (
                    <div key={lang.name}>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="text-white font-medium">{lang.name}</span>
                        <span className="text-slate-400">{lang.level}</span>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={inView ? { width: `${lang.percent}%` } : { width: 0 }}
                          transition={{ duration: 1.2, delay: 0.5 }}
                          className="h-full bg-gradient-to-r from-[#2563EB] to-[#38BDF8] rounded-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right column */}
          <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat) => (
                <motion.div
                  key={stat.label}
                  variants={itemVariants}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="glass rounded-2xl p-5 text-center group hover:border-[#2563EB]/30 transition-colors"
                >
                  <stat.icon className="h-6 w-6 text-[#38BDF8] mx-auto mb-2 group-hover:text-[#2563EB] transition-colors" />
                  <div className="text-2xl md:text-3xl font-bold text-white">
                    <CountUp target={parseInt(stat.value)} suffix={stat.value.includes('+') ? '+' : ''} />
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Education */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -2 }}
              className="glass rounded-2xl p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-[#2563EB]" />
                Education
              </h3>
              <div className="space-y-2 text-sm">
                <p className="text-white font-medium">{education.degree}</p>
                <p className="text-slate-400">{education.university}</p>
                <div className="flex items-center gap-4 text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {education.year}
                  </span>
                  <span>GPA: <span className="text-[#38BDF8] font-medium">{education.gpa}</span></span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}