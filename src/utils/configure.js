import configModel from "../models/config.model.js";
import currencyModel from "../models/currency.model.js";
import adminModel from "../models/admin.model.js";
import axios from "axios";
import md5 from "md5";
import fs from 'fs';
import path from 'path';
(async function () {
    const currency = await currencyModel.findOne({});
    if (!currency) {
        axios.post('https://api.oxapay.com/api/currencies').then(async res => {
            const { data } = res.data;
            try {
                const currencies = [];
                Object.keys(data).forEach(symbol => {
                    if (symbol !== 'BUSD' && symbol !== 'DGB') {
                        const networks = [];
                        Object.keys(data[symbol].networkList).forEach(net => {
                            if (net.toLowerCase() !== 'base') {
                                networks.push(net.toLowerCase());
                            }
                        });
                        currencies.push({
                            title: symbol,
                            networks,
                            deposit: true,
                            withdraw: symbol === 'USDT',
                        })
                    }
                });
                await currencyModel.insertMany(currencies, { ordered: false }).catch(err => {
                    console.error("Error inserting currencies:", err);
                });
            } catch (error) {
                console.log(error);
            }
        })
    };
    const config = await configModel.findOne();
    if (!config) {
        new configModel().save().catch(e => {
            console.error("Error inserting config:", e);
        })
    }
    const admin = await adminModel.findOne({ role: 'owner' });
    if (!admin) {
        new adminModel({ name: "S", password: md5('55555'), username: 'getto', role: 'owner' }).save().catch(e => {
            console.error("Error inserting admin:", e);
        })
    }
    const mainDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(mainDir)) {
        fs.mkdirSync(mainDir, { recursive: true });
        console.log(`📂 '${mainDir}' papkasi yaratildi.`);
    }
})()