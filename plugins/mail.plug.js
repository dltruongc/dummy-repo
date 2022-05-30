const nodemailer = require('nodemailer');
const { debug } = require('debug')('app:plugin:mail');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'nguyenvandiemhcmue@gmail.com',
    pass: 'Nvd09012001',
  },
});

const sendEmail = async function (to, subject, text) {
  const mailOptions = {
    from: '"Ví điện tử TDTUPay" nguyenvandiemhcmue@gmail.com',
    to,
    subject,
    text,
  };

  const info = await transporter.sendMail(mailOptions);

  debug(info.response);
};

module.exports.sendEmail = sendEmail;
