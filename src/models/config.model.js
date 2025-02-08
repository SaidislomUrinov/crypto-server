import { model, Schema } from "mongoose";

const schema = new Schema({
    minWithdraw: {
        type: Number,
        default: 3
    },
    maxWithdraw: {
        type: Number,
        default: 15000
    },
    withdrawFees: {
        type: [
            {
                from: { type: Number, required: true },
                to: { type: Number, required: true },
                fee: { type: Number, required: true }
            }
        ],
        default: [
            { from: 3, to: 99, fee: 0.09 },
            { from: 100, to: 299, fee: 0.05 },
            { from: 300, to: 999, fee: 0.03 },
            { from: 1000, to: 15000, fee: 0.01 }
        ]
    },
    withdrawDays: {
        type: Number,
        default: 3
    },
    autoWithdraw: {
        type: Boolean,
        default: false
    },
    ref1Percent: {
        type: Number,
        default: 0.08
    },
    ref2Percent: {
        type: Number,
        default: 0.04
    },
    ref3Percent: {
        type: Number,
        default: 0.02
    },
    ref1Bonus: {
        type: Number,
        default: 2
    },
    ref2Bonus: {
        type: Number,
        default: 1
    },
    ref3Bonus: {
        type: Number,
        default: 0.1
    },
    ref1CalimPercent: {
        type: Number,
        default: 0.05
    },
    ref2CalimPercent: {
        type: Number,
        default: 0.03
    },
    ref3CalimPercent: {
        type: Number,
        default: 0.01
    },
    lvlPrice: {
        type: Number,
        default: 10
    },
    profit: {
        type: Number,
        default: 0.03
    }
});

export default model("Config", schema);