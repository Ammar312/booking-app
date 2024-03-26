export const responseFunc = (res, stat, err = false, msg, data) => {
  const status = Number(stat);
  if (!data) {
    return res.status(status).send({ error: err, message: msg });
  }
  return res.status(status).send({ error: err, message: msg, data: data });
};
export default responseFunc;
