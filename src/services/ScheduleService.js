const Classroom = require('../models/ClassModel');

const getStudentSchedule = async (studentId) => {
    try {
        const classes = await Classroom.find({ students: studentId })
            .populate('course', 'name')
            .populate('teacher', 'name')
            .select('name schedule address course teacher'); // 🕒 📍 Lấy giờ học & địa chỉ

        return {
            status: 'OK',
            message: 'Student schedule retrieved successfully',
            data: classes
        };
    } catch (error) {
        return {
            status: 'ERR',
            message: 'Failed to get student schedule',
            error: error.message
        };
    }
};

const getTeacherSchedule = async (teacherId) => {
    try {
        const classes = await Classroom.find({ teacher: teacherId })
            .populate('course', 'name')
            .populate('students', 'name')
            .select('name schedule address course students'); // 🕒 📍 Lấy giờ học & địa chỉ

        return {
            status: 'OK',
            message: 'Teacher schedule retrieved successfully',
            data: classes
        };
    } catch (error) {
        return {
            status: 'ERR',
            message: 'Failed to get teacher schedule',
            error: error.message
        };
    }
};

module.exports = {
    getStudentSchedule,
    getTeacherSchedule
};
