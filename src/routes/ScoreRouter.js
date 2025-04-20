const express = require("express");
const router = express.Router()
const ScoreController = require('../controllers/ScoreController');
const { authTeacherMiddleWare } = require("../middleware/authMiddleware");

router.post('/create', authTeacherMiddleWare,ScoreController.createScore)
router.get('/get-all-score', ScoreController.getAllScores);
router.get('/get-score-by-id/:id', ScoreController.getScoreById)
router.put('/update-score/:id', authTeacherMiddleWare, ScoreController.updateScore)
router.delete('/delete/:id', authTeacherMiddleWare, ScoreController.deleteScore)

module.exports = router


