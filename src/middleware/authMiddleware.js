const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

const authMiddleWare = (req, res, next) => {
    const token = req.headers.token.split(' ')[1]
    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
        if (err) {
            return res.status(404).json({
                message: 'The authemtication',
                status: 'ERROR'
            })
        }
        if (user?.isAdmin) {
            next()
        } else {
            return res.status(404).json({
                message: 'The authemtication',
                status: 'ERROR'
            })
        }
    });
}

const authUserMiddleWare = (req, res, next) => {
    const token = req.headers.token.split(' ')[1]
    const userId = req.params.id
    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
        if (err) {
            return res.status(404).json({
                message: 'The authemtication',
                status: 'ERROR'
            })
        }
        if (user?.isAdmin || user?.id === userId) {
            next()
        } else {
            return res.status(404).json({
                message: 'The authemtication',
                status: 'ERROR'
            })
        }
    });
}

// const authTeacherMiddleWare = (req, res, next) => {
//     const authHeader = req.headers.authorization; // Lấy token từ header "Authorization"

//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//         return res.status(401).json({ 
//             message: "Unauthorized: No token provided", 
//             status: "ERROR" 
//         });
//     }

//     const token = authHeader.split(" ")[1]; // Lấy token sau "Bearer"

//     jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
//         if (err) {
//             return res.status(403).json({ 
//                 message: "Invalid token", 
//                 status: "ERROR" 
//             });
//         }
//         if (user?.isTeacher) {
//             next();
//         } else {
//             return res.status(403).json({ 
//                 message: "Access denied", 
//                 status: "ERROR" 
//             });
//         }
//     });
// };

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
        console.log("Decoded User:", user); // 🔥 Kiểm tra dữ liệu từ token

        if (!user || !user.id) { // 🔍 Nếu user không có `id` => lỗi
            return res.status(403).json({ message: "Token không hợp lệ" });
        }

        if (!user.isTeacher) {
            return res.status(403).json({ message: "Access denied" });
        }

        req.user = { _id: user.id, isTeacher: user.isTeacher }; // ✅ Đảm bảo gán `_id`
        next();
    });
};



module.exports = {
    authMiddleWare,
    authUserMiddleWare,
    authTeacherMiddleWare
}