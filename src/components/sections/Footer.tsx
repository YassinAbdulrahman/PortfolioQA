'use client';

import { motion } from 'framer-motion';
import { ArrowUp, Linkedin, Mail, Phone, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';

const socialLinks = [
  { icon: Linkedin, href: 'https://linkedin.com/in/qahtan-saidi/', label: 'LinkedIn' },
  { icon: Mail, href: 'mailto:saidi.qahtan@gmail.com', label: 'Email' },
  { icon: Phone, href: 'tel:+966508674052', label: 'Phone' },
  { icon: Github, href: '#', label: 'GitHub' },
];

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative border-t border-white/5 mt-auto">
      <div className="absolute inset-0 gradient-bg opacity-30" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="text-center md:text-left">
            <a href="#home" className="text-2xl font-bold">
              <span className="text-white">QA</span>
              <span className="text-[#2563EB]">.</span>
            </a>
            <p className="text-slate-500 text-sm mt-1">Data Analyst &bull; Riyadh, KSA</p>
          </div>

          {/* Social links */}
          <div className="flex items-center gap-3">
            {socialLinks.map((link) => (
              <motion.a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -3 }}
                className="w-10 h-10 rounded-xl glass flex items-center justify-center text-slate-400 hover:text-[#38BDF8] hover:border-[#2563EB]/30 transition-all duration-300"
                aria-label={link.label}
              >
                <link.icon className="h-4 w-4" />
              </motion.a>
            ))}
          </div>

          {/* Copyright + Back to top */}
          <div className="flex flex-col items-center md:items-end gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={scrollToTop}
              className="w-10 h-10 rounded-xl glass text-slate-400 hover:text-white hover:border-[#2563EB]/30 transition-all"
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
            <p className="text-slate-500 text-xs">
              &copy; {new Date().getFullYear()} Qahtan Al Saidi. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}