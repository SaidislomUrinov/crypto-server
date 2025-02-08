import './src/utils/configure.js';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import mongoose from 'mongoose';
import cron from 'node-cron';
import { PORT, MONGO_URI } from './src/utils/env.js';
import router from './src/router.js';
import userModel from './src/models/user.model.js';
import { checkDeposit } from './src/utils/merchant.js';
const app = express();
app.use(express.json());
app.use(cors());
app.use(fileUpload());
app.use('/uploads', express.static('uploads'));
mongoose.connect(MONGO_URI)
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});
io.on('connection', async (socket) => {
    const clients = await io.to('online').fetchSockets();
    const client = clients?.find(c => c?.handshake?.headers?.authorization === socket.handshake.headers.authorization);
    if (!client) {
        socket.join('online');
        socket.on('disconnect', () => {
            socket.leave('online');
        });
    }
});
app.use((req, res, next) => {
    req.io = io
    next();
});
cron.schedule('*/2 * * * * *', async () => {
    try {
        const clients = await io.to('online').fetchSockets();
        for (let socket of clients) {
            if (socket) {
                const userId = socket.handshake.headers.authorization;
                if (userId) {
                    const user = await userModel.findOne({ id: userId });
                    if (user) {
                        const profit = await user?.profit();
                        const dailyProfit = await user?.dailyProfit();
                        socket.emit('updateProfit',
                            { profit, dailyProfit }
                        );
                    } else {
                        console.log(`User not found`);
                    }
                } else {
                    console.log(`No authorization header for socket`);
                }
            }
        }
    } catch (error) {
        console.log('Error in cron task:', error);
    }
});
app.get('/successdep/:id', checkDeposit);
app.use('/api', router)
server.listen(PORT);