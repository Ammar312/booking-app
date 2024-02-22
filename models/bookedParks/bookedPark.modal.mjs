import mongoose, { Schema } from "mongoose";

const bookedParkSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    parkId: {
      type: Schema.Types.ObjectId,
      ref: "parks",
      required: true,
    },
    bookeddate: {
      type: Date,
      required: true,
    },
    starttime: {
      type: String,
      required: true,
    },
    endtime: {
      type: String,
      required: true,
    },
    totalcost: {
      type: Number,
      required: true,
    },
    totalpeoples: {
      type: Number,
      required: true,
    },
    advancedpayment: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["booked", "completed", "canceled"],
      default: "booked",
    },
  },
  { timestamps: true }
);

const bookedparks = mongoose.model("bookedparks", bookedParkSchema);
export default bookedparks;
