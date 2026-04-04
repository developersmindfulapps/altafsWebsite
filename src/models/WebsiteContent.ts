import mongoose, { Schema, Document } from "mongoose";

export interface IPracticeArea {
  id: string;
  title: string;
  description: string;
  icon: string; // e.g. "Scale", "Shield", "Award"
}

export interface IWebsiteContent extends Document {
  personalDetails: {
    name: string;
    bio: string;
    imageUrl: string;
  };
  practiceAreas: IPracticeArea[];
  contactDetails: {
    phone: string;
    email: string;
    address: string;
  };
  homepageStats: {
    experience: string;
    casesWon: string;
    satisfaction: string;
  };
  updatedAt: Date;
}

const PracticeAreaSchema = new Schema<IPracticeArea>({
  id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, default: "Scale" },
});

const WebsiteContentSchema: Schema = new Schema({
  personalDetails: {
    name: { type: String, default: "Sheikh Altaf Hussain" },
    bio: { type: String, default: "" },
    imageUrl: { type: String, default: "" },
  },
  practiceAreas: { type: [PracticeAreaSchema], default: [] },
  contactDetails: {
    phone: { type: String, default: "" },
    email: { type: String, default: "" },
    address: { type: String, default: "" },
  },
  homepageStats: {
    experience: { type: String, default: "15+" },
    casesWon: { type: String, default: "High" },
    satisfaction: { type: String, default: "99%" },
  },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.WebsiteContent || mongoose.model<IWebsiteContent>("WebsiteContent", WebsiteContentSchema);
