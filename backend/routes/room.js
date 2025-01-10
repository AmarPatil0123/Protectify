import express from 'express';
const roomRouter = express.Router();
import Room from '../models/Room.js';


roomRouter.post("/createRoom", async (req, res) => {
    try {
        let { roomname, groupType } = req.body;

        let room = await Room.findOne({ roomname: roomname });

        if (room) {
            return res.status(401).json({ message: "Room already exist" });
        }

        let newRoom = new Room({
            roomname: roomname,
            groupType: groupType,
        })

        await newRoom.save();
        res.status(200).json({ message: "Room added successfully" });
    } catch (error) {
        res.json({ message: "error while room creation" })
    }
});

roomRouter.get("/getRoomData/:roomname", async (req, res) => {
    try {
        let { roomname } = req.params;

        let room = await Room.findOne({ roomname: roomname });

        if (room && room.groupType === "Public") {
            return res.status(200).json({roomType: "Public" });
        }

        if (room && room.groupType === "Private") {
            return res.status(200).json({ message: "room is private", roomType: "Private" });
        }
               
    } catch (error) {
        res.json({ error: "Error in fetching data"})
    }
});

roomRouter.put("/updateRoomType/:roomname", async (req, res) => {
    try {
        let { roomname } = req.params;

        let room = await Room.findOne({ roomname: roomname });

        let type = room.groupType;

        if (room) {
            let updData = await Room.findOneAndUpdate({ roomname: roomname }, { $set: { groupType: type === "Private" ? "Public" : "Private" } }, { new: true });
            return res.status(200).json({ message: "Type Changes sucessfully", roomType: updData.groupType });
        } 

    } catch (error) {
        return res.status(400).json({ message: "Error while Type chnging", roomType: "Private" });
    }

})

roomRouter.delete("/deleteRoom/:roomname", async (req, res) => {
    try {
        let { roomname } = req.params;

        let room = await Room.findOne({ roomname: roomname });

        if (room) {
            await Room.findOneAndDelete({ roomname: roomname });
            return res.json({ message: "room deleted" });
        } else {
            return res.json({ message: "room not found" });

        }
    } catch (error) {
        res.json({ error: "error while deletion" })
    }

})


export default roomRouter;