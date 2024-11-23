const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const bearer = req.headers.authorization;

    if (!bearer) {
        return res.status(401).json({
            status: 108,
            message: "Token tidak tidak valid atau kadaluwarsa",
            data: null
        });
    }
    const tokenMatch = bearer.match(/^Bearer\s+(\S+)$/);
    if (!tokenMatch) {
        return res.status(401).json({
            status: 108,
            message: "Token tidak tidak valid atau kadaluwarsa",
            data: null
        });
    }
    const token = tokenMatch[1];

    try {
        const data = jwt.verify(token, process.env.JWT_SECRET);

        req.user = data.user;

        next();
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({
                status: 108,
                message: "Token tidak tidak valid atau kadaluwarsa",
                data: null
            });
        }
        return res.status(500).json({
            code: 500,
            status: "fail",
            message: "Failed to verify token.",
            error: err.message
        });
    }
};

module.exports = authMiddleware;
