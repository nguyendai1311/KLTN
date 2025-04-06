const Class = require("../models/ClassModel");

const createClass = async (newClass) => {
    const { name } = newClass;
    const checkClass = await Class.findOne({ name });
    if (checkClass) {
        return {
            status: 'ERR',
            message: 'The name of class already exists'
        };
    }

    try {
        const createdClass = await Class.create(newClass); // Using newClass directly
        return {
            status: "OK",
            message: "Tạo lớp học thành công",
            data: createdClass
        };
    } catch (e) {
        return {
            status: 'ERR',
            message: e.message || 'An error occurred while creating the class'
        };
    }
};


//  Lấy danh sách tất cả lớp học
const getAllClasses = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const classes = await Class.find().populate("course teacher students");
            resolve({
                status: "OK",
                message: "Lấy danh sách lớp học thành công",
                data: classes
            });
        } catch (e) {
            reject(e);
        }
    });
};

//  Lấy thông tin lớp học theo ID
const getClassById = (classId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const classData = await Class.findById(classId).populate("course teacher students");
            if (!classData) {
                return resolve({ status: "ERR", message: "Không tìm thấy lớp học" });
            }
            resolve({
                status: "OK",
                message: "Lấy lớp học thành công",
                data: classData
            });
        } catch (e) {
            reject(e);
        }
    });
};

// Cập nhật lớp học theo ID
const updateClass = (classId, updateData) => {
    return new Promise(async (resolve, reject) => {
        try {
            const updatedClass = await Class.findByIdAndUpdate(classId, updateData, { new: true });
            if (!updatedClass) {
                return resolve({ status: "ERR", message: "Không tìm thấy lớp học để cập nhật" });
            }
            resolve({
                status: "OK",
                message: "Cập nhật lớp học thành công",
                data: updatedClass
            });
        } catch (e) {
            reject(e);
        }
    });
};

//  Xóa lớp học theo ID
const deleteClass = (classId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const deletedClass = await Class.findByIdAndDelete(classId);
            if (!deletedClass) {
                return resolve({ status: "ERR", message: "Không tìm thấy lớp học để xóa" });
            }
            resolve({
                status: "OK",
                message: "Xóa lớp học thành công",
                data: deletedClass
            });
        } catch (e) {
            reject(e);
        }
    });
};

module.exports = { createClass, getAllClasses, getClassById, updateClass, deleteClass };
