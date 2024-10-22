import React, { useEffect, useState } from "react";
import { Box, Button, CircularProgress, Stack, InputLabel, Typography, Select, MenuItem } from "@mui/material";
import { useNavigate , useParams} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateTerm } from '../../../redux/userRelated/userHandle';
import { underControl } from '../../../redux/userRelated/userSlice';
import { BlueButton } from "../../../components/buttonStyles";
import Popup from "../../../components/Popup";
import styled from "styled-components";
import dayjs from 'dayjs';
import { getAllTerms } from '../../../redux/termRelated/termHandle';
import TextField from '@mui/material/TextField';

const UpdateTerm = () => {
    const currentYear = dayjs().year(); // Get the current year
    const [year] = useState(currentYear); 
    const [termNames, setTermName] = useState('');
    // const [termName, setTerm] = useState('');
    const [status, setStatus] = useState("");
    const [nextTermStarts, setNextTermStartDate] = useState('');
    const [nextTermEnds, setNextTermEndDate] = useState('');
    const { id } = useParams(); 
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const term = useSelector(state => state.term); 

    const userState = useSelector(state => state.user);
    const { status: userStatus, currentUser, response } = userState;
    
    const { termsList, loading, error, getresponse } = useSelector((state) => state.term);
    const [selectedTerm, setSelectedTerm] = useState(null);
    const [termID, setTermID] = useState(null);

    const adminID = currentUser._id;
    const address = "Term";

    useEffect(() => {
        dispatch(getAllTerms(adminID, "Term"));
      }, [adminID, dispatch]);

    useEffect(() => {
    if (termsList) {
        // Filter the list to find the comment with the matching ID
        const term = termsList.find(term => term._id === id);
        setSelectedTerm(term);
        if (term) {
            // Set the form fields with the fetched data
            setTermName(term.termName);
            setStatus(term.status);
            setNextTermStartDate(term.nextTermStarts);
            setNextTermEndDate(term.nextTermEnds);
            setTermID(term._id);
            }
    }
    }, [termsList, id]);

    const [loader, setLoader] = useState(false);
    const [message, setMessage] = useState("");
    const [showPopup, setShowPopup] = useState(false);

    const handleSave = () => {
        if (!termNames) {
            alert('Please select a term.');
            return;
        }

        const termName = `${year}/${termNames}`;

        const fields = {
            termName,
            nextTermStarts,
            nextTermEnds,
            status,
            school: adminID,
        };

        setLoader(true);
        dispatch(updateTerm(fields, termID, address));
    };

    useEffect(() => {
        if (userStatus === 'added') {
            navigate('/Admin/terms');
            dispatch(underControl());
        } else if (userStatus === 'error') {
            setMessage("Network Error");
            setShowPopup(true);
            setLoader(false);
        }
    }, [userStatus, navigate, error, response, dispatch]);

    return (
        <>
            <StyledContainer>
                <StyledBox>
                    <Stack sx={{ alignItems: 'center', mb: 3 }}>
                        <Typography variant="h4" color="primary" sx={{ mb: 3 }}>
                            Update Term For The Current Year
                        </Typography>
                    </Stack>
                    <Stack spacing={3}>
                        <InputLabel id="year-select-label">Year</InputLabel>
                        <Select
                            id="year-select"
                            value={year}
                            required
                            fullWidth
                            variant="outlined"
                            disabled
                        >
                            <MenuItem value={currentYear}>{currentYear}</MenuItem>
                        </Select>

                        <InputLabel id="term-select-label">Select Term</InputLabel>
                        <Select
                            labelId="term-select-label"
                            id="term-select"
                            value={termNames}
                            onChange={(event) => setTermName(event.target.value)}
                            displayEmpty
                            label="Select Term"
                            fullWidth
                        >
                            <MenuItem value="">
                                <em>Select Term</em>
                            </MenuItem>
                            <MenuItem value="I">Term One</MenuItem>
                            <MenuItem value="II">Term Two</MenuItem>
                            <MenuItem value="III">Term Three</MenuItem>
                        </Select>

                        <InputLabel id="status-select-label">Select Term Status</InputLabel>
                        <Select
                            labelId="status-select-label"
                            id="status-select"
                            value={status}
                            onChange={(event) => setStatus(event.target.value)}
                            required
                            fullWidth
                            variant="outlined"
                        >
                            <MenuItem value="Active">Active</MenuItem>
                            <MenuItem value="Inactive">Inactive</MenuItem>
                        </Select>

                        <InputLabel id="next-term-starts-on-label">Next Term Starts On</InputLabel>
                        <TextField
                        label="Next Term Starts On"
                        type="date"
                        value={nextTermStarts}
                        onChange={(event) => setNextTermStartDate(event.target.value)}
                        required
                        fullWidth
                        variant="outlined"
                        InputLabelProps={{
                            shrink: true, // Ensures the label is always above the input field
                        }}
                        />

                        <InputLabel id="next-term-end-on-label">Next Term Ends On</InputLabel>
                        <TextField
                        label="Next Term Ends On"
                        type="date"
                        value={nextTermEnds}
                        onChange={(event) => setNextTermEndDate(event.target.value)}
                        required
                        fullWidth
                        variant="outlined"
                        InputLabelProps={{
                            shrink: true, // Ensures the label is always above the input field
                        }}
                        />
                        <BlueButton
                            fullWidth
                            size="large"
                            sx={{ mt: 3 }}
                            variant="contained"
                            onClick={handleSave}
                            disabled={loader}
                        >
                            {loader ? <CircularProgress size={24} color="inherit" /> : "Update"}
                        </BlueButton>

                        <Button variant="outlined" onClick={() => navigate(-1)}>
                            Back
                        </Button>
                    </Stack>
                </StyledBox>
            </StyledContainer>
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </>
    );
};

export default UpdateTerm;

const StyledContainer = styled(Box)`
  flex: 1 1 auto;
  align-items: center;
  display: flex;
  justify-content: center;
`;

const StyledBox = styled(Box)`
  max-width: 550px;
  padding: 50px 3rem 50px;
  margin-top: 1rem;
  background-color: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  border: 1px solid #ccc;
  border-radius: 4px;
`;
