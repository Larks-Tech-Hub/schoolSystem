import { useEffect, useState } from 'react';
import { IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import { Box, Menu, MenuItem, ListItemIcon} from '@mui/material';
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { deleteUser } from '../../../redux/userRelated/userHandle';
import { getAllGrades } from '../../../redux/gradeRelated/gradeHandle';
import { BlueButton, GreenButton } from '../../../components/buttonStyles';
import TableTemplate from '../../../components/TableTemplate';

// import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import PostAddIcon from '@mui/icons-material/PostAdd';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import AddCardIcon from '@mui/icons-material/AddCard';
import styled from 'styled-components';
import SpeedDialTemplate from '../../../components/SpeedDialTemplate';
import Popup from '../../../components/Popup';

const ShowGrades = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch();

  const { gradingList, loading, error, getresponse } = useSelector((state) => state.grading);
  const { currentUser } = useSelector(state => state.user)

  // const adminID = currentUser._id
  const adminID = currentUser?._id; 

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [deleteID, setDeleteID] = useState(null);
  const [deleteAddress, setDeleteAddress] = useState("");

  useEffect(() => {
    if (adminID) {
      // Dispatching an action to fetch all grades
      dispatch(getAllGrades(adminID, "Grading"));
    }
  }, [adminID, dispatch]);

  if (error) {
    console.log(error)
  }

  const [showPopup, setShowPopup] = useState(false);
  // const [message, setMessage] = useState("");
  const [message ] = useState("");

  const deleteHandler = (deleteID, address) => {
    // console.log(deleteID);
    // console.log(address);
    // setMessage("Sorry the delete function has been disabled for now.")
    // setShowPopup(true);
    dispatch(deleteUser(deleteID, address))
      .then(() => {
        dispatch(getAllGrades(adminID, "Grading"));
      })
  }

  const handleDeleteClick = (id, address) => {
    setDeleteID(id);
    setDeleteAddress(address);
    setShowConfirmation(true);
  }

  const handleConfirmDelete = () => {
    if (deleteID && deleteAddress) {
      deleteHandler(deleteID, deleteAddress);
      setShowConfirmation(false);  // Close the confirmation dialog
    }
  }

  const handleCancelDelete = () => {
    setShowConfirmation(false);  // Close the confirmation dialog without deleting
  }

  const gradingColumns = [
    { id: 'from', label: 'From', minWidth: 170 },
    { id: 'to', label: 'To', minWidth: 170 },
    { id: 'grade', label: 'Grade', minWidth: 170 },
    { id: 'comment', label: 'Comment', minWidth: 170 },
  ]

  const gradingRows = gradingList && gradingList.length > 0 && gradingList.map((grading) => {
    return {
      from: grading.from,
      to: grading.to,
      grade: grading.grade,
      comment: grading.comment,
      id: grading._id,
    };
  });

  const GradingButtonHaver = ({ row }) => {
    const navigate = useNavigate();
    const actions = [
      { icon: <PostAddIcon />, name: 'Add Subjects', action: () => navigate("/Admin/addsubject/" + row.id) },
      { icon: <PersonAddAlt1Icon />, name: 'Add Student', action: () => navigate("/Admin/class/addstudents/" + row.id) },
    ];

    return (
      <ButtonContainer>
        <IconButton onClick={() => handleDeleteClick(row.id, "Grading")} color="secondary">
        <DeleteIcon color="error" />
      </IconButton>

        {/* Confirmation Dialog */}
        <Dialog
          open={showConfirmation}
          onClose={handleCancelDelete}
        >
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this Grade Range?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancelDelete} color="primary">
              Cancel
            </Button>
            <Button onClick={handleConfirmDelete} color="error">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
        
        <BlueButton variant="contained"
          onClick={() => navigate("/Admin/UpdateGrade/" + row.id)}>
          Edit
        </BlueButton>
        <ActionMenu actions={actions} />
      </ButtonContainer>
    );
  };

  const ActionMenu = ({ actions }) => {
    const [anchorEl, setAnchorEl] = useState(null);

    const open = Boolean(anchorEl);

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };
    return (
      <>
        {/* <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
          <Tooltip title="Add Students & Subjects">
            <IconButton
              onClick={handleClick}
              size="small"
              sx={{ ml: 2 }}
              aria-controls={open ? 'account-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
            >
              <h5>Add</h5>
              <SpeedDialIcon />
            </IconButton>
          </Tooltip>
        </Box> */}
        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          PaperProps={{
            elevation: 0,
            sx: styles.styledPaper,
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          {actions.map((action) => (
            <MenuItem onClick={action.action}>
              <ListItemIcon fontSize="small">
                {action.icon}
              </ListItemIcon>
              {action.name}
            </MenuItem>
          ))}
        </Menu>
      </>
    );
  }

  
  const actions = [
    {
      icon: <AddCardIcon color="primary" />, name: 'Add New Grading',
      action: () => navigate("/Admin/addgrade")
    },
    {
      icon: <DeleteIcon color="error" />, name: 'Delete All Gradings',
      action: () => deleteHandler(adminID, "Sclasses")
    },
  ];

  return (
    <>
      {loading ?
        <div>Loading...</div>
        :
        <>
          {getresponse ?
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              <GreenButton variant="contained" onClick={() => navigate("/Admin/addterm")}>
                Add Term
              </GreenButton>
            </Box>
            :
            <>
              {Array.isArray(gradingList) && gradingList.length > 0 &&
                <TableTemplate buttonHaver={GradingButtonHaver} columns={gradingColumns} rows={gradingRows} />
              }
              <SpeedDialTemplate actions={actions} />
            </>}
        </>
      }
      <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />

    </>
  );
};

export default ShowGrades;

const styles = {
  styledPaper: {
    overflow: 'visible',
    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
    mt: 1.5,
    '& .MuiAvatar-root': {
      width: 32,
      height: 32,
      ml: -0.5,
      mr: 1,
    },
    '&:before': {
      content: '""',
      display: 'block',
      position: 'absolute',
      top: 0,
      right: 14,
      width: 10,
      height: 10,
      bgcolor: 'background.paper',
      transform: 'translateY(-50%) rotate(45deg)',
      zIndex: 0,
    },
  }
}

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
`;