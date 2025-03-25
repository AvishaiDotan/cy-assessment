import mongoose from "mongoose";

// Log type for server-side operations
export interface ILog {
  level: string;
  message: string;
  service: string;
  metadata?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

export const logDbSchema = new mongoose.Schema<ILog>(
  {
    level: {
      type: String,
      required: [true, "Log level is required"],
      enum: ["info", "warn", "error", "debug"],
      index: true,
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
    },
    service: {
      type: String,
      required: [true, "Service name is required"],
      trim: true,
      index: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    }
  },
  {
    timestamps: true
  }
);

// Create and export the Log document interface
export interface ILogDocument extends mongoose.Document {
  id: string;
  level: string;
  message: string;
  service: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface LogDTO {
  id: string;
  level: string;
  message: string;
  service: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
} 