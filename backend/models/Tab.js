import mongoose from 'mongoose';
import User from './User.js';

const Schema = mongoose.Schema;

const TabSchema = new Schema({
    id : String,
    title : String,
    data : String,
    owner: { 
        type: mongoose.Schema.Types.ObjectId,
         ref: "User"
     },
    createdAt: {
        type: Date,
        default: Date.now, // Use function reference for default value
    },
});

const Tab = mongoose.model("Tab", TabSchema);

export default Tab;
