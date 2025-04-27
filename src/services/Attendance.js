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

    // Lưu vào database
    const result = await Attendance.create(attendanceRecord);

    // Populate học sinh từ User model
    const populatedAttendance = await result.populate({
        path: "attendances.student",
        model: "User",
        select: "name email"
    });
    // Gửi email cho phụ huynh
    EmailService.sendAttendanceEmails(populatedAttendance.attendances);

    return result;
};


const updateAttendance = async (attendanceId, updatedAttendances) => {
    try {
        const attendance = await Attendance.findById(attendanceId);
        if (!attendance) {
            throw new Error("Điểm danh không tồn tại");
        }

        // Update the attendances
        attendance.attendances = updatedAttendances.map(record => ({
            student: new mongoose.Types.ObjectId(record.student),
            status: record.status
        }));

        await attendance.save();
        return attendance;
    } catch (error) {
        throw new Error(`Lỗi khi cập nhật điểm danh: ${error.message}`);
    }
};

// Delete Attendance
const deleteAttendance = async (attendanceId) => {
    try {
        const attendance = await Attendance.findByIdAndDelete(attendanceId);
        if (!attendance) {
            throw new Error("Điểm danh không tồn tại");
        }

        return { message: "Điểm danh đã được xóa thành công" };
    } catch (error) {
        throw new Error(`Lỗi khi xóa điểm danh: ${error.message}`);
    }
};

const getAllByIdTeacher = async (teacherId) => {
    try {
        const records = await Attendance.find({ teacher: teacherId })
            .populate("classroom", "name")
            .populate("attendances.student", "name email");

        return records;
    } catch (error) {
        throw new Error(`Lỗi khi lấy danh sách điểm danh theo giáo viên: ${error.message}`);
    }
};


const getAttendanceByClassAndDate = async (classroomId, date) => {
  try {
    const startOfDay = new Date(date);
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const attendance = await Attendance.findOne({
      classroom: classroomId,
      date: { $gte: startOfDay, $lte: endOfDay }
    });

    return attendance;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
    bulkAttendance,
    updateAttendance,
    deleteAttendance,
    getAllByIdTeacher,
    getAttendanceByClassAndDate
};