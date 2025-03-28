const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    image: { type: String },
    type: { type: String, required: true },
    studentCount: { type: Number, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    discount: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // ⚠ Phải có dòng này!
    classes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Class' }]
}, { timestamps: true });

module.exports = mongoose.model('Course', CourseSchema);
