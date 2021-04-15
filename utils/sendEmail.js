const nodemailer = require("nodemailer");

module.exports = async (options) => {
    const transporter = nodemailer.createTransport({
        host: "smtp-mail.outlook.com", // hostname
        secureConnection: false, // TLS requires secureConnection to be false
        port: 587, // port for secure SMTP
        tls: {
            ciphers: "SSLv3",
        },
        auth: {
            user: process.env.USER,
            pass: process.env.PASSWORD,
        },
    });
    const mailOptions = {
        from: `Aim4HD Team <${process.env.USER}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
    };

    return await transporter.sendMail(mailOptions);
};
