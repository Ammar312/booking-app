import users from "../../models/usersModal/users.modal.mjs";

export const getProfile = async (req, res) => {
  const { _id } = req.currentUser;
  try {
    const result = await users.findOne({
      _id,
    });
    responseFunc(res, 200, "Profile Fetched", result);
  } catch (error) {
    console.log("profileFetchedError", error);
  }
};
