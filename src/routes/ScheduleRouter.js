const express = require('express');
const { getStudentSchedule, getTeacherSchedule } = require('../controllers/SchduleController');

const router = express.Router();

router.get('/student/:id', getStudentSchedule);
router.get('/teacher/:id', getTeacherSchedule);

module.exports = router;
