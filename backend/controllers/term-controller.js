const Term = require('../models/termSchema.js');

const termCreate = async (req, res) => {
    try {
        const term = new Term({
            termName: req.body.termName,
            status: req.body.status,
            school: req.body.adminID,
            nextTermStarts: req.body.nextTermStarts,
            nextTermEnds: req.body.nextTermEnds
        });

        const existingTermByName = await Term.findOne({
            termName: req.body.termName,
            status: req.status,
            school: req.body.adminID,
            nextTermStarts: req.body.nextTermStarts,
            nextTermEnds: req.body.nextTermEnds
        });

        if (existingTermByName) {
            res.send({ message: 'Sorry this term already exists' });
        }
        else {
            const result = await term.save();
            res.send(result);
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const termList = async (req, res) => {
    try {
        let terms = await Term.find({ school: req.params.id })
        if (terms.length > 0) {
            res.send(terms)
        } else {
            res.send({ message: "No terms found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const updateTerm = async (req, res) => {
    try {
        const result = await Term.findByIdAndUpdate(req.params.id,
            { $set: req.body },
            { new: true })
        res.send(result)
    } catch (error) {
        res.status(500).json(error);
    }
};

const deleteTerm = async (req, res) => {
    try {
        const deletedTerm = await Term.findByIdAndDelete(req.params.id);
        if (!deletedTerm) {
            return res.send({ message: "Term not found" });
        }
        // const deletedStudents = await Student.deleteMany({ sclassName: req.params.id });
        // const deletedSubjects = await Subject.deleteMany({ sclassName: req.params.id });
        // const deletedTeachers = await Teacher.deleteMany({ teachSclass: req.params.id });
        res.send(deletedTerm);
    } catch (error) {
        res.status(500).json(error);
    }
}

const getTermDetail = async (req, res) => {
    try {
        let term = await Term.findById(req.params.id);
        if (term) {
            term = await term.populate("school", "schoolName")
            res.send(term);
        }
        else {
            res.send({ message: "No term found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

module.exports = { termCreate, termList, deleteTerm, getTermDetail };
