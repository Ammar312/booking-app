import Jwt from "jsonwebtoken";
import responseFunc from "../utilis/response.mjs";
import admins from "../models/adminsModal/admin.modal.mjs";
import users from "../models/usersModal/users.modal.mjs";

const verifyToken = (role, allowedRoles) => async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  console.log("header", req.headers);
  if (!token) {
    return responseFunc(res, 401, "Unauthorized: No token provided");
  }

  try {
    const decoded = Jwt.verify(token, process.env.SECRET);

    if (allowedRoles.includes(decoded.role)) {
      const isUser =
        role === "admin"
          ? await admins.findById(decoded._id)
          : await users.findById(decoded._id);
      console.log("qwrety", isUser);
      if (isUser) {
        req.currentUser = decoded;
        next();
      } else {
        responseFunc(res, 401, "Invalid User");
      }
    } else {
      responseFunc(
        res,
        403,
        "Forbidden: You do not have permission to access this resource"
      );
    }

    console.log("token verified");
  } catch (error) {
    console.log("expiryError ", error);
    responseFunc(res, 401, "Unauthorized: Invalid token");
    return;
  }
};
export default verifyToken;
