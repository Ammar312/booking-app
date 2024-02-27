import moment from "moment";
import parks from "../../models/parksModal/parks.modal.mjs";
import responseFunc from "../../utilis/response.mjs";
import bookedparks from "../../models/bookedParks/bookedPark.modal.mjs";

export const availableParksInTimeAndDate = async (req, res) => {
  const {
    userId,
    parkId,
    date,
    starttime,
    endtime,
    totalcost,
    totalpeoples,
    advancepayment,
  } = req.body;

  //   if (
  //     !userId ||
  //     !parkId ||
  //     !date ||
  //     !starttime ||
  //     !endtime ||
  //     !totalcost ||
  //     !totalpeoples ||
  //     !advancepayment
  //   ) {
  //     return responseFunc(res, 403, "Required parameter missing");
  //   }
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
    if (availableParksInTime) {
      const availableParks = await bookedparks.find({
        date: new Date(date),
        starttime,
      });
    } else {
    }
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

    responseFunc(res, 200, "get", availableParksInTime);
  } catch (error) {
    console.log("parkbookingerror", error);
    responseFunc(res, 400, "error");
  }
};
