"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight, Scale, Shield, Award, Briefcase } from "lucide-react";

export default function PracticeAreasCarousel({ areas }: { areas: any[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -366, behavior: 'smooth' }); // Cards are ~350px width + 16px gap
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 366, behavior: 'smooth' });
  };

  return (
    <div className="relative group/carousel mx-auto">
      {/* Controls */}
      <button onClick={scrollLeft} aria-label="Scroll left" className="absolute -left-6 top-1/2 -translate-y-1/2 z-10 bg-white shadow-[0_0_15px_rgba(0,0,0,0.1)] border border-slate-100 p-3 text-slate-400 hover:text-secondary rounded-full opacity-0 group-hover/carousel:opacity-100 transition-opacity hidden md:flex items-center justify-center">
        <ChevronLeft className="h-6 w-6" />
      </button>
      
      <button onClick={scrollRight} aria-label="Scroll right" className="absolute -right-6 top-1/2 -translate-y-1/2 z-10 bg-white shadow-[0_0_15px_rgba(0,0,0,0.1)] border border-slate-100 p-3 text-slate-400 hover:text-secondary rounded-full opacity-0 group-hover/carousel:opacity-100 transition-opacity hidden md:flex items-center justify-center">
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Track */}
      <div 
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory hide-scrollbars pb-8 pt-4 px-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {areas.map((area, index) => {
          const icons = [Briefcase, Scale, Shield, Award];
          const FallbackIcon = icons[index % icons.length];
          return (
            <div key={index} className="w-[85vw] md:w-[350px] shrink-0 snap-center md:snap-start h-auto flex">
              <div className="bg-white p-10 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-secondary/30 transition-all duration-300 group flex flex-col w-full rounded-sm">
                <div className="h-16 w-16 bg-slate-50 text-secondary border border-secondary/20 rounded-full flex items-center justify-center mb-8 group-hover:bg-secondary group-hover:text-white transition-colors shrink-0">
                  <FallbackIcon className="h-7 w-7" />
                </div>
                <h3 className="mb-4 text-2xl group-hover:text-secondary transition-colors">{area.title}</h3>
                <p className="text-slate-500 leading-relaxed font-light flex-grow">
                  {area.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Mobile-only visual instruction */}
      <div className="md:hidden flex justify-center gap-1.5 mt-2">
         {areas.map((_, i) => (
            <div key={i} className={`h-1.5 rounded-full bg-slate-300 ${i === 0 ? "w-4" : "w-1.5"}`} />
         ))}
      </div>
      <style dangerouslySetInnerHTML={{__html:`
        .hide-scrollbars::-webkit-scrollbar { display: none; }
      `}} />
    </div>
  );
}
