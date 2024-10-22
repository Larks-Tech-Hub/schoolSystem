import React, { useEffect, useState , useRef} from "react";
// import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import { getClassStudents } from "../../redux/sclassRelated/sclassHandle";
import { Paper, Box, Typography, ButtonGroup, Button, Popper, Grow, ClickAwayListener, MenuList, MenuItem ,CircularProgress,} from '@mui/material';
import { BlackButton, BlueButton} from "../../components/buttonStyles";
import TableTemplate from "../../components/TableTemplate";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { updateStudentFields } from "../../redux/studentRelated/studentHandle"

const TeacherClassMid = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const { sclassStudents, loading, error, getresponse } = useSelector((state) => state.sclass);

    const { currentUser } = useSelector((state) => state.user);
    const classID = currentUser.teachSclass?._id
    const [successMessage, setSuccessMessage] = useState("");
    const subjectID = currentUser.teachSubject?._id
    const [marksByStudent, setMarksByStudent] = useState({});
    const [loader, setLoader] = useState(false);
    const [value, setValue] = useState("1");

    // Example of calling the handler for "mot"
  const marksSubmitHandler = async (event, studentId, session) => {
    console.log(session);
    event.preventDefault();
    setLoader(true);
    setSuccessMessage(""); // Reset the success message before submission
  
    const marksObtained = marksByStudent[studentId] || ""; // Get marks for the specific student
    const fields = { subName: subjectID, marksObtained, examsSession: session };
  
    try {
      // Perform API call or dispatch action
      await dispatch(updateStudentFields(studentId, fields, "UpdateExamResult"));
  
      // If successful, set the success message
      setSuccessMessage("Added/Updated Successfully");
  
      // Navigate after successful update
    //   navigate(`/Admin/subjects/subject/${classID}/${subjectID}`);
    } catch (error) {
      // Handle errors if needed
      console.error("Submission failed", error);
      // Optionally set an error message or handle error state here
    } finally {
      setLoader(false); // Always stop the loader
    }
  };
  

    const motMarksSubmitHandler = (event, studentId) => marksSubmitHandler(event, studentId, "mot");

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleMarksChange = (studentId, value) => {
        setMarksByStudent(prevMarks => ({
          ...prevMarks,
          [studentId]: value,
        }));
      };
    

    useEffect(() => {
        dispatch(getClassStudents(classID));
    }, [dispatch, classID])

    if (error) {
        console.log(error)
    }

    const studentColumns = [
        { id: 'rollNum', label: 'Lin Number', minWidth: 100 },
        { id: 'name', label: 'Name', minWidth: 170 },
        { id: "midObtained", label: "Marks For MOT", minWidth: 170 },
        // { id: "midObtained", label: "Marks For MID", minWidth: 170 },
        // { id: "endObtained", label: "Marks For EOT", minWidth: 170 },
       
    ]

    const studentRows = sclassStudents.map((student) => {
        const midExam = student.midExamResult.find(exam => exam.subName === subjectID);

        const mid = midExam ? midExam.marksObtained : "";
        return {
            rollNum: student.rollNum,
            name: student.name,
            midObtained: mid,
            id: student._id,
        };
    })

    const StudentsButtonHaver = ({ row }) => {
        const inputRef = useRef(null);
        const [focusedRowId, setFocusedRowId] = useState(null);
        // const options = ['Take Attendance', 'Provide Marks'];
        const options = Array.from({ length: 101 }, (_, i) => i);

        const [open, setOpen] = React.useState(false);
        const anchorRef = React.useRef(null);
        const [selectedIndex, setSelectedIndex] = React.useState(0);

        const handleFocus = () => {
            setFocusedRowId(row.id);
          };

         // Handle change event to update marks
        const handleChange = (event) => {
            const value = event.target.value;
            if (/^\d*$/.test(value)) {
            handleMarksChange(row.id, value);
            }
        };

         // Manage the focus on component mount or when focusedRowId changes
        useEffect(() => {
            if (focusedRowId === row.id) {
            inputRef.current?.focus();
            }
        }, [focusedRowId, row.id]);

        // Prevent focus from shifting to other inputs
        const handleKeyDown = (event) => {
            if (event.key === 'Tab' || event.key === 'Enter') {
            event.preventDefault();
            }
        };

        // const handleClick = () => {
        //     console.info(`You clicked ${options[selectedIndex]}`);
        //     if (selectedIndex === 0) {
        //         handleAttendance();
        //     } else if (selectedIndex === 1) {
        //         handleMarks();
        //     }
        // };

        // const handleAttendance = () => {
        //     navigate(`/Teacher/class/student/attendance/${row.id}/${subjectID}`)
        // }
        // const handleMarks = () => {
        //     navigate(`/Teacher/class/student/botmarks/${row.id}/${subjectID}`)
        // };

        // const handleMenuItemClick = (event, index) => {
        //     setSelectedIndex(index);
        //     setOpen(false);
        // };

        // const handleToggle = () => {
        //     setOpen((prevOpen) => !prevOpen);
        // };

        // const handleClose = (event) => {
        //     if (anchorRef.current && anchorRef.current.contains(event.target)) {
        //         return;
        //     }

        //     setOpen(false);
        // };
        
          
        // Example of calling the handler for "bot"
        // const botMarksSubmitHandler = (event, studentId) => marksSubmitHandler(event, studentId, "bot");
        
        return (
            <>
            <form onSubmit={(e) => {
          // setExamsSession("bot");
                    motMarksSubmitHandler(e, row.id)
                    }
                    }>
                    
                    <select
                        className="marksInput border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        value={marksByStudent[row.id] || ""}
                        onChange={handleChange}
                        required
                        autoFocus
                        inputMode="numeric"
                        pattern="[0-9]*"
                        min="0" // Set the minimum value to 0 or any other appropriate minimum
                        step="1"
                        max="100"
                        onFocus={handleFocus}
                        onKeyDown={handleKeyDown}
                        tabIndex={0}
                    >
                        <option value="" >Marks</option>
                        {options.map((num) => (
                        <option key={num} value={num}>
                            {num}
                        </option>
                        ))}
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
                    {/* <BlueButton
                    variant="contained"
                    // onClick={() => navigate("/Admin/students/student/" + row.id)}
                    onClick={() => navigate(`/Admin/students/student/${row.id}`)}
                    >
                    View
                    </BlueButton> */}

                    </form>
                {/* <BlueButton
                    variant="contained"
                    onClick={() =>
                        navigate("/Teacher/class/student/" + row.id)
                    }
                >
                    View
                </BlueButton> */}
                {/* <React.Fragment>
                    <ButtonGroup variant="contained" ref={anchorRef} aria-label="split button">
                        <Button onClick={handleClick}>{options[selectedIndex]}</Button>
                        <BlackButton
                            size="small"
                            aria-controls={open ? 'split-button-menu' : undefined}
                            aria-expanded={open ? 'true' : undefined}
                            aria-label="select merge strategy"
                            aria-haspopup="menu"
                            onClick={handleToggle}
                        >
                            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                        </BlackButton>
                    </ButtonGroup>
                    <Popper
                        sx={{
                            zIndex: 1,
                        }}
                        open={open}
                        anchorEl={anchorRef.current}
                        role={undefined}
                        transition
                        disablePortal
                    >
                        {({ TransitionProps, placement }) => (
                            <Grow
                                {...TransitionProps}
                                style={{
                                    transformOrigin:
                                        placement === 'bottom' ? 'center top' : 'center bottom',
                                }}
                            >
                                <Paper>
                                    <ClickAwayListener onClickAway={handleClose}>
                                        <MenuList id="split-button-menu" autoFocusItem>
                                            {options.map((option, index) => (
                                                <MenuItem
                                                    key={option}
                                                    disabled={index === 2}
                                                    selected={index === selectedIndex}
                                                    onClick={(event) => handleMenuItemClick(event, index)}
                                                >
                                                    {option}
                                                </MenuItem>
                                            ))}
                                        </MenuList>
                                    </ClickAwayListener>
                                </Paper>
                            </Grow>
                        )}
                    </Popper>
                </React.Fragment> */}
            </>
        );
    };

    return (
        <>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <>
                    <Typography variant="h4" align="center" gutterBottom>
                        Class Details
                    </Typography>
                    {getresponse ? (
                        <>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                                No Students Found
                            </Box>
                        </>
                    ) : (
                        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                            <Typography variant="h5" gutterBottom>
                                Students List:  M.O.T
                            </Typography>

                            {Array.isArray(sclassStudents) && sclassStudents.length > 0 &&
                                <TableTemplate buttonHaver={StudentsButtonHaver} columns={studentColumns} rows={studentRows} />
                            }
                        </Paper>
                    )}
                </>
            )}
        </>
    );
};

export default TeacherClassMid;