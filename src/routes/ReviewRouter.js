const express = require("express");
const router = express.Router();
const ReviewController = require("../controllers/ReviewController");
const { authUserMiddleWare } = require("../middleware/authMiddleware");

router.post("/create/:classId", authUserMiddleWare, ReviewController.createReview);
router.get("/get-review/:classId", authUserMiddleWare, ReviewController.getReviews);
router.delete("/delete-review/:reviewId", authUserMiddleWare, ReviewController.removeReview);

module.exports = router;
