const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
    classroom: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true },
    date: { type: Date, default: Date.now },
    attendances: [
        {
            student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
            status: { type: String, required: true, enum: ["present", "absent"] }
        }
    ]
});

module.exports = mongoose.model("Attendance", attendanceSchema);
