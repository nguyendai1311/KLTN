const mongoose = require('mongoose');
const { Schema } = mongoose;

const ScoreSchema = new Schema({
  examId: {
    type: Schema.Types.ObjectId, 
    required: true,
    ref: 'Exam' 
  },
  scores: [
    {
      studentId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Student' 
      },
      score: {
        type: Number,
        required: true,
        min: 0,
        max: 10,
        validate: {
          validator: function (value) {
            return value >= 0 && value <= 10;
          },
          message: 'Điểm phải trong khoảng từ 0 đến 10'
        }
      }
    }
  ],
  submittedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model("Score", ScoreSchema);
