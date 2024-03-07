import parks from "../../models/parksModal/parks.modal.mjs";
import { uploadCloudinary } from "../../utilis/cloudinary.mjs";
import responseFunc from "../../utilis/response.mjs";

export const addParkController = async (req, res) => {
  const {
    name,
    description,
    location,
    country,
    city,
    starttime,
    endtime,
    capacity,
    cost,
  } = req.body;
  try {
    if (
      !name ||
      !description ||
      !location ||
      !country ||
      !city ||
      !starttime ||
      !endtime ||
      !capacity ||
      !cost
    ) {
      return responseFunc(res, 403, "Required parameter missing");
    }
    if (!req.files) {
      return responseFunc(res, 403, "Images Required!");
    }
    const files = req.files;
    const urls = [];
    for (const file of files) {
      const { path } = file;
      const img = await uploadCloudinary(path);
      urls.push(img.secure_url);
    }
    const startTimeDate = new Date(starttime);
    const endTimeDate = new Date(endtime);
    console.log(startTimeDate.toLocaleTimeString());
    console.log(endTimeDate.toLocaleTimeString());
    const addPark = await parks.create({
      name,
      description,
      location,
      country,
      city,
      parktiming: {
        starttime: startTimeDate,
        endtime: endTimeDate,
      },
      images: urls,
      capacity,
      cost,
    });
    responseFunc(res, 200, "park added");
  } catch (error) {
    console.log("addparkError", error);
    responseFunc(res, 400, "error in add park");
  }
};

export const getAllParks = async (req, res) => {
  const page = Number(req.query.page) || 1;
  const pageSize = Number(req.query.pageSize) || 10;
  const skip = (page - 1) * pageSize;
  try {
    const result = await parks.find({}).skip(skip).limit(pageSize);
    responseFunc(res, 200, "Successfully get all parks", result);
  } catch (error) {
    console.log("getAllParksError: ", error);
    responseFunc(res, 400, "Error in getting parks");
  }
};
