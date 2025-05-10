const express = require("express");
const router = express.Router()
const StatisticController = require('../controllers/StatisticController');

router.get('/get-course-distribution',StatisticController.getCourseStudentDistribution)
router.get('/get-monthly-revenue', StatisticController.getMonthlyRevenue);
router.get('/get-student-growth', StatisticController.getStudentGrowth);

module.exports = router
