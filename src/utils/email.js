import nodemailer from 'nodemailer';
import { EMAIL_LOGIN, EMAIL_PASSWORD, SMTP } from './env.js';

export const sendActivator = async (to, path) => {

    let transporter = nodemailer.createTransport({
        host: SMTP,
        port: 587,
        secure: false,
        auth: {
            user: EMAIL_LOGIN,
            pass: EMAIL_PASSWORD
        }
    });

    // Elektron pochta xabarini yuborish
    return await transporter.sendMail({
        from: `"ISHIM.UZ" ${EMAIL_LOGIN}`,
        to,
        subject: "Visit profile",
        text: `https://ishim.uz/verify/${path}`,
        html: `https://ishim.uz/verify/${path}`,
    });
};