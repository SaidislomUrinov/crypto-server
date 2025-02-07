import { model, Schema } from "mongoose";

const schema = new Schema({
    name: String,
    username: String,
    password: String,
    access: String,
    role: {
        type: String,
        enum: ["owner", "partner", "admin"],
    }
});

export default model('Admin', schema);