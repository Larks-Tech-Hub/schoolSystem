import { useState } from 'react';
import {
    CssBaseline,
    Box,
    Toolbar,
    List,
    Typography,
    Divider,
    IconButton,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AppBar, Drawer } from '../../components/styles';
import Logout from '../Logout';
import SideBar from './SideBar';
import AdminProfile from './AdminProfile';
import AdminHomePage from './AdminHomePage';

import AddStudent from './studentRelated/AddStudent';
import SeeComplains from './studentRelated/SeeComplains';
import ShowStudents from './studentRelated/ShowStudents';
import StudentAttendance from './studentRelated/StudentAttendance';
import StudentBotExamMarks from './studentRelated/StudentBotExamMarks';
import StudentMotExamMarks from './studentRelated/StudentMotExamMarks';
import StudentEotExamMarks from './studentRelated/StudentEotExamMarks';
import MarkEntryStudents from './studentRelated/markEntryStudent';
import ViewStudent from './studentRelated/ViewStudent';

import AddNotice from './noticeRelated/AddNotice';
import ShowNotices from './noticeRelated/ShowNotices';

import ShowSubjects from './subjectRelated/ShowSubjects';
import SubjectForm from './subjectRelated/SubjectForm';
import ViewSubject from './subjectRelated/ViewSubject';

import AddTeacher from './teacherRelated/AddTeacher';
import ChooseClass from './teacherRelated/ChooseClass';
import ChooseSubject from './teacherRelated/ChooseSubject';
import ChooseEntrySubject from './studentRelated/ChooseEntrySubject';
import ShowTeachers from './teacherRelated/ShowTeachers';
import TeacherDetails from './teacherRelated/TeacherDetails';

import AddClass from './classRelated/AddClass';
import ClassDetails from './classRelated/ClassDetails';
import Prints from './classRelated/printMid';
import PrintEnd from './classRelated/print';
import ShowClasses from './classRelated/ShowClasses';
import AccountMenu from '../../components/AccountMenu';
// import ShowYears from './yearRelated/ShowYears';
// import YearDetails from './yearRelated/YearDetails';
// import AddYear from './yearRelated/AddYear';
import AddTerm from './termRelated/AddTerm';
import ShowTerms from './termRelated/ShowTerms';
import TermDetails from './termRelated/TermDetails';
import AddGrade from './gradeRelated/AddGrade';
import ShowGrades from './gradeRelated/ShowGrade';
import GradeDetails from './gradeRelated/GradeDetails';
import AddCt from './ctRelated/AddCt';
import ShowCt from './ctRelated/ShowCt';
import CtDetails from './ctRelated/CtDetails';
import AddHm from './hmRelated/AddHm';
import UpdateHm from './hmRelated/updateHm';
import ShowHm from './hmRelated/ShowHm';
import HmDetails from './hmRelated/HmDetails';
import UpdateTerm from './termRelated/updateTerm';
import UpdateGrade from './gradeRelated/UpdateGrade';
import UpdateCt from './ctRelated/updateCt';
import UpdateClass from './classRelated/UpdateClass';
import UpdateTeacher from './teacherRelated/UpdateTeacher';

const AdminDashboard = () => {
    const [open, setOpen] = useState(false);
    const toggleDrawer = () => {
        setOpen(!open);
    };

    return (
        <>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppBar open={open} position='absolute'>
                    <Toolbar sx={{ pr: '24px' }}>
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="open drawer"
                            onClick={toggleDrawer}
                            sx={{
                                marginRight: '36px',
                                ...(open && { display: 'none' }),
                            }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography
                            component="h1"
                            variant="h6"
                            color="inherit"
                            noWrap
                            sx={{ flexGrow: 1 }}
                        >
                            Admin Dashboard
                        </Typography>
                        <AccountMenu />
                    </Toolbar>
                </AppBar>
                <Drawer variant="permanent" open={open} sx={open ? styles.drawerStyled : styles.hideDrawer}>
                    <Toolbar sx={styles.toolBarStyled}>
                        <IconButton onClick={toggleDrawer}>
                            <ChevronLeftIcon />
                        </IconButton>
                    </Toolbar>
                    <Divider />
                    <List component="nav">
                        <SideBar />
                    </List>
                </Drawer>
                <Box component="main" sx={styles.boxStyled}>
                    <Toolbar />
                    <Routes>
                        <Route path="/" element={<AdminHomePage />} />
                        <Route path='*' element={<Navigate to="/" />} />
                        <Route path="/Admin/dashboard" element={<AdminHomePage />} />
                        <Route path="/Admin/profile" element={<AdminProfile />} />
                        <Route path="/Admin/complains" element={<SeeComplains />} />

                        {/* Notice */}
                        <Route path="/Admin/addnotice" element={<AddNotice />} />
                        <Route path="/Admin/notices" element={<ShowNotices />} />

                        {/* Subject */}
                        <Route path="/Admin/subjects" element={<ShowSubjects />} />
                        <Route path="/Admin/subjects/subject/:classID/:subjectID" element={<ViewSubject />} />
                        <Route path="/Admin/subjects/chooseclass" element={<ChooseClass situation="Subject" />} />

                        <Route path="/Admin/addsubject/:id" element={<SubjectForm />} />
                        <Route path="/Admin/class/subject/:classID/:subjectID" element={<ViewSubject />} />

                        <Route path="/Admin/subject/student/attendance/:studentID/:subjectID" element={<StudentAttendance situation="Subject" />} />
                        <Route path="/Admin/subject/student/botmarks/:studentID/:subjectID" element={<StudentBotExamMarks situation="Subject" />} />
                        <Route path="/Admin/subject/student/motmarks/:studentID/:subjectID" element={<StudentMotExamMarks situation="Subject" />} />
                        <Route path="/Admin/subject/student/eotmarks/:studentID/:subjectID" element={<StudentEotExamMarks situation="Subject" />} />

                        {/* Year */}
                        {/* <Route path="/Admin/addyear" element={<AddYear />} />
                        <Route path="/Admin/years" element={<ShowYears />} />
                        <Route path="/Admin/years/class/:id" element={<YearDetails />} />
                        <Route path="/Admin/year/addstudents/:id" element={<AddStudent situation="Year" />} /> */}

                        {/* Term */}
                        <Route path="/Admin/addterm" element={<AddTerm />} />
                        <Route path="/Admin/updateterm/:id" element={<UpdateTerm />} />
                        <Route path="/Admin/terms" element={<ShowTerms />} />
                        <Route path="/Admin/terms/class/:id" element={<TermDetails />} />
                        <Route path="/Admin/term/addstudents/:id" element={<AddStudent situation="Term" />} />

                        {/* Class */}
                        <Route path="/Admin/addclass" element={<AddClass />} />
                        <Route path="/Admin/updateclass/:id" element={<UpdateClass />} />
                        <Route path="/Admin/classes" element={<ShowClasses situation="Teacher"/>} />
                        <Route path="/Admin/classes/class/:id" element={<ClassDetails />} />
                        <Route path="/Admin/classes/print/:classID/:subjectID/:id" element={<Prints />} />

                        <Route path="/Admin/classes/printEnd/:classID/:subjectID/:id" element={<PrintEnd />} />
                        <Route path="/Admin/class/addstudents/:id" element={<AddStudent situation="Class" />} />

                        {/* Student */}
                        <Route path="/Admin/addstudents" element={<AddStudent situation="Student" />} />
                        <Route path="/Admin/students" element={<ShowStudents />} />

                        <Route path="/Admin/students/student/markEntryStudent/" element={<MarkEntryStudents />} />

                        <Route path="/Admin/students/student/:id" element={<ViewStudent />} />
                        <Route path="/Admin/students/student/:id" element={<Prints />} />
                        <Route path="/Admin/students/student/attendance/:id" element={<StudentAttendance situation="Student" />} />
                        <Route path="/Admin/students/student/botmarks/:id" element={<StudentBotExamMarks situation="Student" />} />
                        <Route path="/Admin/students/student/motmarks/:id" element={<StudentMotExamMarks situation="Student" />} />
                        <Route path="/Admin/students/student/eotmarks/:id" element={<StudentEotExamMarks situation="Student" />} />
                        <Route path="/Admin/students/chooseentrysubject/:id" element={<ChooseEntrySubject situation="Teacher" />} />

                        {/* Grade */}
                        <Route path="/Admin/addgrade" element={<AddGrade />} />
                        <Route path="/Admin/grades" element={<ShowGrades />} />
                        <Route path="/Admin/UpdateGrade/:id" element={<UpdateGrade />} />
                        <Route path="/Admin/grades/class/:id" element={<GradeDetails />} />
                        <Route path="/Admin/grade/addstudents/:id" element={<AddStudent situation="Grade" />} />

                        {/* HeadTeacher */}
                        <Route path="/Admin/addhm" element={<AddHm />} />
                        <Route path="/Admin/updatehm/:id" element={<UpdateHm />} />
                        <Route path="/Admin/hms" element={<ShowHm />} />
                        <Route path="/Admin/hms/class/:id" element={<HmDetails />} />
                        <Route path="/Admin/hm/addstudents/:id" element={<AddStudent situation="Hm" />} />

                        {/* ClassTeacher */}
                        <Route path="/Admin/addct" element={<AddCt />} />
                        <Route path="/Admin/cts" element={<ShowCt />} />
                        <Route path="/Admin/updatect/:id" element={<UpdateCt />} />
                        <Route path="/Admin/cts/class/:id" element={<CtDetails />} />
                        <Route path="/Admin/ct/addstudents/:id" element={<AddStudent situation="Ct" />} />

                        {/* Teacher */}
                        <Route path="/Admin/teachers" element={<ShowTeachers />} />
                        <Route path="/Admin/updateteacher/:id" element={<UpdateTeacher />} />
                        <Route path="/Admin/teachers/teacher/:id" element={<TeacherDetails />} />
                        <Route path="/Admin/teachers/chooseclass" element={<ChooseClass situation="Teacher" />} />
                        <Route path="/Admin/teachers/choosesubject/:id" element={<ChooseSubject situation="Norm" />} />
                        <Route path="/Admin/teachers/choosesubject/:classID/:teacherID" element={<ChooseSubject situation="Teacher" />} />
                        <Route path="/Admin/teachers/addteacher/:id" element={<AddTeacher />} />

                        <Route path="/logout" element={<Logout />} />
                    </Routes>
                </Box>
            </Box>
        </>
    );
}

export default AdminDashboard

const styles = {
    boxStyled: {
        backgroundColor: (theme) =>
            theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
    },
    toolBarStyled: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        px: [1],
    },
    drawerStyled: {
        display: "flex"
    },
    hideDrawer: {
        display: 'flex',
        '@media (max-width: 600px)': {
            display: 'none',
        },
    },
}