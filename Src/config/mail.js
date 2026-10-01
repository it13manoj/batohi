const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,

    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    },

    tls: {
        rejectUnauthorized: false
    }
});

console.log("SMTP HOST:", "smtp-relay.brevo.com");
console.log("SMTP PORT:", 587);
console.log("SMTP USER:", process.env.SMTP_USER);

transporter.verify((error, success) => {
    if (error) {
        console.log("❌ SMTP ERROR");
        console.log(error);
    } else {
        console.log("✅ BREVO SMTP SERVER READY");
    }
});

module.exports = transporter;