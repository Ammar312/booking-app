import parks from "../../models/parksModal/parks.modal.mjs";
import { uploadCloudinary } from "../../utilis/cloudinary.mjs";
import responseFunc from "../../utilis/response.mjs";

export const addParkController = async (res, req) => {
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
  try {
    const files = req.files;
    const urls = [];
    for (const file of files) {
      const { path } = file;
      const img = await uploadCloudinary(path);
      urls.push(img.secure_url);
    }
    const addPark = await parks.create({
      name,
      description,
      location,
      country,
      city,
      parktiming: {
        start: starttime,
        end: endtime,
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
