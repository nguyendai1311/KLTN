const mongoose = require('mongoose');

const ScoreSchema = new mongoose.Schema({
  examId: { type: String, required: true, ref: 'Exam' },
  scores: [
    {
      studentId: { type: String, required: true, ref: 'Student' },
      score: { type: Number, required: true, min: 0, max: 10 }
    }
  ],
  submittedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model("Score", ScoreSchema);
