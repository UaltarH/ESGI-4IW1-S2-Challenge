const nodemailer = require('nodemailer');
const ejs = require('ejs');

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
    try {
        await transporter.sendMail(mailOptions);
    } catch (err) {
        console.error('Failed to send email', err);
    }
};
const sendEmailWithTemplate = (receiver, subject, content, templatePath) => {
    ejs.renderFile(__dirname + templatePath, { receiver, content }, (err, data) => {
        if (err) {
            console.error(err);
        } else {
            const mailOptions = {
                from: {
                    name: "BoToBe Administration",
                    address: process.env.USER_MAIL,
                },
                to: receiver,
                subject: subject,
                html: data
            };
            try {
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        return console.error(error);
                    }
                });
            } catch (err) {
                console.error('Failed to send email', err);
            }

        }
    });
};


module.exports = {
    sendMail,
    sendEmailWithTemplate,
};