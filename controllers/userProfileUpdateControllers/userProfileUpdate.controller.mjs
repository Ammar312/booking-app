import mongoose from "mongoose";
import users from "../../models/usersModal/users.modal.mjs";
import responseFunc from "../../utilis/response.mjs";
import {
  uploadCloudinary,
  deleteImgCloudinary,
} from "../../utilis/cloudinary.mjs";

export const updateUserProfile = async (req, res) => {
  const { _id } = req.currentUser;
  const { lastname, firstname, phonenumber } = req.body;
  if (!mongoose.isValidObjectId(_id)) {
    return responseFunc(res, 400, "Invalid userId");
  }
  const user = await users.findOne({ _id, isDisable: false });
  if (!user) {
    return responseFunc(res, 404, "User Not Found");
  }
  try {
    let updatedData = {};
    if (firstname) {
      updatedData.firstname = firstname;
    }
    if (lastname) {
      updatedData.lastname = lastname;
    }
    if (phonenumber) {
      updatedData.phonenumber = phonenumber;
    }
    await users.updateOne({ _id, isDisable: false }, { $set: updatedData });
    responseFunc(res, 200, "User Updated Successfully");
  } catch (error) {
    console.log("updateUserError: ", error);
    responseFunc(res, 400, "Error in updating user");
  }
};

export const updateUserAvatar = async (req, res) => {
  const { _id } = req.currentUser;
  if (!mongoose.isValidObjectId(_id)) {
    return responseFunc(res, 400, "Invalid userId");
  }
  try {
    const user = await users.findOne({ _id, isDisable: false });
    if (!user) {
      return responseFunc(res, 404, "User Not Found");
    }
    const currentAvatar = user.avatar;
    console.log("file ", req.file);
    const { buffer } = req.file;
    const avatar = await uploadCloudinary(buffer);
    console.log("avatar ", avatar);
    const result = await users.updateOne(
      { _id, isDisable: false },
      {
        $set: {
          avatar: {
            url: avatar.secure_url,
            publicId: avatar.public_id,
          },
        },
      }
    );
    if (currentAvatar && currentAvatar.publicId) {
      await deleteImgCloudinary(currentAvatar.publicId);
    }
    responseFunc(res, 200, "Avatar Updated");
  } catch (error) {
    console.log("userAvatarError: ", error);
    responseFunc(res, 400, "Error in updating user avatar");
  }
};
