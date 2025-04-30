const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
  testName:{type: String ,required : true},
  questions: [
    {
      questionId: { type: Number, required: true },
      questionText: { type: String, required: true },
      options: [{ type: String }],
      correctAnswer: { type: String, required: true },
    },
  ],
  duration: { type: Number, required: true }, // thời gian làm bài tính bằng phút
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('SuggestCourse', testSchema);
