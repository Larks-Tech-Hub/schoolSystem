import React, { useEffect, useState } from "react";
import { Box, Button, CircularProgress, Stack, TextField, Typography } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addGrade } from '../../../redux/userRelated/userHandle';
import { underControl } from '../../../redux/userRelated/userSlice';
import { BlueButton } from "../../../components/buttonStyles";
import Popup from "../../../components/Popup";
import styled from "styled-components";

const AddGrade = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    // const userState = useSelector(state => state.user);
    // const { status, currentUser, response, error, tempDetails } = userState;
    const { status, response, error } = useSelector(state => state.user);
    const { currentUser } = useSelector(state => state.user);

    const [from, setFromName] = useState("");
    const [to, setToName] = useState("");
    const [grade, setGradeName] = useState("");
    const [comment, setCommentName] = useState("");
    const adminID = currentUser._id
  
    // const adminID = currentUser._id
    const address = "Grading"

    const [loader, setLoader] = useState(false)
    const [message, setMessage] = useState("");
    const [showPopup, setShowPopup] = useState(false);

    const fields = {
        from,
        to,
        grade,
        comment,
        adminID,
    };

    const submitHandler = (event) => {
        event.preventDefault()
        setLoader(true)
        dispatch(addGrade(fields, address))
    };

    useEffect(() => {
        if (status === 'added') {
        navigate('/Admin/grades');
        dispatch(underControl())
        } else if (status === 'error') {
        setMessage("Network Error")
        setShowPopup(true)
        setLoader(false)
        }
    }, [status, navigate, error, response, dispatch]);

    return (
        <>
            <StyledContainer>
                <StyledBox>
                    <Stack sx={{
                        alignItems: 'center',
                        mb: 3
                    }}>
                        <Typography variant="h4" color="primary" sx={{ mb: 3 }}>
                            Enter Grading Scale Range
                        </Typography>
                    </Stack>
                    <form onSubmit={submitHandler}>
                    <Stack spacing={3}>
                    <TextField
                        type="number"
                        label="From"
                        variant="outlined"
                        value={from}
                        onChange={(event) => setFromName(event.target.value)}
                        required
                        fullWidth
                        />

                        <TextField
                        label="To"
                         type="number"
                        variant="outlined"
                        value={to}
                        onChange={(event) => setToName(event.target.value)}
                        required
                        fullWidth
                        />

                        <TextField
                        label="Grade"
                        variant="outlined"
                        value={grade}
                        onChange={(event) => setGradeName(event.target.value)}
                        required
                        fullWidth
                        />

                        <TextField
                        label="Comment"
                        variant="outlined"
                        value={comment}
                        onChange={(event) => setCommentName(event.target.value)}
                        required
                        fullWidth
                        />

                        <BlueButton
                        fullWidth
                        size="large"
                        sx={{ mt: 3 }}
                        variant="contained"
                        type="submit"
                        disabled={loader}
                        >
                        {loader ? <CircularProgress size={24} color="inherit" /> : "Create"}
                        </BlueButton>

                        <Button variant="outlined" onClick={() => navigate(-1)}>
                        Back
                        </Button>
                    </Stack>
                    </form>
                </StyledBox>
            </StyledContainer>
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </>
    )
}

export default AddGrade

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