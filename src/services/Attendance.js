const mongoose = require("mongoose");
const User = require("../models/UserModel");
const Attendance = require("../models/Attendance");
const Class = require("../models/ClassModel");
const EmailService = require('./EmailService')

const bulkAttendance = async (classroomId, attendances, teacherId) => {
    // Kiểm tra lớp học có tồn tại không
    const classroom = await Class.findById(classroomId);
    if (!classroom) {
        throw new Error("Lớp học không tồn tại");
    }

    // Kiểm tra danh sách điểm danh có hợp lệ không
    if (!Array.isArray(attendances) || attendances.length === 0) {
        throw new Error("Danh sách điểm danh không hợp lệ");
    }

    // Lấy danh sách học viên trong lớp
    const studentList = await User.find({
        _id: { $in: classroom.students }
    }).distinct("_id");

    // Kiểm tra tính hợp lệ của từng bản ghi điểm danh
    const isValid = attendances.every(record =>
        record.student &&
        record.status &&
        studentList.some(id => id.toString() === record.student.toString())
    );

    if (!isValid) {
        throw new Error("Có học viên không thuộc lớp học hoặc thiếu dữ liệu `student/status`");
    }

    // Tạo document điểm danh
    const attendanceRecord = {
        classroom: new mongoose.Types.ObjectId(classroomId),
        teacher: new mongoose.Types.ObjectId(teacherId),
        date: new Date(),
        attendances: attendances.map(record => ({
            student: new mongoose.Types.ObjectId(record.student),
            status: record.status
        }))
    };

    console.log("✅ Dữ liệu điểm danh chuẩn bị lưu:", JSON.stringify(attendanceRecord, null, 2));

    // Lưu vào database
    const result = await Attendance.create(attendanceRecord);

    // Populate học sinh từ User model
    const populatedAttendance = await result.populate({
        path: "attendances.student",
        model: "User",
        select: "name email"
    });
    console.log("📢 Dữ liệu sau populate:", JSON.stringify(populatedAttendance, null, 2));
    // Gửi email cho phụ huynh
    EmailService.sendAttendanceEmails(populatedAttendance.attendances);

    return result;
};


module.exports = {
    bulkAttendance
};
