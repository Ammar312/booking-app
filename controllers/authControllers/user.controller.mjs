import Jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import responseFunc from "../../utilis/response.mjs";
import users from "../../models/usersModal/users.modal.mjs";
import { sendResetPasswordEmail } from "../../utilis/nodemailer.mjs";

export const signupController = async (req, res) => {
  const { firstname, lastname, email, phonenumber, password } = req.body;
  if (!firstname || !lastname || !email || !phonenumber || !password) {
    return responseFunc(res, 403, true, "Required parameter missing");
  }
  firstname.trim();
  lastname.trim();
  email.trim();
  phonenumber.trim();
  password.trim();
  if (!email.includes("@"))
    return responseFunc(res, 403, true, "Invalid Email: must contain @");
  if (password.length < 6)
    return responseFunc(
      res,
      403,
      true,
      "Password must be equal and greater than 6"
    );
  // Phone number validation
  const phoneRegex = /^0[0-9]{10}$/;
  if (!phoneRegex.test(phonenumber)) {
    if (!/^\d+$/.test(phonenumber)) {
      return responseFunc(
        res,
        403,
        true,
        "Phone Number must contain only digits"
      );
    } else if (phonenumber.length !== 11) {
      return responseFunc(
        res,
        403,
        true,
        "Phone Number must be exactly 11 digits"
      );
    } else if (phonenumber.charAt(0) !== "0") {
      return responseFunc(res, 403, true, "Phone Number must start with '0'");
    }
  }
  try {
    const result = await users.findOne({ email });
    if (result) {
      responseFunc(res, 403, true, "User already exist with this email");
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
      const token = Jwt.sign(
        {
          firstname: result.firstname,
          lastname: result.lastname,
          email: result.email,
          phonenumber: result.phonenumber,
          _id: result._id,
          role: "user",
        },
        process.env.SECRET,
        {
          expiresIn: "24h",
        }
      );
      res.cookie("token", token, { httpOnly: true, secure: true });
      responseFunc(res, 200, false, "Signup Successfully", { token });
    }
  } catch (error) {
    console.log("signupError ", error);
    responseFunc(res, 400, true, "Something went wrong", error);
  }
};

export const loginController = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    responseFunc(res, 403, true, "Required Paramater Missing");
    return;
  }

  email.trim();
  password.trim();
  try {
    const result = await users.findOne({
      email,
      isDisable: false,
    });
    if (!result) {
      responseFunc(res, 401, true, "Email incorrect");
      return;
    } else {
      const isMatch = await bcrypt.compare(password, result.password);
      if (isMatch) {
        const token = Jwt.sign(
          {
            firstname: result.firstname,
            lastname: result.lastname,
            email: result.email,
            phonenumber: result.phonenumber,
            _id: result._id,
            role: "user",
          },
          process.env.SECRET,
          {
            expiresIn: "24h",
          }
        );
        res.cookie("token", token, { httpOnly: true, secure: true });
        responseFunc(res, 200, false, "Login Successfully", {
          token,
          // firstname: result.firstname,
          // lastname: result.lastname,
          // email: result.email,
          // phonenumber: result.phonenumber,
          // avatar: result.avatar,
          // _id: result._id,
        });
        return;
      } else {
        responseFunc(res, 401, true, "Password incorrect");
      }
    }
  } catch (error) {
    console.log("loginError ", error);
    responseFunc(res, 400, true, "Something went wrong", error);
  }
};

export const getProfile = async (req, res) => {
  const { _id } = req.currentUser;
  try {
    const result = await users.findOne(
      {
        _id,
        isDisable: false,
      },
      { password: 0 }
    );
    console.log(result);
    if (result === null) {
      return responseFunc(res, 404, true, "User not found");
    }
    responseFunc(res, 200, false, "Profile Fetched", result);
  } catch (error) {
    console.log("profileFetchedError", error);
    responseFunc(res, 400, true, "Error in getting user", error);
  }
};

export const forgotPasswordController = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await users.findOne({ email, isDisable: false });
    if (!user) {
      return responseFunc(res, 404, true, "User Not found");
    }
    const token = generateToken(email);
    sendResetPasswordEmail(email, token);
    responseFunc(res, 200, false, "Password reset link sent successfully");
  } catch (error) {
    console.log("forgotPasswordError", error);
    responseFunc(res, 400, true, "Error in forgot password", error);
  }
};

const generateToken = (email) => {
  return Jwt.sign({ email }, process.env.RESET_PASSWORD_KEY, {
    expiresIn: "3m",
  });
};

export const resetPasswordView = async (req, res) => {
  const { token } = req.query;
  res.render("resetpassword", { token });
};

export const resetPasswordController = async (req, res) => {
  const { token } = req.query;
  const { newPassword, confirmPassword } = req.body;
  if (!newPassword || !confirmPassword) {
    return responseFunc(res, 403, true, "Required parameter missing");
  }
  try {
    const decode = Jwt.verify(token, process.env.RESET_PASSWORD_KEY);
    if (!decode) return responseFunc(res, 403, true, "Token Expired");
    if (newPassword !== confirmPassword)
      return responseFunc(res, 403, true, "Password must be same");
    if (confirmPassword.length < 6)
      return responseFunc(
        res,
        403,
        true,
        "Password must be equal and greater than 6"
      );
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(confirmPassword, saltRounds);
    const resetPassword = await users.updateOne(
      { email: decode.email, isDisable: false },
      { $set: { password: passwordHash } }
    );
    responseFunc(res, 200, false, "Password Reset Successfully");
  } catch (error) {
    console.log("ErrorResetPassword", error);
    responseFunc(res, 400, true, "Error in Reset password", { error });
  }
};
