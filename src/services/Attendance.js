const mongoose = require("mongoose");
const Attendance = require('../models/Attendance');
const Class = require('../models/ClassModel');

const bulkAttendance  = async (classroomId, attendances, teacherId) => {
    // Kiểm tra lớp học có tồn tại không
    const classroom = await Class.findById(classroomId);
    if (!classroom) {
        throw new Error("Lớp học không tồn tại");
    }
    // Nếu lớp học có trường students, kiểm tra học viên có thuộc lớp hay không
    if (classroom.students && Array.isArray(classroom.students)) {
        for (let record of attendances) {
            if (!classroom.students.includes(record.studentId)) {
                throw new Error(`Học viên ${record.studentId} không thuộc lớp học này`);
            }
        }
    }
    // Tạo mảng bản ghi điểm danh cho từng học viên
    const records = attendances.map(record => ({
        course: classroom.course,
        classroom: new mongoose.Types.ObjectId(classroomId),
        student: new mongoose.Types.ObjectId(record.studentId),
        teacher: new mongoose.Types.ObjectId(teacherId),
        status: record.status,
        date: new Date()
    }));
    console.log("Records to insert:", records);
    // Chèn hàng loạt các bản ghi
    const insertedRecords = await Attendance.insertMany(records);
    return insertedRecords;
};

module.exports = {
    bulkAttendance 
};
