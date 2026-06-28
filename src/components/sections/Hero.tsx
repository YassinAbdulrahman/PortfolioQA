'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, Mail, MapPin, Linkedin, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Profile {
  name: string;
  title: string;
  location: string;
  email: string;
  linkedin: string;
  summary: string;
}

export default function Hero() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [typedText, setTypedText] = useState('');
  const titles = ['Data Analyst', 'SQL Expert', 'Power BI Developer', 'Excel VBA Specialist', 'Python Analyst'];
  const titleIndex = useRef(0);
  const charIndex = useRef(0);
  const isDeleting = useRef(false);

  useEffect(() => {
    fetch('/api/profile').then(r => r.json()).then(setProfile).catch(() => {});
  }, []);

  useEffect(() => {
    const currentTitle = titles[titleIndex.current];
    const timeout = setTimeout(() => {
      if (!isDeleting.current) {
        setTypedText(currentTitle.slice(0, charIndex.current + 1));
        charIndex.current++;
        if (charIndex.current === currentTitle.length) {
          isDeleting.current = true;
          setTimeout(() => {}, 1500);
        }
      } else {
        setTypedText(currentTitle.slice(0, charIndex.current - 1));
        charIndex.current--;
        if (charIndex.current === 0) {
          isDeleting.current = false;
          titleIndex.current = (titleIndex.current + 1) % titles.length;
        }
      }
    }, isDeleting.current ? 40 : 80);
    return () => clearTimeout(timeout);
  }, [typedText]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 gradient-bg" />
      <div className="absolute inset-0 grid-pattern" />

      {/* Floating orbs */}
      <motion.div
        animate={{ x: [0, 30, -20, 0], y: [0, -40, 20, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        className="absolute top-1/4 left-1/4 w-72 h-72 bg-[#2563EB]/10 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ x: [0, -30, 20, 0], y: [0, 30, -20, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#38BDF8]/8 rounded-full blur-3xl"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Text content */}
          <div className="flex-1 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-4"
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs font-medium text-[#38BDF8]">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                Available for opportunities
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4"
            >
              <span className="text-white">Hi, I&apos;m </span>
              <span className="bg-gradient-to-r from-[#2563EB] to-[#38BDF8] bg-clip-text text-transparent">
                {profile?.name || 'Qahtan Al Saidi'}
              </span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="h-10 md:h-12 mb-6"
            >
              <span className="text-xl sm:text-2xl md:text-3xl text-slate-300 font-light">
                {typedText}
                <span className="text-[#38BDF8] animate-pulse">|</span>
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-sm text-slate-400 mb-8"
            >
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-[#2563EB]" />
                {profile?.location || 'Riyadh, Saudi Arabia'}
              </span>
              <span className="flex items-center gap-1.5">
                <Mail className="h-4 w-4 text-[#2563EB]" />
                {profile?.email || 'saidi.qahtan@gmail.com'}
              </span>
              <span className="flex items-center gap-1.5">
                <Linkedin className="h-4 w-4 text-[#2563EB]" />
                LinkedIn
              </span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-xl mx-auto lg:mx-0 mb-8"
            >
              {profile?.summary || 'Data Analyst with a strong background in Business Information Technology, specializing in data cleaning, periodic reporting, and dashboard development.'}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap gap-4 justify-center lg:justify-start"
            >
              <a href="/upload/Qahtan_Al_Saidi_Data_Analyst_Resume.pdf" download>
                <Button size="lg" className="bg-[#2563EB] hover:bg-[#1d4ed8] text-white rounded-2xl px-8 ripple">
                  Download CV
                </Button>
              </a>
              <Button
                size="lg"
                variant="outline"
                onClick={() => scrollTo('contact')}
                className="border-[#2563EB]/50 text-white hover:bg-[#2563EB]/10 rounded-2xl px-8"
              >
                Contact Me
              </Button>
            </motion.div>
          </div>

          {/* Avatar / Profile visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative flex-shrink-0"
          >
            <div className="relative w-64 h-64 sm:w-80 sm:h-80">
              <div className="absolute inset-0 bg-gradient-to-br from-[#2563EB] to-[#38BDF8] rounded-3xl rotate-6 opacity-20" />
              <div className="absolute inset-0 bg-[#0F172A] rounded-3xl border border-white/10 overflow-hidden flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#2563EB] to-[#38BDF8] flex items-center justify-center">
                    <span className="text-4xl sm:text-5xl font-bold text-white">QA</span>
                  </div>
                  <p className="text-white font-semibold text-lg">Qahtan Al Saidi</p>
                  <p className="text-[#38BDF8] text-sm">Data Analyst</p>
                </div>
              </div>
              {/* Decorative dots */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-4 -right-4 w-8 h-8 bg-[#2563EB] rounded-full opacity-60"
              />
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -bottom-4 -left-4 w-6 h-6 bg-[#38BDF8] rounded-full opacity-60"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        onClick={() => scrollTo('about')}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 cursor-pointer scroll-indicator"
      >
        <div className="flex flex-col items-center gap-2 text-slate-500">
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <ChevronDown className="h-5 w-5" />
        </div>
      </motion.div>
    </section>
  );
}