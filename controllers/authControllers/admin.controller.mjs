import Jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import responseFunc from "../../utilis/response.mjs";
import admins from "../../models/adminsModal/admin.modal.mjs";

export const signupController = async (req, res) => {
  const { firstname, lastname, email, password } = req.body;
  if (!firstname || !lastname || !email || !password) {
    return responseFunc(res, 403, "Required parameter missing");
  }
  firstname.trim();
  lastname.trim();
  email.trim();

  password.trim();
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
      });
      const token = Jwt.sign(
        {
          firstname: result.firstname,
          lastname: result.lastname,
          email: result.email,
          role: result.role,
          _id: result._id,
        },
        process.env.SECRET,
        {
          expiresIn: "1h",
        }
      );
      res.cookie("adminToken", token, { httpOnly: true, secure: true });
      responseFunc(res, 200, "Signup Successfully", { token });
    }
  } catch (error) {
    console.log("signupError ", error);
    responseFunc(res, 400, "Something went wrong");
  }
};

export const loginController = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    responseFunc(res, 403, "Required Paramater Missing");
    return;
  }

  email.trim();
  password.trim();
  try {
    const result = await admins.findOne({
      email,
    });
    if (!result) {
      responseFunc(res, 401, "Email incorrect");
      return;
    } else {
      const isMatch = await bcrypt.compare(password, result.password);
      if (isMatch) {
        const token = Jwt.sign(
          {
            firstname: result.firstname,
            lastname: result.lastname,
            email: result.email,
            role: result.role,
            _id: result._id,
          },
          process.env.SECRET,
          {
            expiresIn: "1h",
          }
        );
        res.cookie("adminToken", token, { httpOnly: true, secure: true });
        responseFunc(res, 200, "Login Successfully", {
          token,
          // firstname: result.firstname,
          // lastname: result.lastname,
          // email: result.email,
          // role: result.role,
          // _id: result._id,
        });
        return;
      } else {
        responseFunc(res, 401, "Password incorrect");
      }
    }
  } catch (error) {
    console.log("loginError ", error);
    responseFunc(res, 400, "Something went wrong");
  }
};

export const getProfile = async (req, res) => {
  const { _id } = req.currentUser;
  try {
    const result = await admins.findOne(
      {
        _id,
      },
      { password: 0 }
    );
    console.log(result);
    if (result === null) {
      return responseFunc(res, 404, "User not found");
    }
    responseFunc(res, 200, "Profile Fetched", result);
  } catch (error) {
    console.log("profileFetchedError", error);
    responseFunc(res, 400, "Error in getting user");
  }
};
