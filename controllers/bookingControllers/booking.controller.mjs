import parks from "../../models/parksModal/parks.modal.mjs";
import responseFunc from "../../utilis/response.mjs";
import bookedparks from "../../models/bookedParks/bookedPark.modal.mjs";
import mongoose from "mongoose";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import convertToUTCAndFormat from "../../utilis/convertToUtc.mjs";

dayjs.extend(utc);
const d = new Date();
const year = d.getFullYear();
const month = d.getMonth() + 1;
const datee = d.getDate();
const formattedMonth = month < 10 ? `0${month}` : month;
const formattedDate = datee < 10 ? `0${datee}` : datee;
const currentDate = `${year}-${formattedMonth}-${formattedDate}T00:00:00`;
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
  // console.log(currentDate);
  const utchour = dayjs(endtime).utc().hour();
  const utcminute = dayjs(endtime).utc().minute();
  const utcdate = dayjs.utc(`1970-01-01T${utchour}:${utcminute}:00`).isUTC();
  // .format("YYYY-MM-DDTHH:mm:00");
  const sw = dayjs(endtime).format();
  // console.log(utchour);
  // console.log(utcminute);
  const utctime = convertToUTCAndFormat(endtime);
  console.log(utctime);
  console.log(new Date(utctime));
  console.log(endtime);
  if (date < currentDate) {
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
    totalPeoples,
    advancePayment,
  } = req.body;
  const utcstarttime = convertToUTCAndFormat(startTime);
  const utcendtime = convertToUTCAndFormat(endTime);
  console.log("utcstartime: ", utcstarttime);
  console.log("utcendtime: ", utcendtime);
  if (
    !userId ||
    !parkId ||
    !date ||
    !startTime ||
    !endTime ||
    !totalPeoples ||
    !advancePayment
  ) {
    return responseFunc(res, 403, "Required parameter missing");
  }

  if (date < currentDate) {
    return responseFunc(res, 400, "Invalid Date");
  }

  // if (!startTime > st || !endTime < et) {
  //   return responseFunc(res, 400, "Invalid Time");
  // }

  try {
    const isPark = await parks.findOne({
      _id: parkId,
      "parktiming.starttime": { $lte: endTime },
      "parktiming.endtime": { $gte: startTime },
      isDisable: "false",
    });
    if (!isPark) {
      return responseFunc(res, 404, "This park does not exist");
    }
    if (totalPeoples > isPark.capacity) {
      return responseFunc(
        res,
        403,
        `This park has the capacity of ${isPark.capacity} peoples `
      );
    }
    const isBooked = await bookedparks.findOne({
      parkId,
      date: date,
      startTime: { $lte: endTime },
      endTime: { $gte: startTime },
      $or: [{ status: "pending" }, { status: "booked" }],
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
      totalCost: isPark.cost,
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
  const { userId } = req.query;
  const { _id } = req.currentUser;
  if (!mongoose.isValidObjectId(userId || _id)) {
    return responseFunc(res, 400, "Invalid userId");
  }
  try {
    const id = userId || _id;
    const result = await bookedparks
      .find({ userId: id })
      .populate({ path: "parkId", select: "name location " });
    if (!result.length) {
      responseFunc(res, 200, "No booking yet", result);
      return;
    }
    responseFunc(res, 200, "user bookings", result);
  } catch (error) {
    console.log("getUserBookingsError: ", error);
    responseFunc(res, 400, "Error in getting user bookings");
  }
};

export const getBookings = async (req, res) => {
  const { status, date } = req.query;
  const page = Number(req.query.page) || 1;
  const pageSize = Number(req.query.pageSize) || 10;
  const skip = (page - 1) * pageSize;
  const filters = {};

  if (status) {
    filters.status = status;
  }

  try {
    const result = await bookedparks
      .find(filters)
      .skip(skip)
      .limit(pageSize)
      .populate({
        path: "userId",
        select: "firstname lastname email phonenumber",
      })
      .populate({ path: "parkId", select: "name " });
    responseFunc(res, 200, "Get bookings Successfully", result);
  } catch (error) {
    console.log("getBookingsError: ", error);
    responseFunc(res, 400, "Error in getting bookings");
  }
};

export const approveBooking = async (req, res) => {
  const { _id } = req.body;
  if (!_id) {
    return responseFunc(res, 403, "Booking Id missing");
  }
  if (!mongoose.isValidObjectId(_id)) {
    return responseFunc(res, 400, "Invalid Booking Id");
  }
  try {
    const booking = await bookedparks
      .findOne({ _id, status: "pending" })
      .populate({ path: "userId", select: "firstname lastname email" });
    console.log(booking);
    if (!booking) {
      return responseFunc(res, 404, "No booking found");
    }
    const { parkId, date, startTime, endTime } = booking;
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
    responseFunc(res, 200, "Booking Approved");
  } catch (error) {
    console.log("ErrorInApproveBooking: ", error);
    responseFunc(res, 400, "Error in approving booking");
  }
};
export const rejectBooking = async (req, res) => {};

// function isValidDate(dateString) {
//   return !isNaN(Date.parse(dateString));
// }
// function formatDateToISO(date) {
//   const year = date.getFullYear();
//   const month = String(date.getMonth() + 1).padStart(2, "0"); // Adding leading zero if needed
//   const day = String(date.getDate()).padStart(2, "0"); // Adding leading zero if needed

//   return `${year}-${month}-${day}`;
// }
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
