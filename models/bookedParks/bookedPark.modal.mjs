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
    date: {
      type: Date,
      required: true,
    },
    starttime: {
      type: Date,
      required: true,
    },
    endtime: {
      type: Date,
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
    advancepayment: {
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
