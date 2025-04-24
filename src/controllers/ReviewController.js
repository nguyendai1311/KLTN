const reviewService = require("../services/ReviewService");

const createReview = async (req, res) => {
    try {
        const courseId = req.params.courseId
        const { comment, rating, userId } = req.body;
        const review = await reviewService.addReview(userId, courseId, comment, rating);
        res.status(201).json(review);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};



const getAllReviewsByCourseId = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const reviews = await reviewService.getAllReviewsByCourseId(courseId);
        res.json(reviews);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateReview = async (req, res) => {
    try {
        const { reviewId } = req.params
        const { comment, rating } = req.body;
        const response = await reviewService.updateReview(reviewId, { comment, rating });
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({ status: "ERR", message: error.message });
    }
};

const getAllReviews = async (req, res) => {
    try {
        const reviews = await reviewService.getAllReviews();
        res.status(200).json(reviews);
    } catch (error) {
        console.error("Error getting reviews:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const deleteReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const response = await reviewService.deleteReview(reviewId);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({ status: "ERR", message: error.message });
    }
};



module.exports = { createReview, deleteReview, getAllReviews, updateReview,getAllReviewsByCourseId };
