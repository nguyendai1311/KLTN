const reviewService = require("../services/ReviewService");

const createReview = async (req, res) => {
    const { comment } = req.body;
    const { classId } = req.params; 

    try {
        const review = await reviewService.addReview(req.user, classId, comment);
        res.status(201).json({ message: "Đánh giá lớp học thành công!", review });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getReviews = async (req, res) => {
    try {
        const reviews = await reviewService.getClassReviews(req.params.classId); 
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server!", error });
    }
};

const removeReview = async (req, res) => {
    try {
        const result = await reviewService.deleteReview(req.user, req.params.reviewId);
        res.json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { createReview, getReviews, removeReview };
