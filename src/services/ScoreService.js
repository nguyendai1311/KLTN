const Score = require('../models/ScoreModel');

const createScore = async (scoreData) => {
    try {
        const newScore = await Score.create(scoreData);
        return {
            status: "OK",
            message: "Tạo điểm cho học sinh thành công",
            data: newScore
        };
    } catch (error) {
        throw error;
    }
};

const getAllScores = async () => {
    try {
        const scores = await Score.find().populate('Exam');
        return {
            status: "OK",
            message: "Lấy danh sách điểm thành công",
            data: scores
        };
    } catch (error) {
        throw error;
    }
};

const getScoreById = async (id) => {
    try {
        const score = await Score.findById(id).populate('Exam');
        if (!score) {
            return {
                status: "NOT_FOUND",
                message: "Không tìm thấy điểm"
            };
        }
        return {
            status: "OK",
            message: "Lấy điểm thành công",
            data: score
        };
    } catch (error) {
        throw error;
    }
};

const updateScore = async (id, updateData) => {
    try {
        const updated = await Score.findByIdAndUpdate(id, updateData, { new: true });
        if (!updated) {
            return {
                status: "NOT_FOUND",
                message: "Không tìm thấy điểm để cập nhật"
            };
        }
        return {
            status: "OK",
            message: "Cập nhật điểm thành công",
            data: updated
        };
    } catch (error) {
        throw error;
    }
};

const deleteScore = async (id) => {
    try {
        const deleted = await Score.findByIdAndDelete(id);
        if (!deleted) {
            return {
                status: "NOT_FOUND",
                message: "Không tìm thấy điểm để xoá"
            };
        }
        return {
            status: "OK",
            message: "Xoá điểm thành công"
        };
    } catch (error) {
        throw error;
    }
};

module.exports = {
    createScore,
    getAllScores,
    getScoreById,
    updateScore,
    deleteScore
};
