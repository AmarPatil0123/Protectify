import React, { useState } from 'react'
import Snackbar from '@mui/material/Snackbar';

const SnackbarLoader = ({message, duration=3000}) => {

    const [state, setState] = useState({
        open: true,
        vertical: 'top',
        horizontal: 'center',
    });
    const { vertical, horizontal, open } = state;

    const handleClose = () => {
        setState({ ...state, open: false });
    };

    return (
        <Snackbar
            anchorOrigin={{ vertical, horizontal }}
            open={open}
            onClose={handleClose}
            message={message}
            autoHideDuration={duration} 
            key={vertical + horizontal}
        />
    )
}

export default SnackbarLoader