const Review = require("../models/ReviewModel");
const Class = require("../models/ClassModel");

const addReview = async (user, classId, comment) => {
    if (!user || !user._id) {
        throw new Error("Thông tin người dùng không hợp lệ!");
    }

    const classData = await Class.findById(classId);
    if (!classData) {
        throw new Error("Không tìm thấy lớp học!");
    }

    const studentIds = classData.students.map(id => id.toString());
    if (!studentIds.includes(user._id.toString())) {
        throw new Error("Bạn chưa đăng ký lớp học này!");
    }

    const review = new Review({
        user: user._id,
        class: classId,
        comment
    });

    await review.save();
    await Class.findByIdAndUpdate(classId, { $push: { reviews: review._id } });
    return review;
};


const getClassReviews = async (classId) => {
    return await Review.find({ class: classId }).populate("user", "name");
};

const deleteReview = async (user, reviewId) => {
    const review = await Review.findById(reviewId);
    if (!review) throw new Error("Không tìm thấy đánh giá!");

    if (review.user.toString() !== user._id.toString()) {
        throw new Error("Bạn không có quyền xóa đánh giá này!");
    }

    await review.deleteOne();
    return { message: "Đã xóa đánh giá!" };
};

module.exports = { addReview, getClassReviews, deleteReview };
