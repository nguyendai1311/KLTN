const mongoose = require("mongoose");

const AttendanceSchema = new mongoose.Schema({
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
    classroom: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true },
    status: { type: String, enum: ["present", "absent"], required: true },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Attendance", AttendanceSchema);
