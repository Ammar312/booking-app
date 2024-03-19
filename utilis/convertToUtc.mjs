import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
dayjs.extend(utc);

const convertToUTCAndFormat = (date) => {
  const utcHours = dayjs(date).utc().hour();
  const utcMinutes = dayjs(date).utc().minute();
  const utcDate = dayjs
    .utc(`1970-01-01T${utcHours}:${utcMinutes}:00`)
    .format("YYYY-MM-DDTHH:mm:00");
  return utcDate;
};
export default convertToUTCAndFormat;
