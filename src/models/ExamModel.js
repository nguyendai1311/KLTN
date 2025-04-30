const mongoose = require('mongoose');

const ExamSchema = new mongoose.Schema({
    examName: { type: String, required: true },
    examDeadline: { type: Date, required: true },
    questions: [
        {
            questionId: { type: Number, required: true },
            questionText: { type: String, required: true },
            options: [{ type: String }],
            correctAnswer: { type: String, required: true },
        },
    ],
    duration: { type: Number, required: true },
    class: { type: String, required: true, ref: "Class" },
    teacher: { type: String, required: true, ref: "User" }
},
    { timestamps: true });


module.exports = mongoose.model('Exam', ExamSchema);
