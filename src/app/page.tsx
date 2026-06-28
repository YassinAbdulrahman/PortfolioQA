'use client';

import { useState } from 'react';
import Navbar from '@/components/sections/Navbar';
import ScrollProgress from '@/components/sections/ScrollProgress';
import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import Experience from '@/components/sections/Experience';
import Skills from '@/components/sections/Skills';
import Projects from '@/components/sections/Projects';
import Certificates from '@/components/sections/Certificates';
import Contact from '@/components/sections/Contact';
import Footer from '@/components/sections/Footer';
import AdminDashboard from '@/components/admin/AdminDashboard';
import { Toaster } from '@/components/ui/sonner';

export default function Home() {
  const [adminOpen, setAdminOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <ScrollProgress />
      <Navbar onAdminClick={() => setAdminOpen(true)} />
      <main className="flex-1">
        <Hero />
        <About />
        <Experience />
        <Skills />
        <Projects />
        <Certificates />
        <Contact />
      </main>
      <Footer />
      <AdminDashboard open={adminOpen} onClose={() => setAdminOpen(false)} />
      <Toaster position="top-center" richColors />
    </div>
  );
}