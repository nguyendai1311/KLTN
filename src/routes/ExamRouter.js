const express = require("express");
const router = express.Router()
const ExamController = require('../controllers/ExamController');
const { authTeacherMiddleWare } = require("../middleware/authMiddleware");

router.post('/create', authTeacherMiddleWare, ExamController.createExam)
router.get('/get-all-exam', authTeacherMiddleWare, ExamController.getAllExams);
router.get('/get-exam-by-id/:id', authTeacherMiddleWare, ExamController.getExamById)
router.put('/update-exam/:id', authTeacherMiddleWare, ExamController.updateExam)
router.delete('/delete/:id', authTeacherMiddleWare, ExamController.deleteExam)

module.exports = router


