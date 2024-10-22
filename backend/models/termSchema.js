const mongoose = require("mongoose");

const termSchema = new mongoose.Schema({
    termName: {
        type: String,
        required: true,
    },
    nextTermStarts: {
        type: String,
        required: true,
    },
    nextTermEnds: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        default: 'Active',
        required: true,
    },
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin',
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model("term", termSchema);

