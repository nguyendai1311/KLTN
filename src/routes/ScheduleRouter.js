const express = require('express');
const { getStudentSchedule, getTeacherSchedule } = require('../controllers/SchduleController');
const { authTeacherMiddleWare } = require("../middleware/authMiddleware");

const router = express.Router();

router.get('/schedule-student/:id', getStudentSchedule);
router.get('/schedule-teacher/:id', authTeacherMiddleWare, getTeacherSchedule);

module.exports = router;
