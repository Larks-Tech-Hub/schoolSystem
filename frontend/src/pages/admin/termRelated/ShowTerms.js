import { useEffect, useState } from 'react';
import { IconButton, Box, Menu, MenuItem, ListItemIcon, Tooltip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { deleteUser } from '../../../redux/userRelated/userHandle';
import { deleteTerm } from '../../../redux/userRelated/userHandle';
import { getAllTerms } from '../../../redux/termRelated/termHandle';
import { BlueButton, GreenButton } from '../../../components/buttonStyles';
import TableTemplate from '../../../components/TableTemplate';

import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import PostAddIcon from '@mui/icons-material/PostAdd';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import AddCardIcon from '@mui/icons-material/AddCard';
import styled from 'styled-components';
import SpeedDialTemplate from '../../../components/SpeedDialTemplate';
import Popup from '../../../components/Popup';

const ShowTerms = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch();

  const { termsList, loading, error, getresponse } = useSelector((state) => state.term);
  const { currentUser } = useSelector(state => state.user)

  const adminID = currentUser._id

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [deleteID, setDeleteID] = useState(null);
  const [deleteAddress, setDeleteAddress] = useState("");


  useEffect(() => {
    dispatch(getAllTerms(adminID, "Term"));
  }, [adminID, dispatch]);

  if (error) {
    console.log(error)
  }

  const [showPopup, setShowPopup] = useState(false);
  // const [message, setMessage] = useState("");
  const [message ] = useState("");

  const deleteHandler = (deleteID, address) => {
    dispatch(deleteUser(deleteID, address))
      .then(() => {
        dispatch(getAllTerms(adminID, "Term"));
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


  const termColumns = [
    { id: 'termName', label: 'Year/T', minWidth: 170 },
    { id: 'status', label: 'Statuses', minWidth: 170 },
    { id: 'nextTermStarts', label: 'Next Term Starts On', minWidth: 170 },
    { id: 'nextTermEnds', label: 'Next Term Ends On', minWidth: 170 },
  ]

  const termRows = termsList && termsList.length > 0 && termsList.map((term) => {
    console.log(term);
    return {
      termName: term.termName,
      status: term.status,
      nextTermStarts: term.nextTermStarts,
      nextTermEnds: term.nextTermEnds,
      id: term._id,
    };
  });

  const TermButtonHaver = ({ row }) => {
    const navigate = useNavigate();
    const actions = [
      { icon: <PostAddIcon />, name: 'Add Subjects', action: () => navigate("/Admin/addsubject/" + row.id) },
      { icon: <PersonAddAlt1Icon />, name2: 'Add Student', action: () => navigate("/Admin/term/addstudents/" + row.id) },
    ];

    return (
      <ButtonContainer>
        {/* <IconButton onClick={() => handleDeleteClick(row.id, "Term")} color="secondary">
          <DeleteIcon color="error" />
        </IconButton> */}

        {/* Confirmation Dialog */}
        <Dialog
          open={showConfirmation}
          onClose={handleCancelDelete}
        >
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this Term Details?
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
          onClick={() => navigate("/Admin/updateterm/" + row.id)}>
          Edit
        </BlueButton>

        {/* <BlueButton variant="contained"
          onClick={() => navigate("/Admin/terms/term/" + row.id)}>
          View
        </BlueButton> */}
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
      icon: <AddCardIcon color="primary" />, name: 'Add New Term',
      action: () => navigate("/Admin/addterm")
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
              {Array.isArray(termsList) && termsList.length > 0 &&
                <TableTemplate buttonHaver={TermButtonHaver} columns={termColumns} rows={termRows} />
              }
              <SpeedDialTemplate actions={actions} />
            </>}
        </>
      }
      <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />

    </>
  );
};

export default ShowTerms;

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