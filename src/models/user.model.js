import { getNow } from '../middlewares/date.js'
import { model, Schema } from 'mongoose'
import bonusModel from './bonus.model.js';
import claimModel from './claim.model.js';
import paymentModel from './payment.model.js';
import investModel from './invest.model.js';
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
        const bonuses = (await bonusModel.find({ user: this._id, claimed: true })).reduce((total, doc) => total + doc.amount, 0);
        const claims = (await claimModel.find({ user: this._id })).reduce((total, doc) => total + doc.amount, 0);
        const payments = (await paymentModel.find({ user: this._id, status: { $in: ['pending', 'success'] } })).reduce((total, doc) => total + doc.amount, 0);
        return (bonuses + claims) - payments;
    } catch (error) {
        console.log(error.message);
        return 0
    }
};
schema.methods.dailyProfit = async function () {
    try {
        const invests = (await investModel.find({ user: this._id })).reduce((total, doc) => total + doc.profit, 0);
        return invests * 86400;
    } catch (error) {
        console.log(error.message);
        return 0
    }
};
schema.methods.profit = async function () {
    try {
        const now = getNow();
        const invests = await investModel.find({ status: 'paid', user: this._id });
        let profit = 0;
        for (const i of invests) {
            const diff = now - i.start;
            const totalClaims = await claimModel.aggregate([
                { $match: { user: this._id, invest: i._id } },
                { $group: { _id: null, total: { $sum: '$amount' } } }
            ]);
            const claimed = totalClaims.length ? totalClaims[0].total : 0;
            const investProfit = (i.profit * diff) - claimed;
            profit += Math.max(investProfit, 0);
        };
        return profit;
    } catch (error) {
        console.log(error.message);
        return 0
    }
};
schema.methods.claim = async function () {
    try {
        const now = getNow();
        const invests = await investModel.find({ user: this._id });
        for (const i of invests) {
            const totalClaims = await claimModel.aggregate([
                { $match: { user: this._id, invest: i._id } },
                { $group: { _id: null, total: { $sum: '$amount' } } }
            ]);
            const claimed = totalClaims.length ? totalClaims[0].total : 0;
            const remainingProfit = (i.profit * (now - i.start)) - claimed;
            if (remainingProfit > 0) {
                const claim = new claimModel({
                    user: this._id,
                    invest: i._id,
                    amount: remainingProfit,
                });
                await claim.save();
            }
        };
        return true;
    } catch (error) {
        console.log(error.message);
        return false
    }
};
schema.method.lvl = async function () {
    try {
        const invests = await investModel.aggregate([
            { $match: { user: this._id, status: 'paid' } },
            { $group: { _id: null, lvl: { $sum: '$lvl' } } }
        ]);
        return invests.length ? invests[0].lvl : 0;
    } catch (error) {
        console.log(error.message);
        return 0;
    }
}
export default model('User', schema);