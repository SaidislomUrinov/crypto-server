import { getNow } from "../middlewares/date.js";
import { model, Schema } from "mongoose";
const schema = new Schema({
    element: {
        type: Schema.Types.ObjectId,
        ref: 'Element'
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    amount: Number,
    payAmount: Number,
    profit: Number,
    tokenProfit: Number,
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