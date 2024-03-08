import mongoose from "mongoose";
import bcrypt from "bcrypt";

import admins from "../../models/adminsModal/admin.modal.mjs";
import users from "../../models/usersModal/users.modal.mjs";
import responseFunc from "../../utilis/response.mjs";

export const getAllUsers = async (req, res) => {
  const page = Number(req.query.page) || 1;
  const pageSize = Number(req.query.pageSize) || 10;
  const skip = (page - 1) * pageSize;
  try {
    const result = await users
      .find({ isDisable: false }, { password: 0 })
      .skip(skip)
      .limit(pageSize);
    responseFunc(res, 200, "Users", result);
  } catch (error) {
    console.log("allUsersError: ", error);
    responseFunc(res, 400, "Error in getting users");
  }
};

export const deleteUser = async (req, res) => {
  const { userId } = req.body;
  if (!mongoose.isValidObjectId(userId)) {
    return responseFunc(res, 400, "Invalid userId");
  }

  try {
    await users.updateOne(
      { _id: userId, isDisable: false },
      { $set: { isDisable: true } }
    );
    responseFunc(res, 200, "User deleted successfully");
  } catch (error) {
    console.log("deleteUserError: ", error);
    responseFunc(res, 400, "Error in Deleting user");
  }
};

export const getAllAdmins = async (req, res) => {
  const page = Number(req.query.page) || 1;
  const pageSize = Number(req.query.pageSize) || 10;
  const skip = (page - 1) * pageSize;
  try {
    const result = await admins
      .find({ isDisable: false }, { password: 0 })
      .skip(skip)
      .limit(pageSize);
    responseFunc(res, 200, "Admins", result);
  } catch (error) {
    console.log("allAdminsError: ", error);
    responseFunc(res, 400, "Error in getting admins");
  }
};

export const deleteAdmin = async (req, res) => {
  const { adminId } = req.body;
  if (!mongoose.isValidObjectId(adminId)) {
    return responseFunc(res, 400, "Invalid adminId");
  }

  try {
    await users.updateOne(
      { _id: adminId, isDisable: false },
      { $set: { isDisable: true } }
    );
    responseFunc(res, 200, "Admin deleted successfully");
  } catch (error) {
    console.log("deleteAdminError: ", error);
    responseFunc(res, 400, "Error in deleting admin");
  }
};

export const updateAdmin = async (req, res) => {
  const { adminId, password, ...updateFields } = req.body;
  if (!mongoose.isValidObjectId(adminId)) {
    return responseFunc(res, 400, "Invalid adminId");
  }

  try {
    let updatedData = {};
    Object.keys(updateFields).forEach((field) => {
      if (
        updateFields[field] !== undefined &&
        field !== adminId &&
        field !== password
      ) {
        updatedData[field] = updateFields[field];
      }
    });
    if (password) {
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);
      updatedData.password = passwordHash;
    }
    await admins.updateOne(
      { _id: adminId, isDisable: false },
      { $set: updatedData }
    );
    responseFunc(res, 200, "Admin Updated Successfully");
  } catch (error) {
    console.log("updateAdminError: ", error);
    responseFunc(res, 400, "Error in updating admin");
  }
};
