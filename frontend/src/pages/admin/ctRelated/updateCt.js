import React, { useEffect, useState } from "react";
import { Box, Button, CircularProgress, Stack, TextField, Typography } from "@mui/material";
import { useNavigate , useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateClassTeacherComment } from '../../../redux/userRelated/userHandle';
import { underControl } from '../../../redux/userRelated/userSlice';
import { BlueButton } from "../../../components/buttonStyles";
import Popup from "../../../components/Popup";
import styled from "styled-components";
import { getAllClassTeacherComment } from '../../../redux/ctRelated/ctHandle';

const UpdateCt = () => {
    // const [sclassName, setSclassName] = useState("");
    // const [sclassName ] = useState("");
    const { id } = useParams(); 

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const userState = useSelector(state => state.user);
    const { status, currentUser, response, error} = userState;

    const { ClassTeacherCommentList, loading, getresponse } = useSelector((state) => state.ClassTeacherComment);
    const [selectedComment, setSelectedComment] = useState(null);


    const [from, setFromName] = useState("");
    const [to, setToName] = useState("");
    const [comment, setCommentName] = useState("");
    const [commentID, setCommentID] = useState("");
    const adminID = currentUser._id

    const address = "ClassTeacherComment"

    useEffect(() => {
        dispatch(getAllClassTeacherComment(adminID, "ClassTeacherComment"));
      }, [adminID, dispatch]);

    useEffect(() => {
    if (ClassTeacherCommentList) {
        // Filter the list to find the comment with the matching ID
        const comment = ClassTeacherCommentList.find(comment => comment._id === id);
        setSelectedComment(comment);
        if (comment) {
            // Set the form fields with the fetched data
            setFromName(comment.from);
            setToName(comment.to);
            setCommentName(comment.comment);
            setCommentID(comment._id);
            
          }
    }
    }, [ClassTeacherCommentList, id]);



    const [loader, setLoader] = useState(false)
    const [message, setMessage] = useState("");
    const [showPopup, setShowPopup] = useState(false);

    const fields = {
        from,
        to,
        comment,
        school: adminID,
    };

    const submitHandler = (event) => {
        event.preventDefault()
        setLoader(true)
        dispatch(updateClassTeacherComment(fields, commentID, address))
    };

    useEffect(() => {
        if (status === 'added') {
        navigate('/Admin/hms');
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
                            Update Comment for Pupil's Performance
                        </Typography>
                    </Stack>
                    <form onSubmit={submitHandler}>
                    <Stack spacing={3}>
                    <TextField
                        label="From"
                        type="number"
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
                        {loader ? <CircularProgress size={24} color="inherit" /> : "Update"}
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

export default UpdateCt

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