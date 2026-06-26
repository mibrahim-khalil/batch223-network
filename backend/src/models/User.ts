import mongoose, { Schema } from "mongoose";

export type UserRole = "student" | "admin";

const ExperienceSchema = new Schema(
  {
    id: { type: String, required: true },
    title: { type: String, default: "" },
    company: { type: String, default: "" },
    employmentType: { type: String, default: "" },
    location: { type: String, default: "" },
    startMonth: { type: String, default: "" },
    startYear: { type: String, default: "" },
    endMonth: { type: String, default: "" },
    endYear: { type: String, default: "" },
    current: { type: Boolean, default: true },
    description: { type: String, default: "" },
  },
  { _id: false }
);

const EducationSchema = new Schema(
  {
    id: { type: String, required: true },
    level: {
      type: String,
      enum: ["Matric", "Intermediate", "University", "Current"],
      required: true,
    },
    institutionName: { type: String, default: "" },
    degreeField: { type: String, default: "" },
    passingMonth: { type: String, default: "" },
    passingYear: { type: String, default: "" },
    description: { type: String, default: "" },
  },
  { _id: false }
);

const UserSchema = new Schema(
  {
    // auth
    email: { type: String, unique: true, index: true, required: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["student", "admin"], default: "student" },

    emailVerified: { type: Boolean, default: false },
    emailOtpHash: { type: String, default: null },
    emailOtpExpiresAt: { type: Date, default: null },

    //forgot/reset password
    passwordResetOtpHash: { type: String, default: null },
    passwordResetOtpExpiresAt: { type: Date, default: null },

    // required at register (rank/roll/reg no)
    registrationNumber: { type: String, default: "" },

    // profile
    fullName: { type: String, default: "Your Name" },
    headline: { type: String, default: "Your Role @ Company" },
    cityCountry: { type: String, default: "City, Country" },
    about: { type: String, default: "" },

    openToWork: { type: Boolean, default: true },
    freelancer: { type: Boolean, default: false },
    entrepreneur: { type: Boolean, default: false },

    phone: { type: String, default: "" },

    linkedin: { type: String, default: "" },
    github: { type: String, default: "" },
    portfolio: { type: String, default: "" },
    fiverr: { type: String, default: "" },
    upwork: { type: String, default: "" },

    skills: {
      type: [String],
      default: () => ["React", "TypeScript", "Node.js"],
    },

    experiences: { type: [ExperienceSchema], default: () => [] },
    education: { type: [EducationSchema], default: () => [] },

    // UI-only filenames (optional)
    avatarFileName: { type: String, default: "" },
    coverFileName: { type: String, default: "" },
    resumeFileName: { type: String, default: "" },

    // Cloudinary URLs
    avatarUrl: { type: String, default: "" },
    coverUrl: { type: String, default: "" },
    resumeUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", UserSchema);