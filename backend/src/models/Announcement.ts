import mongoose, { Schema } from "mongoose";

export type AnnouncementStatus = "published" | "pending" | "rejected";
export type AnnouncementTag = "Announcement" | "Update" | "Job" | "Event";

const AnnouncementSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    body: { type: String, required: true },

    tag: {
      type: String,
      enum: ["Announcement", "Update", "Job", "Event"],
      default: "Update",
    },

    pinned: { type: Boolean, default: false },
    official: { type: Boolean, default: false },

    status: {
      type: String,
      enum: ["published", "pending", "rejected"],
      default: "pending",
      index: true,
    },

    authorEmail: { type: String, required: true, index: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export const Announcement = mongoose.model("Announcement", AnnouncementSchema);