const Class = require("../models/ClassModel");
const Course = require("../models/CourseModel");
const classService = require("../services/ClassService");

//  Tạo lớp học mới
const createClass = async (req, res) => {
    try {
        const {
            name,
            course,
            teacher,
            studentCount,
            schedule,
            address,
            startDate,
            endDate
        } = req.body;

        // Kiểm tra dữ liệu bắt buộc
        if (!name || !course || !teacher || !schedule || !address || !startDate || !endDate) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Missing required fields',
            });
        }

        // Tạo lớp học mới
        const newClass = await Class.create({
            name,
            course,
            teacher,
            studentCount,
            schedule,
            address,
            startDate,
            endDate
        });

        // Thêm classId vào khóa học tương ứng
        const updatedCourse = await Course.findByIdAndUpdate(
            course,
            { $push: { classes: newClass._id } },
            { new: true }
        );

        if (!updatedCourse) {
            return res.status(404).json({
                status: 'ERR',
                message: 'Course not found',
            });
        }

        return res.status(201).json({
            status: 'OK',
            message: 'Class created and added to course successfully',
            data: {
                class: newClass,
                course: updatedCourse
            }
        });

    } catch (error) {
        return res.status(500).json({
            status: 'ERR',
            message: 'Internal server error',
            error: error.message,
        });
    }
};


//  Lấy danh sách tất cả lớp học
const getAllClasses = async (req, res) => {
    try {
        const response = await classService.getAllClasses();
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({ status: "ERR", message: error.message });
    }
};

//  Lấy thông tin lớp học theo ID
const getClassById = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await classService.getClassById(id);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({ status: "ERR", message: error.message });
    }
};

//  Cập nhật lớp học theo ID
const updateClass = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const response = await classService.updateClass(id, updateData);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({ status: "ERR", message: error.message });
    }
};

//  Xóa lớp học theo ID
const deleteClass = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await classService.deleteClass(id);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({ status: "ERR", message: error.message });
    }
};

module.exports = {
    createClass,
    getAllClasses,
    getClassById,
    updateClass,
    deleteClass
};
