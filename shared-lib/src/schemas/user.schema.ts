import mongoose from "mongoose";

export interface IUser {
  _id?: mongoose.Types.ObjectId;
  email: string;
  name: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const userDbSchema = new mongoose.Schema<IUser>(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      auto: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true
  }
);

export interface IUserDocument extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  name: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

