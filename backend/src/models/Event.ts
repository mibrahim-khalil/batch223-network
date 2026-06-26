import mongoose, { Schema } from "mongoose";

export type EventStatus = "published" | "pending" | "rejected";
export type EventType = "Meetup" | "Workshop" | "Webinar" | "Sports" | "Reunion";

const EventSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    type: { type: String, enum: ["Meetup", "Workshop", "Webinar", "Sports", "Reunion"], required: true },

    cityCountry: { type: String, required: true, trim: true },
    venue: { type: String, required: true, trim: true },

    date: { type: String, required: true }, // YYYY-MM-DD
    time: { type: String, required: true }, // "6:00 PM"
    description: { type: String, required: true },

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

export const Event = mongoose.model("Event", EventSchema);