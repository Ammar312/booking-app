import mongoose, { Schema } from "mongoose";

const parkSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    country: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    parktiming: {
      starttime: {
        type: Date,
        required: true,
      },
      endtime: {
        type: Date,
        required: true,
      },
    },
    capacity: {
      type: Number,
      required: true,
    },
    cost: {
      type: Number,
      required: true,
    },
    isDisable: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const parks = mongoose.model("parks", parkSchema);
export default parks;
