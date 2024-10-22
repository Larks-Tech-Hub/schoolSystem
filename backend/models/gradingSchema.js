const mongoose = require("mongoose");

const gradingSchema = new mongoose.Schema({
    from: {
        type: Number,
        required: true,
    },
    to: {
        type: Number,
        required: true,
    },
    grade: {
        type: String,
        required: true,
    },
    comment: {
        type: String,
        required: true,
    },
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin',
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model("grading", gradingSchema);

