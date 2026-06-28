'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ExternalLink, Github, Layers } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string;
  featured: boolean;
  githubUrl: string;
  demoUrl: string;
}

const gradients = [
  'from-[#2563EB]/20 to-[#38BDF8]/20',
  'from-[#818CF8]/20 to-[#2563EB]/20',
  'from-[#34D399]/20 to-[#38BDF8]/20',
  'from-[#FBBF24]/20 to-[#F97316]/20',
  'from-[#EC4899]/20 to-[#818CF8]/20',
  'from-[#38BDF8]/20 to-[#34D399]/20',
];

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  useEffect(() => {
    fetch('/api/projects').then(r => r.json()).then(setProjects).catch(() => {});
  }, []);

  return (
    <section id="projects" className="py-24 md:py-32 relative">
      <div className="absolute inset-0 grid-pattern opacity-20" />
      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-[#38BDF8] text-sm font-medium tracking-widest uppercase">Portfolio</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mt-2">Featured Projects</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-[#2563EB] to-[#38BDF8] mx-auto mt-4 rounded-full" />
          <p className="text-slate-400 mt-4 max-w-2xl mx-auto text-sm">
            Showcase of data analytics projects demonstrating expertise in dashboard design, reporting automation, and business intelligence solutions.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -6 }}
              className="group glass rounded-2xl overflow-hidden hover:border-[#2563EB]/30 transition-all duration-300"
            >
              {/* Image placeholder */}
              <div className={`relative h-44 bg-gradient-to-br ${gradients[index % gradients.length]} flex items-center justify-center overflow-hidden`}>
                <div className="absolute inset-0 grid-pattern opacity-20" />
                <Layers className="h-12 w-12 text-white/20 group-hover:text-white/40 transition-colors" />
                {project.featured && (
                  <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-[#2563EB]/80 text-white text-xs font-medium backdrop-blur-sm">
                    Featured
                  </span>
                )}
              </div>

              <div className="p-6">
                <h3 className="text-lg font-semibold text-white group-hover:text-[#38BDF8] transition-colors mb-2">
                  {project.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed mb-4 line-clamp-3">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-5">
                  {project.technologies.split(',').map((tech) => (
                    <Badge
                      key={tech.trim()}
                      variant="outline"
                      className="text-xs border-[#2563EB]/30 text-[#38BDF8] bg-[#2563EB]/5 rounded-lg"
                    >
                      {tech.trim()}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
                    >
                      <Github className="h-3.5 w-3.5" />
                      Code
                    </a>
                  )}
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      Live Demo
                    </a>
                  )}
                  {!project.githubUrl && !project.demoUrl && (
                    <span className="text-xs text-slate-500 italic">Showcase project</span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}