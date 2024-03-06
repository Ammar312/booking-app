import cron from "node-cron";
import bookedparks from "./models/bookedParks/bookedPark.modal.mjs";
const checkCompleted = async () => {
  try {
    const d = new Date();
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const date = d.getDate();
    const fullDate = `${year}-${month.length === 2 ? month : `0${month}`}-${
      date.length === 2 ? date : `0${date}`
    }T00:00:00.000+00:00`;
    const hours = d.getHours();
    const minutes = d.getMinutes();
    const time = `1970-01-01T${hours.length === 2 ? hours : `0${hours}`}:${
      minutes.length === 2 ? minutes : `0${minutes}`
    }:00`;
    const result = await bookedparks.updateMany(
      {
        date: { $lte: fullDate },
        endTime: { $lte: time },
        status: "booked",
      },
      { $set: { status: "completed" } }
    );

    console.log(result);
  } catch (error) {
    console.log("checkCompletedError", error);
  }
};

export default checkCompleted;
