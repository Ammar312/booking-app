import mongoose, { Schema } from "mongoose";

const approvalSchema = new Schema(
  {
    booking: {
      type: Schema.Types.ObjectId,
      ref: "bookedparks",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    approver: {
      type: Schema.Types.ObjectId,
      ref: "admins",
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "canceled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const approvals = mongoose.model("approvals", approvalSchema);
export default approvals;
