export const responseFunc = (
  res,
  stat,
  err = false,
  msg,
  data,
  expired = false
) => {
  const status = Number(stat);
  if (!data) {
    return res
      .status(status)
      .send({ error: err, isExpired: expired, message: msg });
  }
  return res
    .status(status)
    .send({ error: err, isExpired: expired, message: msg, data: data });
};
export default responseFunc;
