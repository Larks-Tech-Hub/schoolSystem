const Grading = require('../models/gradingSchema.js');

const gradingCreate = async (req, res) => {
    try {
        const grading = new Grading({
            ...req.body,
            school: req.body.adminID
        });

        const existingGradingByName = await Grading.findOne({
            ...req.body,
            school: req.body.adminID
        });

        if (existingGradingByName) {
            res.send({ message: 'Sorry this grading already exists' });
        }
        else {
            const result = await grading.save();
            res.send(result);
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const gradingList = async (req, res) => {
    try {
        let gradings = await Grading.find({ school: req.params.id })
        if (gradings.length > 0) {
            res.send(gradings)
        } else {
            res.send({ message: "No gradings found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const updateGrading = async (req, res) => {
    try {
        const result = await Grading.findByIdAndUpdate(req.params.id,
            { $set: req.body },
            { new: true })
        res.send(result)
    } catch (error) {
        res.status(500).json(error);
    }
};

const deleteGrading = async (req, res) => {
    try {
        const result = await Grading.findByIdAndDelete(req.params.id)
        res.send(result)
    } catch (error) {
        res.status(500).json(err);
    }
}


module.exports = { gradingCreate, gradingList, updateGrading, deleteGrading };
