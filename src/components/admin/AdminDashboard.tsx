'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, LogIn, LayoutDashboard, Briefcase, Code2, Award, BarChart3, Mail, User, Trash2, Plus, Save, Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

/* ------------------------------------------------------------------ */
/*  Login                                                              */
/* ------------------------------------------------------------------ */
function AdminLogin({ onLogin }: { onLogin: (token: string) => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok) {
        onLogin(data.token);
        toast({ title: 'Welcome back!', description: 'Admin access granted.' });
      } else {
        toast({ title: 'Login failed', description: data.error, variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Error', description: 'Something went wrong', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label className="text-slate-300">Username</Label>
        <Input value={username} onChange={e => setUsername(e.target.value)} required
          className="bg-white/5 border-white/10 text-white rounded-xl" placeholder="admin" />
      </div>
      <div className="space-y-2">
        <Label className="text-slate-300">Password</Label>
        <Input type="password" value={password} onChange={e => setPassword(e.target.value)} required
          className="bg-white/5 border-white/10 text-white rounded-xl" placeholder="••••••••" />
      </div>
      <Button type="submit" disabled={loading} className="w-full bg-[#2563EB] hover:bg-[#1d4ed8] text-white rounded-2xl">
        {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><LogIn className="h-4 w-4 mr-2" />Sign In</>}
      </Button>
    </form>
  );
}

/* ------------------------------------------------------------------ */
/*  Generic CRUD table                                                 */
/* ------------------------------------------------------------------ */
function CrudTable<T extends { id: string }>({
  title, icon: Icon, items, columns, renderRow,
  onCreate, onUpdate, onDelete, newItemDefault,
}: {
  title: string; icon: React.ComponentType<{ className?: string }>;
  items: T[]; columns: string[];
  renderRow: (item: T) => React.ReactNode;
  onCreate: (data: Record<string, unknown>) => Promise<void>;
  onUpdate: (id: string, data: Record<string, unknown>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  newItemDefault: Record<string, unknown>;
}) {
  const [editing, setEditing] = useState<T | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<Record<string, unknown>>({});
  const { toast } = useToast();

  const openCreate = () => { setForm(newItemDefault); setCreating(true); };
  const openEdit = (item: T) => { setForm({ ...item }); setEditing(item); setCreating(false); };
  const handleSave = async () => {
    try {
      if (creating) { await onCreate(form); toast({ title: 'Created' }); }
      else if (editing) { await onUpdate(editing.id, form); toast({ title: 'Updated' }); }
      setEditing(null); setCreating(false);
    } catch { toast({ title: 'Error', variant: 'destructive' }); }
  };
  const handleDelete = async (id: string) => {
    try { await onDelete(id); toast({ title: 'Deleted' }); } catch { toast({ title: 'Error', variant: 'destructive' }); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-white flex items-center gap-2">
          <Icon className="h-4 w-4 text-[#38BDF8]" /> {title}
          <Badge variant="secondary" className="ml-1">{items.length}</Badge>
        </h3>
        <Button size="sm" onClick={openCreate} className="bg-[#2563EB] hover:bg-[#1d4ed8] text-white rounded-xl">
          <Plus className="h-3.5 w-3.5 mr-1" /> Add
        </Button>
      </div>

      {/* Edit/Create dialog */}
      <AnimatePresence>
        {(editing || creating) && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => { setEditing(null); setCreating(false); }}
          >
            <motion.div
              initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              onClick={e => e.stopPropagation()}
              className="bg-[#0F172A] rounded-2xl p-6 w-full max-w-lg border border-white/10 shadow-2xl"
            >
              <h4 className="text-lg font-semibold text-white mb-4">
                {creating ? 'Create' : 'Edit'} {title.slice(0, -1)}
              </h4>
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {Object.entries(form).filter(([k]) => k !== 'id' && k !== 'createdAt' && k !== 'updatedAt').map(([key, val]) => (
                  <div key={key} className="space-y-1">
                    <Label className="text-slate-400 text-xs capitalize">{key}</Label>
                    {typeof val === 'boolean' ? (
                      <input type="checkbox" checked={!!val} onChange={e => setForm({ ...form, [key]: e.target.checked })}
                        className="rounded" />
                    ) : String(val).length > 100 ? (
                      <Textarea value={String(val || '')} rows={3}
                        onChange={e => setForm({ ...form, [key]: e.target.value })}
                        className="bg-white/5 border-white/10 text-white text-sm rounded-xl" />
                    ) : (
                      <Input value={String(val || '')}
                        onChange={e => setForm({ ...form, [key]: e.target.value })}
                        className="bg-white/5 border-white/10 text-white text-sm rounded-xl" />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex gap-3 mt-5">
                <Button onClick={handleSave} className="flex-1 bg-[#2563EB] hover:bg-[#1d4ed8] text-white rounded-xl">
                  <Save className="h-4 w-4 mr-1" /> Save
                </Button>
                <Button variant="outline" onClick={() => { setEditing(null); setCreating(false); }}
                  className="flex-1 border-white/10 text-white rounded-xl">Cancel</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* List */}
      <div className="space-y-2 max-h-80 overflow-y-auto">
        {items.map(item => renderRow(item))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Admin Dashboard                                               */
/* ------------------------------------------------------------------ */
export default function AdminDashboard({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [token, setToken] = useState<string | null>(null);
  const [experiences, setExperiences] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);

  const authHeader = token ? { Authorization: `Bearer ${token}` } : {};

  const fetchAll = async () => {
    if (!token) return;
    const headers = { ...authHeader, 'Content-Type': 'application/json' };
    const fetcher = (url: string) => fetch(url, { headers }).then(r => r.json()).catch(() => []);
    setExperiences(await fetcher('/api/experience'));
    setSkills(await fetcher('/api/skills'));
    setProjects(await fetcher('/api/projects'));
    setCertificates(await fetcher('/api/certificates'));
    const msgs = await fetch('/api/admin/messages', { headers }).then(r => r.json()).catch(() => []);
    setMessages(msgs);
    const prof = await fetch('/api/profile').then(r => r.json()).catch(() => null);
    setProfile(prof);
  };

  useEffect(() => {
    const stored = localStorage.getItem('admin_token');
    if (stored) {
      const init = () => { setToken(stored); };
      init();
    }
  }, []);

  useEffect(() => {
    if (token) {
      const loadData = async () => { await fetchAll(); };
      loadData();
    }
  }, [token]);

  const handleLogin = (t: string) => {
    setToken(t);
    localStorage.setItem('admin_token', t);
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('admin_token');
  };

  const apiAction = async (url: string, method: string, body?: unknown) => {
    const res = await fetch(url, {
      method,
      headers: { ...authHeader, 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (res.ok) fetchAll();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-[#020617] rounded-2xl border border-white/10 w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#2563EB]/20 flex items-center justify-center">
                  <LayoutDashboard className="h-4 w-4 text-[#38BDF8]" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">Admin Dashboard</h2>
                  <p className="text-xs text-slate-500">Manage your portfolio content</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {token && (
                  <Button variant="ghost" size="sm" onClick={handleLogout}
                    className="text-slate-400 hover:text-white text-xs">
                    <X className="h-4 w-4 mr-1" /> Logout
                  </Button>
                )}
                <Button variant="ghost" size="icon" onClick={onClose} className="text-slate-400">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-72px)]">
              {!token ? (
                <div className="max-w-sm mx-auto pt-8">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-[#2563EB]/10 flex items-center justify-center mb-3">
                      <LogIn className="h-8 w-8 text-[#2563EB]" />
                    </div>
                    <h3 className="text-xl font-semibold text-white">Admin Access</h3>
                    <p className="text-sm text-slate-400 mt-1">Sign in to manage your portfolio</p>
                  </div>
                  <AdminLogin onLogin={handleLogin} />
                </div>
              ) : (
                <Tabs defaultValue="messages" className="w-full">
                  <TabsList className="bg-white/5 rounded-xl p-1 mb-6 flex flex-wrap h-auto gap-1">
                    {[
                      { value: 'messages', label: 'Messages', icon: Mail },
                      { value: 'experience', label: 'Experience', icon: Briefcase },
                      { value: 'skills', label: 'Skills', icon: Code2 },
                      { value: 'projects', label: 'Projects', icon: BarChart3 },
                      { value: 'certificates', label: 'Certificates', icon: Award },
                      { value: 'profile', label: 'Profile', icon: User },
                    ].map(tab => (
                      <TabsTrigger key={tab.value} value={tab.value}
                        className="data-[state=active]:bg-[#2563EB] data-[state=active]:text-white rounded-lg text-xs flex items-center gap-1.5 px-3 py-2 text-slate-400">
                        <tab.icon className="h-3.5 w-3.5" /> {tab.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {/* Messages Tab */}
                  <TabsContent value="messages">
                    <h3 className="text-base font-semibold text-white flex items-center gap-2 mb-4">
                      <Mail className="h-4 w-4 text-[#38BDF8]" /> Messages
                      <Badge variant="secondary">{messages.filter(m => !m.read).length} new</Badge>
                    </h3>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {messages.length === 0 && <p className="text-slate-500 text-sm text-center py-8">No messages yet</p>}
                      {messages.map(msg => (
                        <div key={msg.id} className={`glass rounded-xl p-4 ${!msg.read ? 'border-[#2563EB]/30' : ''}`}>
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="text-sm font-medium text-white">{msg.name}</p>
                              <p className="text-xs text-slate-500">{msg.email}</p>
                            </div>
                            <div className="flex items-center gap-1">
                              {!msg.read && (
                                <Button size="sm" variant="ghost" onClick={() => apiAction('/api/admin/messages', 'PATCH', { id: msg.id, read: true })}
                                  className="text-xs text-[#38BDF8] hover:text-white">
                                  <Eye className="h-3 w-3 mr-1" /> Mark read
                                </Button>
                              )}
                              <Button size="sm" variant="ghost" onClick={() => apiAction(`/api/admin/messages?id=${msg.id}`, 'DELETE')}
                                className="text-xs text-red-400 hover:text-red-300">
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-sm font-medium text-slate-300">{msg.subject}</p>
                          <p className="text-xs text-slate-500 mt-1 line-clamp-2">{msg.message}</p>
                          <p className="text-[10px] text-slate-600 mt-2">
                            {new Date(msg.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  {/* Experience Tab */}
                  <TabsContent value="experience">
                    <CrudTable
                      title="Experiences" icon={Briefcase} items={experiences} columns={['position', 'company']}
                      newItemDefault={{ company: '', position: '', location: '', startDate: '', endDate: '', current: false, responsibilities: '', order: 0 }}
                      renderRow={item => (
                        <div key={item.id} className="glass rounded-xl p-4 flex items-center justify-between group">
                          <div>
                            <p className="text-sm font-medium text-white">{item.position}</p>
                            <p className="text-xs text-slate-400">{item.company} &bull; {item.startDate} — {item.endDate}</p>
                          </div>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button size="sm" variant="ghost" onClick={() => {}} className="text-xs text-slate-400">Edit</Button>
                            <Button size="sm" variant="ghost" onClick={() => apiAction(`/api/admin/experience?id=${item.id}`, 'DELETE')}
                              className="text-xs text-red-400"><Trash2 className="h-3 w-3" /></Button>
                          </div>
                        </div>
                      )}
                      onCreate={(data) => apiAction('/api/admin/experience', 'POST', data)}
                      onUpdate={(id, data) => apiAction('/api/admin/experience', 'PUT', { id, ...data })}
                      onDelete={(id) => apiAction(`/api/admin/experience?id=${id}`, 'DELETE')}
                    />
                  </TabsContent>

                  {/* Skills Tab */}
                  <TabsContent value="skills">
                    <CrudTable
                      title="Skills" icon={Code2} items={skills} columns={['name', 'category']}
                      newItemDefault={{ name: '', category: 'Data Analytics', level: 80, icon: 'Code', order: 0 }}
                      renderRow={item => (
                        <div key={item.id} className="glass rounded-xl p-4 flex items-center justify-between group">
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-white">{item.name}</p>
                              <span className="text-xs text-[#38BDF8]">{item.level}%</span>
                            </div>
                            <p className="text-xs text-slate-500">{item.category}</p>
                          </div>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-4">
                            <Button size="sm" variant="ghost" onClick={() => apiAction(`/api/admin/skills?id=${item.id}`, 'DELETE')}
                              className="text-xs text-red-400"><Trash2 className="h-3 w-3" /></Button>
                          </div>
                        </div>
                      )}
                      onCreate={(data) => apiAction('/api/admin/skills', 'POST', data)}
                      onUpdate={(id, data) => apiAction('/api/admin/skills', 'PUT', { id, ...data })}
                      onDelete={(id) => apiAction(`/api/admin/skills?id=${id}`, 'DELETE')}
                    />
                  </TabsContent>

                  {/* Projects Tab */}
                  <TabsContent value="projects">
                    <CrudTable
                      title="Projects" icon={BarChart3} items={projects} columns={['title']}
                      newItemDefault={{ title: '', description: '', technologies: '', featured: false, order: 0, githubUrl: '', demoUrl: '' }}
                      renderRow={item => (
                        <div key={item.id} className="glass rounded-xl p-4 flex items-center justify-between group">
                          <div>
                            <p className="text-sm font-medium text-white">{item.title}</p>
                            <p className="text-xs text-slate-500">{item.technologies}</p>
                          </div>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button size="sm" variant="ghost" onClick={() => apiAction(`/api/admin/projects?id=${item.id}`, 'DELETE')}
                              className="text-xs text-red-400"><Trash2 className="h-3 w-3" /></Button>
                          </div>
                        </div>
                      )}
                      onCreate={(data) => apiAction('/api/admin/projects', 'POST', data)}
                      onUpdate={(id, data) => apiAction('/api/admin/projects', 'PUT', { id, ...data })}
                      onDelete={(id) => apiAction(`/api/admin/projects?id=${id}`, 'DELETE')}
                    />
                  </TabsContent>

                  {/* Certificates Tab */}
                  <TabsContent value="certificates">
                    <CrudTable
                      title="Certificates" icon={Award} items={certificates} columns={['title', 'issuer']}
                      newItemDefault={{ title: '', issuer: '', date: '', order: 0 }}
                      renderRow={item => (
                        <div key={item.id} className="glass rounded-xl p-4 flex items-center justify-between group">
                          <div>
                            <p className="text-sm font-medium text-white">{item.title}</p>
                            <p className="text-xs text-slate-500">{item.issuer} &bull; {item.date}</p>
                          </div>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button size="sm" variant="ghost" onClick={() => apiAction(`/api/admin/certificates?id=${item.id}`, 'DELETE')}
                              className="text-xs text-red-400"><Trash2 className="h-3 w-3" /></Button>
                          </div>
                        </div>
                      )}
                      onCreate={(data) => apiAction('/api/admin/certificates', 'POST', data)}
                      onUpdate={(id, data) => apiAction('/api/admin/certificates', 'PUT', { id, ...data })}
                      onDelete={(id) => apiAction(`/api/admin/certificates?id=${id}`, 'DELETE')}
                    />
                  </TabsContent>

                  {/* Profile Tab */}
                  <TabsContent value="profile">
                    <h3 className="text-base font-semibold text-white flex items-center gap-2 mb-4">
                      <User className="h-4 w-4 text-[#38BDF8]" /> Profile
                    </h3>
                    {profile && (
                      <div className="glass rounded-2xl p-6 space-y-4">
                        {['name', 'title', 'location', 'email', 'phone', 'linkedin', 'summary', 'aboutText'].map(field => (
                          <div key={field} className="space-y-1">
                            <Label className="text-slate-400 text-xs capitalize">{field}</Label>
                            {['summary', 'aboutText'].includes(field) ? (
                              <Textarea value={profile[field]} rows={4}
                                onChange={e => setProfile({ ...profile, [field]: e.target.value })}
                                className="bg-white/5 border-white/10 text-white text-sm rounded-xl" />
                            ) : (
                              <Input value={profile[field]}
                                onChange={e => setProfile({ ...profile, [field]: e.target.value })}
                                className="bg-white/5 border-white/10 text-white text-sm rounded-xl" />
                            )}
                          </div>
                        ))}
                        <Button onClick={async () => {
                          const { id, createdAt, updatedAt, ...data } = profile;
                          await fetch('/api/admin/profile', { method: 'PUT', headers: { ...authHeader, 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
                          fetchAll();
                        }} className="bg-[#2563EB] hover:bg-[#1d4ed8] text-white rounded-xl">
                          <Save className="h-4 w-4 mr-1" /> Save Profile
                        </Button>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}