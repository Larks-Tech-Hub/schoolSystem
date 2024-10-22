import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getSubjectDetails } from "../../../redux/sclassRelated/sclassHandle";
import Popup from "../../../components/Popup";
import { registerUser } from "../../../redux/userRelated/userHandle";
import { underControl } from "../../../redux/userRelated/userSlice";
import { Button, CircularProgress } from "@mui/material";
import { getAllTeachers } from '../../../redux/teacherRelated/teacherHandle';
import { updateTeacher } from '../../../redux/userRelated/userHandle';


const UpdateTeacher = () => {
  const { id } = useParams(); 

  // const params = useParams();
  const dispatch = useDispatch();

  const userState = useSelector(state => state.user);
  
  const navigate = useNavigate();
  
  const { teachersList, loading } = useSelector((state) => state.teacher);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
      dispatch(getAllTeachers(currentUser._id));
  }, [currentUser._id, dispatch]);

  const subjectID = id;

  const adminID = currentUser?._id; 
  const address = "Teacher"

  const { status, response, error } = useSelector((state) => state.user);
  const { subjectDetails } = useSelector((state) => state.sclass);

  useEffect(() => {
    dispatch(getSubjectDetails(subjectID, "Subject"));
  }, [dispatch, subjectID]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [teacherID, setTeacherID] = useState("");

  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [loader, setLoader] = useState(false);
  
  useEffect(() => {
    if (teachersList) {
        // Filter the list to find the comment with the matching ID
        const teacher = teachersList.find(teacher => teacher._id === id);
        setSelectedTeacher(teacher);
        if (teacher) {
            // Set the form fields with the fetched data
            setName(teacher.name);
            setEmail(teacher.email);
            setPassword(teacher.password);
            setTeacherID(teacher._id);
          }
    }
    }, [teachersList, id]);

  const role = "Teacher";
  const school = subjectDetails && subjectDetails.school;
  const teachSubject = subjectDetails && subjectDetails._id;
  const teachSclass =
    subjectDetails &&
    subjectDetails.sclassName &&
    subjectDetails.sclassName._id;

  // const fields = { name, email, password, role, school, teachSubject, teachSclass }

  // const submitHandler = (event) => {
  //   event.preventDefault()
  //   setLoader(true)
  //   dispatch(registerUser(fields, role))

  //   console.log("fiels: ", fields)
  // }
  const fields = {
    name,
    email,
    password,
    // comment,
    // school: adminID,
   };

  const submitHandler = (event) => {
    event.preventDefault()
    setLoader(true)
    dispatch(updateTeacher(fields, teacherID, address))
};

  // const submitHandler = (event) => {
  //   event.preventDefault();
  //   if (name === "") {
  //     setMessage("Please Enter the Name");
  //     setShowPopup(true);
  //   } else {
  //     const formDataToSend = new FormData();
  //     formDataToSend.append("name", name);
  //     formDataToSend.append("email", email);
  //     formDataToSend.append("password", password);
  //     formDataToSend.append("role", role);
  //     formDataToSend.append("school", school);
  //     formDataToSend.append("teachSubject", teachSubject);
  //     formDataToSend.append("teachSclass", teachSclass);
      
  //     setLoader(true);
  //     dispatch(registerUser(formDataToSend, role));
      
  //     console.log("formDataToSend: ", formDataToSend)
  //   }
  // };

  useEffect(() => {
    if (status === "added") {
      dispatch(underControl());
      navigate("/Admin/teachers");
    } else if (status === "failed") {
      setMessage(response);
      setShowPopup(true);
      setLoader(false);
    } else if (status === "error") {
      setMessage("Network Error");
      setShowPopup(true);
      setLoader(false);
    }
  }, [status, navigate, error, response, dispatch]);

  return (
    <div>
      <div className="register">
        <form className="registerForm" onSubmit={submitHandler}>
          <span className="registerTitle">Update Teacher</span>
          <br />
          <label>Subject : {subjectDetails && subjectDetails.subName}</label>
          <label>
            Class :{" "}
            {subjectDetails &&
              subjectDetails.sclassName &&
              subjectDetails.sclassName.sclassName}
          </label>
          <label>Name</label>
          <input
            className="registerInput"
            type="text"
            placeholder="Enter teacher's name..."
            value={name}
            onChange={(event) => setName(event.target.value)}
            autoComplete="name"
            required
          />

          <label>Email</label>
          <input
            className="registerInput"
            type="email"
            placeholder="Enter teacher's email..."
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            required
          />

          <label>Password</label>
          <input
            className="registerInput"
            type="password"
            placeholder="Enter teacher's password..."
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="new-password"
            required
          />

          <button className="registerButton" type="submit" disabled={loader}>
            {loader ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Update"
            )}
          </button>
          <Button variant="outlined" onClick={() => navigate(-1)}>
            Back
          </Button>
        </form>
      </div>
      <Popup
        message={message}
        setShowPopup={setShowPopup}
        showPopup={showPopup}
      />
    </div>
  );
};

export default UpdateTeacher;
