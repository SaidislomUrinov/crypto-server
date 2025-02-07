import { getNow } from '../middlewares/date.js'
import { model, Schema } from 'mongoose'
const schema = new Schema({
    id: Number,
    name: String,
    active: {
        type: Boolean,
        default: false
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    active: {
        type: Boolean,
        default: false
    },
    password: {
        type: String,
        required: true
    },
    access: String,
    ref1: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    ref2: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    ref3: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    created: {
        type: Number,
        default: getNow
    }
});
schema.methods.balance = async function () {
    try {
        return 1
    } catch (error) {
        console.log(error);
        return 0
    }
};
export default model('User', schema);