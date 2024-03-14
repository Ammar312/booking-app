import cron from "node-cron";
import bookedparks from "./models/bookedParks/bookedPark.modal.mjs";
const checkCompleted = async () => {
  try {
    const d = new Date();
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const date = d.getDate();
    const formattedMonth = month < 10 ? `0${month}` : month;
    const formattedDate = date < 10 ? `0${date}` : date;
    const fullDate = `${year}-${formattedMonth}-${formattedDate}T00:00:00.000+00:00`;
    const hours = d.getHours();
    const minutes = d.getMinutes();
    const formattedHours = hours < 10 ? `0${hours}` : hours;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const time = `1970-01-01T${formattedHours}:${formattedMinutes}:00`;
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
