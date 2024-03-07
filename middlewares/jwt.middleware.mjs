import Jwt from "jsonwebtoken";
import responseFunc from "../utilis/response.mjs";
import admins from "../models/adminsModal/admin.modal.mjs";
import users from "../models/usersModal/users.modal.mjs";

const verifyToken = (role) => async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  console.log("header", req.headers);
  if (!token) {
    return responseFunc(res, 401, "Unauthorized: No token provided");
  }

  try {
    const decoded = Jwt.verify(token, process.env.SECRET);

    if (role === "admin") {
      const isUser = await admins.findById(decoded._id);
      if (isUser) {
        req.currentUser = decoded;
        next();
      } else {
        responseFunc(res, 401, "Only Admin can access this");
      }
    } else {
      const isUser = await users.findById(decoded._id);
      if (isUser) {
        req.currentUser = decoded;
        next();
      } else {
        responseFunc(res, 401, "Invalid User");
      }
    }

    console.log("token verified");
  } catch (error) {
    console.log("expiryError ", error);
    responseFunc(res, 401, "Unauthorized: Invalid token");
    return;
  }
};
export default verifyToken;
