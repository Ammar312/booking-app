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

export const createUser = async (req, res) => {
  const { firstname, lastname, email, phonenumber, password } = req.body;
  if (!firstname || !lastname || !email || !phonenumber || !password) {
    return responseFunc(res, 403, "Required parameter missing");
  }
  firstname.trim();
  lastname.trim();
  email.trim();
  phonenumber.trim();
  password.trim();
  if (!email.includes("@"))
    return responseFunc(res, 403, "Invalid Email: must contain @");
  if (password.length < 6)
    return responseFunc(res, 403, "Password must be equal and greater than 6");
  try {
    const result = await users.findOne({ email });
    if (result) {
      responseFunc(res, 403, "User already exist with this email");
    } else {
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);
      const result = await users.create({
        firstname,
        lastname,
        email,
        phonenumber,
        password: passwordHash,
      });
      responseFunc(res, 200, "User Created Successfully");
    }
  } catch (error) {
    console.log("userCreatedError ", error);
    responseFunc(res, 400, "User created error", error);
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

export const updateUser = async (req, res) => {
  const { userId, lastname, firstname, phonenumber } = req.body;
  if (!mongoose.isValidObjectId(userId)) {
    return responseFunc(res, 400, "Invalid userId");
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
    await users.updateOne(
      { _id: userId, isDisable: false },
      { $set: updatedData }
    );
    responseFunc(res, 200, "User Updated Successfully");
  } catch (error) {
    console.log("updateUserError: ", error);
    responseFunc(res, 400, "Error in updating user");
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

export const createAdmin = async (req, res) => {
  const { firstname, lastname, email, password, role } = req.body;
  if (!firstname || !lastname || !email || !password) {
    return responseFunc(res, 403, "Required parameter missing");
  }
  firstname.trim();
  lastname.trim();
  email.trim();
  password.trim();
  if (!email.includes("@"))
    return responseFunc(res, 403, "Email must contain @");
  if (password.length < 6)
    return responseFunc(res, 403, "Password must be equal and greater than 6");
  try {
    const result = await admins.findOne({ email });
    if (result) {
      responseFunc(res, 403, "User already exist with this email");
    } else {
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);
      const result = await admins.create({
        firstname,
        lastname,
        email,
        password: passwordHash,
        role,
      });

      responseFunc(res, 200, `${result.role} created successfully`);
    }
  } catch (error) {
    console.log("createAdminError ", error);
    responseFunc(res, 400, "Error in creating admin");
  }
};

export const deleteAdmin = async (req, res) => {
  const { adminId } = req.body;
  if (!mongoose.isValidObjectId(adminId)) {
    return responseFunc(res, 400, "Invalid adminId");
  }

  try {
    const result = await admins.updateOne(
      { _id: adminId, isDisable: false },
      { $set: { isDisable: true } }
    );
    responseFunc(res, 200, "Admin deleted successfully", result);
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
      if (password.length < 6) {
        return responseFunc(
          res,
          403,
          "Password must be equal and greater than 6"
        );
      }
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
