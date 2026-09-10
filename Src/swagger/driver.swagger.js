// driver.swagger.js

/**
 * @swagger
 * /api/v1/driver/profile:
 *   get:
 *     summary: Get driver profile
 *     tags:
 *       - Driver
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Driver profile fetched successfully
 */


/**
 * @swagger
 * /api/v1/auth/driver/profile:
 *   post:
 *     summary: Create or update driver profile
 *     tags:
 *       - Driver
 *     security:
 *       - bearerAuth: []
 *
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *
 *               firstName:
 *                 type: string
 *                 example: Johan
 *
 *               lastName:
 *                 type: string
 *                 example: Kumar
 *
 *               gender:
 *                 type: string
 *                 example: Male
 *
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *                 example: 2000-01-01
 *
 *               address:
 *                 type: string
 *                 example: Sohani Patti Buxar
 *
 *               city:
 *                 type: string
 *                 example: Buxar
 *
 *               state:
 *                 type: string
 *                 example: Bihar
 *
 *               pincode:
 *                 type: string
 *                 example: 802101
 *
 *               driverCode:
 *                 type: string
 *                 example: "10"
 *
 *               mobileNo:
 *                 type: string
 *                 example: "9874565412"
 *
 *               licenseExpiryDate:
 *                 type: string
 *                 format: date
 *                 example: 2030-01-01
 *
 *               experienceYears:
 *                 type: integer
 *                 example: 4
 *
 *               aadhaarNumber:
 *                 type: string
 *                 example: "3214547856542541"
 *
 *               alternateMobile:
 *                 type: string
 *                 example: "9875555454545"
 *
 *               drivingLicenseNo:
 *                 type: string
 *                 example: L54545LLA45
 *
 *               licenseIssueDate:
 *                 type: string
 *                 format: date
 *                 example: 2030-01-01
 *
 *               panNumber:
 *                 type: string
 *                 example: LAKDSFA4658L
 *
 *               emergencyContactName:
 *                 type: string
 *                 example: MKS
 *
 *               emergencyContactNumber:
 *                 type: string
 *                 example: "987458745"
 *
 *               licenseImage:
 *                 type: string
 *                 format: binary
 *
 *               profileImage:
 *                 type: string
 *                 format: binary
 *
 *               panCard:
 *                 type: string
 *                 format: binary
 *
 *               adharImage:
 *                 type: string
 *                 format: binary
 *
 *     responses:
 *       200:
 *         description: Driver profile updated successfully
 *
 *       400:
 *         description: Invalid request data
 *
 *       401:
 *         description: Unauthorized
 *
 *       500:
 *         description: Internal server error
 */