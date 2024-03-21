import exceljs from "exceljs";
import bookedparks from "../../models/bookedParks/bookedPark.modal.mjs";
import responseFunc from "../../utilis/response.mjs";
import dayjs from "dayjs";

export const bookingExcelFile = async (req, res) => {
  const workBook = new exceljs.Workbook();
  const workSheet = workBook.addWorksheet("Bookings");
  const path = "./files";
  try {
    const bookings = await bookedparks
      .find({}, { __v: 0, updatedAt: 0, _id: 0 })
      .populate({ path: "userId", select: "firstname lastname" })
      .populate({ path: "parkId", select: "name" });
    console.log("bookings ", bookings);
    workSheet.columns = [
      { header: "S no.", key: "s_no", width: 10 },
      //   { header: "User", key: "userId", width: 20 },
      { header: "First Name", key: "firstName", width: 15 },
      { header: "Last Name", key: "lastName", width: 15 },
      { header: "Park", key: "parkName", width: 15 },
      //   { header: "Park", key: "parkId", width: 20 },
      { header: "Date", key: "date", width: 15 },
      { header: "Start Time", key: "startTime", width: 15 },
      { header: "End Time", key: "endTime", width: 15 },
      { header: "Cost", key: "totalCost", width: 10 },
      { header: "Advanced", key: "advancePayment", width: 10 },
      { header: "Guests", key: "totalPeoples", width: 10 },
      { header: "Status", key: "status", width: 10 },
      { header: "Created", key: "createdAt", width: 20 },
    ];
    let counter = 1;
    bookings.forEach((booking) => {
      const row = {
        s_no: counter,
        firstName: booking.userId.firstname,
        lastName: booking.userId.lastname,
        parkName: booking.parkId.name,
        date: booking.date,
        startTime: dayjs(booking.startTime).format("HH:mm"),
        endTime: dayjs(booking.endTime).format("HH:mm"),
        totalCost: booking.totalCost,
        advancePayment: booking.advancePayment,
        totalPeoples: booking.totalPeoples,
        status: booking.status,
        createdAt: booking.createdAt,
      };
      booking.s_no = counter;
      workSheet.addRow(row);
      counter++;
    });
    // Making first line in excel bold
    workSheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
    });
    const data = await workBook.xlsx
      .writeFile(`${path}/bookings.xlsx`)
      .then(() => {
        responseFunc(
          res,
          200,
          "File created successfully",
          `${path}/bookings.xlsx`
        );
      });
    console.log("data", data);
  } catch (error) {
    console.log("errorBookingFile", error);
    responseFunc(res, 400, "Error in Excel file");
  }
};
