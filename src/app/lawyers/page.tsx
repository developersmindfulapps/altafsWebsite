import { getWebsiteContent } from "@/lib/getContent";
import LawyersList from "@/components/LawyersList";

export const metadata = {
  title: "Our Legal Team",
  description: "Meet the experienced advocates dedicated to protecting your rights. Our team brings decades of combined expertise to the courtroom.",
};

export default async function LawyersPage() {
  const content = await getWebsiteContent();

  const lawyers = content.lawyers.map((lawyer, index) => ({
    id: index + 1,
    name: lawyer.name,
    title: index === 0 ? "Senior Partner & Founder" : "Associate Practitioner",
    image: lawyer.imageUrl || "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80",
    education: lawyer.education.split("\\\\").map(e => e.trim()), 
    specialization: lawyer.specialization.split(",").map(s => s.trim()), 
    bio: lawyer.bio,
  }));

  return (
    <>
      <section className="bg-primary text-white pt-32 pb-20">
        <div className="container mx-auto px-4 md:px-8 max-w-5xl text-center">
          <h1 className="mb-4">Our Legal Team</h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto font-light leading-relaxed">
            Meet the experienced advocates dedicated to protecting your rights. Our team brings decades of combined expertise to the courtroom.
          </p>
        </div>
      </section>

      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4 md:px-8 max-w-6xl">
          <LawyersList lawyers={lawyers} />
        </div>
      </section>
    </>
  );
}
