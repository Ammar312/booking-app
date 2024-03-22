import users from "../../models/usersModal/users.modal.mjs";
import responseFunc from "../../utilis/response.mjs";

export const searchUser = async (req, res) => {
  const { user } = req.query;
  try {
    const result = await users
      .find(
        {
          $or: [
            { firstname: { $regex: `${user}`, $options: "i" } },
            { lastname: { $regex: `${user}`, $options: "i" } },
          ],
          isDisable: false,
        },
        { password: 0, updatedAt: 0, createdAt: 0, __v: 0 }
      )
      .exec();
    responseFunc(res, 200, "User fetched", result);
  } catch (error) {
    console.log("searchUsers ", error);
    responseFunc(res, 400, "Error in search users");
  }
};
