import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from '@mui/material';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';

const ChangePassword = ({ closeCP }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const { selectedTab } = useSelector((state) => state.tabs);

  const handleSubmit = async () => {
    try{
    if (newPassword !== confirmPassword) {
      setError("Passwords don't match");
      setTimeout(() => {
        setError("");

      }, 3000);
      setNewPassword("");
      setConfirmPassword("");
      return;
    }
    if (newPassword.length < 2) {
      setError('Password must be at least 2 characters');
      setTimeout(() => {
        setError("");

      }, 3000);
      setNewPassword("");
      setConfirmPassword("");
      return;
    }

    const response = await axios.post(`/changePassword/${selectedTab.owner}`, { newPassword });

    setError('');
    setNewPassword("");
    setConfirmPassword("");
    setTimeout(() => {
      closeCP();
    }, 800);

    toast.success("Password updated Successfully", {
      position: "top-center",
      autoClose: 600,
      pauseOnHover: false,
    });

  }catch(error){

    toast.error("something went wrong", {
      position: "top-center",
      autoClose: 600,
      pauseOnHover: false,
    });
  }
  };


  return (
    <>
      <Dialog open={true} >
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          {error && <p style={{ color: 'red' }}>{error}</p>}

          <TextField
            label="New Password"
            type="password"
            fullWidth
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            margin="normal"
          />
          <TextField
            label="Confirm New Password"
            type="password"
            fullWidth
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => closeCP()} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Toast message */}
      <ToastContainer />
    </>
  );
};

export default ChangePassword;
