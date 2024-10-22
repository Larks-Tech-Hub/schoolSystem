import { useEffect, useState  , useRef} from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom'
import { getClassDetails, getClassStudents, getSubjectList } from "../../../redux/sclassRelated/sclassHandle";
import { deleteUser } from '../../../redux/userRelated/userHandle';
import {
    Box,
    Tab,
    IconButton,
    Container,
    Typography,
    BottomNavigation,
    BottomNavigationAction,
    Paper,
  CircularProgress,
  } from "@mui/material";
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { resetSubjects } from "../../../redux/sclassRelated/sclassSlice";
import { BlueButton, GreenButton, PurpleButton } from "../../../components/buttonStyles";
import TableTemplate from "../../../components/TableTemplate";
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import SpeedDialTemplate from "../../../components/SpeedDialTemplate";
import Popup from "../../../components/Popup";
import DeleteIcon from "@mui/icons-material/Delete";
import PostAddIcon from '@mui/icons-material/PostAdd';
import InsertChartIcon from "@mui/icons-material/InsertChart";
import InsertChartOutlinedIcon from "@mui/icons-material/InsertChartOutlined";
import { updateStudentFields } from "../../../redux/studentRelated/studentHandle";
import TableChartIcon from "@mui/icons-material/TableChart";
import TableChartOutlinedIcon from "@mui/icons-material/TableChartOutlined";

const ClassDetails = () => {
    const params = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const { subjectsList, sclassStudents, sclassDetails, loading, error, response, getresponse } = useSelector((state) => state.sclass);

    useSelector((state) => state.sclass);
    const [successMessage, setSuccessMessage] = useState("");

    const classID = params.id
    const [disciplineByStudent, setDisciplineByStudent] = useState({});
    const [smartnessByStudent, setSmartnessByStudent] = useState({});
    const [timeByStudent, setTimeByStudent] = useState({});
    const [attendanceByStudent, setAttendanceByStudent] = useState({});

    useEffect(() => {
        dispatch(getClassDetails(classID, "Sclass"));
        dispatch(getSubjectList(classID, "ClassSubjects"))
        dispatch(getClassStudents(classID));
    }, [dispatch, classID])

    if (error) {
        console.log(error)
    }
    
    // discipline
    const handleDisciplineChange = (studentId, value) => {
        setDisciplineByStudent(prevDiscipline => ({
          ...prevDiscipline,
          [studentId]: value,
        }));
      };
    // time
    const handleMarksChange = (studentId, value) => {
    setTimeByStudent(prevTime => ({
      ...prevTime,
      [studentId]: value,
    }));
  };

    const [value, setValue] = useState('1');

    const [loader, setLoader] = useState(false);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const [selectedSection, setSelectedSection] = useState("attendance");
    const handleSectionChange = (event, newSection) => {
        setSelectedSection(newSection);
    };

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");

    const deleteHandler = (deleteID, address) => {
        // console.log(deleteID);
        // console.log(address);
        // setMessage("Sorry the delete function has been disabled for now.")
        // setShowPopup(true);
        dispatch(deleteUser(deleteID, address))
            .then(() => {
                dispatch(getClassStudents(classID));
                dispatch(resetSubjects())
                dispatch(getSubjectList(classID, "ClassSubjects"))
            })
    }

    const subjectColumns = [
        { id: 'name', label: 'Subject Name', minWidth: 170 },
        { id: 'code', label: 'Subject Code', minWidth: 100 },
    ]

    const subjectRows = subjectsList && subjectsList.length > 0 && subjectsList.map((subject) => {
        return {
            name: subject.subName,
            code: subject.subCode,
            id: subject._id,
        };
    })

    const SubjectsButtonHaver = ({ row }) => {
        return (
            <>
                <IconButton onClick={() => deleteHandler(row.id, "Subject")}>
                    <DeleteIcon color="error" />
                </IconButton>
                <BlueButton
                    variant="contained"
                    onClick={() => {
                        navigate(`/Admin/class/subject/${classID}/${row.id}`)
                    }}
                >
                    View
                </BlueButton >
            </>
        );
    };

    const subjectActions = [
        {
            icon: <PostAddIcon color="primary" />, name: 'Add New Subject',
            action: () => navigate("/Admin/addsubject/" + classID)
        },
        {
            icon: <DeleteIcon color="error" />, name: 'Delete All Subjects',
            action: () => deleteHandler(classID, "SubjectsClass")
        }
    ];

    const ClassSubjectsSection = () => {
        return (
            <>
                {response ?
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                        <GreenButton
                            variant="contained"
                            onClick={() => navigate("/Admin/addsubject/" + classID)}
                        >
                            Add Subjects
                        </GreenButton>
                    </Box>
                    :
                    <>
                        <Typography variant="h5" gutterBottom>
                            Subjects List:
                        </Typography>

                        <TableTemplate buttonHaver={SubjectsButtonHaver} columns={subjectColumns} rows={subjectRows} />
                        <SpeedDialTemplate actions={subjectActions} />
                    </>
                }
            </>
        )
    }

    const studentColumns = [
        { id: 'name', label: 'Name', minWidth: 170 },
        { id: 'rollNum', label: 'Lin Number', minWidth: 100 },
    ]

    const studentRows = sclassStudents.map((student) => {
        return {
            name: student.name,
            rollNum: student.rollNum,
            id: student._id,
        };
    })

    const StudentsButtonHaver = ({ row }) => {
        return (
            <>
                <IconButton onClick={() => deleteHandler(row.id, "Student")}>
                    <PersonRemoveIcon color="error" />
                </IconButton>
                <BlueButton
                    variant="contained"
                    onClick={() => navigate("/Admin/students/student/" + row.id)}
                >
                    View
                </BlueButton>
                {/* <PurpleButton
                    variant="contained"
                    onClick={() =>
                        navigate("/Admin/students/student/attendance/" + row.id)
                    }
                >
                    Attendance
                </PurpleButton> */}
            </>
        );
    };

    // conduct
    const studentConductColumns = [
        { id: 'rollNum', label: 'Lin Number', minWidth: 100 },
        { id: 'name', label: 'Name', minWidth: 170 },
        { id: "discipline", label: "Discipline", minWidth: 150 },
        { id: "timeManagement", label: "Time Management", minWidth: 150 },
        { id: "smartness", label: "Smartness", minWidth: 150 },
        { id: "attendanceRemarks", label: "Attendance", minWidth: 150 },
        ]

    const studentConductRows = sclassStudents.map((student) => {
        return {
            rollNum: student.rollNum,
            name: student.name,
            discipline: student.discipline,
            timeManagement: student.timeManagement,
            smartness: student.smartness,
            attendanceRemarks: student.attendanceRemarks,
            id: student._id,
        };
    })

    // first discipline
    const studentDisciplineColumns = [
        { id: 'rollNum', label: 'Lin Number', minWidth: 100 },
        { id: 'name', label: 'Name', minWidth: 170 },
        { id: "discipline", label: "Discipline", minWidth: 150 },
        ]

    const studentDisciplineRows = sclassStudents.map((student) => {
        return {
            rollNum: student.rollNum,
            name: student.name,
            discipline: student.discipline,
            id: student._id,
        };
    })

    // first Time
    const studentTimeColumns = [
        { id: 'rollNum', label: 'Lin Number', minWidth: 100 },
        { id: 'name', label: 'Name', minWidth: 170 },
        { id: "timeManagement", label: "Time Management", minWidth: 150 },
        ]

    const studentTimeRows = sclassStudents.map((student) => {
        return {
            rollNum: student.rollNum,
            name: student.name,
            timeManagement: student.timeManagement,
            id: student._id,
        };
    })

    // first Smartness
    const studentSmartnessColumns = [
        { id: 'rollNum', label: 'Lin Number', minWidth: 100 },
        { id: 'name', label: 'Name', minWidth: 170 },
        { id: "smartness", label: "Smartness", minWidth: 150 },
        ]

    const studentSmartnessRows = sclassStudents.map((student) => {
        return {
            rollNum: student.rollNum,
            name: student.name,
            smartness: student.smartness,
            id: student._id,
        };
    })

    // first Attendance
    const studentAttendanceColumns = [
        { id: 'rollNum', label: 'Lin Number', minWidth: 100 },
        { id: 'name', label: 'Name', minWidth: 170 },
        { id: "attendanceRemarks", label: "Attendance", minWidth: 150 },
        ]

    const studentAttendanceRows = sclassStudents.map((student) => {
        return {
            rollNum: student.rollNum,
            name: student.name,
            attendanceRemarks: student.attendanceRemarks,
            id: student._id,
        };
    })

    const disciplineSubmitHandler = async (event, studentId) => {
    event.preventDefault();
    setLoader(true);
    setSuccessMessage(""); // Reset the success message before submission

    const disciplineObtained = disciplineByStudent[studentId] || ""; 
    const disciplineFields = { discipline: disciplineObtained };
  
  
    try {
      // Perform API call or dispatch action
      await dispatch(updateStudentFields(studentId, disciplineFields, "Student"));
      
      // If successful, set the success message
      setSuccessMessage("Added/Updated Successfully");
      console.log(disciplineFields);
      
    } catch (error) {
      // Handle errors if needed
      console.error("Submission failed", error);
      // Optionally set an error message or handle error state here
    } finally {
      setLoader(false); // Always stop the loader
    }
  };

  const timeSubmitHandler = async (event, studentId) => {
    event.preventDefault();
    setLoader(true);
    setSuccessMessage(""); // Reset the success message before submission

    const timeObtained = timeByStudent[studentId] || ""; 
    const timeFields = { timeManagement: timeObtained };
  
  
    try {
      // Perform API call or dispatch action
      await dispatch(updateStudentFields(studentId, timeFields, "Student"));
      
      // If successful, set the success message
      setSuccessMessage("Added/Updated Successfully");
    //   console.log(timeFields);
      
    } catch (error) {
      // Handle errors if needed
      console.error("Submission failed", error);
      // Optionally set an error message or handle error state here
    } finally {
      setLoader(false); // Always stop the loader
    }
  };

  const smartnessSubmitHandler = async (event, studentId) => {
    event.preventDefault();
    setLoader(true);
    setSuccessMessage(""); // Reset the success message before submission

    const smartnessObtained = smartnessByStudent[studentId] || ""; 
    const smartnessFields = { smartness: smartnessObtained };
  
  
    try {
      // Perform API call or dispatch action
      await dispatch(updateStudentFields(studentId, smartnessFields, "Student"));
      
      // If successful, set the success message
      setSuccessMessage("Added/Updated Successfully");
      
    } catch (error) {
      // Handle errors if needed
      console.error("Submission failed", error);
      // Optionally set an error message or handle error state here
    } finally {
      setLoader(false); // Always stop the loader
    }
  };

  const attendanceSubmitHandler = async (event, studentId) => {
    event.preventDefault();
    setLoader(true);
    setSuccessMessage(""); // Reset the success message before submission

    const attendanceObtained = attendanceByStudent[studentId] || ""; 
    const attendanceFields = { attendanceRemarks: attendanceObtained };
  
  
    try {
      // Perform API call or dispatch action
      await dispatch(updateStudentFields(studentId, attendanceFields, "Student"));
      
      // If successful, set the success message
      setSuccessMessage("Added/Updated Successfully");
      
    } catch (error) {
      // Handle errors if needed
      console.error("Submission failed", error);
      // Optionally set an error message or handle error state here
    } finally {
      setLoader(false); // Always stop the loader
    }
  };



    const ConductButtonHaver = ({ row }) => {
        return (
            <>
                {/* <IconButton onClick={() => deleteHandler(row.id, "Student")}>
                    <PersonRemoveIcon color="error" />
                </IconButton>
                <BlueButton
                    variant="contained"
                    onClick={() => navigate("/Admin/students/student/" + row.id)}
                >
                    View
                </BlueButton>
                <PurpleButton
                    variant="contained"
                    onClick={() =>
                        navigate("/Admin/students/student/attendance/" + row.id)
                    }
                >
                    Attendance
                </PurpleButton> */}
            </>
        );
    };

    const ConductButtonHaver1 = ({ row }) => {
    const inputRef = useRef(null);
    const [focusedRowId, setFocusedRowId] = useState(null);

    const handleFocus = () => {
      setFocusedRowId(row.id);
    };

    // Handle change event to update marks
    const handleChange = (e) => {
        const { name, value } = e.target;
        // Update the state for the selected discipline
        setDisciplineByStudent((prevState) => ({
          ...prevState,
          [name]: value,
        }));
      };
  

   // Manage the focus on component mount or when focusedRowId changes
  useEffect(() => {
    if (focusedRowId === row.id) {
      inputRef.current?.focus();
    }
  }, [focusedRowId, row.id]);

    return (
      <>
        <form onSubmit={(e) => {
        //   setExamsSession("bot");
          disciplineSubmitHandler(e, row.id)
        }
          }>
          <select
            name={row.id}
            className="marksInput border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            value={disciplineByStudent[row.id] || ""}
            onChange={handleChange}
            defaultValue=""
            >
            <option value="" disabled>
                Select Discipline
            </option>
            <option value="Excellent">Excellent</option>
             <option value="V. Good">V. Good</option>
            <option value="Good">Good</option>
            <option value="Fair">Fair</option>
            <option value="Poor">Poor</option>
            </select>
          <button
            className="registerButton"
            type="submit"
            disabled={loader}
          >
            {loader ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Add/Update"
            )}
          </button>
      {successMessage && (
        <div className="successMessage">{successMessage}</div>
      )}

        </form>
      </>
    );
  };

  const ConductButtonHaver2 = ({ row }) => {
    const inputRef = useRef(null);
    const [focusedRowId, setFocusedRowId] = useState(null);

    const handleFocus = () => {
      setFocusedRowId(row.id);
    };

    // Handle change event to update marks
    const handleChange = (e) => {
        const { name, value } = e.target;
        // Update the state for the selected discipline
        setTimeByStudent((prevState) => ({
          ...prevState,
          [name]: value,
        }));
      };
  

   // Manage the focus on component mount or when focusedRowId changes
  useEffect(() => {
    if (focusedRowId === row.id) {
      inputRef.current?.focus();
    }
  }, [focusedRowId, row.id]);

    return (
      <>
        <form onSubmit={(e) => {
        //   setExamsSession("bot");
          timeSubmitHandler(e, row.id)
        }
          }>
        <select
            name={row.id}
            className="marksInput border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            value={timeByStudent[row.id] || ""}
            onChange={handleChange}

            defaultValue=""
            >
            <option value="" disabled>
                Select Time Management
            </option>
            <option value="Excellent">Excellent</option>
             <option value="V. Good">V. Good</option>
            <option value="Good">Good</option>
            <option value="Fair">Fair</option>
            <option value="Poor">Poor</option>
            </select>
          <button
            className="registerButton"
            type="submit"
            disabled={loader}
          >
            {loader ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Add/Update"
            )}
          </button>
      {successMessage && (
        <div className="successMessage">{successMessage}</div>
      )}

        </form>
      </>
    );
  };
  
  const ConductButtonHaver3 = ({ row }) => {
    const inputRef = useRef(null);
    const [focusedRowId, setFocusedRowId] = useState(null);

    const handleFocus = () => {
      setFocusedRowId(row.id);
    };

    // Handle change event to update marks
    const handleChange = (e) => {
        const { name, value } = e.target;
        // Update the state for the selected discipline
        setSmartnessByStudent((prevState) => ({
          ...prevState,
          [name]: value,
        }));
      };
  

   // Manage the focus on component mount or when focusedRowId changes
  useEffect(() => {
    if (focusedRowId === row.id) {
      inputRef.current?.focus();
    }
  }, [focusedRowId, row.id]);

    return (
      <>
        <form onSubmit={(e) => {
        //   setExamsSession("bot");
          smartnessSubmitHandler(e, row.id)
        }
          }>
        <select
            name={row.id}
            className="marksInput border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            value={smartnessByStudent[row.id] || ""}
            onChange={handleChange}
            defaultValue=""
            >
            <option value="" disabled>
                Select Smartness
            </option>
            <option value="Excellent">Excellent</option>
             <option value="V. Good">V. Good</option>
            <option value="Good">Good</option>
            <option value="Fair">Fair</option>
            <option value="Poor">Poor</option>
            </select>
          <button
            className="registerButton"
            type="submit"
            disabled={loader}
          >
            {loader ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Add/Update"
            )}
          </button>
      {successMessage && (
        <div className="successMessage">{successMessage}</div>
      )}

        </form>
      </>
    );
  };

  const ConductButtonHaver4 = ({ row }) => {
    const inputRef = useRef(null);
    const [focusedRowId, setFocusedRowId] = useState(null);

    const handleFocus = () => {
      setFocusedRowId(row.id);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        // Update the state for the selected discipline
        setAttendanceByStudent((prevState) => ({
          ...prevState,
          [name]: value,
        }));
      };
  

   // Manage the focus on component mount or when focusedRowId changes
  useEffect(() => {
    if (focusedRowId === row.id) {
      inputRef.current?.focus();
    }
  }, [focusedRowId, row.id]);

    return (
      <>
        <form onSubmit={(e) => {
        //   setExamsSession("bot");
          attendanceSubmitHandler(e, row.id)
        }
          }>
        <select
            name={row.id}
            className="marksInput border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            value={attendanceByStudent[row.id] || ""}
            onChange={handleChange}
            defaultValue=""
            >
            <option value="" disabled>
                Select Attendance
            </option>
            <option value="Excellent">Excellent</option>
             <option value="V. Good">V. Good</option>
            <option value="Good">Good</option>
            <option value="Fair">Fair</option>
            <option value="Poor">Poor</option>
            </select>
          <button
            className="registerButton"
            type="submit"
            disabled={loader}
          >
            {loader ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Add/Update"
            )}
          </button>
      {successMessage && (
        <div className="successMessage">{successMessage}</div>
      )}

        </form>
      </>
    );
  };
 

    const studentActions = [
        {
            icon: <PersonAddAlt1Icon color="primary" />, name: 'Add New Student',
            action: () => navigate("/Admin/class/addstudents/" + classID)
        },
        {
            icon: <PersonRemoveIcon color="error" />, name: 'Delete All Students',
            action: () => deleteHandler(classID, "StudentsClass")
        },
    ];

    const ClassStudentsSection = () => {
        return (
            <>
                {getresponse ? (
                    <>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                            <GreenButton
                                variant="contained"
                                onClick={() => navigate("/Admin/class/addstudents/" + classID)}
                            >
                                Add Students
                            </GreenButton>
                        </Box>
                    </>
                ) : (
                    <>
                        <Typography variant="h5" gutterBottom>
                            Students List:
                        </Typography>

                        <TableTemplate buttonHaver={StudentsButtonHaver} columns={studentColumns} rows={studentRows} />
                        <SpeedDialTemplate actions={studentActions} />
                    </>
                )}
            </>
        )
    }

    const ClassConductSection = () => {
    return (
      <>
        {getresponse ? (
          <>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "16px",
              }}
            >
              <GreenButton
                variant="contained"
                onClick={() => navigate("/Admin/class/addstudents/" + classID)}
              >
                Add Students
              </GreenButton>
            </Box>
          </>
        ) : (
          <>
            <Typography variant="h5" gutterBottom>
              Pupil's General Conducts:
            </Typography>

            {selectedSection === "attendance" && (
              <TableTemplate
                buttonHaver={ConductButtonHaver}
                columns={studentConductColumns}
                rows={studentConductRows}
              />
            )}
            {selectedSection === "marks1" && (
              <TableTemplate
                buttonHaver={ConductButtonHaver1}
                columns={studentDisciplineColumns}
                rows={studentDisciplineRows}
              />
            )}
            {selectedSection === "marks2" && (
              <TableTemplate
                buttonHaver={ConductButtonHaver2}
                columns={studentTimeColumns}
                rows={studentTimeRows}
              />
            )}
            {selectedSection === "marks3" && (
              <TableTemplate
                buttonHaver={ConductButtonHaver3}
                columns={studentSmartnessColumns}
                rows={studentSmartnessRows}
              />
            )}
            {selectedSection === "mid" && (
              <TableTemplate
                buttonHaver={ConductButtonHaver4}
                columns={studentAttendanceColumns}
                rows={studentAttendanceRows}
              />
            )}
            {/* {selectedSection === "end" && (
              <TableTemplate
                buttonHaver={PrintEndButtonHaver3}
                columns={printEndColumns}
                rows={printEndRows}
              />
            )}  */}

            <Paper
              sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
              elevation={3}
            >
              <BottomNavigation
                value={selectedSection}
                onChange={handleSectionChange}
                showLabels
              >
                <BottomNavigationAction
                  label="Show Conducts"
                  value="attendance"
                  icon={
                    selectedSection === "attendance" ? (
                      <TableChartIcon />
                    ) : (
                      <TableChartOutlinedIcon />
                    )
                  }
                />
                <BottomNavigationAction
                  label="Add Discipline"
                  value="marks1"
                  icon={
                    selectedSection === "marks1" ? (
                      <InsertChartIcon />
                    ) : (
                      <InsertChartOutlinedIcon />
                    )
                  }
                />
                <BottomNavigationAction
                  label="Add Time Management"
                  value="marks2"
                  icon={
                    selectedSection === "marks2" ? (
                      <InsertChartIcon />
                    ) : (
                      <InsertChartOutlinedIcon />
                    )
                  }
                />
                <BottomNavigationAction
                  label="Add Smartness"
                  value="marks3"
                  icon={
                    selectedSection === "marks3" ? (
                      <InsertChartIcon />
                    ) : (
                      <InsertChartOutlinedIcon />
                    )
                  }
                />
                <BottomNavigationAction
                  label="Add Attendance"
                  value="mid"
                  icon={
                    selectedSection === "mid" ? (
                      <InsertChartIcon />
                    ) : (
                      <InsertChartOutlinedIcon />
                    )
                  }
                />
              </BottomNavigation>
            </Paper>
          </>
        )}
      </>
    );
  };

    
    const ClassConductSection1 = () => {
        return (
            <>
                {getresponse ? (
                    <>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                            <GreenButton
                                variant="contained"
                                onClick={() => navigate("/Admin/class/addstudents/" + classID)}
                            >
                                Add Students
                            </GreenButton>
                        </Box>
                    </>
                ) : (
                    <>
                        <Typography variant="h5" gutterBottom>
                            Pupil's General Conducts:
                        </Typography>

                        <TableTemplate buttonHaver={ConductButtonHaver} columns={studentConductColumns} rows={studentConductRows} />
                        <SpeedDialTemplate actions={studentActions} />
                    </>
                )}
            </>
        )
    }

    const ClassTeachersSection = () => {
        return (
            <>
                Teachers
            </>
        )
    }

    const ClassDetailsSection = () => {
        const numberOfSubjects = subjectsList.length;
        const numberOfStudents = sclassStudents.length;

        return (
            <>
                <Typography variant="h4" align="center" gutterBottom>
                    <span style={{ fontWeight: 'bold' }}>Class Details</span> 
                </Typography>
                <Typography variant="h5" gutterBottom>
                    <span style={{ fontWeight: 'bold' }}>This is Class</span>  {sclassDetails && sclassDetails.sclassName}
                </Typography>
                <Typography variant="h6" gutterBottom>
                    <span style={{ fontWeight: 'bold' }}>Number of Subjects: </span> {numberOfSubjects}
                </Typography>
                <Typography variant="h6" gutterBottom>
                    <span style={{ fontWeight: 'bold' }}>Number of Students: </span> {numberOfStudents}
                </Typography>
                {getresponse &&
                    <GreenButton
                        variant="contained"
                        onClick={() => navigate("/Admin/class/addstudents/" + classID)}
                    >
                        Add Students
                    </GreenButton>
                }
                {response &&
                    <GreenButton
                        variant="contained"
                        onClick={() => navigate("/Admin/addsubject/" + classID)}
                    >
                        Add Subjects
                    </GreenButton>
                }
            </>
        );
    }

    return (
        <>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <>
                    <Box sx={{ width: '100%', typography: 'body1', }} >
                        <TabContext value={value}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <TabList onChange={handleChange} sx={{ position: 'fixed', width: '100%', bgcolor: 'background.paper', zIndex: 1 }}>
                                    <Tab label="Details" value="1" />
                                    <Tab label="Subjects" value="2" />
                                    <Tab label="Students" value="3" />
                                    <Tab label="General Conduct" value="4" />
                                    <Tab label="Teachers" value="5" />
                                </TabList>
                            </Box>
                            <Container sx={{ marginTop: "3rem", marginBottom: "4rem" }}>
                                <TabPanel value="1">
                                    <ClassDetailsSection />
                                </TabPanel>
                                <TabPanel value="2">
                                    <ClassSubjectsSection />
                                </TabPanel>
                                <TabPanel value="3">
                                    <ClassStudentsSection />
                                </TabPanel>
                                <TabPanel value="4">
                                    <ClassConductSection />
                                </TabPanel>
                                <TabPanel value="5">
                                    <ClassTeachersSection />
                                </TabPanel>
                            </Container>
                        </TabContext>
                    </Box>
                </>
            )}
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </>
    );
};


export default ClassDetails;