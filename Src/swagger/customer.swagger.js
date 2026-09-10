/**
 * @swagger
 * /api/v1/customer/profile:
 *   get:
 *     summary: Get user profile
 *     tags:
 *       - Customer
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Customer profile fetched successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */