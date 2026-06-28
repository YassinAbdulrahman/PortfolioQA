'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Database, Code, BarChart3, Table, FileSpreadsheet, Sheet,
  Search, Briefcase, Filter, LayoutDashboard, Target, Brain,
  Puzzle, Eye, Clock, Users, Presentation
} from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Database, Code, BarChart3, Table, FileSpreadsheet, Sheet,
  Search, Briefcase, Filter, LayoutDashboard, Target, Brain,
  Puzzle, Eye, Clock, Users, Presentation, PivotTable: Table,
};

interface Skill {
  id: string;
  name: string;
  category: string;
  level: number;
  icon: string;
}

const categoryColors: Record<string, string> = {
  'Data Analytics': 'from-[#2563EB] to-[#38BDF8]',
  'Business Intelligence': 'from-[#818CF8] to-[#2563EB]',
  'Soft Skills': 'from-[#34D399] to-[#38BDF8]',
};

export default function Skills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  useEffect(() => {
    fetch('/api/skills').then(r => r.json()).then(setSkills).catch(() => {});
  }, []);

  const categories = [...new Set(skills.map(s => s.category))];

  return (
    <section id="skills" className="py-24 md:py-32 relative">
      <div className="absolute inset-0 gradient-bg opacity-40" />
      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-[#38BDF8] text-sm font-medium tracking-widest uppercase">What I work with</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mt-2">Skills & Expertise</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-[#2563EB] to-[#38BDF8] mx-auto mt-4 rounded-full" />
        </motion.div>

        <div className="space-y-12">
          {categories.map((category, catIdx) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: catIdx * 0.15 }}
            >
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${categoryColors[category] || 'from-[#2563EB] to-[#38BDF8]'}`} />
                {category}
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {skills
                  .filter(s => s.category === category)
                  .map((skill, skillIdx) => {
                    const IconComp = iconMap[skill.icon] || Code;
                    return (
                      <motion.div
                        key={skill.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={inView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ duration: 0.4, delay: catIdx * 0.15 + skillIdx * 0.05 }}
                        whileHover={{ y: -4, scale: 1.02 }}
                        className="glass rounded-2xl p-5 group hover:border-[#2563EB]/30 transition-all duration-300"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-xl bg-[#2563EB]/10 flex items-center justify-center group-hover:bg-[#2563EB]/20 transition-colors">
                            <IconComp className="h-5 w-5 text-[#38BDF8]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">{skill.name}</p>
                            <p className="text-xs text-slate-500">{skill.level}%</p>
                          </div>
                        </div>
                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={inView ? { width: `${skill.level}%` } : { width: 0 }}
                            transition={{ duration: 1, delay: catIdx * 0.15 + skillIdx * 0.05 + 0.3 }}
                            className={`h-full rounded-full bg-gradient-to-r ${categoryColors[category] || 'from-[#2563EB] to-[#38BDF8]'}`}
                          />
                        </div>
                      </motion.div>
                    );
                  })}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}