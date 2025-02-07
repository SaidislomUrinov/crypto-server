import { model, Schema } from "mongoose";
import { getNow } from "../utils/date.js";
import bonusModel from "./bonus.model.js";

const schema = new Schema({
    id: Number,
    code: String,
    active: {
        type: Boolean,
        default: true
    },
    count: {
        type: Number,
        default: 10
    },
    type: {
        type: String,
        enum: ['withdraw', 'deposit']
    },
    amount: Number,
    created: {
        type: Number,
        default: getNow
    },
});
schema.methods.used = async function () {
    try {
        const used = await bonusModel.countDocuments({ promocode: this._id });
        return used;
    } catch (error) {
        console.error(error.message);
        return 0;
    }
}
export default model('Promocode', schema);