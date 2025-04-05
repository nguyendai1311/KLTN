const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
    class: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true }, 
    comment: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("Review", reviewSchema);
