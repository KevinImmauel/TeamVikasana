const socketIo = require('socket.io');
const SOS = require('../model/sosModel');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const apiValidator = require('../service/validation/apiValidation');
const express = require('express');
const {JWT_SECRET} = require('../config/config');
const logger = require('../util/logger');
const app = express()
app.use(apiValidator)
const userConnections = new Map();

const setupSocket = (server) => {
    const io = socketIo(server, {
        cors: {
            origin: "http://localhost:3000/",
            methods: ["GET", "POST"],
            credentials: true,
        },
    });

    io.on('connection', (socket) => {
        console.log('A user connected');
        userConnections.set(socket.id, { socket });
        socket.on('sendSOS', async (sosData, token) => {
            try {
               
                const decoded = jwt.verify(token, JWT_SECRET);
                console.log(decoded);
                const userId = decoded.userData.id; 
                // logger.error(userId)
                sosData.triggered_by = userId;

                // Save SOS data to MongoDB
                const sosMessage = new SOS(sosData);
                await sosMessage.save(); 

                console.log('SOS saved to database:', sosMessage);
                userConnections.forEach((user) => {
                    user.socket.emit('newSOS', sosMessage);
                });
            } catch (error) {
                console.error('Error saving SOS to database:', error);
            }
        });
        socket.on('disconnect', () => {
            userConnections.delete(socket.id);
            console.log('A user disconnected');
        });
    });

    return io;
};

module.exports = setupSocket;
