import axios from 'axios';
import {
    getRequest,
    getSuccess,
    getFailed,
    getError
} from './ctSlice';

// const REACT_APP_BASE_URL = "http://localhost:5000";
const REACT_APP_BASE_URL = "https://schoolsystem-ice2.onrender.com";

export const getAllClassTeacherComment = (id, address) => async (dispatch) => {
    dispatch(getRequest());

    try {
        const result = await axios.get(`${REACT_APP_BASE_URL}/${address}List/${id}`);
        if (result.data.message) {
            dispatch(getFailed(result.data.message));
        } else {
            dispatch(getSuccess(result.data));
        }
    } catch (error) {
        dispatch(getError(error));
    }
}