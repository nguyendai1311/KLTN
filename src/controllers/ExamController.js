const examService = require('../services/ExamService')

const createExam = async (req, res) => {
  try {
    const newExam = await examService.createExam(req.body);
    res.status(201).json(newExam);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAllExams = async (req, res) => {
  try {
    const exams = await examService.getAllExams();
    res.status(200).json(exams);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getExamById = async (req, res) => {
  try {
    const exam = await examService.getExamById(req.params.id);
    if (!exam) return res.status(404).json({ message: "Exam not found" });
    res.status(200).json(exam);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getExamsByTeacherId = async (req, res) => {
  try {
      const teacherId = req.params.id;

      if (!teacherId) {
          return res.status(400).json({
              status: "ERROR",
              message: "Thiếu ID giảng viên"
          });
      }

      const result = await examService.getExamsByTeacherId(teacherId);
      return res.status(200).json(result);

  } catch (error) {
      console.error("Lỗi khi lấy bài thi theo giảng viên:", error);
      return res.status(500).json({
          status: "ERROR",
          message: "Có lỗi xảy ra ở server"
      });
  }
};

const getExamsByClassId = async (req, res) => {
  try {
      const classId = req.params.id;

      if (!classId) {
          return res.status(400).json({
              status: "ERROR",
              message: "Thiếu ID lớp học"
          });
      }

      const result = await examService.getExamsByClassId(classId);
      return res.status(200).json(result);

  } catch (error) {
      console.error("Lỗi khi lấy bài thi theo lớp học:", error);
      return res.status(500).json({
          status: "ERROR",
          message: "Có lỗi xảy ra ở server"
      });
  }
};


const updateExam = async (req, res) => {
  try {
    const updated = await examService.updateExam(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: "Exam not found" });
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteExam = async (req, res) => {
  try {
    const deleted = await examService.deleteExam(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Exam not found" });
    res.status(200).json({ message: "Exam deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const submitExam = async (req, res) => {
  try {
    const { examId, answers,studentId } = req.body;
    if (!examId || !answers || !studentId) {
      return res.status(400).json({ message: "Thiếu dữ liệu đầu vào." });
    }

    const result = await examService.submitExam(examId, answers,studentId);

    return res.status(200).json({
      message: "Nộp bài thành công.",
      result,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message || "Lỗi server." });
  }
};


module.exports = {
  createExam,
  getAllExams,
  getExamById,
  updateExam,
  deleteExam,
  getExamsByTeacherId,
  getExamsByClassId,
  submitExam
}