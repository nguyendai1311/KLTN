const express = require("express");
const router = express.Router();
const Attendance = require("../controllers/Attendance");
const { authTeacherMiddleWare } = require("../middleware/authMiddleware");

router.post("/bulk",authTeacherMiddleWare, Attendance.bulkAttendance);
router.put("/update",authTeacherMiddleWare, Attendance.updateAttendance);
router.delete("/delete/:attendanceId",authTeacherMiddleWare, Attendance.deleteAttendance);
router.get("/get-all/:teacherId",authTeacherMiddleWare, Attendance.getAllByIdTeacher);
router.get("/get-attendance", Attendance.getAttendanceByClassAndDate);

module.exports = router;
