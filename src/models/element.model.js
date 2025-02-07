import { model, Schema } from "mongoose";

const schema = new Schema({
    title: String,
    minInvest: Number,
    maxInvest: Number,
    image: String,
    count: Number,
    profit: Number,
    type: {
        type: String,
        enum: ['simple', 'medium', 'pro', 'super', 'ultra'],
        required: true,
    },
});

export default model('Element', schema);