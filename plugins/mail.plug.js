const nodemailer = require('nodemailer');
const { debug } = require('debug')('app:plugin:mail');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'dltruong.c@gmail.com',
    pass: 'ghbr67By23',
  },
});

const sendEmail = async function (to, subject, text) {
  const mailOptions = {
    from: '"Ví điện tử TDTUPay" dltruong.c@gmail.com',
    to,
    subject,
    text,
  };

  const info = await transporter.sendMail(mailOptions);

  debug(info.response);
};

module.exports.sendEmail = sendEmail;
