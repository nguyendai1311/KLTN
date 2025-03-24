const express = require("express");
const router = express.Router();
const Attendance = require("../controllers/Attendance");
const { authTeacherMiddleWare } = require("../middleware/authMiddleware");

router.post("/:classroomId/bulk",authTeacherMiddleWare, Attendance.AttendanceController);
module.exports = router;
