const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).send("Token is required");
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).send("Invalid token format");
        }

        const decoded = await jwt.verify(
            token,
            process.env.JWT_SECRET
        );


        req.user = decoded;

        next();

    } catch (error) {
        return res.status(401).send({
            message: "Invalid or expired token"
        });
    }
};

module.exports = authMiddleware;