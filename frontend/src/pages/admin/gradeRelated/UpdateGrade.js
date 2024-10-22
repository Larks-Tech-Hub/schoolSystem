import React, { useEffect, useState } from "react";
import { Box, Button, CircularProgress, Stack, TextField, Typography } from "@mui/material";
import { useNavigate , useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addGrade } from '../../../redux/userRelated/userHandle';
import { underControl } from '../../../redux/userRelated/userSlice';
import { BlueButton } from "../../../components/buttonStyles";
import Popup from "../../../components/Popup";
import styled from "styled-components";
import { updateGrade } from '../../../redux/userRelated/userHandle';
import { getAllGrades } from '../../../redux/gradeRelated/gradeHandle';

const UpdateGrade = () => {
    
    const { id } = useParams(); 
    
    const navigate = useNavigate()
  const dispatch = useDispatch();

  const userState = useSelector(state => state.user);

  const { gradingList, loading, error, getresponse } = useSelector((state) => state.grading);
  const [selectedGrade, setSelectedGrade] = useState(null);
  const { status, currentUser, response } = useSelector(state => state.user)

  const [from, setFromName] = useState("");
  const [to, setToName] = useState("");
  const [grade, setGradeName] = useState("");
  const [comment, setCommentName] = useState("");
  const [gradeID, setGradeID] = useState("");

  // const adminID = currentUser._id
  const adminID = currentUser?._id; 
  const address = "Grading"

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [deleteID, setDeleteID] = useState(null);
  const [deleteAddress, setDeleteAddress] = useState("");

//   useEffect(() => {
//     if (adminID) {
//       dispatch(getAllGrades(adminID, "Grading"));
//     }
//   }, [adminID, dispatch]);

//   if (error) {
//     console.log(error)
//   }

  useEffect(() => {
    if (gradingList) {
        // Filter the list to find the comment with the matching ID
        const grading = gradingList.find(comment => comment._id === id);
        setSelectedGrade(grading);
        if (grading) {
            // Set the form fields with the fetched data
            setFromName(grading.from);
            setToName(grading.to);
            setGradeName(grading.grade);
            setCommentName(grading.comment);
            setGradeID(grading._id);
          }
    }
    }, [gradingList, id]);


  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  const [loader, setLoader] = useState(false)


  const fields = {
    from,
    to,
    grade,
    comment,
    school: adminID,
   };

    const submitHandler = (event) => {
        event.preventDefault()
        setLoader(true)
        dispatch(updateGrade(fields, gradeID, address))
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
                            Update Grading Scale Range
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

export default UpdateGrade

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