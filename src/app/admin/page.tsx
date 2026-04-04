"use client";

import { useState, useEffect, useRef } from "react";
import { LogOut, Save, Plus, Trash2, CheckCircle2, LayoutDashboard, Settings, Home as HomeIcon, Users, User, Search, BookOpen, AlertCircle, UploadCloud } from "lucide-react";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("settings");
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");

  useEffect(() => {
    fetch("/api/content")
      .then((res) => res.json())
      .then((data) => {
        if (data.data) {
          setContent(data.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const lawyersEndRef = useRef<HTMLDivElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, path: string[], type: "profile" | "hero") => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const sizeInMB = file.size / (1024 * 1024);
    if (type === "hero" && sizeInMB > 10) return alert("Hero image must be less than 10MB");
    if (type === "profile" && sizeInMB > 5) return alert("Profile image must be less than 3MB");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);

    const backupOriginal = content; // Optimistic mapping fallback
    try {
      // Show optimistic loading state locally
      updateNestedState(path, "");
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.success && data.url) {
        updateNestedState(path, data.url);
      } else { 
        setContent(backupOriginal);
        alert(data.error || "Upload failed");
      }
    } catch (err) {
      setContent(backupOriginal);
      alert("Network error during upload");
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/admin/login';
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveAll = async () => {
    setSaving(true);
    setSavedMessage("");
    try {
      const res = await fetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        // Sending the entire monolithic document recursively
        body: JSON.stringify(content),
      });
      if (res.ok) {
        setSavedMessage("All changes successfully published to the live site.");
        setTimeout(() => setSavedMessage(""), 4000);
      } else {
        alert("Failed to save changes.");
      }
    } catch (error) {
      alert("Error saving.");
    } finally {
      setSaving(false);
    }
  };

  const updateNestedState = (path: string[], value: any) => {
    setContent((prev: any) => {
      const newState = structuredClone(prev);
      let ref = newState;
      for (let i = 0; i < path.length - 1; i++) {
        if (!ref[path[i]]) ref[path[i]] = {};
        ref = ref[path[i]];
      }
      ref[path[path.length - 1]] = value;
      return newState;
    });
  };

  const addLawyer = () => {
    const fresh = [...(content.lawyers || [])];
    fresh.push({ name: "New Lawyer", imageUrl: "", education: "", specialization: "", bio: "" });
    setContent({ ...content, lawyers: fresh });
    setTimeout(() => {
      lawyersEndRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const removeLawyer = (index: number) => {
    const fresh = [...content.lawyers];
    fresh.splice(index, 1);
    setContent({ ...content, lawyers: fresh });
  };

  const addPracticeArea = () => {
    const fresh = [...(content.homepage?.practiceAreas || [])];
    fresh.push({ title: "New Area", description: "" });
    updateNestedState(["homepage", "practiceAreas"], fresh);
  };

  const removePracticeArea = (index: number) => {
    const fresh = [...content.homepage.practiceAreas];
    fresh.splice(index, 1);
    updateNestedState(["homepage", "practiceAreas"], fresh);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center pt-24"><div className="animate-pulse flex gap-2"><div className="h-4 w-4 bg-primary rounded-full"></div><div className="h-4 w-4 bg-secondary rounded-full"></div><div className="h-4 w-4 bg-primary rounded-full"></div></div></div>;

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Navigation */}
        <div className="w-full md:w-64 shrink-0">
          <div className="bg-white border border-slate-200 rounded-sm overflow-hidden flex flex-col sticky top-28">
            <div className="bg-primary p-4 text-white">
              <h2 className="font-serif text-xl border-b border-white/20 pb-2 mb-2 flex items-center gap-2">
                <LayoutDashboard className="h-5 w-5" /> Main Content
              </h2>
            </div>
            <nav className="p-2 space-y-1 flex-grow">
              {[
                { id: "settings", label: "Global Settings", icon: <Settings className="h-4 w-4" /> },
                { id: "homepage", label: "Homepage Editor", icon: <HomeIcon className="h-4 w-4" /> },
                { id: "lawyers", label: "Lawyers Directory", icon: <Users className="h-4 w-4" /> },
                { id: "seo", label: "SEO Configurations", icon: <Search className="h-4 w-4" /> },
                { id: "blogs", label: "Blogs & Articles", icon: <BookOpen className="h-4 w-4" /> },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 font-medium rounded-sm text-sm transition-colors ${
                    activeTab === tab.id ? "bg-secondary/10 text-primary border-l-4 border-secondary" : "text-slate-600 hover:bg-slate-50 border-l-4 border-transparent"
                  }`}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </nav>
            <div className="p-4 border-t border-slate-100 flex flex-col gap-3">
              <button 
                onClick={handleSaveAll} 
                disabled={saving} 
                className="w-full flex justify-center items-center gap-2 px-4 py-3 bg-secondary text-white rounded-sm hover:bg-secondary/90 shadow-sm transition-all focus:ring-4 ring-secondary/30 font-bold"
              >
                <Save className={`h-4 w-4 ${saving ? "animate-spin" : ""}`} /> {saving ? "Publishing..." : "Publish Global Changes"}
              </button>
              <button onClick={handleLogout} className="w-full flex justify-center items-center gap-2 px-4 py-2 text-slate-500 hover:text-red-700 transition-colors text-sm font-medium">
                <LogOut className="h-4 w-4" /> Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Main Editor Canvas */}
        <div className="flex-1">
          {savedMessage && (
            <div className="mb-6 bg-green-50 z-50 fixed top-24 right-4 border border-green-200 text-green-800 p-4 rounded-sm flex items-center gap-3 shadow-lg animate-in fade-in slide-in-from-top-4">
              <CheckCircle2 className="h-5 w-5" />
              <p className="font-bold text-sm tracking-wide">{savedMessage}</p>
            </div>
          )}

          <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden min-h-[500px]">
            
            {/* =========================================
                1. GLOBAL SETTINGS TAB 
            ========================================= */}
            {activeTab === "settings" && (
              <div className="p-6 md:p-8 space-y-10">
                <h3 className="font-serif text-2xl text-primary border-b border-slate-100 pb-4">Global Site Settings</h3>
                
                <div className="space-y-6 max-w-2xl">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Official Law Firm Name</label>
                    <input type="text" className="w-full border border-slate-300 rounded-sm px-4 py-2 bg-slate-50 focus:bg-white" value={content.siteSettings?.siteName || ""} onChange={(e) => updateNestedState(["siteSettings", "siteName"], e.target.value)} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Primary Email Contact</label>
                      <input type="email" className="w-full border border-slate-300 rounded-sm px-4 py-2" value={content.siteSettings?.email || ""} onChange={(e) => updateNestedState(["siteSettings", "email"], e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Primary Support Phone</label>
                      <input type="text" className="w-full border border-slate-300 rounded-sm px-4 py-2" value={content.siteSettings?.phone || ""} onChange={(e) => updateNestedState(["siteSettings", "phone"], e.target.value)} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Official Address</label>
                    <textarea rows={3} className="w-full border border-slate-300 rounded-sm px-4 py-2 resize-y" value={content.siteSettings?.address || ""} onChange={(e) => updateNestedState(["siteSettings", "address"], e.target.value)} />
                  </div>
                </div>

                <div className="space-y-6 max-w-2xl border-t border-slate-100 pt-8">
                  <h4 className="font-serif text-xl text-primary">Emergency & Special Contacts</h4>
                  <div>
                    <label className="block text-sm font-semibold text-red-700 mb-1 flex items-center gap-2"><AlertCircle className="h-4 w-4"/> 24/7 Red Line Phone</label>
                    <input type="text" className="w-full border border-red-300 rounded-sm px-4 py-2 focus:ring-red-500" value={content.contactPage?.emergencyPhone || ""} onChange={(e) => updateNestedState(["contactPage", "emergencyPhone"], e.target.value)} />
                  </div>
                </div>
              </div>
            )}

            {/* =========================================
                2. HOMEPAGE EDITOR TAB 
            ========================================= */}
            {activeTab === "homepage" && (
              <div className="p-6 md:p-8 space-y-12">
                <h3 className="font-serif text-2xl text-primary border-b border-slate-100 pb-4">Homepage Editor</h3>
                
                {/* Hero */}
                <div className="space-y-6 max-w-3xl">
                  <h4 className="font-semibold text-lg flex items-center gap-2"><span className="bg-primary/10 text-primary py-1 px-2 rounded font-mono text-xs">Section 1</span> Hero Header</h4>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Main Headline (Allows Linebreaks - Press Enter or type \n)</label>
                    <textarea rows={3} className="w-full border border-slate-300 rounded-sm px-4 py-2 text-lg font-serif" value={content.homepage?.hero?.headline || ""} onChange={(e) => updateNestedState(["homepage", "hero", "headline"], e.target.value)} />
                    <p className="text-xs text-slate-400 mt-1">Hint: Simply pressing 'Enter' while typing inside the box will dynamically map downwards visually.</p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Support Subtext</label>
                    <textarea rows={2} className="w-full border border-slate-300 rounded-sm px-4 py-2" value={content.homepage?.hero?.subtext || ""} onChange={(e) => updateNestedState(["homepage", "hero", "subtext"], e.target.value)} />
                  </div>
                  <div className="flex flex-col md:flex-row gap-4 items-center">
                    <div className="flex-1">
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Hero Background Image</label>
                      <input type="text" placeholder="https://..." className="w-full border border-slate-300 rounded-sm px-4 py-2" value={content.homepage?.hero?.backgroundImageUrl || ""} onChange={(e) => updateNestedState(["homepage", "hero", "backgroundImageUrl"], e.target.value)} />
                      <p className="text-[11px] text-slate-400 mt-1">Recommended: 1920x1080px (16:9). Don't worry if it's smaller, the system automatically stretches and center-cuts the image to perfectly cover the Hero container without breaking aspect ratio!</p>
                    </div>
                    <div className="shrink-0 pt-0">
                       <label className="flex flex-col items-center justify-center cursor-pointer gap-1 bg-slate-100 hover:bg-slate-200 border border-slate-300 px-4 py-3 rounded-sm text-sm font-medium transition-colors text-center w-full">
                         <span className="flex items-center gap-2"><UploadCloud className="h-4 w-4" /> Upload Custom Hero</span>
                         <span className="text-[10px] text-secondary font-bold uppercase tracking-widest mt-1">1. Upload • 2. Click Publish</span>
                         <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, ["homepage", "hero", "backgroundImageUrl"], "hero")} />
                       </label>
                    </div>
                  </div>
                </div>

                {/* Founder Info */}
                <div className="space-y-6 max-w-3xl border-t border-slate-100 pt-8">
                  <h4 className="font-semibold text-lg flex items-center gap-2"><span className="bg-primary/10 text-primary py-1 px-2 rounded font-mono text-xs">Section 2</span> Founder Highlights</h4>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Founder Tagline / Bio</label>
                    <textarea rows={4} className="w-full border border-slate-300 rounded-sm px-4 py-2" value={content.homepage?.lawyerIntro?.bio || ""} onChange={(e) => updateNestedState(["homepage", "lawyerIntro", "bio"], e.target.value)} />
                  </div>
                  <div className="flex flex-col md:flex-row gap-4 items-center mb-6">
                    <div className="flex-1">
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Founder Profile Image</label>
                      <input type="text" placeholder="https://..." className="w-full border border-slate-300 rounded-sm px-4 py-2" value={content.homepage?.lawyerIntro?.imageUrl || ""} onChange={(e) => updateNestedState(["homepage", "lawyerIntro", "imageUrl"], e.target.value)} />
                      <p className="text-[11px] text-slate-400 mt-1">Recommended: Square format (e.g., 600x600px). Don't worry about dimensions, NextJS will automatically auto-crop constraints flawlessly around faces.</p>
                    </div>
                    <div className="shrink-0 pt-0">
                       <label className="flex flex-col items-center justify-center cursor-pointer gap-1 bg-slate-100 hover:bg-slate-200 border border-slate-300 px-4 py-3 rounded-sm text-sm font-medium transition-colors text-center w-full">
                         <span className="flex items-center gap-2"><UploadCloud className="h-4 w-4" /> Upload Face Photo</span>
                         <span className="text-[10px] text-secondary font-bold uppercase tracking-widest mt-1">1. Upload • 2. Click Publish</span>
                         <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, ["homepage", "lawyerIntro", "imageUrl"], "profile")} />
                       </label>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Years Exp</label>
                      <input type="number" className="w-full border border-slate-300 rounded-sm px-4 py-2" value={content.homepage?.lawyerIntro?.stats?.experienceYears || 0} onChange={(e) => updateNestedState(["homepage", "lawyerIntro", "stats", "experienceYears"], parseInt(e.target.value, 10))} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Cases Won</label>
                      <input type="number" className="w-full border border-slate-300 rounded-sm px-4 py-2" value={content.homepage?.lawyerIntro?.stats?.casesWon || 0} onChange={(e) => updateNestedState(["homepage", "lawyerIntro", "stats", "casesWon"], parseInt(e.target.value, 10))} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Satisfaction %</label>
                      <input type="number" className="w-full border border-slate-300 rounded-sm px-4 py-2" value={content.homepage?.lawyerIntro?.stats?.clientSatisfaction || 0} onChange={(e) => updateNestedState(["homepage", "lawyerIntro", "stats", "clientSatisfaction"], parseInt(e.target.value, 10))} />
                    </div>
                  </div>
                </div>

                {/* Practice Areas */}
                <div className="space-y-6 border-t border-slate-100 pt-8">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold text-lg flex items-center gap-2"><span className="bg-primary/10 text-primary py-1 px-2 rounded font-mono text-xs">Section 3</span> Practice Areas Array</h4>
                    <button onClick={addPracticeArea} className="flex items-center gap-1 bg-slate-800 text-white px-3 py-1.5 rounded-sm hover:bg-slate-700 text-xs font-medium">
                      <Plus className="h-3 w-3" /> Add Practice Area
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {content.homepage?.practiceAreas?.map((area: any, index: number) => (
                      <div key={index} className="border border-slate-200 p-4 rounded-sm bg-slate-50 relative group">
                        <button onClick={() => removePracticeArea(index)} className="absolute top-2 right-2 text-slate-400 hover:text-red-500 transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <input 
                          type="text" 
                          className="w-full border-b border-slate-300 bg-transparent px-2 py-1 mb-3 font-semibold text-primary outline-none focus:border-secondary" 
                          value={area.title} 
                          onChange={(e) => {
                            const fresh = [...content.homepage.practiceAreas];
                            fresh[index].title = e.target.value;
                            updateNestedState(["homepage", "practiceAreas"], fresh);
                          }} 
                        />
                        <textarea 
                          rows={2} 
                          className="w-full border border-transparent bg-white px-2 py-1 text-sm outline-none focus:border-slate-300" 
                          value={area.description} 
                          onChange={(e) => {
                            const fresh = [...content.homepage.practiceAreas];
                            fresh[index].description = e.target.value;
                            updateNestedState(["homepage", "practiceAreas"], fresh);
                          }} 
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* =========================================
                3. LAWYERS DIRECTORY TAB 
            ========================================= */}
            {activeTab === "lawyers" && (
              <div className="p-6 md:p-8">
                <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                  <h3 className="font-serif text-2xl text-primary">Firm Directory</h3>
                  <button onClick={addLawyer} className="flex items-center gap-1 bg-secondary text-white px-4 py-2 rounded-sm hover:bg-secondary/90 text-sm font-bold shadow-sm">
                    <Plus className="h-4 w-4" /> Add Advocate
                  </button>
                </div>
                
                <div className="space-y-6">
                  {content.lawyers?.map((lawyer: any, index: number) => (
                    <div key={index} className="border border-slate-200 rounded-sm overflow-hidden flex flex-col md:flex-row shadow-sm hover:shadow-md transition-shadow">
                      {/* Left: Quick Image Prev */}
                      <div className="w-full md:w-48 bg-slate-100 shrink-0 border-r border-slate-200 p-4 flex flex-col items-center justify-center relative">
                        {lawyer.imageUrl ? (
                           <div className="h-24 w-24 rounded-full overflow-hidden mb-3 border-4 border-white shadow-sm">
                             <img src={lawyer.imageUrl} alt={lawyer.name} className="h-full w-full object-cover" />
                           </div>
                        ) : (
                           <div className="h-24 w-24 rounded-full bg-slate-200 mb-3 flex items-center justify-center text-slate-400">
                             <User className="h-8 w-8" />
                           </div>
                        )}
                        <input type="url" placeholder="Image URL..." className="w-full text-xs px-2 py-1 border border-slate-300 text-center mb-2" value={lawyer.imageUrl === "loading..." ? "Uploading..." : lawyer.imageUrl} onChange={(e) => {
                          const fresh = [...content.lawyers]; fresh[index].imageUrl = e.target.value; updateNestedState(["lawyers"], fresh);
                        }} />
                        <label className="cursor-pointer text-xs font-medium text-secondary hover:text-secondary/80 flex items-center gap-1">
                          <UploadCloud className="h-3 w-3" /> Upload Disk File
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, ["lawyers", String(index), "imageUrl"], "profile")} />
                        </label>
                      </div>

                      {/* Right: Data Grid */}
                      <div className="flex-1 p-5 relative group">
                        <button onClick={() => removeLawyer(index)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors">
                          <Trash2 className="h-5 w-5" />
                        </button>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                             <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Full Name</label>
                             <input type="text" className="w-full border-b border-slate-300 px-1 py-1 font-serif text-lg text-primary outline-none focus:border-secondary" value={lawyer.name} onChange={(e) => {
                               const fresh = [...content.lawyers]; fresh[index].name = e.target.value; updateNestedState(["lawyers"], fresh);
                             }} />
                          </div>
                          <div>
                             <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Education (Separate with double slash \\)</label>
                             <input type="text" className="w-full border-b border-slate-300 px-1 py-1 outline-none text-sm" value={lawyer.education} onChange={(e) => {
                               const fresh = [...content.lawyers]; fresh[index].education = e.target.value; updateNestedState(["lawyers"], fresh);
                             }} />
                          </div>
                          <div className="md:col-span-2">
                             <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Specialization (Comma separated)</label>
                             <input type="text" className="w-full border-b border-slate-300 px-1 py-1 outline-none text-sm" value={lawyer.specialization} onChange={(e) => {
                               const fresh = [...content.lawyers]; fresh[index].specialization = e.target.value; updateNestedState(["lawyers"], fresh);
                             }} />
                          </div>
                          <div className="md:col-span-2">
                             <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Long Bio</label>
                             <textarea rows={3} className="w-full border border-slate-200 px-3 py-2 outline-none text-sm rounded-sm" value={lawyer.bio} onChange={(e) => {
                               const fresh = [...content.lawyers]; fresh[index].bio = e.target.value; updateNestedState(["lawyers"], fresh);
                             }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {(!content.lawyers || content.lawyers.length === 0) && (
                    <div className="text-center text-slate-500 py-12 border-2 border-dashed border-slate-300 rounded-lg">No advocates listed in the directory.</div>
                  )}
                  {/* Invisible Ref for explicit scrolling target */}
                  <div ref={lawyersEndRef} className="h-2 w-full mt-4" aria-hidden="true" />
                </div>
              </div>
            )}

            {/* =========================================
                4. SEO CONFIGURATIONS TAB 
            ========================================= */}
            {activeTab === "seo" && (
              <div className="p-6 md:p-8 space-y-8">
                <h3 className="font-serif text-2xl text-primary border-b border-slate-100 pb-4">Search Engine Optimization Basics</h3>
                
                <div className="bg-blue-50 text-blue-800 p-4 rounded-sm text-sm border border-blue-100 mb-8">
                  <strong>Notice:</strong> These act as the default fallback tags globally if a specific page (like a blog post) does not override them. It generates JSON-LD Structured Data automatically.
                </div>

                <div className="space-y-6 max-w-2xl">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Default Browser Title (Meta Tag)</label>
                    <input type="text" className="w-full border border-slate-300 rounded-sm px-4 py-2 text-primary font-medium" value={content.seo?.defaultTitle || ""} onChange={(e) => updateNestedState(["seo", "defaultTitle"], e.target.value)} />
                    <p className="text-xs text-slate-500 mt-1">Keep under 60 characters for best Google display.</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Default Meta Description</label>
                    <textarea rows={3} className="w-full border border-slate-300 rounded-sm px-4 py-2" value={content.seo?.defaultDescription || ""} onChange={(e) => updateNestedState(["seo", "defaultDescription"], e.target.value)} />
                    <p className="text-xs text-slate-500 mt-1">Keep under 160 characters. This is the snippet users read on Google.</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Global Keywords (Comma separated)</label>
                    <input type="text" className="w-full border border-slate-300 rounded-sm px-4 py-2" value={content.seo?.keywords?.join(", ") || ""} onChange={(e) => {
                      const arr = e.target.value.split(",").map(k => k.trim()).filter(k=>k);
                      updateNestedState(["seo", "keywords"], arr);
                    }} />
                  </div>
                </div>
              </div>
            )}

            {/* =========================================
                5. BLOGS STUB TAB 
            ========================================= */}
            {activeTab === "blogs" && (
              <div className="p-6 md:p-8 space-y-6">
                <h3 className="font-serif text-2xl text-primary border-b border-slate-100 pb-4">Blogs & Articles</h3>
                <div className="bg-slate-50 border border-slate-200 p-12 text-center rounded-sm">
                  <div className="h-16 w-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="h-8 w-8" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-800 mb-2">Blog Schema Initialized</h4>
                  <p className="text-slate-600 max-w-lg mx-auto">
                    The backend database schema now natively supports `content.blogs`. A dedicated rich-text editor interface for drafting full HTML pages will be required to utilize this securely. Contact your development team to turn on the "Blog Modules" interface.
                  </p>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
