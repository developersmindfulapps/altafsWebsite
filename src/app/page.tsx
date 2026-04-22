import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Scale, Shield, Award, Briefcase, CheckCircle2 } from "lucide-react";
import Button from "@/components/Button";
import { getWebsiteContent } from "@/lib/getContent";
import PracticeAreasCarousel from "@/components/PracticeAreasCarousel";
import React from "react";

const IconMap: Record<string, any> = {
  Scale,
  Shield,
  Award,
  Briefcase
};

// Helper to cleanly map explicit "\n" literal characters as well native line-breaks to HTML <br/> logic.
const formatText = (text: string) => {
  if (!text) return null;
  return text.split(/\\n|\n/).map((line, i, arr) => (
    <React.Fragment key={i}>
      {line}
      {i !== arr.length - 1 && <br />}
    </React.Fragment>
  ));
};

export default async function Home() {
  const content = await getWebsiteContent();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LegalService",
            "name": content.siteSettings.siteName,
            "image": content.siteSettings.logoUrl || "https://altaflawfirmjammu.example.com/logo.png",
            "@id": "https://altaflawfirmjammu.example.com",
            "url": "https://altaflawfirmjammu.example.com",
            "telephone": content.siteSettings.phone,
            "address": {
              "@type": "PostalAddress",
              "streetAddress": content.siteSettings.address.split(',')[0],
              "addressLocality": "Jammu",
              "addressRegion": "J&K",
              "addressCountry": "IN"
            }
          })
        }}
      />
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[70vh] md:min-h-[75vh] flex items-center pt-24 pb-16 border-b border-slate-200 shadow-sm">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[#050D1F]/85 z-10" />
          <Image
            src={content.homepage.hero.backgroundImageUrl || "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80"}
            alt="Law firm office interior"
            fill
            sizes="100vw"
            className="object-cover mix-blend-overlay opacity-40"
            priority
          />
        </div>

        <div className="container mx-auto px-4 md:px-8 relative z-20 flex flex-col justify-between h-full">
          <div className="max-w-3xl mt-auto pt-8">
            <span className="inline-block py-1 px-3 rounded-full bg-secondary/20 border border-secondary/30 text-secondary-light tracking-widest text-[10px] sm:text-xs font-semibold uppercase mb-6 shadow-sm">
              Jammu District Court & Jammu High Court
            </span>
            <h1 className="text-white mb-6 leading-tight whitespace-pre-wrap">
              {formatText(content.homepage.hero.headline)}
            </h1>
            <p className="text-white/90 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed font-light">
              {content.homepage.hero.subtext}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-16">
              <Button href="/contact" variant="secondary" className="text-primary hover:bg-white text-sm shadow-xl font-semibold px-8">
                {content.homepage.hero.ctaPrimary} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button href="/contact" variant="outline" className="text-white border-white/60 hover:bg-white hover:text-primary backdrop-blur-sm px-8">
                {content.homepage.hero.ctaSecondary}
              </Button>
            </div>
            
            {/* TRUST STRIP (INSIDE HERO) */}
            <div className="w-full border-t border-white/10 pt-8 mt-auto flex flex-col md:flex-row gap-6 md:gap-12 text-white/90">
               <div className="flex flex-col">
                  <span className="text-3xl font-serif text-secondary font-bold">{content.homepage.lawyerIntro.stats.experienceYears}+</span>
                  <span className="text-xs uppercase tracking-widest opacity-80 mt-1">Years Experience</span>
               </div>
               <div className="hidden md:block w-px bg-white/10"></div>
               <div className="flex flex-col">
                  <span className="text-3xl font-serif text-secondary font-bold">{content.homepage.lawyerIntro.stats.casesWon}+</span>
                  <span className="text-xs uppercase tracking-widest opacity-80 mt-1">Cases Won</span>
               </div>
               <div className="hidden md:block w-px bg-white/10"></div>
               <div className="flex flex-col">
                  <span className="text-3xl font-serif text-secondary font-bold">{content.homepage.lawyerIntro.stats.clientSatisfaction}%</span>
                  <span className="text-xs uppercase tracking-widest opacity-80 mt-1">Client Satisfaction</span>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SECOND SECTION (ABOVE THE FOLD SUPPORT) */}
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="w-full lg:w-5/12 relative">
              <div className="aspect-[4/5] relative rounded-sm overflow-hidden shadow-2xl ring-1 ring-slate-100">
                <Image
                  src={content.homepage.lawyerIntro.imageUrl || "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80"}
                  alt={content.homepage.lawyerIntro.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white p-6 shadow-xl border border-slate-100 hidden md:block max-w-[240px]">
                <Scale className="h-8 w-8 text-secondary mb-3" />
                <p className="font-serif text-sm leading-relaxed text-slate-800 italic">
                  Leading practice in high-stakes litigation and robust legal defense strategies.
                </p>
              </div>
            </div>

            <div className="w-full lg:w-7/12 lg:pl-8">
              <span className="text-secondary tracking-widest text-xs uppercase font-bold mb-3 block">Senior Advocate</span>
              <h2 className="mb-8">{content.homepage.lawyerIntro.name}</h2>
              <div className="prose prose-slate max-w-none text-slate-600 space-y-4 mb-10 whitespace-pre-wrap font-light leading-relaxed text-lg">
                {content.homepage.lawyerIntro.bio}
              </div>
              <div className="flex flex-col sm:flex-row gap-4 border-t border-slate-100 pt-8 mt-4">
                <Button href="/lawyers" className="px-8 shadow-sm">View Full Profile</Button>
                <div className="flex items-center gap-3 text-sm text-slate-500 bg-slate-50 px-6 py-3 rounded-sm border border-slate-100">
                  <CheckCircle2 className="h-5 w-5 text-secondary" /> Practicing since {new Date().getFullYear() - content.homepage.lawyerIntro.stats.experienceYears}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PRACTICE AREAS */}
      <section className="py-24 bg-slate-50 border-t border-slate-200">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-secondary font-bold tracking-widest uppercase text-sm mb-4 block">Areas of Practice</span>
            <h2>Comprehensive Legal Expertise</h2>
            <p className="text-slate-600 mt-4 leading-relaxed font-light text-lg">
              We provide formidable legal representation across a spectrum of practice areas, ensuring our clients receive specialized attention tailored to their unique circumstances.
            </p>
          </div>

          <PracticeAreasCarousel areas={content.homepage.practiceAreas} />
          
        </div>
      </section>

      {/* 4. TRUST / VALUE SECTION */}
      <section className="bg-primary pt-20 pb-20 relative overflow-hidden text-white">
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="text-center mb-16">
             <h2 className="text-white text-3xl md:text-4xl">The Altaf Hussain Standard</h2>
             <span className="w-16 h-1 bg-secondary mx-auto mt-6 block"></span>
          </div>
          <div className="flex flex-col md:flex-row justify-between gap-12 divide-y md:divide-y-0 md:divide-x divide-white/10">
            {content.homepage.trustPoints.map((point, index) => {
              const icons = [Award, Shield, Scale];
              const FallbackIcon = icons[index % icons.length];
              return (
                <div key={index} className="flex-1 flex flex-col items-center text-center pt-8 md:pt-0 px-4 group">
                  <div className="bg-white/5 p-4 rounded-full mb-6 group-hover:bg-secondary/20 transition-colors">
                    <FallbackIcon className="h-8 w-8 text-secondary" />
                  </div>
                  <h4 className="font-serif font-semibold text-xl mb-3 tracking-wide">{point.title}</h4>
                  <p className="text-white/60 text-sm leading-relaxed max-w-sm">{point.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. FINAL CTA SECTION */}
      <section className="py-24 bg-slate-100 border-t border-slate-200">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-4xl mx-auto bg-white p-12 md:p-16 rounded-sm shadow-xl border border-slate-100 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-secondary"></div>
            <h2 className="text-primary mb-6">Take Action on Your Case Today</h2>
            <p className="text-slate-600 text-lg mb-10 leading-relaxed font-light max-w-2xl mx-auto">
              Do not leave your legal matters to chance. Contact our office for a confidential consultation and secure the representation you deserve.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6 items-center">
              <Button href="/contact" className="px-10 py-4 shadow-md text-base w-full sm:w-auto">
                Contact Us
              </Button>
              <div className="flex items-center gap-2 text-primary font-medium">
                 <span className="text-slate-400">or call</span>
                 <a href={`tel:${(content.siteSettings.phone || "").replace(/[^0-9+]/g, '')}`} className="font-bold text-lg hover:text-secondary transition-colors underline decoration-secondary decoration-2 underline-offset-4">
                   {content.siteSettings.phone}
                 </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
