const { Attendance, bulkAttendance } = require('../services/Attendance');

const AttendanceController = async (req, res) => {
    try {
        const { classroomId } = req.params;
        const { attendances } = req.body; // Mảng gồm các đối tượng { studentId, status }
        const teacherId = req.user._id; // Giả sử middleware verifyTeacher đã set req.user
        const insertedRecords = await bulkAttendance(classroomId, attendances, teacherId);
        res.json({ message: "Điểm danh nhiều sinh viên thành công", attendances: insertedRecords });
    } catch (error) {
        // Trả về mã lỗi phù hợp dựa trên thông báo lỗi
        if (error.message === "Lớp học không tồn tại") {
            return res.status(404).json({ message: error.message });
        }
        if (error.message.includes("không thuộc lớp học này")) {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

module.exports = {
    AttendanceController
};
