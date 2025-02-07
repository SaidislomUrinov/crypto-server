import './src/utils/configure.js';
import express from 'express';
import http from 'http';
import {Server} from 'socket.io';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import mongoose from 'mongoose';
import {PORT, MONGO_URI} from './src/utils/env.js';
import router from './src/router.js';
const app = express();
app.use(express.json());
app.use(cors());
app.use(fileUpload());
app.use('/uploads', express.static('uploads'));
mongoose.connect(MONGO_URI)
const server = http.createServer(app);
const io = new Server(server);
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
app.use('/api', router)
server.listen(PORT);