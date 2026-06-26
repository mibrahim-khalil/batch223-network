import mongoose, { Schema } from "mongoose";

export type JobStatus = "published" | "pending" | "rejected";
export type JobType = "Job" | "Internship";

const JobSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    cityCountry: { type: String, required: true, trim: true },

    type: { type: String, enum: ["Job", "Internship"], required: true },
    skills: { type: [String], default: [] },
    link: { type: String, default: "" },

    body: { type: String, required: true },
    open: { type: Boolean, default: true },

    status: {
      type: String,
      enum: ["published", "pending", "rejected"],
      default: "pending",
      index: true,
    },

    official: { type: Boolean, default: false },
    authorEmail: { type: String, required: true, index: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export const Job = mongoose.model("Job", JobSchema);