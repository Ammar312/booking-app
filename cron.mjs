import cron from "node-cron";
import bookedparks from "./models/bookedParks/bookedPark.modal.mjs";
import responseFunc from "./utilis/response.mjs";
const checkCompleted = async (req, res) => {
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
    const seconds = d.getSeconds();
    const formattedHours = hours < 10 ? `0${hours}` : hours;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
    const time = `1970-01-01T${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    const result = await bookedparks.updateMany(
      {
        date: { $lt: fullDate },
        // endTime: { $lt: time },
        status: "booked",
      },
      { $set: { status: "completed" } }
    );
    console.log(fullDate);
    console.log(time);
    console.log(result);
    // responseFunc(res, 200, "Check completed");
  } catch (error) {
    console.log("checkCompletedError", error);
    // responseFunc(res, 400, "error in completed");
  }
};

export default checkCompleted;
