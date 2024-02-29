import Jwt from "jsonwebtoken";
const jwtMiddleware = (req, res, next) => {
  const token = req.cookies.token;
  console.log(req.cookies);
  try {
    const decoded = Jwt.verify(token, process.env.SECRET);

    req.currentUser = decoded;
    //  {
    //   username: decoded.username,
    //   email: decoded.email,
    //   _id: decoded._id,
    // };
    console.log("token verified");
    next();
  } catch (error) {
    console.log("errorabc", error);
    res.status(401).send({ message: "Unauthorized" });
    return;
  }
};
export default jwtMiddleware;
