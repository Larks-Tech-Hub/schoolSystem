import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { getAllStudents } from '../../../redux/studentRelated/studentHandle';
import { deleteUser } from '../../../redux/userRelated/userHandle';
import {
    Paper, Box, Button, TextField
} from '@mui/material';
import { BlueButton, GreenButton } from '../../../components/buttonStyles';
import TableTemplate from '../../../components/TableTemplate';
import SaveIcon from '@mui/icons-material/Save';
import UpdateIcon from '@mui/icons-material/Update';
import SpeedDialTemplate from '../../../components/SpeedDialTemplate';

import * as React from 'react';

const MarkEntryStudents = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { studentsList, loading, response } = useSelector((state) => state.student);
    const { currentUser } = useSelector(state => state.user);

    const [marksObtained, setMarksObtained] = useState("");

    useEffect(() => {
        if (currentUser && currentUser._id) {
          dispatch(getAllStudents(currentUser._id));
        }
      }, [currentUser, dispatch]);

    const deleteHandler = (deleteID, address) => {
        dispatch(deleteUser(deleteID, address))
            .then(() => {
                dispatch(getAllStudents(currentUser._id));
            })
    }

    const studentColumns = [
        { id: 'rollNum', label: 'Lin Number', minWidth: 100 },
        { id: 'name', label: 'Name', minWidth: 170 },
        { id: 'sclassName', label: 'Class', minWidth: 170 },
        { id: 'markEntryStudents', label: 'Marks Entry(Subject)', minWidth: 150 }, // New column for marks entry
    ];

    const studentRows = studentsList && studentsList.length > 0 && studentsList.map((student) => {
        return {
            rollNum: student.rollNum,
            name: student.name,
            sclassName: student.sclassName.sclassName,
            markEntryStudents: (
                <TextField type="number" label='Enter marks'
                    value={marksObtained} required
                    onChange={(e) => setMarksObtained(e.target.value)}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                // <Button
                //     variant="contained"
                //     color="primary"
                //     onClick={() => navigate(`/Admin/students/student/marks/${student._id}`)}
                // >
                //     Marks Entry
                // </Button>
            ),
            id: student._id,
        };
    })

    const StudentButtonHaver = ({ row }) => {
        return (
            <>
            <BlueButton variant="contained"
                onClick={() => navigate("/Admin/students/student/" + row.id)}>
                View
            </BlueButton>
            </>
        );
    };

    const actions = [
        {
            icon: <SaveIcon color="primary" />, name: 'Save',
            action: () => navigate("/Admin/addstudents")
        },
        {
            icon: <UpdateIcon color="error" />, name: 'Update',
            action: () => deleteHandler(currentUser._id, "Students")
        },
    ];

    return (
        <>
            {loading ?
                <div>Loading...</div>
                :
                <>
                    {response ?
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                            <GreenButton variant="contained" onClick={() => navigate("/Admin/addstudents")}>
                                Add Students
                            </GreenButton>
                        </Box>
                        :
                        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                            {Array.isArray(studentsList) && studentsList.length > 0 &&
                                <TableTemplate buttonHaver={StudentButtonHaver} columns={studentColumns} rows={studentRows} />
                            }
                            <SpeedDialTemplate actions={actions} />
                        </Paper>
                    }
                </>
            }
        </>
    );
};

export default MarkEntryStudents;
