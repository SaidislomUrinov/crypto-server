import { model, Schema } from "mongoose";

const schema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    type: {
        type: String,
        enum: ['deposit', 'withdraw'],
        required: true
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