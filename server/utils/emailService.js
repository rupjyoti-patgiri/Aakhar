const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: process.env.EMAIL_USER, // Your Gmail address
              pass: process.env.EMAIL_PASS, // Not your Gmail password!
            }
          });
        const mailOptions = {
            from: `"Your Blog Name" <${process.env.EMAIL_FROM}>`,
            to: to,
            subject: subject,
            text: text, // plain text body
            // html: '<b>Hello world?</b>' // You can also send HTML
        };

        

        const mailresponse = await transporter.sendMail(mailOptions);

        console.log('Email sent:', mailresponse);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Email could not be sent');
    }
};

module.exports = { sendEmail };
