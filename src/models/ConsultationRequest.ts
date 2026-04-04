import mongoose, { Schema, Document } from "mongoose";

export interface IConsultationRequest extends Document {
  name: string;
  email: string;
  phone: string;
  caseType: string;
  date: string;
  timeSlot: string;
  message: string;
  createdAt: Date;
}

const ConsultationRequestSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  caseType: { type: String, required: true },
  date: { type: String, required: false },
  timeSlot: { type: String, required: false },
  message: { type: String, required: false },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.ConsultationRequest || mongoose.model<IConsultationRequest>("ConsultationRequest", ConsultationRequestSchema);
