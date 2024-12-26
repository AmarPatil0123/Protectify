import React, { memo, useState } from "react";
import { setCollaboration, resetCollaboration, setGroupType } from "../features/tabs/tabSlice";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    DialogActions,
    Button,
    Typography,
} from "@mui/material";


const RoomDialog = ({ createValue, setCreateValue, handleCreateRoom }) => {

    const dispatch = useDispatch();
    const { collaboration, groupType } = useSelector((state) => state.tabs);

    const [open, setOpen] = useState(true);

    const handleClose = () => {
        setCreateValue("");
        dispatch(setGroupType("Public"));
        setOpen(false);
    };

    const handleCreate = async () => {

        handleCreateRoom();
        setOpen(false);

        let response = await axios.post("http://localhost:8080/createRoom", { roomname: createValue, groupType: groupType });
    };

    return (
        <Dialog open={open} maxWidth="sm" fullWidth>
            <DialogTitle>
                <Typography align="center" variant="h6" component="div">
                    Create a New Room
                </Typography>
            </DialogTitle>

            <DialogContent>
                <FormControl fullWidth margin="normal">
                    <TextField
                        label="Room Name"
                        value={createValue}
                        onChange={(e) => setCreateValue(e.target.value)}
                        fullWidth

                        error={createValue.length < 1} 
                        helperText={createValue.length < 1 ? "Minimum 1 characters required" : ""}
                        inputProps={{
                            maxLength: 10,
                        }}
                    />
                </FormControl>
                <FormControl fullWidth margin="normal" sx={{ mt: 2 }}>
                    <InputLabel>Group Type</InputLabel>
                    <Select
                        value={groupType}
                        onChange={(e) => dispatch(setGroupType(e.target.value))}
                        label="Group Type"
                    >
                        <MenuItem value="Public">Public</MenuItem>
                        <MenuItem value="Private">Private</MenuItem>
                    </Select>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="secondary">
                    Cancel
                </Button>
                <Button
                    onClick={handleCreate}
                    color="primary"
                    variant="contained"
                    disabled={!createValue || !groupType}
                >
                    Create
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default memo(RoomDialog);
