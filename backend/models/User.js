import mongoose from 'mongoose';
import passportLocalMongoose from "passport-local-mongoose";

const Schema = mongoose.Schema;

const UserSchema = new Schema({

});

UserSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", UserSchema);
export default User;
