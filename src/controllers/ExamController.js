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

module.exports = {
  createExam,
  getAllExams,
  getExamById,
  updateExam,
  deleteExam
}