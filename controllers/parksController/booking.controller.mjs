import moment from "moment";
import parks from "../../models/parksModal/parks.modal.mjs";
import responseFunc from "../../utilis/response.mjs";
import bookedparks from "../../models/bookedParks/bookedPark.modal.mjs";

export const availableParksInTimeAndDate = async (req, res) => {
  const { date, starttime, endtime } = req.body;
  if (!date || !starttime || !endtime) {
    return responseFunc(res, 403, "Required parameter missing");
  }

  // const a = moment.utc(new Date(starttime)).local().format();
  // const b = moment.utc(new Date(endtime)).local().format();
  // console.log("as", a);
  // console.log("be", b);
  console.log("starttime: ", new Date(starttime));
  console.log("endtime: ", new Date(endtime));
  try {
    const availableParksInTime = await parks.find({
      "parktiming.starttime": { $lte: new Date(starttime) },
      "parktiming.endtime": { $gte: new Date(endtime) },
    });
    console.log("availableParksInTime", availableParksInTime);
    if (availableParksInTime.length > 0) {
      const bookedParks = await bookedparks.find({
        date: date,
        startTime: { $lte: endtime },
        endTime: { $gte: starttime },
        status: "booked",
      });
      console.log("bookedParks", bookedParks);
      const availableParks = availableParksInTime.filter((park) => {
        return !bookedParks.some(
          (bookedPark) => bookedPark.parkId.toString() === park._id.toString()
        );
      });
      responseFunc(res, 200, "Available parks", availableParks);
    } else {
      responseFunc(res, 200, "None of the parks are open in this time range");
    }

    // responseFunc(res, 200, "get", availableParksInTime);
  } catch (error) {
    console.log("parkbookingerror", error);
    responseFunc(res, 400, "Error finding available parks");
  }
};
export const bookAParkController = async (req, res) => {
  const {
    userId,
    parkId,
    date,
    startTime,
    endTime,
    totalCost,
    totalPeoples,
    advancePayment,
  } = req.body;

  if (
    !userId ||
    !parkId ||
    !date ||
    !startTime ||
    !endTime ||
    !totalCost ||
    !totalPeoples ||
    !advancePayment
  ) {
    return responseFunc(res, 403, "Required parameter missing");
  }
  try {
    const isBooked = await bookedparks.findOne({
      parkId,
      date: date,
      startTime: { $lte: endTime },
      endTime: { $gte: startTime },
      status: "booked",
    });
    if (isBooked) {
      responseFunc(
        res,
        409,
        "This park is already booked at this date and time"
      );
      return;
    }
    const bookPark = await bookedparks.create({
      userId,
      parkId,
      date,
      startTime,
      endTime,
      totalCost,
      totalPeoples,
      advancePayment,
    });
    responseFunc(res, 200, "Park Book Successfully");
  } catch (error) {
    console.log("parkbookingerror", error);
    responseFunc(res, 400, "error");
  }
};

export const cancelBooking = async (req, res) => {
  const { bookingId } = req.body;
  try {
    const changeStatus = await bookedparks.updateOne(
      { _id: bookingId },
      {
        $set: { status: "canceled" },
      }
    );
    responseFunc(res, 200, "Your booking has been canceled.");
  } catch (error) {
    console.log("cancelBooking: ", error);
    responseFunc(res, 400, "Error in cancel booking");
  }
};
// const availableParks = await parks.aggregate([
//   {
//     $match: {
//       $expr: {
//         $and: [
//           {
//             $lte: [
//               { $hour: "$parktiming.starttime" },
//               { $hour: new Date(endtime) },
//             ],
//           },
//           {
//             $gte: [
//               { $hour: "$parktiming.endtime" },
//               { $hour: new Date(starttime) },
//             ],
//           },
//         ],
//       },
//     },
//   },
// ]);
