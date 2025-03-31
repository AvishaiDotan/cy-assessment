import mongoose from "mongoose";

export interface IPhishingPayload {
  _id?: mongoose.Types.ObjectId;
  recipient: string;
  emailContent: string;
  status: PhishingPayloadStatus;
  link: string;
  createdAt?: Date;
  updatedAt?: Date;
  userId?: any;
}

export type PhishingPayloadStatus = "pending" | "visited";

export const phishingPayloadDbSchema = new mongoose.Schema<IPhishingPayload>(
  {
    recipient: {
      type: String,
      required: true,
    },
    emailContent: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  },
  {
    timestamps: true
  }
);

export interface IPhishingPayloadDocument extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  recipient: string;
  emailContent: string;
  status: PhishingPayloadStatus;
  link: string;
  createdAt: Date;
  updatedAt: Date;
  userId?: any;
}
