const Review = require("../models/ReviewModel");
const Class = require("../models/ClassModel");
const Order = require("../models/OrderProduct");

const addReview = async (userId, courseId, comment, rating) => {
    if (!comment || !rating) throw new Error('Vui lòng nhập đầy đủ thông tin!');

    const orders = await Order.find({ user: userId });
    let hasCompletedCourse = false;
    let hasCourse = false;
    for (const order of orders) {
        for (const item of order.orderItems) {
            const classData = await Class.findById(item.class);

            if (
                classData?.course?.toString() === courseId.toString() &&
                new Date() > new Date(classData.endDate) // kiểm tra ngày hiện tại đã qua endDate
            ) {
                hasCompletedCourse = true;
                break;
            }
        }
        if (hasCompletedCourse) break;
    }

    for (const order of orders) {
        for (const item of order.orderItems) {
            const classData = await Class.findById(item.class);
            if (classData?.course?.toString() === courseId.toString()) {
                hasCourse = true;
                break;
            }
        }
        if (hasCourse) break;
    }

    if (!hasCourse) throw new Error('Bạn chưa học khóa học này!');

    if (!hasCompletedCourse) throw new Error('Bạn chỉ có thể đánh giá sau khi hoàn thành khóa học!');

    const review = await Review.create({
        user: userId,
        course: courseId,
        comment,
        rating,
    });

    const populatedReview = await Review.findById(review._id)
        .populate('user', 'name avatar')
        .populate('course', 'name');

    return populatedReview;
};


const getAllReviewsByCourseId = async (courseId) => {
    const reviews = await Review.find({ course: courseId })
        .sort({ createdAt: -1 })
        .populate('user', 'name avatar'); // lấy name + avatar từ bảng User
    return reviews;
};

const getAllReviews = async () => {
    return await Review.find()
        .populate("user", "name email")
        .populate("course", "name")
        .sort({ createdAt: -1 });
};

const updateReview = (reviewId, ReviewData) => {
    return new Promise(async (resolve, reject) => {
        try {
            const updatereview = await Review.findByIdAndUpdate(reviewId, ReviewData, { new: true });

            if (!updatereview) {
                reject({ message: "review không tồn tại để cập nhật" });
            }
            resolve({
                status: "OK",
                message: "Cập nhật review thành công",
                data: updatereview
            });
        } catch (error) {
            reject(error);
        }
    });
};


const deleteReview = (reviewId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const review = await Review.findByIdAndDelete(reviewId);
            if (!review) {
                return resolve({ status: "ERR", message: "Không tìm thấy review để xóa" });
            }
            resolve({
                status: "OK",
                message: "Xóa  review thành công",
                data: review
            });
        } catch (e) {
            reject(e);
        }
    });
};

module.exports = { addReview, getAllReviews, deleteReview, updateReview, getAllReviewsByCourseId };
