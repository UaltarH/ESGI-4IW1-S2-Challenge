const nodemailer = require('nodemailer');
const puppeteer = require('puppeteer');

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
        console.log('Email sent');
    } catch (err) {
        console.error('Failed to send email', err);
    }
};


const generatePdfAndSendMail = async (htmlContent, recipientEmail) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({ format: 'A4' });

    await browser.close();

    const mailOptions = {
        from: {
            name: 'BoxToBe Administration',
            address: process.env.USER_MAIL
        },
        to: recipientEmail,
        subject: 'Test email with PDF attachment',
        text: 'This is a test email with a PDF attachment',
        attachments: [
            {
                filename: 'test.pdf',
                content: pdfBuffer
            }
        ]
    };

    await sendMail(mailOptions);
};

module.exports = {
    sendMail,
    generatePdfAndSendMail
};