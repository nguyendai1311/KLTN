const scheduleService = require('../services/ScheduleService');

const getStudentSchedule = async (req, res) => {
    try {
        const studentId = req.params.id;
        const result = await scheduleService.getStudentSchedule(studentId);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({
            status: 'ERR',
            message: 'Internal server error',
            error: error.message
        });
    }
};

const getTeacherSchedule = async (req, res) => {
    try {
        const teacherId = req.params.id;
        const result = await scheduleService.getTeacherSchedule(teacherId);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({
            status: 'ERR',
            message: 'Internal server error',
            error: error.message
        });
    }
};

module.exports = {
    getStudentSchedule,
    getTeacherSchedule
};
