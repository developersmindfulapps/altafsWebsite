"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown, GraduationCap, Briefcase, Scale } from "lucide-react";

export default function LawyersList({ lawyers }: { lawyers: any[] }) {
  const [openId, setOpenId] = useState<number | null>(1);

  const handleToggle = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {lawyers.map((lawyer) => {
        const isOpen = openId === lawyer.id;

        return (
          <div 
            key={lawyer.id} 
            className={`bg-white border transition-all duration-300 rounded-sm overflow-hidden flex flex-col ${
              isOpen ? "border-secondary/50 shadow-xl ring-1 ring-secondary/20 scale-[1.02]" : "border-slate-100 shadow-sm hover:border-slate-200"
            }`}
          >
            {/* Card Header (Always visible) */}
            <div 
              className="cursor-pointer group relative"
              onClick={() => handleToggle(lawyer.id)}
            >
              <div className="aspect-[4/3] relative overflow-hidden bg-slate-100">
                <Image
                  src={lawyer.image}
                  alt={lawyer.name}
                  fill
                  className={`object-cover transition-transform duration-700 ${isOpen ? "scale-105" : "group-hover:scale-105"}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/50 to-transparent opacity-90" />
                
                <div className="absolute bottom-0 left-0 p-6 w-full text-white">
                  <h3 className="font-serif text-2xl mb-1">{lawyer.name}</h3>
                  <p className="text-secondary tracking-widest text-xs uppercase font-medium">{lawyer.title}</p>
                  <p className="text-white/80 text-sm mt-3 line-clamp-2 leading-relaxed">
                    {lawyer.bio}
                  </p>
                </div>
              </div>

              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-sm text-primary transition-transform duration-300">
                <ChevronDown className={`h-5 w-5 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
              </div>
            </div>

            {/* Accordion Content */}
            <div 
              className={`grid transition-all duration-300 ease-in-out ${
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <div className="p-6 md:p-8 space-y-6">
                  
                  <div>
                    <h4 className="flex items-center gap-2 font-medium text-slate-800 border-b border-slate-100 pb-2 mb-3">
                      <Briefcase className="h-4 w-4 text-secondary" /> Practice Areas
                    </h4>
                    <ul className="flex flex-wrap gap-2 text-sm text-slate-600">
                      {lawyer.specialization.map((spec: string, idx: number) => (
                        <li key={idx} className="bg-slate-50 border border-slate-100 px-3 py-1 rounded-full">
                          {spec}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="flex items-center gap-2 font-medium text-slate-800 border-b border-slate-100 pb-2 mb-3">
                      <GraduationCap className="h-4 w-4 text-secondary" /> Education
                    </h4>
                    <ul className="space-y-1 text-sm text-slate-600">
                      {lawyer.education.map((edu: string, idx: number) => (
                        <li key={idx} className="flex gap-2">
                          <span className="text-secondary font-bold">•</span> {edu}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="flex items-center gap-2 font-medium text-slate-800 border-b border-slate-100 pb-2 mb-3">
                      <Scale className="h-4 w-4 text-secondary" /> Biography
                    </h4>
                    <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                      {lawyer.bio}
                    </p>
                  </div>
                  
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
