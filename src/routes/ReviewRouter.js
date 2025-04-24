const express = require("express");
const router = express.Router();
const ReviewController = require("../controllers/ReviewController");

router.post('/create/:courseId', ReviewController.createReview);
router.delete('/delete-review/:reviewId', ReviewController.deleteReview);
router.get('/get-all-review/:courseId',ReviewController.getAllReviewsByCourseId);
router.put('/update-review/:reviewId', ReviewController.updateReview);
router.get('/get-all-reviews',ReviewController.getAllReviews);

module.exports = router;
