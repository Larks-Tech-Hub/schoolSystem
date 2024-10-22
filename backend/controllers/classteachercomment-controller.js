const classTeacherComment = require('../models/classTeacherCommentSchema.js');

const classTeacherCommentCreate = async (req, res) => {
    try {
        const comment = new classTeacherComment({
            ...req.body,
            teacher: req.body.teacherID,
            school: req.body.adminID
        });

        const existingCommentByName = await classTeacherComment.findOne({
            ...req.body,
            teacher: req.body.teacherID,
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

const classTeacherCommentList = async (req, res) => {
    try {
        let comments = await classTeacherComment.find({ school: req.params.id })
        if (comments.length > 0) {
            res.send(comments)
        } else {
            res.send({ message: "No comments found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const updateClassTeacherComment = async (req, res) => {
    try {
        const result = await classTeacherComment.findByIdAndUpdate(req.params.id,
            { $set: req.body },
            { new: true })
        res.send(result)
    } catch (error) {
        res.status(500).json(error);
    }
};

const deleteClassTeacherComment = async (req, res) => {
    try {
        const result = await classTeacherComment.findByIdAndDelete(req.params.id)
        res.send(result)
    } catch (error) {
        res.status(500).json(err);
    }
}


module.exports = { classTeacherCommentCreate, classTeacherCommentList, updateClassTeacherComment, deleteClassTeacherComment };
