import Jwt from "jsonwebtoken";
import responseFunc from "../utilis/response.mjs";
const adminTokenVerify = (req, res, next) => {
  const token = req.headers.authorization || req.cookies.adminToken;
  if (!token) {
    return responseFunc(res, 401, "Unauthorized: No token provided");
  }

  try {
    const decoded = Jwt.verify(token, process.env.SECRET);
    req.currentAdmin = decoded;
    console.log("token verified");
    next();
  } catch (error) {
    console.log("errorabc", error);
    responseFunc(res, 401, "Unauthorized: Invalid token");
    return;
  }
};
export default adminTokenVerify;
