import mongoose, { Schema, Document } from "mongoose";

export interface IVaultItem extends Document {
  userId: string;
  title: string;
  username: string;
  password: string; // encrypted string
  url?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const VaultSchema = new Schema<IVaultItem>(
  {
    userId: { type: String, required: true },
    title: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true }, // will store encrypted blob
    url: { type: String },
    notes: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.VaultItem || mongoose.model<IVaultItem>("VaultItem", VaultSchema);
