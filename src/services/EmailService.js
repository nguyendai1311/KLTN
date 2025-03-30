const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const crypto = require('crypto');
const inlineBase64 = require('nodemailer-plugin-inline-base64');

dotenv.config();

const createTransporter = () => {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.MAIL_ACCOUNT,
      pass: process.env.MAIL_PASSWORD,
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
          <p>Bạn đã mua khóa học <b>${order.name}</b> và giá là: <b>${order.price} VND</b>.</p>
          <p>Bên dưới là hình ảnh của khóa học:</p>
        </div>`;
      attachImage.push({ path: order.image });
    });

    await transporter.sendMail({
      from: process.env.MAIL_ACCOUNT,
      to: email,
      subject: "Bạn đã mua khóa học",
      html: `<div><b>Bạn đã mua khóa học thành công</b></div>${listItem}`,
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
  console.log("otp", otp)
  await transporter.sendMail(mailOptions);
};

const sendAttendanceEmails = async (attendances) => {
  const transporter = createTransporter();
  transporter.use('compile', inlineBase64({ cidPrefix: 'somePrefix_' }));
  
  for (const attendance of attendances) {
    const { student, status } = attendance;
    if (!student || !student.email) {
      console.warn(`⚠️ Không có email phụ huynh cho học sinh ${student?.name}`);
      continue;
    }
    const mailOptions = {
      from: process.env.MAIL_ACCOUNT,
      to: student.email,
      subject: `Thông báo điểm danh của ${student.name}`,
      html: `
              <p>Xin chào quý phụ huynh,</p>
              <p>Học sinh <b>${student.name}</b> đã được điểm danh.</p>
              <p>Trạng thái: <b style="color: ${status === 'present' ? 'green' : 'red'};">
                  ${status === 'present' ? 'Có mặt' : 'Vắng mặt'}
              </b></p>
              <p>Trân trọng,</p>
              <p>Nhà trường</p>
          `
    };
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log(`📩 Email điểm danh đã gửi đến ${student.email}:`, info.response);
    } catch (error) {
      console.error(`❌ Lỗi gửi email cho ${student.email}:`, error.message);
    }
  }
};



module.exports = {
  sendEmailCreateOrder,
  generateOtp,
  sendOtpEmail,
  sendAttendanceEmails
};
