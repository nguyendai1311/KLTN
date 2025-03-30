const attendanceService = require("../services/Attendance");

const bulkAttendance = async (req, res) => {
    try {
        const { classroomId, attendances, teacherId } = req.body;

        if (!classroomId || !attendances || !teacherId) {
            return res.status(400).json({ message: "Thiếu dữ liệu đầu vào" });
        }

        const result = await attendanceService.bulkAttendance(classroomId, attendances, teacherId);
        return res.status(201).json({
            message: "Điểm danh thành công",
            data: result
        });

    } catch (error) {
        console.error("❌ Lỗi khi điểm danh:", error.message);
        return res.status(500).json({
            message: "Lỗi server",
            error: error.message
        });
    }
};



module.exports = {
    bulkAttendance
};
