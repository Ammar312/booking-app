import Jwt from "jsonwebtoken";
import responseFunc from "../utilis/response.mjs";
const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  console.log("header", req.headers);
  console.log("header.authorization", req.headers.authorization);
  if (!token) {
    return responseFunc(res, 401, "Unauthorized: No token provided");
  }

  try {
    const decoded = Jwt.verify(token, process.env.SECRET);
    req.currentUser = decoded;
    console.log("token verified");
    next();
  } catch (error) {
    console.log("expiryError ", error);
    responseFunc(res, 401, "Unauthorized: Invalid token");
    return;
  }
};
export default verifyToken;
