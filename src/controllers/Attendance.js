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

const updateAttendance = async (req, res) => {
    try {
        const { attendanceId, attendances } = req.body;

        if (!attendanceId || !attendances) {
            return res.status(400).json({ message: "Thiếu dữ liệu đầu vào" });
        }

        const updatedAttendance = await attendanceService.updateAttendance(attendanceId, attendances);
        return res.status(200).json({
            message: "Cập nhật điểm danh thành công",
            data: updatedAttendance
        });

    } catch (error) {
        console.error("❌ Lỗi khi cập nhật điểm danh:", error.message);
        return res.status(500).json({
            message: "Lỗi server",
            error: error.message
        });
    }
};

// Delete Attendance
const deleteAttendance = async (req, res) => {
    try {
        const { attendanceId } = req.params;

        if (!attendanceId) {
            return res.status(400).json({ message: "Thiếu dữ liệu đầu vào" });
        }

        const result = await attendanceService.deleteAttendance(attendanceId);
        return res.status(200).json({
            message: result.message
        });

    } catch (error) {
        console.error("❌ Lỗi khi xóa điểm danh:", error.message);
        return res.status(500).json({
            message: "Lỗi server",
            error: error.message
        });
    }
};

// Lấy tất cả điểm danh theo ID giáo viên
const getAllByIdTeacher = async (req, res) => {
    try {
        const { teacherId } = req.params;

        if (!teacherId) {
            return res.status(400).json({ message: "Thiếu teacherId" });
        }

        const records = await attendanceService.getAllByIdTeacher(teacherId);
        return res.status(200).json({
            message: "Lấy danh sách điểm danh thành công",
            data: records
        });

    } catch (error) {
        console.error("❌ Lỗi khi lấy danh sách điểm danh:", error.message);
        return res.status(500).json({
            message: "Lỗi server",
            error: error.message
        });
    }
};

const getAttendanceByClassAndDate = async (req, res) => {
    try {
      const { classroomId, date } = req.query;
  
      if (!classroomId || !date) {
        return res.status(400).json({ message: 'Missing classroomId or date' });
      }
      const attendance = await attendanceService.getAttendanceByClassAndDate(classroomId, date);
      if (!attendance) {
        return res.status(404).json({ message: 'Attendance not found' });
      }
  
      res.status(200).json(attendance);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  

module.exports = {
    bulkAttendance,
    updateAttendance,
    deleteAttendance,
    getAllByIdTeacher,
    getAttendanceByClassAndDate
};