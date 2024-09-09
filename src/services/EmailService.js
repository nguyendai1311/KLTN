const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const crypto = require('crypto');
const inlineBase64 = require('nodemailer-plugin-inline-base64');
const { log } = require('console');

dotenv.config();

const createTransporter = () => {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.MAIL_ACCOUNT, // your email account
      pass: process.env.MAIL_PASSWORD, // your email password
    },
  });
};

const sendEmailCreateOrder = async (email, orderItems) => {
  try {
    const transporter = createTransporter();
    transporter.use('compile', inlineBase64({ cidPrefix: 'somePrefix_' }));

    let listItem = '';
    const attachImage = [];

    orderItems.forEach((order) => {
      listItem += `
        <div>
          <p>Bạn đã đặt sản phẩm <b>${order.name}</b> với số lượng: <b>${order.amount}</b> và giá là: <b>${order.price} VND</b>.</p>
          <p>Bên dưới là hình ảnh của sản phẩm:</p>
        </div>`;
      attachImage.push({ path: order.image });
    });

    await transporter.sendMail({
      from: process.env.MAIL_ACCOUNT,
      to: email,
      subject: "Bạn đã đặt hàng tại shop",
      html: `<div><b>Bạn đã đặt hàng thành công</b></div>${listItem}`,
      attachments: attachImage,
    });

    console.log('Order confirmation email sent successfully.');
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
  }
};

const generateOtp = () => {
  return crypto.randomInt(100000, 999999).toString(); 
}

const sendOtpEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
          user: process.env.MAIL_ACCOUNT,
          pass: process.env.MAIL_PASSWORD,
      },
  });

  const mailOptions = {
      from: process.env.MAIL_ACCOUNT,
      to: email,
      subject: 'Your OTP Code',
      html: `<p>Your OTP code is: <b>${otp}</b></p>`,
    };
  console.log("otp",otp)
  await transporter.sendMail(mailOptions);
};


module.exports = {
  sendEmailCreateOrder,
  generateOtp,
  sendOtpEmail,
};
