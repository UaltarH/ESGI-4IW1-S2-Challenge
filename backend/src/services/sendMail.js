const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.USER_MAIL,
        pass: process.env.USER_MAIL_PASSWORD
    }
});

const sendMail = async (mailOptions) => {
    console.log('user env', process.env.USER_MAIL);
    console.log('user env pass', process.env.USER_MAIL_PASSWORD);
    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent');
    } catch (err) {
        console.error('Failed to send email', err);
    }
};

module.exports = sendMail;