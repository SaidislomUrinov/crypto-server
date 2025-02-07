import { model, Schema } from "mongoose";
import { getNow } from "../utils/date.js";
const schema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    network: String,
    currency: String,
    trackId: Number,
    address: String,
    status: {
        type: String,
        enum: ['rejected', 'pending', 'success']
    },
    amount: {
        type: Number
    },
    created: {
        type: Number,
        default: getNow
    },
});
export default model('Payment', schema);