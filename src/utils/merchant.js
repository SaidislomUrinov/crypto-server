import axios from "axios"
import { OXA_MERCHANT_KEY } from "./env.js"
import investModel from "../models/invest.model.js";
import { getNow } from "./date.js";
export const createWallet = (network, amount, currency, _id) => {
    return axios.post('https://api.oxapay.com/merchants/request/whitelabel', {
        merchant: OXA_MERCHANT_KEY,
        payCurrency: currency,
        network,
        amount,
        currency: 'USDT',
        callbackUrl: "https://api.profitway.lol/successdep/" + _id
    });
};
export const checkDeposit = async (req, res) => {
    try {
        const { id } = req.params;
        const invest = await investModel.findOne({ _id: id });
        if (!invest) throw new Error("Invest not found");
        invest.status = 'paid';
        invest.start = getNow()
        await invest.save();
        return res.send({
            ok: true,
            msg: "Deposit successful"
        })
    } catch (error) {
        console.log(error);
        return res.send({
            ok: false,
            msg: error.message
        })
    }
} 