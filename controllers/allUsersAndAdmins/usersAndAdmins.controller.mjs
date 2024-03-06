import admins from "../../models/adminsModal/admin.modal.mjs";
import users from "../../models/usersModal/users.modal.mjs";
import responseFunc from "../../utilis/response.mjs";

export const getAllUsers = async (req, res) => {
  const page = Number(req.query.page) || 1;
  const pageSize = Number(req.query.pageSize) || 10;
  const skip = (page - 1) * pageSize;
  try {
    const result = await users
      .find({}, { password: 0 })
      .skip(skip)
      .limit(pageSize);
    responseFunc(res, 200, "Users", result);
  } catch (error) {
    console.log("allUsersError: ", error);
    responseFunc(res, 400, "Error in getting users");
  }
};
export const getAllAdmins = async (req, res) => {
  const page = Number(req.query.page) || 1;
  const pageSize = Number(req.query.pageSize) || 10;
  const skip = (page - 1) * pageSize;
  try {
    const result = await admins
      .find({}, { password: 0 })
      .skip(skip)
      .limit(pageSize);
    responseFunc(res, 200, "Admins", result);
  } catch (error) {
    console.log("allAdminsError: ", error);
    responseFunc(res, 400, "Error in getting admins");
  }
};
