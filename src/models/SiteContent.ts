import mongoose, { Schema, Document } from "mongoose";

export interface ISiteContent extends Document {
  siteSettings: {
    siteName: string;
    logoUrl: string;
    primaryLocation: string;
    courts: string[];
    phone: string;
    email: string;
    address: string;
    socialLinks: {
      linkedin: string;
      twitter: string;
    };
  };
  homepage: {
    hero: {
      headline: string;
      subtext: string;
      ctaPrimary: string;
      ctaSecondary: string;
      backgroundImageUrl?: string; // Newly added to support dynamic hero uploads
    };
    lawyerIntro: {
      name: string;
      bio: string;
      imageUrl: string;
      stats: {
        experienceYears: number;
        casesWon: number;
        clientSatisfaction: number;
      };
    };
    practiceAreas: Array<{
      title: string;
      description: string;
    }>;
    trustPoints: Array<{
      title: string;
      description: string;
    }>;
  };
  lawyers: Array<{
    name: string;
    imageUrl: string;
    education: string;
    specialization: string;
    bio: string;
  }>;
  contactPage: {
    emergencyPhone: string;
    mapEmbedUrl: string;
  };
  bookingPage: {
    timeSlots: string[];
    faq: Array<{
      question: string;
      answer: string;
    }>;
  };
  seo: {
    defaultTitle: string;
    defaultDescription: string;
    keywords: string[];
  };
  footer: {
    aboutText: string;
    officeHours: {
      weekdays: string;
      saturday: string;
      sunday: string;
    };
  };
  blogs: Array<{
    title: string;
    slug: string;
    content: string;
    createdAt: string;
    seo: {
      title: string;
      description: string;
    };
  }>;
  updatedAt: Date;
}

const SiteContentSchema = new Schema<ISiteContent>({
  siteSettings: {
    siteName: { type: String, default: "" },
    logoUrl: { type: String, default: "" },
    primaryLocation: { type: String, default: "" },
    courts: { type: [String], default: [] },
    phone: { type: String, default: "" },
    email: { type: String, default: "" },
    address: { type: String, default: "" },
    socialLinks: {
      linkedin: { type: String, default: "" },
      twitter: { type: String, default: "" },
    },
  },
  homepage: {
    hero: {
      headline: { type: String, default: "" },
      subtext: { type: String, default: "" },
      ctaPrimary: { type: String, default: "" },
      ctaSecondary: { type: String, default: "" },
      backgroundImageUrl: { type: String, default: "" }, // Add strict map
    },
    lawyerIntro: {
      name: { type: String, default: "" },
      bio: { type: String, default: "" },
      imageUrl: { type: String, default: "" },
      stats: {
        experienceYears: { type: Number, default: 0 },
        casesWon: { type: Number, default: 0 },
        clientSatisfaction: { type: Number, default: 0 },
      },
    },
    practiceAreas: [{
      title: { type: String, default: "" },
      description: { type: String, default: "" },
    }],
    trustPoints: [{
      title: { type: String, default: "" },
      description: { type: String, default: "" },
    }],
  },
  lawyers: [{
    name: { type: String, default: "" },
    imageUrl: { type: String, default: "" },
    education: { type: String, default: "" },
    specialization: { type: String, default: "" },
    bio: { type: String, default: "" },
  }],
  contactPage: {
    emergencyPhone: { type: String, default: "" },
    mapEmbedUrl: { type: String, default: "" },
  },
  bookingPage: {
    timeSlots: { type: [String], default: [] },
    faq: [{
      question: { type: String, default: "" },
      answer: { type: String, default: "" },
    }],
  },
  seo: {
    defaultTitle: { type: String, default: "" },
    defaultDescription: { type: String, default: "" },
    keywords: { type: [String], default: [] },
  },
  footer: {
    aboutText: { type: String, default: "" },
    officeHours: {
      weekdays: { type: String, default: "" },
      saturday: { type: String, default: "" },
      sunday: { type: String, default: "" },
    },
  },
  blogs: [{
    title: { type: String, default: "" },
    slug: { type: String, default: "" },
    content: { type: String, default: "" },
    createdAt: { type: String, default: "" },
    seo: {
      title: { type: String, default: "" },
      description: { type: String, default: "" },
    },
  }],
  updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

// Specifically mandate the collection name to exactly "site_content" as requested.
export default mongoose.models.SiteContent || mongoose.model<ISiteContent>("SiteContent", SiteContentSchema, "site_content");
