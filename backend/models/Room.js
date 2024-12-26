import mongoose from 'mongoose';
const Schema = mongoose.Schema;

let RoomSchema = new Schema({
    roomname : String,
    groupType : String,
})

const Room = mongoose.model("Room", RoomSchema)

export default Room;
