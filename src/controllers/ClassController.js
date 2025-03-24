const classService = require("../services/ClassService");

//  Tạo lớp học mới
const createClass = async (req, res) => {
    try {
        const classData = req.body;
        const response = await classService.createClass(classData);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({ status: "ERR", message: error.message });
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
