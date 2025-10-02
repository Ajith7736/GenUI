import mongoose, { model, Schema } from "mongoose";

const UserSchema: Schema = new mongoose.Schema({
    Email: {
        type: String,
        required: true
    },
    Name: {
        type: String,
        required: true
    },
    Profilepic: {
        type: String,
        required: true
    }
})

const User = mongoose.models.User || model("User", UserSchema);

export default User;