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
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    totalCost: {
      type: Number,
      required: true,
    },
    totalPeoples: {
      type: Number,
      required: true,
    },
    advancePayment: {
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
