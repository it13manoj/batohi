const multer = require("multer");
const fs = require("fs");
const path = require("path");


// =====================================================
// STORAGE
// =====================================================

const storage = multer.diskStorage({

    // ---------------- DESTINATION ----------------

    destination: function (req, file, cb) {

        try {

            const userId = req.user.id;
            const userType = req.user.type;

            let uploadDir;

            // Profile Image
            if (file.fieldname === "profileImage") {

                uploadDir = path.join(
                    __dirname,
                    `../uploads/images/${userType}/${userId}/profile`
                );

            }

            // Aadhar Image
            else if (file.fieldname === "adharImage") {

                uploadDir = path.join(
                    __dirname,
                    `../uploads/images/${userType}/${userId}/adharCard`
                );

            }

            // PAN Card
            else if (file.fieldname === "panCard") {

                uploadDir = path.join(
                    __dirname,
                    `../uploads/images/${userType}/${userId}/panCard`
                );

            } else if (file.fieldname === "licenseImage") {

                uploadDir = path.join(
                    __dirname,
                    `../uploads/images/${userType}/${userId}/licenseImage`
                );

            }

            // Invalid field
            else {

                return cb(
                    new Error(`Invalid file field: ${file.fieldname}`),
                    null
                );
            }


            // Create folder if not exists
            if (!fs.existsSync(uploadDir)) {

                fs.mkdirSync(uploadDir, {
                    recursive: true,
                    mode: 0o755
                });

            }

            cb(null, uploadDir);

        } catch (error) {

            cb(error, null);

        }
    },


    // ---------------- FILE NAME ----------------

    filename: function (req, file, cb) {

        try {

            const ext = path.extname(file.originalname);

            let fileName;

            // Profile Image
            if (file.fieldname === "profileImage") {

                fileName = `profile_${Date.now()}${ext}`;

            }

            // Aadhar
            else if (file.fieldname === "adharImage") {

                fileName = `adhar_${Date.now()}${ext}`;

            }

            // PAN
            else if (file.fieldname === "licenseImage") {

                fileName = `pan_${Date.now()}${ext}`;

            }

            else if (file.fieldname === "panCard") {

                fileName = `pan_${Date.now()}${ext}`;

            }

            else {

                return cb(
                    new Error(`Invalid file field: ${file.fieldname}`),
                    null
                );

            }

            cb(null, fileName);

        } catch (error) {

            cb(error, null);

        }
    }

});


// =====================================================
// MULTER
// =====================================================

const upload = multer({

    storage: storage,

    limits: {
        fileSize: 5 * 1024 * 1024
    }

});


// =====================================================
// EXPORT
// =====================================================

module.exports = {
    upload
};