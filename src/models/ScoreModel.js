const mongoose = require('mongoose')

const ScoreSchema = new mongoose.Schema({
    examId: { type: String, required: true, ref: 'Exam' },
    studentId: { type: String, required: true },
    score: { type: Number, required: true, min: 0, max: 10 },
    submittedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model("Score", ScoreSchema);
