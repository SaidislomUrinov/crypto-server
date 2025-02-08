import axios from "axios"
import { OXA_MERCHANT_KEY } from "./env.js"

export const createWallet = (network, amount, currency) =>{
    return axios.post('https://api.oxapay.com/merchants/request/whitelabel', {
        merchant: OXA_MERCHANT_KEY,
        payCurrency: currency,
        network,
        amount,
        currency: 'USDT'
    });
}