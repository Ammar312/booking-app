import approvals from "../../models/approvalModal/approvals.modal.mjs";
import responseFunc from "../../utilis/response.mjs";

export const allApprovals = async (req, res) => {
  const { status, date } = req.query;
  const page = Number(req.query.page) || 1;
  const pageSize = Number(req.query.pageSize) || 10;
  const skip = (page - 1) * pageSize;
  const filters = {};

  if (status) {
    filters.status = status;
  }
  try {
    const result = await approvals.find(filters).skip(skip).limit(pageSize);
    responseFunc(res, 200, "Approvals");
  } catch (error) {
    responseFunc(res, 400, "Error in getting approvals");
  }
};
