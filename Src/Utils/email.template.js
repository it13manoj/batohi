const registrationTemplate = (username) => {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Batohi Drive</title>
</head>

<body style="
    margin:0;
    padding:0;
    background:#f4f6f8;
    font-family:Arial, Helvetica, sans-serif;
">

<table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
        <td align="center" style="padding:30px 10px;">

            <!-- MAIN CONTAINER -->
            <table
                width="600"
                cellpadding="0"
                cellspacing="0"
                border="0"
                style="
                    max-width:600px;
                    width:100%;
                    background:#ffffff;
                    border-radius:12px;
                    overflow:hidden;
                "
            >

                <!-- HEADER -->
                <tr>
                    <td
                        align="center"
                        style="
                            padding:25px 20px 20px;
                            background:#ffffff;
                        "
                    >

                        <img
                            src="cid:batohi-logo"
                            alt="Batohi Drive"
                            width="220"
                            style="
                                display:block;
                                width:220px;
                                max-width:90%;
                                height:auto;
                                margin:auto;
                            "
                        >

                    </td>
                </tr>


                <!-- BLUE/ORANGE LINE -->
                <tr>
                    <td style="
                        height:5px;
                        background:linear-gradient(
                            90deg,
                            #1769ff 50%,
                            #ff5a00 50%
                        );
                    ">
                    </td>
                </tr>


                <!-- CONTENT -->
                <tr>
                    <td
                        style="
                            padding:40px 35px;
                            color:#172a45;
                        "
                    >

                        <h1 style="
                            margin:0 0 20px;
                            font-size:26px;
                            color:#172a45;
                        ">
                            Welcome, ${username}! 👋
                        </h1>


                        <p style="
                            margin:0 0 18px;
                            font-size:16px;
                            line-height:1.7;
                            color:#444444;
                        ">
                            Welcome to <strong>Batohi Drive</strong>.
                            Your account has been created successfully.
                        </p>


                        <p style="
                            margin:0 0 25px;
                            font-size:16px;
                            line-height:1.7;
                            color:#444444;
                        ">
                            We're excited to have you with us.
                            You can now enjoy a smooth and convenient
                            ride experience with Batohi Drive.
                        </p>


                        <!-- INFO BOX -->
                        <table
                            width="100%"
                            cellpadding="0"
                            cellspacing="0"
                            border="0"
                            style="
                                background:#ffffff;
                                border-radius:8px;
                                over-flow:hidden;
                            "
                        >
                            <tr>
                                <td style="padding:22px;">

                                    <p style="
                                        margin:0 0 8px;
                                        font-size:16px;
                                        color:#172a45;
                                    ">
                                        <strong>Account Created Successfully ✓</strong>
                                    </p>

                                    <p style="
                                        margin:0;
                                        font-size:14px;
                                        line-height:1.6;
                                        color:#555555;
                                    ">
                                        Your Batohi Drive account is ready
                                        to use.
                                    </p>

                                </td>
                            </tr>
                        </table>


                        <p style="
                            margin:30px 0 0;
                            font-size:15px;
                            line-height:1.6;
                            color:#555555;
                        ">
                            Thank you for choosing
                            <strong>Batohi Drive</strong>.
                        </p>

                    </td>
                </tr>


                <!-- FOOTER -->
                <tr>
                    <td
                        align="center"
                        style="
                            background:#172a45;
                            padding:28px 20px;
                            color:;
                        "
                    >

                        <p style="
                            margin:0 0 8px;
                            font-size:16px;
                            font-weight:bold;
                        ">
                            Batohi Drive
                        </p>

                        <p style="
                            margin:0 0 15px;
                            font-size:13px;
                            color:#d9e0ea;
                        ">
                            Every Path. Every Journey.
                        </p>

                        <p style="
                            margin:0;
                            font-size:12px;
                            color:#aeb9c8;
                        ">
                            © 2026 Batohi Drive. All rights reserved.
                        </p>

                    </td>
                </tr>

            </table>

        </td>
    </tr>
</table>

</body>
</html>
`;
};

// ================= OTP TEMPLATE =================

const otpTemplate = (username, otp) => {
    return `
    <!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>

<body style="
    margin:0;
    padding:0;
    background:#f4f6f8;
    font-family:Arial, Helvetica, sans-serif;
">

<table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
        <td align="center" style="padding:30px 10px;">

            <!-- Main Card -->
            <table width="600" cellpadding="0" cellspacing="0" border="0"
                style="
                    max-width:600px;
                    width:100%;
                    background:#ffffff;
                    border-radius:12px;
                    overflow:hidden;
                ">

                <!-- Logo -->
                <tr>
                    <td align="center" style="padding:25px 20px 20px;">
                        <img
                            src="cid:batohi-logo"
                            alt="Batohi Drive"
                            width="220"
                            style="
                                display:block;
                                width:220px;
                                max-width:90%;
                                height:auto;
                                margin:auto;
                            "
                        >
                    </td>
                </tr>

                <!-- Line -->
                <tr>
                    <td style="height:5px;background:#1769ff;"></td>
                </tr>

                <!-- Body -->
                <tr>
                    <td style="padding:40px 35px;color:#172a45;">

                        <h1 style="
                            margin:0 0 20px;
                            font-size:26px;
                            color:#172a45;
                        ">
                            Login Verification 🔐
                        </h1>

                        <p style="
                            margin:0 0 15px;
                            font-size:16px;
                            line-height:1.6;
                            color:#444444;
                        ">
                            Hello <strong>${username}</strong>,
                        </p>

                        <p style="
                            margin:0 0 25px;
                            font-size:16px;
                            line-height:1.6;
                            color:#444444;
                        ">
                            Use the following OTP to complete your
                            Batohi Drive login:
                        </p>

                        <!-- OTP Box -->
                        <table width="100%" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                                <td align="center"
                                    style="
                                        background:#f4f8ff;
                                        border-radius:10px;
                                        padding:25px;
                                    ">

                                    <p style="
                                        margin:0 0 10px;
                                        font-size:13px;
                                        color:#666666;
                                    ">
                                        YOUR OTP
                                    </p>

                                    <p style="
                                        margin:0;
                                        font-size:34px;
                                        font-weight:bold;
                                        letter-spacing:8px;
                                        color:#1769ff;
                                    ">
                                        ${otp}
                                    </p>

                                </td>
                            </tr>
                        </table>

                        <p style="
                            margin:25px 0 10px;
                            font-size:14px;
                            color:#555555;
                            line-height:1.6;
                        ">
                            This OTP is valid for <strong>5 minutes</strong>.
                        </p>

                        <p style="
                            margin:0;
                            font-size:14px;
                            color:#777777;
                            line-height:1.6;
                        ">
                            If you did not request this login, please ignore
                            this email.
                        </p>

                    </td>
                </tr>

                <!-- Footer -->
                <tr>
                    <td align="center"
                        style="
                            background:#172a45;
                            padding:28px 20px;
                            color:#ffffff;
                        ">

                        <p style="
                            margin:0 0 8px;
                            font-size:16px;
                            font-weight:bold;
                        ">
                            Batohi Drive
                        </p>

                        <p style="
                            margin:0 0 15px;
                            font-size:13px;
                            color:#d9e0ea;
                        ">
                            Every Path. Every Journey.
                        </p>

                        <p style="
                            margin:0;
                            font-size:12px;
                            color:#aeb9c8;
                        ">
                            © 2026 Batohi Drive. All rights reserved.
                        </p>

                    </td>
                </tr>

            </table>

        </td>
    </tr>
</table>

</body>
</html>
`;
};

module.exports = {
    registrationTemplate,
    otpTemplate
}

