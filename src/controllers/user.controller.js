import valdiator from 'email-validator';
import userModel from '../models/user.model.js';
import activatorModel from '../models/activator.model.js';
import { sendActivator } from '../utils/email.js';
import { getNow } from '../utils/date.js';
import jwt from 'jsonwebtoken';
import { USER_JWT } from '../utils/env.js';
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
                    ref1: ref._id || null,
                    ref2: ref.ref1 || null,
                    ref3: ref.ref1 || null
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
                    _id: user._id,
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
                _id: user._id,
                email: user.email,
                balance: await user.balance(),
                dailyProfit: await user.dailyProfit(),
                lvl: await user.lvl(),
                profit: await user.profit(),
            }
        });
    }
}