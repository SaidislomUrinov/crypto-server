import { model, Schema } from "mongoose";
import { getNow } from "../utils/date.js";

const schema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    invest: {
        type: Schema.Types.ObjectId,
        ref: 'Invest'
    },
    amount: Number,
    created: {
        type: Number,
        default: getNow
    }
});

export default model('Claim', schema);