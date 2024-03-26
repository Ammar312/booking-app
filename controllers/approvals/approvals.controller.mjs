import approvals from "../../models/approvalModal/approvals.modal.mjs";
import responseFunc from "../../utilis/response.mjs";

export const allApprovals = async (req, res) => {
  const { status } = req.query;
  const page = Number(req.query.page) || 1;
  const pageSize = Number(req.query.pageSize) || 10;
  const skip = (page - 1) * pageSize;
  const filters = {};

  if (status) {
    filters.status = status;
  }
  try {
    const result = await approvals
      .find(filters, { createdAt: 0, updatedAt: 0, __v: 0 })
      .skip(skip)
      .limit(pageSize)
      .sort({ _id: -1 })
      .populate({ path: "user", select: "firstname lastname isDisable" })
      .populate({ path: "approver", select: "firstname lastname role" })
      .populate({
        path: "booking",
        populate: { path: "parkId", select: " name parktiming" },
      });

    console.log(result.length);
    responseFunc(res, 200, false, "Approvals", result);
  } catch (error) {
    console.log("allApprovalsError: ", error);
    responseFunc(res, 400, true, "Error in getting approvals");
  }
};
