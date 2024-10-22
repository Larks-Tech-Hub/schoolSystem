import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../../redux/userRelated/userHandle";
import Popup from "../../../components/Popup";
import { underControl } from "../../../redux/userRelated/userSlice";
import { getAllSclasses } from "../../../redux/sclassRelated/sclassHandle";
import { CircularProgress } from "@mui/material";

const AddStudent = ({ situation }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();

  const userState = useSelector((state) => state.user);
  const { status, currentUser, response, error } = userState;
  const { sclassesList } = useSelector((state) => state.sclass);

  const [name, setName] = useState("");
  const [rollNum, setRollNum] = useState("");
  const [password, setPassword] = useState("");
  const [className, setClassName] = useState("");
  const [sclassName, setSclassName] = useState("");
  const [gender, setGender] = useState("");
  const [photo, setPhoto] = useState(null);

  const adminID = currentUser._id;
  const role = "Student";
  const attendance = [];

  useEffect(() => {
    if (situation === "Class") {
      setSclassName(params.id);
    }
  }, [params.id, situation]);

  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    dispatch(getAllSclasses(adminID, "Sclass"));
  }, [adminID, dispatch]);

  const handlePhotoChange = (event) => {
    setPhoto(event.target.files[0]);
  };

  const changeHandler = (event) => {
    if (event.target.value === "Select Class") {
      setClassName("Select Class");
      setSclassName("");
    } else {
      const selectedClass = sclassesList.find(
        (classItem) => classItem.sclassName === event.target.value
      );
      setClassName(selectedClass.sclassName);
      setSclassName(selectedClass._id);
    }
  };

  // const fields = { name, rollNum, password, sclassName, adminID, role, attendance }

  const submitHandler = (event) => {
    event.preventDefault();
    if (sclassName === "") {
      setMessage("Please select a classname");
      setShowPopup(true);
    } else {
      const formDataToSend = new FormData();
      formDataToSend.append("name", name);
      formDataToSend.append("rollNum", rollNum);
      formDataToSend.append("password", password);
      formDataToSend.append("sclassName", sclassName);
      formDataToSend.append("adminID", adminID);
      formDataToSend.append("role", role);
      // formDataToSend.append("attendance", JSON.stringify(attendance)); 
      formDataToSend.append("gender", gender);
      formDataToSend.append("photo", photo);
      
      setLoader(true);
      dispatch(registerUser(formDataToSend, role));
    }
  };

  useEffect(() => {
    if (status === "added") {
      dispatch(underControl());
      navigate(-1);
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
    <>
      <div className="register">
        <form
          className="registerForm p-6 bg-white shadow-lg rounded-lg"
          onSubmit={submitHandler}
        >
          <span className="registerTitle text-2xl font-bold mb-4 block text-center">
            Add Student
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center space-x-6">
              <label className="min-w-[150px] text-gray-700">Name</label>
              <input
                className="registerInput flex-1 border rounded px-3 py-2 text-gray-700"
                type="text"
                placeholder="Enter Pupil's name..."
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoComplete="name"
                required
              />
            </div>

            <div className="flex items-center space-x-6">
              <label className="min-w-[150px] text-gray-700">Gender</label>
              <select
                className="registerInput flex-1 border rounded px-3 py-2 text-gray-700"
                value={gender}
                onChange={(event) => setGender(event.target.value)}
                required
              >
                <option value="Select Gender">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            {situation === "Student" && (
              <div>
                <label>Class</label>
                <select
                  className="registerInput"
                  value={className}
                  onChange={changeHandler}
                  required
                >
                  <option value="Select Class">Select Class</option>
                  {sclassesList.map((classItem, index) => (
                    <option key={index} value={classItem.sclassName}>
                      {classItem.sclassName}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex items-center space-x-6">
              <label className="min-w-[150px] text-gray-700">LIN Number</label>
              <input
                className="registerInput flex-1 border rounded px-3 py-2 text-gray-700"
                type="text"
                placeholder="Enter Pupil's Lin Number..."
                value={rollNum}
                onChange={(event) => setRollNum(event.target.value)}
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-700 mb-1">Upload Photo</label>
              <input
                className="registerInput border rounded px-3 py-2 w-full text-gray-700"
                type="file"
                value={photo}
                onChange={handlePhotoChange}
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-700 mb-1">Password</label>
              <input
                className="registerInput border rounded px-3 py-2 w-full text-gray-700"
                type="password"
                placeholder="Enter Pupil's password..."
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="new-password"
                required
              />
            </div>

            <div className="md:col-span-2">
              <button
                className="registerButton w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200"
                type="submit"
                disabled={loader}
              >
                {loader ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Add"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      <Popup
        message={message}
        setShowPopup={setShowPopup}
        showPopup={showPopup}
      />
    </>
  );
};

export default AddStudent;
