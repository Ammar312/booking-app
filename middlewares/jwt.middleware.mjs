import Jwt from "jsonwebtoken";
import responseFunc from "../utilis/response.mjs";
import admins from "../models/adminsModal/admin.modal.mjs";
import users from "../models/usersModal/users.modal.mjs";

const verifyToken = (allowedRoles) => async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return responseFunc(res, 401, true, "Unauthorized: No token provided");
  }

  try {
    const decoded = Jwt.verify(token, process.env.SECRET);

    if (decoded.role === "superadmin") {
      const isUser = await admins.findOne({
        _id: decoded._id,
        isDisable: false,
      });
      if (isUser) {
        req.currentUser = decoded;
        next();
        return;
      } else {
        responseFunc(res, 401, true, "Invalid User");
      }
      return;
    }

    if (allowedRoles.includes(decoded.role)) {
      const isUser =
        decoded.role === "user"
          ? await users.findOne({ _id: decoded._id, isDisable: false })
          : await admins.findOne({ _id: decoded._id, isDisable: false });
      // console.log("qwrety", isUser);
      if (isUser) {
        req.currentUser = decoded;
        next();
      } else {
        responseFunc(res, 401, true, "Invalid User");
      }
    } else {
      responseFunc(
        res,
        403,
        true,
        "Forbidden: You do not have permission to access this resource"
      );
    }

    console.log("token verified");
  } catch (error) {
    console.log("expiryError ", error);
    responseFunc(res, 401, true, "Unauthorized: Invalid token");
    return;
  }
};
export default verifyToken;
