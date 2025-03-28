const express = require('express');
const { getStudentSchedule, getTeacherSchedule } = require('../controllers/SchduleController');
const { authTeacherMiddleWare } = require("../middleware/authMiddleware");

const router = express.Router();

router.get('/student/:id', getStudentSchedule);
router.get('/teacher/:id', authTeacherMiddleWare, getTeacherSchedule);

module.exports = router;
