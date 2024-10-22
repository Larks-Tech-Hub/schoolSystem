const router = require('express').Router();
const multer = require('multer');
const cloudinary = require('../config/cloudinaryConfig');

// Configure multer for file upload
const upload = multer({ dest: 'uploads/' });

// const { adminRegister, adminLogIn, deleteAdmin, getAdminDetail, updateAdmin } = require('../controllers/admin-controller.js');

const { adminRegister, adminLogIn, getAdminDetail} = require('../controllers/admin-controller.js');

const { termCreate, termList , deleteTerm, getTermDetail } = require('../controllers/term-controller.js');
const { sclassCreate, sclassList, deleteSclass, deleteSclasses, getSclassDetail, getSclassStudents } = require('../controllers/class-controller.js');
const { complainCreate, complainList } = require('../controllers/complain-controller.js');
const { noticeCreate, noticeList, deleteNotices, deleteNotice, updateNotice } = require('../controllers/notice-controller.js');
const {
    studentRegister,
    studentLogIn,
    getStudents,
    getStudentDetail,
    deleteStudents,
    deleteStudent,
    updateStudent,
    studentAttendance,
    deleteStudentsByClass,
    updateExamResult,
    clearAllStudentsAttendanceBySubject,
    clearAllStudentsAttendance,
    removeStudentAttendanceBySubject,
    removeStudentAttendance } = require('../controllers/student_controller.js');
const { subjectCreate, classSubjects, deleteSubjectsByClass, getSubjectDetail, deleteSubject, freeSubjectList, allSubjects, deleteSubjects } = require('../controllers/subject-controller.js');
const { teacherRegister, teacherLogIn, getTeachers, getTeacherDetail, deleteTeachers, deleteTeachersByClass, deleteTeacher, updateTeacherSubject, teacherAttendance } = require('../controllers/teacher-controller.js');
const { gradingCreate, gradingList, updateGrading, deleteGrading } = require('../controllers/grading-controller.js');
const { headTeacherCommentCreate, headTeacherCommentList, updateHeadTeacherComment, deleteHeadTeacherComment } = require('../controllers/headteachercomment-controller.js');
const { classTeacherCommentCreate, classTeacherCommentList, updateClassTeacherComment, deleteClassTeacherComment } = require('../controllers/classteachercomment-controller.js');

// Admin
router.post('/AdminReg', adminRegister);
router.post('/AdminLogin', adminLogIn);

router.get("/Admin/:id", getAdminDetail);
// router.delete("/Admin/:id", deleteAdmin)

// router.put("/Admin/:id", updateAdmin)


// Term

router.post('/TermCreate', termCreate);
router.get('/TermList/:id', termList);
router.get('/Term/:id', deleteTerm);
router.get("/Term/:id", getTermDetail);


// Sclass

router.post('/SclassCreate', sclassCreate);

router.get('/SclassList/:id', sclassList);
router.get("/Sclass/:id", getSclassDetail);

router.get("/Sclass/Students/:id", getSclassStudents);

router.delete("/Sclasses/:id", deleteSclasses);
router.delete("/Sclass/:id", deleteSclass);

// Subject

router.post('/SubjectCreate', subjectCreate);

router.get('/AllSubjects/:id', allSubjects);
router.get('/ClassSubjects/:id', classSubjects);
router.get('/FreeSubjectList/:id', freeSubjectList);
router.get("/Subject/:id", getSubjectDetail);

router.delete("/Subject/:id", deleteSubject);
router.delete("/Subjects/:id", deleteSubjects);
router.delete("/SubjectsClass/:id", deleteSubjectsByClass);

// Teacher

router.post('/TeacherReg', teacherRegister);
router.post('/TeacherLogin', teacherLogIn);

router.get("/Teachers/:id", getTeachers);
router.get("/Teacher/:id", getTeacherDetail);

router.delete("/Teachers/:id", deleteTeachers);
router.delete("/TeachersClass/:id", deleteTeachersByClass);
router.delete("/Teacher/:id", deleteTeacher);

router.put("/TeacherSubject", updateTeacherSubject);

router.post('/TeacherAttendance/:id', teacherAttendance);

// Student

router.post('/StudentReg', upload.single('photo'), async (req, res) => {
    try {
        // Upload photo to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'students'
        });

        // Get photo URL
        const photoUrl = result.secure_url;

        // Create a new student object with the photo URL and other data
        req.body.photo = photoUrl; // Add photo URL to request body

        // Call the studentRegister controller function
        studentRegister(req, res);
    } catch (error) {
        res.status(500).json({ message: 'Failed to upload photo', error: error.message });
    }
});
router.post('/StudentLogin', studentLogIn);

router.get("/Students/:id", getStudents);
router.get("/Student/:id", getStudentDetail);

router.delete("/Students/:id", deleteStudents);
router.delete("/StudentsClass/:id", deleteStudentsByClass);
router.delete("/Student/:id", deleteStudent);

router.put("/Student/:id", updateStudent);

router.put('/UpdateExamResult/:id', updateExamResult);

router.put('/StudentAttendance/:id', studentAttendance);

router.put('/RemoveAllStudentsSubAtten/:id', clearAllStudentsAttendanceBySubject);
router.put('/RemoveAllStudentsAtten/:id', clearAllStudentsAttendance);

router.put('/RemoveStudentSubAtten/:id', removeStudentAttendanceBySubject);
router.put('/RemoveStudentAtten/:id', removeStudentAttendance);

// Notice

router.post('/NoticeCreate', noticeCreate);

router.get('/NoticeList/:id', noticeList);

router.delete("/Notices/:id", deleteNotices);
router.delete("/Notice/:id", deleteNotice);

router.put("/Notice/:id", updateNotice);


// Grading

router.post('/GradingCreate', gradingCreate);
router.get('/GradingList/:id', gradingList);
router.put("/Grading/:id", updateGrading);
router.delete("/Grading/:id", deleteGrading);


// HeadTeacher Comment

router.post('/HeadTeacherCommentCreate', headTeacherCommentCreate);
router.get('/HeadTeacherCommentList/:id', headTeacherCommentList);
router.put("/HeadTeacherComment/:id", updateHeadTeacherComment);
router.delete("/HeadTeacherComment/:id", deleteHeadTeacherComment);


// ClassTeacher Comment

router.post('/ClassTeacherCommentCreate', classTeacherCommentCreate);
router.get('/ClassTeacherCommentList/:id', classTeacherCommentList);
router.put("/ClassTeacherComment/:id", updateClassTeacherComment);
router.delete("/ClassTeacherComment/:id", deleteClassTeacherComment);


// Complain

router.post('/ComplainCreate', complainCreate);

router.get('/ComplainList/:id', complainList);

module.exports = router;
