"use client";

import React, { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { ScanlineOverlay, HeaderBar } from "@/components/layout/Common";
import { Sidebar } from "@/components/layout/Sidebar";
import { 
  StatBox, 
  SectionBlock, 
  SkillTag, 
  OpenTag,
  Badge
} from "@/components/ui";
import { Chapters } from "@astranova/catalogues";
import { profileSchema, type ProfileFormData } from "@/lib/schema";
import { Modal } from "@/components/ui";

export default function ProfilePage() {
  const [isEditMode, setIsEditMode] = useState(true); 
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState<Partial<ProfileFormData>>({
    name: "",
    username: "",
    email: "",
    chapters: [],
    social_links: [],
    stats: {},
    achievements: [],
    projects: [],
  });
  const [errors, setErrors] = useState<any>({});
  const router = useRouter();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: fd,
      });

      if (response.ok) {
        const data = await response.json();
        setFormData(prev => ({ ...prev, image: data.url }));
        setIsModalOpen(false);
      } else {
        const err = await response.json();
        alert(err.message || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Network error. Upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await authClient.getSession();
      if (!data) {
        router.push("/auth/sign-in");
      } else {
        setSession(data);
        try {
          const response = await fetch(`/api/profile?username=${(data.user as any).username}`);
          if (response.ok) {
            const profile = await response.json();
            setFormData(profile);
          } else {
            setFormData({
              name: data.user.name,
              email: data.user.email,
              username: (data.user as any).username,
              chapters: [],
              social_links: [],
              stats: {},
              achievements: [],
              projects: [],
            });
          }
        } catch (e) {
          console.error("Failed to fetch profile", e);
        }
      }
      setLoading(false);
    };
    fetchSession();
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleArrayUpdate = (field: string, index: number, value: any) => {
    setFormData(prev => {
      const arr = [...((prev as any)[field] || [])];
      arr[index] = { ...arr[index], ...value };
      return { ...prev, [field]: arr };
    });
  };

  const handleArrayAdd = (field: string, initialValue: any) => {
    setFormData(prev => ({ ...prev, [field]: [...((prev as any)[field] || []), initialValue] }));
  };

  const handleArrayRemove = (field: string, index: number) => {
    setFormData(prev => ({ ...prev, [field]: ((prev as any)[field] || []).filter((_: any, i: number) => i !== index) }));
  };

  const handleStatUpdate = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, stats: { ...(prev.stats || {}), [key]: value } }));
  };

  const removeStat = (key: string) => {
    setFormData(prev => {
      const newStats = { ...(prev.stats || {}) };
      delete newStats[key];
      return { ...prev, stats: newStats };
    });
  };

  const saveProfile = async () => {
    const result = profileSchema.safeParse(formData);
    if (!result.success) {
      setErrors(result.error.format());
      console.log("Validation errors", result.error.format());
      return;
    }
    setErrors({});
    
    setIsUpdating(true);
    try {
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        // Refresh data from server to ensure local state is synced
        const refresh = await fetch(`/api/profile?username=${formData.username}`);
        if (refresh.ok) {
            const updated = await refresh.json();
            setFormData(updated);
        }
      } else {
        const err = await response.json();
        alert(err.message || "Failed to update data");
      }
    } catch (e) {
      alert("Network error. Update failed.");
    }
    setIsUpdating(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0d1a] text-[#00ff9d] flex items-center justify-center font-mono">
        <ScanlineOverlay />
        <div className="animate-pulse tracking-[0.2em]">SYNCHRONIZING WITH HOST...</div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-[#0d0d1a] text-[#c8ffe8] font-['Share_Tech_Mono',_monospace] relative overflow-x-hidden">
      <ScanlineOverlay />
      <HeaderBar />

      <div className="border-b border-[rgba(0,255,157,0.25)] bg-[rgba(0,255,157,0.02)] px-6 py-2 flex justify-between items-center relative z-20">
        <div className="flex gap-4 items-center">
          <button 
            onClick={() => setIsEditMode(!isEditMode)}
            className={`text-[10px] px-3 py-1 border transition-all uppercase tracking-widest ${isEditMode ? 'bg-[#00ff9d] text-[#0d0d1a] border-[#00ff9d]' : 'border-[rgba(0,255,157,0.4)] text-[#00ff9d] hover:bg-[rgba(0,255,157,0.1)]'}`}
          >
            {isEditMode ? "View Profile" : "Edit Profile"}
          </button>
          <span className="text-[9px] text-[rgba(200,255,232,0.45)] uppercase tracking-tighter">
            System Status: <span className="text-[#00ff9d]">{formData.current_status || "STABLE"}</span>
          </span>
        </div>
        <button onClick={() => authClient.signOut().then(() => router.push("/auth/sign-in"))} className="text-[10px] text-[#ff4fd8] border border-[#ff4fd8] px-3 py-1 hover:bg-[rgba(255,79,216,0.1)] transition-all uppercase tracking-widest">
          Logout
        </button>
      </div>

      <div className="flex flex-col md:flex-row min-h-[calc(100vh-80px)]">
        <Sidebar 
            user={formData as any} 
            isEditMode={isEditMode} 
            openModal={() => setIsModalOpen(true)}
        />

        <main className="flex-1 p-6 flex flex-col gap-6 max-w-5xl relative z-10 pb-20">
          {isEditMode ? (
            <div className="space-y-8 animate-in slide-in-from-bottom duration-500">
              <div className="flex justify-between items-center border-b border-[rgba(0,255,157,0.25)] pb-4">
                <h2 className="font-vt text-4xl text-[#00ff9d] uppercase tracking-wider">System Override</h2>
                <button 
                  onClick={saveProfile}
                  disabled={isUpdating}
                  className={`bg-[#00ff9d] text-[#0d0d1a] px-8 py-2 font-bold uppercase tracking-[0.2em] shadow-[0_0_15px_rgba(0,255,157,0.3)] hover:scale-105 transition-all ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isUpdating ? "Synchronizing..." : "Update Data"}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] uppercase text-[rgba(200,255,232,0.45)] mb-1">// identifier (name)</label>
                            <input name="name" value={formData.name} onChange={handleInputChange} className="w-full bg-[rgba(0,255,157,0.05)] border border-[rgba(0,255,157,0.2)] rounded px-3 py-2 outline-none focus:border-[#00ff9d]" />
                        </div>
                        <div>
                            <label className="block text-[10px] uppercase text-[rgba(200,255,232,0.45)] mb-1">// network id (username)</label>
                            <input name="username" value={formData.username} onChange={handleInputChange} className="w-full bg-[rgba(0,255,157,0.05)] border border-[rgba(0,255,157,0.2)] rounded px-3 py-2 outline-none focus:border-[#00ff9d]" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-[10px] uppercase text-[rgba(200,255,232,0.45)] mb-1">// live telemetry (status)</label>
                        <input name="current_status" placeholder="building DevOps autopilot..." value={formData.current_status} onChange={handleInputChange} className="w-full bg-[rgba(0,255,157,0.05)] border border-[rgba(0,255,157,0.2)] rounded px-3 py-2 outline-none focus:border-[#00ff9d] text-[#00ff9d]" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase text-[rgba(200,255,232,0.45)] mb-1">// source records (bio)</label>
                    <textarea name="bio" rows={4} value={formData.bio} onChange={handleInputChange} className="w-full bg-[rgba(0,255,157,0.05)] border border-[rgba(0,255,157,0.2)] rounded px-3 py-2 outline-none focus:border-[#00ff9d]" />
                  </div>
              </div>

              <div className="grid grid-cols-1 gap-8">
                  {/* Social Links */}
                  <div className="space-y-4 border-t border-[rgba(0,255,157,0.1)] pt-6">
                    <div className="flex justify-between items-center">
                        <label className="text-[10px] uppercase tracking-widest text-[rgba(200,255,232,0.45)]">// established links</label>
                        <button onClick={() => handleArrayAdd('social_links', { label: '', link: '' })} className="text-[10px] border border-[#00ff9d] px-2 py-1">+ Add Link</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {(formData.social_links || []).map((sl, idx) => (
                            <div key={idx} className="flex gap-2 items-center bg-[rgba(0,255,157,0.02)] border border-[rgba(0,255,157,0.1)] p-2 rounded">
                                <input placeholder="Label (e.g. Github)" value={sl.label} onChange={(e) => handleArrayUpdate('social_links', idx, { label: e.target.value })} className="w-24 bg-transparent border-b border-[rgba(0,255,157,0.2)] outline-none text-[11px]" />
                                <input placeholder="https://..." value={sl.link} onChange={(e) => handleArrayUpdate('social_links', idx, { link: e.target.value })} className="flex-1 bg-transparent border-b border-[rgba(0,255,157,0.2)] outline-none text-[11px]" />
                                <button onClick={() => handleArrayRemove('social_links', idx)} className="text-[#ff4fd8]">×</button>
                            </div>
                        ))}
                    </div>
                  </div>

                  {/* Chapters */}
                  <div className="space-y-4 border-t border-[rgba(0,255,157,0.1)] pt-6">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] uppercase tracking-widest text-[rgba(200,255,232,0.45)]">// node affiliations (chapters)</label>
                      <select 
                        onChange={(e) => {
                            const ch = Chapters.find(c => c.acronym === e.target.value);
                            if (ch) handleArrayAdd('chapters', { acronym: ch.acronym, name: ch.name, position: '', start_date: '' });
                            e.target.value = "";
                        }}
                        className="bg-[#0d0d1a] border border-[#00ff9d] text-[#00ff9d] text-[10px] px-2 py-1"
                      >
                        <option value="">+ Add Chapter</option>
                        {Chapters.map(c => <option key={c.acronym} value={c.acronym}>{c.acronym}</option>)}
                      </select>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {(formData.chapters || []).map((ch, idx) => (
                            <div key={idx} className="border border-[rgba(0,255,157,0.2)] bg-[rgba(0,255,157,0.02)] p-3 rounded relative">
                                <button onClick={() => handleArrayRemove('chapters', idx)} className="absolute top-2 right-2 text-[#ff4fd8] opacity-50 hover:opacity-100">×</button>
                                <div className="text-[11px] font-bold text-[#00ff9d]">{ch.acronym}</div>
                                <input placeholder="Position" value={ch.position} onChange={(e) => handleArrayUpdate('chapters', idx, { position: e.target.value })} className="w-full bg-transparent border-b border-[rgba(0,255,157,0.1)] outline-none text-[10px] py-1 mt-2" />
                            </div>
                        ))}
                    </div>
                    {errors.chapters && <p className="text-[#ff4fd8] text-[9px]">{errors.chapters._errors[0]}</p>}
                  </div>

                  {/* Stats */}
                  <div className="space-y-4 border-t border-[rgba(0,255,157,0.1)] pt-6">
                    <label className="text-[10px] uppercase tracking-widest text-[rgba(200,255,232,0.45)]">// performance metrics</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {Object.entries(formData.stats || {}).map(([key, val]) => (
                            <div key={key} className="bg-[rgba(0,255,157,0.05)] border border-[rgba(0,255,157,0.2)] p-2 rounded relative">
                                <button onClick={() => removeStat(key)} className="absolute top-1 right-1 text-[#ff4fd8] text-[8px]">×</button>
                                <div className="text-[9px] opacity-50 uppercase">{key}</div>
                                <input value={val} onChange={(e) => handleStatUpdate(key, e.target.value)} className="w-full bg-transparent outline-none text-[#00ff9d] text-lg font-vt" />
                            </div>
                        ))}
                        <button onClick={() => {const k = prompt("Metric Label:"); if(k) handleStatUpdate(k.toUpperCase(), "0")}} className="border border-dashed border-[rgba(0,255,157,0.3)] text-[9px] opacity-60">+ Add Metric</button>
                    </div>
                  </div>

                  {/* Achievements */}
                  <div className="space-y-4 border-t border-[rgba(0,255,157,0.1)] pt-6">
                    <div className="flex justify-between items-center">
                        <label className="text-[10px] uppercase tracking-widest text-[rgba(200,255,232,0.45)]">// validated honors</label>
                        <button onClick={() => handleArrayAdd('achievements', { title: '', badge_type: 'hackathon' })} className="text-[10px] border border-[#00ff9d] px-2 py-1">+ Add Honor</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {(formData.achievements || []).map((ach, idx) => (
                            <div key={idx} className="flex gap-2 items-center bg-[rgba(0,255,157,0.02)] border border-[rgba(0,255,157,0.1)] p-2 rounded">
                                <input placeholder="Honor Title" value={ach.title} onChange={(e) => handleArrayUpdate('achievements', idx, { title: e.target.value })} className="flex-1 bg-transparent border-b border-[rgba(0,255,157,0.2)] outline-none text-[11px]" />
                                <select value={ach.badge_type} onChange={(e) => handleArrayUpdate('achievements', idx, { badge_type: e.target.value })} className="bg-[#0d0d1a] text-[10px] border border-[rgba(0,255,157,0.3)] text-[#00ff9d]">
                                    <option value="hackathon">Hackathon</option>
                                    <option value="gsoc">GSoC</option>
                                    <option value="open_source">Open Source</option>
                                    <option value="certification">Cert</option>
                                    <option value="award">Award</option>
                                </select>
                                <button onClick={() => handleArrayRemove('achievements', idx)} className="text-[#ff4fd8]">×</button>
                            </div>
                        ))}
                    </div>
                  </div>
              </div>

            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {Object.entries(formData.stats || {}).map(([key, val]) => (
                  <StatBox key={key} num={val} label={key} />
                ))}
              </div>

              <SectionBlock title="NODE IDENTITY">
                <div className="font-vt text-3xl text-[#00ff9d] leading-tight mb-2 uppercase">
                   {formData.current_status || "SIGNAL DETECTED"}
                </div>
                <div className="text-[12px] text-[rgba(200,255,232,0.45)] leading-[1.7] mt-2.5">
                  {formData.bio || "No biography established."}
                </div>
              </SectionBlock>

              <SectionBlock title="SYSTEM HONORS">
                <div className="flex flex-wrap gap-2">
                  {(formData.achievements || []).map((ach, idx) => (
                    <Badge key={idx} label={ach.title} color={
                      ach.badge_type === 'hackathon' ? 'amber' :
                      ach.badge_type === 'gsoc' ? 'green' :
                      ach.badge_type === 'open_source' ? 'pink' :
                      ach.badge_type === 'certification' ? 'blue' : 'amber'
                    } />
                  ))}
                </div>
              </SectionBlock>

              <SectionBlock title="CONNECTIVITY">
                <div className="flex flex-wrap gap-2">
                  <OpenTag label="Available for Collaboration" />
                </div>
              </SectionBlock>
            </>
          )}
        </main>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Biometric Update">
        <div className="space-y-4">
            <p className="text-[10px] text-[rgba(200,255,232,0.6)] uppercase leading-relaxed tracking-wider">
                Select a visual identifier for system-wide recognition.
            </p>
            <div className="relative border border-dashed border-[rgba(0,255,157,0.3)] rounded p-8 flex flex-col items-center justify-center gap-4 bg-[rgba(0,255,157,0.02)] hover:bg-[rgba(0,255,157,0.05)] transition-all cursor-pointer group">
                <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileChange} 
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                />
                <div className="text-[#00ff9d] text-2xl group-hover:scale-110 transition-transform">⏏</div>
                <div className="text-[10px] uppercase text-[#00ff9d] font-bold">
                    {isUploading ? "Processing Data..." : "Choose File or Drag & Drop"}
                </div>
            </div>
            <div className="text-[9px] text-[rgba(255,79,216,0.6)] uppercase text-center mt-2">
                Supported formats: JPG, PNG, GIF. Max size: 2MB.
            </div>
        </div>
      </Modal>
    </div>
  );
}
