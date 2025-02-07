import { model, Schema } from "mongoose";

const schema = new Schema({
    title: String,
    networks: Array,
    deposit: {
        type: Boolean,
        default: true
    },
    withdraw: {
        type: Boolean,
        default: true
    },
});

export default model('Currency', schema);