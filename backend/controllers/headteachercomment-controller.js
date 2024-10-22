const headTeacherComment = require('../models/headTeacherCommentSchema.js');

const headTeacherCommentCreate = async (req, res) => {
    try {
        const comment = new headTeacherComment({
            ...req.body,
            school: req.body.adminID
        });

        const existingCommentByName = await headTeacherComment.findOne({
            ...req.body,
            school: req.body.adminID
        });

        if (existingCommentByName) {
            res.send({ message: 'Sorry this comment already exists' });
        }
        else {
            const result = await comment.save();
            res.send(result);
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const headTeacherCommentList = async (req, res) => {
    try {
        let comments = await headTeacherComment.find({ school: req.params.id })
        if (comments.length > 0) {
            res.send(comments)
        } else {
            res.send({ message: "No comments found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const updateHeadTeacherComment = async (req, res) => {
    try {
        const result = await headTeacherComment.findByIdAndUpdate(req.params.id,
            { $set: req.body },
            { new: true })
        res.send(result)
    } catch (error) {
        res.status(500).json(error);
    }
};

const deleteHeadTeacherComment = async (req, res) => {
    try {
        const result = await headTeacherComment.findByIdAndDelete(req.params.id)
        res.send(result)
    } catch (error) {
        res.status(500).json(err);
    }
}


module.exports = { headTeacherCommentCreate, headTeacherCommentList, updateHeadTeacherComment, deleteHeadTeacherComment };
