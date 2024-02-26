import parks from "../../models/parksModal/parks.modal.mjs";
import responseFunc from "../../utilis/response.mjs";

export const availableParksInTime = async (req, res) => {
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

  try {
    const availableParks = await parks.find({
      "parktiming.starttime": { $lte: new Date(endtime) },
      "parktiming.endtime": { $gte: new Date(starttime) },
    });
    console.log("starttime: ", new Date(starttime));
    console.log("endtime: ", new Date(endtime));
    // const availableParks = await parks.find({
    //   $expr: {
    //     $and: [
    //       {
    //         $gte: [
    //           { $hour: "$parktiming.starttime" },
    //           { $hour: new Date(starttime) },
    //         ],
    //       },
    //       {
    //         $lte: [
    //           { $hour: "$parktiming.endtime" },
    //           { $hour: new Date(endtime) },
    //         ],
    //       },
    //     ],
    //   },
    // });
    console.log(availableParks);
    responseFunc(res, 200, "get", availableParks);
  } catch (error) {
    console.log("parkbookingerror", error);
    responseFunc(res, 400, "error");
  }
};
