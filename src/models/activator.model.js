import { model, Schema } from "mongoose";
import { getNow } from "../utils/date.js";

const schema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    created: {
        type: Number,
        default: getNow
    },
    active: {
        type: Boolean,
        default: true
    }
});

export default model('Activator', schema);