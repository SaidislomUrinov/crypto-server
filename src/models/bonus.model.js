import { model, Schema } from "mongoose";

const schema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    amount: {
        type: Number,
        required: true
    },
    promocode: {
        type: Schema.Types.ObjectId,
        ref: 'Promocode'
    },
    claimed: {
        type: Boolean,
        default: false
    }
});

export default model('Bonus', schema);