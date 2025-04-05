const express = require("express");
const router = express.Router()
const ScoreController = require('../controllers/ScoreController');

router.post('/create', ScoreController.createScore)
router.get('/get-all-score', ScoreController.getAllScores);
router.get('/get-score-by-id/:id', ScoreController.getScoreById)
router.put('/update-score/:id', ScoreController.updateScore)
router.delete('/delete/:id', ScoreController.deleteScore)

module.exports = router


