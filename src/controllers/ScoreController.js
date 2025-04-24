const scoreService = require('../services/ScoreService');

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

const getScoreById = async (req, res) => {
    try {
        const result = await scoreService.getScoreById(req.params.id);
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
    getScoreById,
    updateScore,
    deleteScore
};
