import nodemailer from "nodemailer";
const sendResetPasswordEmail = (email, token) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.YOUR_EMAIL,
      pass: process.env.APP_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.YOUR_EMAIL,
    to: email,
    subject: "Password Reset",
    html: `<p><a href="http://localhost:5000/api/v1/user/view/resetpassword?token=${token}">Click here</a> to reset your password.</p>`,
  };
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log("Error sending email: ", err);
    } else {
      console.log("Email sent: ", info.response);
    }
  });
};
export default sendResetPasswordEmail;
