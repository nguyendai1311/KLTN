const express = require("express");
const router = express.Router();
const Attendance = require("../controllers/Attendance");
const { authTeacherMiddleWare } = require("../middleware/authMiddleware");

router.post("/bulk",authTeacherMiddleWare, Attendance.bulkAttendance);
module.exports = router;
