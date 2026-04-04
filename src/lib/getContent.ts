import connectDB from "./mongodb";
import SiteContent, { ISiteContent } from "@/models/SiteContent";
import { unstable_cache } from "next/cache";

// Type representing the shape of our fully resolved content (lean Mongo doc)
export type SiteContentData = Omit<ISiteContent, keyof import("mongoose").Document>;

const DEFAULT_CONTENT: SiteContentData = {
  siteSettings: {
    siteName: "Altaf Hussain Law Firm",
    logoUrl: "",
    primaryLocation: "Jammu, Jammu & Kashmir, India",
    courts: ["Jammu District Court", "Jammu High Court"],
    phone: "+91 98765 43210",
    email: "contact@altaflawfirmjammu.example.com",
    address: "Chamber No. 123, District Court Complex, Janipur, Jammu, J&K, India 180007",
    socialLinks: {
      linkedin: "",
      twitter: ""
    }
  },
  homepage: {
    hero: {
      headline: "Relentless Advocacy.\\nProven Results.",
      subtext: "Premium legal representation dedicated to protecting your rights and achieving the best possible outcome in every case.",
      ctaPrimary: "Book Consultation",
      ctaSecondary: "Contact"
    },
    lawyerIntro: {
      name: "Sheikh Altaf Hussain",
      bio: "With over 15 years of distinguished practice at the Jammu High Court, Sheikh Altaf Hussain is renowned for his strategic litigation skills and relentless pursuit of justice.",
      imageUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80",
      stats: {
        experienceYears: 15,
        casesWon: 500,
        clientSatisfaction: 98
      }
    },
    practiceAreas: [
      {
        title: "Civil Litigation",
        description: "Expert handling of property disputes, breach of contract, and complex commercial litigation in district and high courts."
      },
      {
        title: "Criminal Defense",
        description: "Aggressive and strategic defense against criminal charges, protecting your freedom and reputation at all costs."
      },
      {
        title: "Family Law",
        description: "Compassionate yet firm representation in divorce, child custody, alimony, and domestic disputes."
      }
    ],
    trustPoints: [
      {
        title: "Absolute Confidentiality",
        description: "Your privacy is our priority"
      },
      {
        title: "Decades of Experience",
        description: "Trusted legal expertise"
      },
      {
        title: "Aggressive Representation",
        description: "Fighting for your rights"
      }
    ]
  },
  lawyers: [
    {
      name: "Sheikh Altaf Hussain",
      imageUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80",
      education: "LL.B., Jammu University\\B.A. Political Science",
      specialization: "Civil Litigation, Constitutional Law, Corporate Disputes",
      bio: "With over 15 years of distinguished practice at the Jammu High Court, Sheikh Altaf Hussain is renowned for his strategic litigation skills and relentless pursuit of justice."
    },
    {
      name: "Adv. Rajesh Kumar",
      imageUrl: "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&q=80",
      education: "LL.M., Delhi University\\LL.B., Jammu University",
      specialization: "Criminal Defense, Appellate Practice, White Collar Crimes",
      bio: "Rajesh Kumar brings a forensic approach to criminal defense. His meticulous preparation and aggressive courtroom demeanor have resulted in numerous acquittals and favorable settlements in complex criminal proceedings."
    },
    {
      name: "Adv. Priya Sharma",
      imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80",
      education: "LL.B. (Hons), National Law University",
      specialization: "Family Law, Matrimonial Disputes, Property Law",
      bio: "Priya Sharma specializes in family and property disputes, providing compassionate yet firm representation. She is dedicated to achieving equitable resolutions for her clients during challenging transitions."
    }
  ],
  contactPage: {
    emergencyPhone: "+91 98765 43210",
    mapEmbedUrl: ""
  },
  bookingPage: {
    timeSlots: ["10:00 AM", "11:00 AM", "2:00 PM", "4:00 PM"],
    faq: [
      {
        question: "What should I bring to my first consultation?",
        answer: "Please bring any relevant legal documents, court summons, contracts, or evidence related to your case."
      }
    ]
  },
  seo: {
    defaultTitle: "Sheikh Altaf Hussain | Premium Law Firm in Jammu",
    defaultDescription: "Experienced lawyer in Jammu High Court offering legal consultation.",
    keywords: [
      "lawyer in Jammu",
      "advocate in Jammu High Court",
      "best lawyer in Jammu",
      "legal consultation Jammu"
    ]
  },
  footer: {
    aboutText: "Premium legal representation at the Jammu District Court and High Court. Committed to delivering exceptional results with integrity and professionalism.",
    officeHours: {
      weekdays: "9:00 AM - 6:00 PM",
      saturday: "10:00 AM - 2:00 PM",
      sunday: "Closed"
    }
  },
  blogs: [],
  updatedAt: new Date()
};

export const getWebsiteContent = unstable_cache(
  async (): Promise<SiteContentData> => {
    try {
      await connectDB();
      // Using exactly what's required:
      // const data = await db.collection("site_content").findOne({});
      const content = await SiteContent.findOne({}).lean() as SiteContentData | null;
      
      if (!content) {
        return DEFAULT_CONTENT;
      }
      
      // Merge DB content with defaults recursively in case of missing future fields
      // Map everything together
      const rawContent = {
        siteSettings: { ...DEFAULT_CONTENT.siteSettings, ...content.siteSettings },
        homepage: {
          hero: { ...DEFAULT_CONTENT.homepage.hero, ...content.homepage?.hero },
          lawyerIntro: { ...DEFAULT_CONTENT.homepage.lawyerIntro, ...content.homepage?.lawyerIntro },
          practiceAreas: content.homepage?.practiceAreas?.length ? content.homepage.practiceAreas : DEFAULT_CONTENT.homepage.practiceAreas,
          trustPoints: content.homepage?.trustPoints?.length ? content.homepage.trustPoints : DEFAULT_CONTENT.homepage.trustPoints,
        },
        lawyers: content.lawyers?.length ? content.lawyers : DEFAULT_CONTENT.lawyers,
        contactPage: { ...DEFAULT_CONTENT.contactPage, ...content.contactPage },
        bookingPage: { ...DEFAULT_CONTENT.bookingPage, ...content.bookingPage },
        seo: { ...DEFAULT_CONTENT.seo, ...content.seo },
        footer: {
          aboutText: content.footer?.aboutText ?? DEFAULT_CONTENT.footer.aboutText,
          officeHours: { ...DEFAULT_CONTENT.footer.officeHours, ...content.footer?.officeHours }
        },
        blogs: content.blogs || [],
        updatedAt: content.updatedAt
      };
      
      // JSON serialization strips native MongoDB _id buffer objects which crash Next.js Client Component borders
      return JSON.parse(JSON.stringify(rawContent));
    } catch (error) {
      console.error("Error fetching site_content from DB:", error);
      return DEFAULT_CONTENT;
    }
  },
  ['site-content-v2'],
  { tags: ['content'], revalidate: 3600 }
);
