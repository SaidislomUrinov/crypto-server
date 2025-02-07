import jwt from 'jsonwebtoken';
import { USER_JWT } from '../utils/env.js';
import userModel from '../models/user.model.js';
export const userAuth = async (req, res, next) => {
    try {
        const token = req.headers['x-auth-token'];
        if (!token || !token.startsWith('Bearer ')) throw new Error("Invalid token");
        const access = token.slice(7);
        const decoded = jwt.verify(access, USER_JWT);
        const user = await userModel.findOne({ _id: decoded._id });
        if (!user) throw new Error("User not found");
        if (user.block) throw new Error("Your account has been blocked");
        if (access !== user.access) throw new Error("Session has expired");
        req.user = user;
        next();
    } catch (error) {
        return res.send({
            ok: false,
            msg: error.message,
        })
    }
}