const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cuenta-regresiva', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Models
const Zonal = mongoose.model('Zonal', {
    nombre: String,
    fecha: String,
    horaSalida: String,
    tiempoRestante: String,
    activo: Boolean
});

// Middleware
app.use(express.json());
app.use(express.static('frontend/build'));

// Socket.IO connection
io.on('connection', (socket) => {
    console.log('New client connected');

    // Send initial data
    Zonal.find()
        .sort({ fecha: -1 })
        .then(zonals => {
            socket.emit('initialData', zonals);
        });

    // Update timer every second
    const timer = setInterval(() => {
        Zonal.find({ activo: true })
            .then(zonals => {
                const currentTime = new Date();
                const updatedZonals = zonals.map(zonal => {
                    const horaSalida = new Date(zonal.fecha + ' ' + zonal.horaSalida);
                    const diff = horaSalida - currentTime;
                    
                    if (diff > 0) {
                        const hours = Math.floor(diff / (1000 * 60 * 60));
                        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
                        
                        zonal.tiempoRestante = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                        return zonal.save();
                    } else {
                        zonal.tiempoRestante = '00:00:00';
                        return zonal.save();
                    }
                });

                Promise.all(updatedZonals)
                    .then(() => {
                        Zonal.find({ activo: true })
                            .then(zonals => {
                                io.emit('timerUpdate', zonals);
                            });
                    });
            });
    }, 1000);

    socket.on('disconnect', () => {
        console.log('Client disconnected');
        clearInterval(timer);
    });
});

// Routes
app.post('/api/zonal', async (req, res) => {
    try {
        const zonal = new Zonal(req.body);
        await zonal.save();
        io.emit('zonalAdded', zonal);
        res.status(201).json(zonal);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.put('/api/zonal/:id', async (req, res) => {
    try {
        const zonal = await Zonal.findByIdAndUpdate(req.params.id, req.body, { new: true });
        io.emit('zonalUpdated', zonal);
        res.json(zonal);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
