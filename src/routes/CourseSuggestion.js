const express = require("express");
const router = express.Router()
const CourseSuggestion = require('../controllers/CourseSugestion');

router.post('/submit', CourseSuggestion.suggestCourse)
router.post('/create', CourseSuggestion.createTest);
router.get('/get-all-test', CourseSuggestion.getAllTests);
router.put('/update/:id', CourseSuggestion.updateTest);
router.delete('/delete/:id', CourseSuggestion.deleteTest);

module.exports = router