import valdiator from 'email-validator';
import userModel from '../models/user.model.js';
import activatorModel from '../models/activator.model.js';
import { sendActivator } from '../utils/email.js';
import { getNow } from '../utils/date.js';
import jwt from 'jsonwebtoken';
import { USER_JWT } from '../utils/env.js';
import currencyModel from '../models/currency.model.js';
import configModel from '../models/config.model.js';
import investModel from '../models/invest.model.js';
import { createWallet } from '../utils/merchant.js';
export default {
    auth: async (req, res) => {
        try {
            const { email, invite } = req.body;
            if (!email) throw new Error("Enter email address");
            const clearedEmail = email.trim().toLowerCase();
            const validate = valdiator.validate(email);
            if (!validate) throw new Error("Invalid email address");
            let user = await userModel.findOne({ email: clearedEmail });
            if (!user) {
                const ref = !isNaN(invite) ? await userModel.findOne({ id: invite }) : null;
                const id = await userModel.countDocuments() + 1;
                user = new userModel({
                    id,
                    email: clearedEmail,
                    ref1: ref?._id || null,
                    ref2: ref?.ref1 || null,
                    ref3: ref?.ref1 || null
                });
                await user.save();
            }
            if (user.block) throw new Error("Your account has been blocked");
            const activator = new activatorModel({
                user: user._id,
            });
            await activator.save();
            await sendActivator(clearedEmail, activator._id);
            return res.send({
                ok: true,
                msg: "Check your email for authorization link",
            });
        } catch (error) {
            return res.send({
                ok: false,
                msg: error.message
            });
        }
    },
    activate: async (req, res) => {
        try {
            const { _id } = req.query;
            if (!_id || _id.length !== 24) throw new Error("Invalid Authorization link");
            const activator = await activatorModel.findById(_id);
            if (!activator) throw new Error("Invalid Authorization link");
            if (activator.created + 180 < getNow()) throw new Error("Authorization link expired please try again Authorization");
            if (activator.active) throw new Error("Authorization link already used");
            const user = await userModel.findOne({ _id: activator.user });
            if (!user) throw new Error("User not found");
            activator.active = true;
            await activator.save();
            const access = jwt.sign({ _id: user._id }, USER_JWT, { expiresIn: '1d' });
            user.access = access;
            await user.save();
            return res.send({
                ok: true,
                msg: "Welcome",
                access,
                data: {
                    id: user.id,
                    email: user.email,
                    balance: await user.balance(),
                    dailyProfit: await user.dailyProfit(),
                    lvl: await user.lvl(),
                    profit: await user.profit(),
                }
            });
        } catch (error) {
            error.message;
            return res.send({
                ok: false,
                msg: error.message
            });
        }
    },
    verify: async (req, res) => {
        const user = req.user;
        return res.send({
            ok: true,
            data: {
                id: user.id,
                email: user.email,
                balance: await user.balance(),
                dailyProfit: await user.dailyProfit(),
                lvl: await user.lvl(),
                profit: await user.profit(),
            }
        });
    },
    currencies: async (_, res) => {
        try {
            const currencies = await currencyModel.find().select('title networks deposit withdraw');
            return res.send({
                ok: true,
                data: currencies
            })
        } catch (error) {
            return res.send({
                ok: false,
                msg: error.message
            })
        }
    },
    configs: async (_, res) => {
        try {
            const config = await configModel.findOne().select('minWithdraw maxWithdraw withdrawFees withdrawDays autoWithdraw ref1Percent ref2Percent ref3Percent ref1Bonus ref2Bonus ref3Bonus lvlPrice profit');
            return res.send({
                ok: true,
                data: config
            });
        } catch (error) {
            return res.send({
                ok: false,
                msg: error.message
            })
        }
    },
    deposit: async (req, res) => {
        try {
            const { currency, network, lvl } = req.body;
            if (!currency || !network || !lvl) throw new Error("Missing required fields");
            const user = req.user;
            const cfg = await configModel.findOne();
            const investPrice = () => {
                return cfg.lvlPrice * Math.pow(2, lvl - 1);
            };
            const amount = investPrice();
            const profit = amount * cfg.profit;
            const investData = {
                user: user._id,
                profit: profit / 86400,
                amount,
                currency,
                network,
                lvl: lvl - await user.lvl(),
            };
            const invest = new investModel(investData);
            const resp = await createWallet(network, amount, currency, invest._id);
            const { trackId, payAmount, address, QRCode } = resp.data;
            invest.trackId = trackId;
            invest.payAmount = payAmount;
            invest.wallet = address;
            invest.qr = QRCode;
            await invest.save();
            return res.send({
                ok: true,
                msg: "Cheque",
                data: {
                    network: invest.network,
                    wallet: invest.wallet,
                    qr: invest.qr,
                    currency: invest.currency,
                    payAmount: invest.payAmount,
                    amount: invest.amount,
                    unix: invest.created,
                    lvl
                }
            });
        } catch (error) {
            return res.send({
                ok: false,
                msg: error.message
            })
        }
    },
    claim: async (req, res) => {
        try {
            const user = req.user;
            await user.claim();
            const balance = await user.balance();
            return res.send({
                ok: true,
                data: {
                    balance
                }
            })
        } catch (error) {
            return res.send({
                ok: false,
                msg: error.message
            });
        }
    },
    referrals: async (req,res)=>{
        try {
            const referrals = await req.user.referrals();
            return res.send({
                ok: true,
                data: referrals
            })
        } catch (error) {
            return res.send({
                ok: false,
                msg: error.message
            });
        }
    }
}