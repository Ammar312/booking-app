import mongoose, { Schema } from "mongoose";

const adminSchema = new Schema(
  {
    firstname: {
      type: String,
      required: true,
    },

    lastname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["superadmin", "admin", "moderator"],
      default: "admin",
    },
    status: {
      type: String,
      enum: ["active", "suspended", "deactivated"],
    },
    isDisable: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const admins = mongoose.model("admins", adminSchema);
export default admins;
