import { getNow } from "../utils/date.js";
import { model, Schema } from "mongoose";
const schema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    lvl: Number,
    amount: Number,
    payAmount: Number,
    profit: Number,
    created: {
        type: Number,
        default: getNow
    },
    start: Number,
    status: {
        type: String,
        enum: ['paid', 'active', 'expired'],
        default: 'active'
    },
    network: String,
    currency: String,
    trackId: Number,
    qr: String,
    wallet: String,
});
export default model('Invest', schema)