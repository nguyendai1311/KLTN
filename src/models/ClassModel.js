const mongoose = require('mongoose');

const ClassroomSchema = new mongoose.Schema(
    {
        name: { type: String, required: true }, // Tên lớp học
        course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true }, // Khóa học thuộc về lớp này
        teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Giảng viên phụ trách lớp
        maxStudent: { type: Number, required: true },
        students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Danh sách học viên trong lớp
        schedule: [
            {
                day: { type: String, enum: ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'], required: true }, // Ngày trong tuần
                startTime: { type: String, required: true }, // Giờ bắt đầu
                endTime: { type: String, required: true } // Giờ kết thúc
            }
        ], // Lịch học của lớp
        address: { type: String, required: true }, // Địa điểm học
        startDate: { type: Date, required: true }, // Ngày bắt đầu lớp học
        endDate: { type: Date, required: true }, // Ngày kết thúc lớp học
    },
    {
        timestamps: true
    }
);

const Class = mongoose.model("Class", ClassroomSchema);
module.exports = Class;