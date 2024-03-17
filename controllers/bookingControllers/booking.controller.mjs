import moment from "moment";
import parks from "../../models/parksModal/parks.modal.mjs";
import responseFunc from "../../utilis/response.mjs";
import bookedparks from "../../models/bookedParks/bookedPark.modal.mjs";
import mongoose from "mongoose";

const d = new Date();
const year = d.getFullYear();
const month = d.getMonth() + 1;
const datee = d.getDate();
const formattedMonth = month < 10 ? `0${month}` : month;
const formattedDate = datee < 10 ? `0${datee}` : datee;
const currentDate = new Date(
  `${year}-${formattedMonth}-${formattedDate}T00:00:00`
);
const st = `1970-01-01T00:00:00.000+00:00`;
const et = `1970-01-01T23:59:00.000+00:00`;

export const availableParksInTimeAndDate = async (req, res) => {
  const { date, starttime, endtime } = req.body;
  if (!date || !starttime || !endtime) {
    return responseFunc(res, 403, "Required parameter missing");
  }

  // const a = moment.utc(new Date(starttime)).local().format();
  // const b = moment.utc(new Date(endtime)).local().format();
  // console.log("as", a);
  // console.log("be", b);
  // console.log("starttime: ", new Date(starttime));
  // console.log("endtime: ", new Date(endtime));
  console.log(currentDate);
  console.log(date);
  if (new Date(date) < currentDate) {
    return responseFunc(res, 400, "Invalid Date");
  }
  if (!(starttime > st && endtime < et)) {
    return responseFunc(res, 400, "Invalid Time");
  }
  try {
    const availableParksInTime = await parks.find({
      "parktiming.starttime": { $lte: new Date(starttime) },
      "parktiming.endtime": { $gte: new Date(endtime) },
      isDisable: false,
    });
    // console.log("availableParksInTime", availableParksInTime);
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
    responseFunc(res, 400, "Error in finding available parks");
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

  if (date < currentDate) {
    return responseFunc(res, 400, "Invalid Date");
  }

  if (!startTime > st || !endTime < et) {
    return responseFunc(res, 400, "Invalid Time");
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
    responseFunc(res, 200, "You will recieve a email of your booking soon.");
  } catch (error) {
    console.log("parkbookingerror", error);
    responseFunc(res, 400, "error");
  }
};

export const cancelBooking = async (req, res) => {
  const { bookingId } = req.body;
  try {
    const changeStatus = await bookedparks.updateOne(
      { _id: bookingId, $or: [{ status: "booked" }, { status: "pending" }] },
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

export const reschdeuleBooking = async (req, res) => {
  const { startTime, endTime, bookingId, date, parkId } = req.body;
  if (!startTime || !endTime || !bookingId || !parkId || !date) {
    return responseFunc(res, 403, "Required Parameter Missing");
  }
  try {
    const isBooked = await bookedparks.findOne({
      parkId,
      startTime: { $lte: endTime },
      endTime: { $gte: startTime },
      date,
      status: "booked",
    });
    if (isBooked) {
      return responseFunc(
        res,
        409,
        "This park is already booked at this date and time"
      );
    } else {
      const updated = { startTime, endTime, date };
      await bookedparks.updateOne({ _id: bookingId }, { $set: updated });
      responseFunc(res, 200, "Booking rescheduled");
    }
  } catch (error) {
    console.log("reschdeule error: ", error);
    responseFunc(res, 400, "Error in rescheduling booking");
  }
};

export const getUserBookings = async (req, res) => {
  const { userId } = req.body;
  if (!mongoose.isValidObjectId(_id)) {
    return responseFunc(res, 400, "Invalid userId");
  }
  try {
    const id = userId || req.currentUser._id;
    const result = await bookedparks.find({ userId: id });
    responseFunc(res, 200, "user bookings", result);
  } catch (error) {
    console.log("getUserBookingsError: ", error);
    responseFunc(res, 400, "Error in getting user bookings");
  }
};

export const getBookings = async (req, res) => {
  const { status } = req.query;
  const page = Number(req.query.page) || 1;
  const pageSize = Number(req.query.pageSize) || 10;
  const skip = (page - 1) * pageSize;
  const filters = {};
  if (status) {
    filters.status = status;
  }
  try {
    const result = await bookedparks.find(filters).skip(skip).limit(pageSize);
    responseFunc(res, 200, "Get bookings Successfully", result);
  } catch (error) {
    console.log("getBookingsError: ", error);
    responseFunc(res, 400, "Error in getting bookings");
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
