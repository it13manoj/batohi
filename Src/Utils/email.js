
const nodemailer = require("nodemailer");
const path = require("path");

const {
    registrationTemplate
} = require("./email.template");


// ========================================
// SMTP TRANSPORTER
// ========================================

const transporter = nodemailer.createTransport({

    host: "smtp.gmail.com",

    port: 465,

    secure: true,

    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },

    tls: {
        rejectUnauthorized: false
    }

});


// ========================================
// SMTP CONNECTION TEST
// ========================================

transporter.verify((error, success) => {

    if (error) {

        console.log("❌ SMTP CONNECTION FAILED:");
        console.log(error);

    } else {

        console.log("✅ SMTP SERVER READY");

    }

});


// ========================================
// REGISTRATION EMAIL
// ========================================

exports.sendRegistrationEmail = async (to, username) => {

    try {

        // Actual logo location:
        // Src/public/images/logo.jpeg

        const logoPath = path.resolve(
            process.cwd(),
            "Src",
            "public",
            "images",
            "logo.jpeg"
        );


        console.log("LOGO PATH:", logoPath);


        const info = await transporter.sendMail({

            from: `"Batohi Drive" <${process.env.EMAIL_USER}>`,

            to: to,

            subject: "Welcome to Batohi Drive 🚗",

            html: registrationTemplate(username),

            attachments: [
                {
                    filename: "batohi-logo.jpeg",

                    path: logoPath,

                    cid: "batohi-logo"
                }
            ]

        });


        console.log("✅ REGISTRATION EMAIL SENT");

        console.log(
            "Message ID:",
            info.messageId
        );


        return info;

    } catch (error) {

        console.error(
            "❌ REGISTRATION EMAIL ERROR:",
            error.message
        );

        throw error;

    }

};


// ========================================
// OTP EMAIL
// ========================================

exports.sendOtpEmail = async (to, username, otp) => {

    try {

        // Actual logo location:
        // Src/public/images/logo.jpeg

        const logoPath = path.resolve(
            process.cwd(),
            "Src",
            "public",
            "images",
            "logo.jpeg"
        );


        console.log("OTP LOGO PATH:", logoPath);


        const info = await transporter.sendMail({

            from: `"Batohi Driver" <${process.env.EMAIL_USER}>`,

            to: to,

            subject: "Your Login OTP - Batohi Driver",

            html: `
                <div style="
                    font-family: Arial, sans-serif;
                    padding: 30px;
                    background: #f4f6f8;
                ">

                    <div style="
                        max-width: 600px;
                        margin: auto;
                        background: white;
                        padding: 30px;
                        border-radius: 10px;
                    ">

                        <!-- LOGO -->

                        <div style="
                            text-align: center;
                        ">

                            <img
                                src="cid:batohi-logo"
                                alt="Batohi Driver"
                                width="220"
                                style="
                                    display: block;
                                    width: 220px;
                                    max-width: 90%;
                                    height: auto;
                                    margin: auto;
                                "
                            >

                        </div>


                        <!-- LINE -->

                        <hr style="
                            border: 0;
                            border-top: 4px solid #1769ff;
                        ">


                        <!-- TITLE -->

                        <h2 style="
                            color: #172a45;
                        ">
                            Login Verification 🔐
                        </h2>


                        <!-- USER -->

                        <p>
                            Hello
                            <strong>${username}</strong>,
                        </p>


                        <p>
                            Your login OTP for Batohi Driver is:
                        </p>


                        <!-- OTP BOX -->

                        <div style="
                            background: #f4f8ff;
                            padding: 20px;
                            text-align: center;
                            border-radius: 8px;
                        ">

                            <p style="
                                margin: 0;
                                color: #666;
                            ">
                                YOUR OTP
                            </p>


                            <h1 style="
                                margin: 10px 0 0;
                                color: #1769ff;
                                letter-spacing: 8px;
                            ">
                                ${otp}
                            </h1>

                        </div>


                        <!-- EXPIRY -->

                        <p>
                            This OTP is valid for
                            <strong>5 minutes</strong>.
                        </p>


                        <!-- SECURITY -->

                        <p style="
                            color: #777;
                        ">
                            If you did not request this login,
                            please ignore this email.
                        </p>


                        <br>


                        <!-- FOOTER -->

                        <b>
                            Batohi Driver Team
                        </b>

                    </div>

                </div>
            `,

            attachments: [
                {
                    filename: "batohi-logo.jpeg",

                    path: logoPath,

                    cid: "batohi-logo"
                }
            ]

        });


        console.log(
            "✅ OTP EMAIL SENT:",
            info.messageId
        );


        return info;

    } catch (error) {

        console.error(
            "❌ OTP EMAIL ERROR:",
            error.message
        );

        throw error;

    }

};
