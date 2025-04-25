const scoreService = require('../services/ScoreService');
const Score = require('../models/ScoreModel');
const { default: mongoose } = require('mongoose');

const createScore = async (req, res) => {
    try {
        const result = await scoreService.createScore(req.body);
        res.status(201).json(result);
    } catch (error) {
        if (error.message === "Bảng điểm cho bài thi này đã tồn tại!") {
            res.status(400).json({
                status: "ERROR",
                message: error.message
            });
        } else {
            res.status(500).json({
                status: "ERROR",
                message: error.message
            });
        }
    }
};


const getAllScores = async (req, res) => {
    try {
        const result = await scoreService.getAllScores();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({
            status: "ERROR",
            message: error.message
        });
    }
};

const getScoreByExamId = async (req, res) => {
    const { examId } = req.params
    if (!mongoose.Types.ObjectId.isValid(examId)) {
        return res.status(400).json({
            status: "ERROR",
            message: "examId không hợp lệ"
        });
    }

    try {
        const result = await scoreService.getScoreByExamId(examId);

        if (result.status === "NOT_FOUND") {
            return res.status(404).json(result);
        }

        res.status(200).json(result);
    } catch (error) {
        console.error("Lỗi khi truy vấn điểm theo examId:", error);
        res.status(500).json({
            status: "ERROR",
            message: "Có lỗi xảy ra khi xử lý yêu cầu. Vui lòng thử lại sau.",
        });
    }
};



const updateScore = async (req, res) => {
    try {
        const result = await scoreService.updateScore(req.params.id, req.body);
        if (result.status === "NOT_FOUND") {
            return res.status(404).json(result);
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({
            status: "ERROR",
            message: error.message
        });
    }
};

const deleteScore = async (req, res) => {
    try {
        const result = await scoreService.deleteScore(req.params.id);
        if (result.status === "NOT_FOUND") {
            return res.status(404).json(result);
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({
            status: "ERROR",
            message: error.message
        });
    }
};

module.exports = {
    createScore,
    getAllScores,
    getScoreByExamId,
    updateScore,
    deleteScore
};
