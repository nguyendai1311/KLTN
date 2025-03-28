const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

const authMiddleWare = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Missing or invalid token format", status: "ERROR" });
        }

        const token = authHeader.split(" ")[1];

        jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
            if (err) {
                return res.status(403).json({ message: "Invalid token", status: "ERROR" });
            }

            if (!user || user.isAdmin !== true) {
                return res.status(403).json({ message: "Access denied. Admins only!", status: "ERROR" });
            }

            req.user = user;
            next();
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", status: "ERROR" });
    }
};

const authTeacherMiddleWare = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Invalid token" });
        }

        if (!user || !user.id) { // 🔍 Nếu user không có `id` => lỗi
            return res.status(403).json({ message: "Token không hợp lệ" });
        }

        if (!user.isAdmin && !user.isTeacher) {
            return res.status(403).json({ message: "Access denied. Admin or Teacher required." });
        }

        req.user = { _id: user.id, isTeacher: user.isTeacher, isAdmin: user.isAdmin }; // ✅ Gán thông tin user vào request
        next();
    });
};

module.exports = {
    authMiddleWare,
    authTeacherMiddleWare
}