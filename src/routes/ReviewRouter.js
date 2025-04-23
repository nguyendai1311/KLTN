const express = require("express");
const router = express.Router();
const ReviewController = require("../controllers/ReviewController");

router.post('/create/:courseId', ReviewController.createReview);
router.delete('/delete-review/:reviewId', ReviewController.deleteReview);
router.get('/get-all-review/:courseId',ReviewController.getAllReviews);
router.put('/update-review/:reviewId', ReviewController.updateReview);


module.exports = router;
