'use client';

import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Send, Mail, User, MessageSquare, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export default function Contact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus('success');
        setForm({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => setStatus('idle'), 4000);
      } else {
        setStatus('error');
        setTimeout(() => setStatus('idle'), 3000);
      }
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <section id="contact" className="py-24 md:py-32 relative">
      <div className="absolute inset-0 grid-pattern opacity-20" />
      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-[#38BDF8] text-sm font-medium tracking-widest uppercase">Let&apos;s Talk</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mt-2">Get In Touch</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-[#2563EB] to-[#38BDF8] mx-auto mt-4 rounded-full" />
          <p className="text-slate-400 mt-4 max-w-xl mx-auto text-sm">
            Have a project in mind or want to discuss data opportunities? I&apos;d love to hear from you.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl mx-auto"
        >
          <div className="glass rounded-2xl p-6 md:p-8">
            {status === 'success' ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <CheckCircle2 className="h-16 w-16 text-emerald-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Message Sent!</h3>
                <p className="text-slate-400 text-sm">Thank you for reaching out. I&apos;ll get back to you soon.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-slate-300 text-sm flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5 text-[#2563EB]" />
                      Name
                    </Label>
                    <Input
                      id="name"
                      placeholder="Your name"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 rounded-xl focus:border-[#2563EB]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-slate-300 text-sm flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5 text-[#2563EB]" />
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 rounded-xl focus:border-[#2563EB]"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-slate-300 text-sm flex items-center gap-1.5">
                    <MessageSquare className="h-3.5 w-3.5 text-[#2563EB]" />
                    Subject
                  </Label>
                  <Input
                    id="subject"
                    placeholder="What's this about?"
                    required
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 rounded-xl focus:border-[#2563EB]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message" className="text-slate-300 text-sm flex items-center gap-1.5">
                    <MessageSquare className="h-3.5 w-3.5 text-[#2563EB]" />
                    Message
                  </Label>
                  <Textarea
                    id="message"
                    placeholder="Tell me about your project or opportunity..."
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 rounded-xl focus:border-[#2563EB] resize-none"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full bg-[#2563EB] hover:bg-[#1d4ed8] text-white rounded-2xl h-12 ripple"
                >
                  {status === 'sending' ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </div>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
                {status === 'error' && (
                  <p className="text-red-400 text-sm text-center">Something went wrong. Please try again.</p>
                )}
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}