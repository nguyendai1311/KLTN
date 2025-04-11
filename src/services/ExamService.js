const Exam = require("../models/ExamModel")

const createExam = (examData) => {
    return new Promise(async (resolve, reject) => {
        try {
            const newExam = await Exam.create(examData);
            resolve({
                status: "OK",
                message: "Tạo bài kiểm tra thành công",
                data: newExam
            });
        } catch (error) {
            reject(error);
        }
    });
};

const getAllExams = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const exams = await Exam.find().populate("class").populate("teacher");
            resolve({
                status: "OK",
                message: "Lấy danh sách bài kiểm tra thành công",
                data: exams
            });
        } catch (error) {
            reject(error);
        }
    });
};

const getExamById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const exam = await Exam.findById(id).populate("class").populate("teacher");
            if (!exam) {
                resolve({
                    status: "NOT_FOUND",
                    message: "Không tìm thấy bài kiểm tra"
                });
            } else {
                resolve({
                    status: "OK",
                    message: "Lấy bài kiểm tra thành công",
                    data: exam
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

const getExamsByTeacherId = (teacherId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const exams = await Exam.find({ teacher: teacherId })
                .populate("class")
                .populate("teacher");

            if (!exams || exams.length === 0) {
                resolve({
                    status: "NOT_FOUND",
                    message: "Không tìm thấy bài kiểm tra nào cho giảng viên này"
                });
            } else {
                resolve({
                    status: "OK",
                    message: "Lấy danh sách bài kiểm tra thành công",
                    data: exams
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};


const updateExam = (id, updateData) => {
    return new Promise(async (resolve, reject) => {
        try {
            const updated = await Exam.findByIdAndUpdate(id, updateData, { new: true });
            if (!updated) {
                resolve({
                    status: "NOT_FOUND",
                    message: "Không tìm thấy bài kiểm tra để cập nhật"
                });
            } else {
                resolve({
                    status: "OK",
                    message: "Cập nhật bài kiểm tra thành công",
                    data: updated
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

const deleteExam = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const deleted = await Exam.findByIdAndDelete(id);
            if (!deleted) {
                resolve({
                    status: "NOT_FOUND",
                    message: "Không tìm thấy bài kiểm tra để xoá"
                });
            } else {
                resolve({
                    status: "OK",
                    message: "Xoá bài kiểm tra thành công"
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

module.exports =  {
    createExam,
    getAllExams,
    getExamById,
    updateExam,
    deleteExam,
    getExamsByTeacherId
};
