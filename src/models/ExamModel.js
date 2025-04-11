const mongoose = require('mongoose');

const ExamSchema = new mongoose.Schema({
    examName: { type: String, required: true },
    examDeadline: { type: Date, required: true },
    examUrl: { type: String, required: true },
    class: { type: String, required: true, ref: "Class" },
    teacher: { type: String, required: true, ref: "User" }
},
    { timestamps: true });


module.exports = mongoose.model('Exam', ExamSchema);
