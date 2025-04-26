const mongoose = require('mongoose');
const Score = require('../models/ScoreModel');

const createScore = async (scoreData) => {
    try {
        // Chuyển examId thành ObjectId
        scoreData.examId = new mongoose.Types.ObjectId(scoreData.examId);

        const existingScore = await Score.findOne({ examId: scoreData.examId });
        if (existingScore) {
            throw new Error("Bảng điểm cho bài thi này đã tồn tại!");
        }

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
        const scores = await Score.find();
        return {
            status: "OK",
            message: "Lấy danh sách điểm thành công",
            data: scores
        };
    } catch (error) {
        throw error;
    }
};

const getScoreByExamId = async (examId) => {
    try {
        const score = await Score.findOne({ examId });
        if (!score) {
            return {
                status: "NOT_FOUND",
                message: "Không tìm thấy điểm với examId này"
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

const getScoreByExamIdAndStudentId = async (examId, studentId) => {
    try {
      const score = await Score.findOne({
        examId: examId,
        'scores.studentId': studentId
      });
  
      if (!score) {
        throw new Error('Không tìm thấy điểm cho bài thi này và học sinh này');
      }
  
      const studentScore = score.scores.find(s => s.studentId.toString() === studentId.toString());
  
      return studentScore ? studentScore.score : null;
    } catch (error) {
      throw new Error(error.message || 'Có lỗi xảy ra khi lấy điểm');
    }
  };

const updateScore = async (id, updateData) => {
    try {
        const updated = await Score.findByIdAndUpdate(id, updateData, { new: true });
        if (!updated) {
            return {
                status: "NOT_FOUND",
                message: "Không tìm thấy bảng điểm để cập nhật"
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
                message: "Không tìm thấy bảng điểm để xóa"
            };
        }

        return {
            status: "OK",
            message: "Xóa bảng điểm thành công"
        };
    } catch (error) {
        throw error;
    }
};

module.exports = {
    createScore,
    getAllScores,
    getScoreByExamId,
    updateScore,
    deleteScore,
    getScoreByExamIdAndStudentId
};
