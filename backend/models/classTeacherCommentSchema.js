const mongoose = require("mongoose");

const classTeacherSchema = new mongoose.Schema({
    from: {
        type: Number,
        required: true,
    },
    to: {
        type: Number,
        required: true,
    },
    comment: {
        type: String,
        required: true,
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'teacher',
        required: false,
    },
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin',
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model("classTeacherComment", classTeacherSchema);

