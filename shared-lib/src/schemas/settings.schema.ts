import mongoose from "mongoose";
import { Language, ThemeMode, type Settings } from "../types/settings.types";

// Settings interface for server-side operations
export interface ISettings {
    userId: string;
    theme: ThemeMode;
    language: Language;
    createdAt?: Date;
    updatedAt?: Date;
}

export const settingsDbSchema = new mongoose.Schema<ISettings>(
    {
        userId: {
            type: String,
            required: [true, "User ID is required"],
            index: true,
        },
        theme: {
            type: String,
            enum: Object.values(ThemeMode),
            default: ThemeMode.SYSTEM,
            required: [true, "Theme is required"],
        },
        language: {
            type: String,
            enum: Object.values(Language),
            default: Language.EN,
            required: [true, "Language is required"],
        },
    },
    {
        timestamps: true,
    }
);

// Create indexes
settingsDbSchema.index({ userId: 1 }, { unique: true });

// Document interface
export interface ISettingsDocument extends mongoose.Document, Omit<Settings, 'id'> {
    id: string;
}

// DTO for client responses
export type SettingsDTO = Settings; 