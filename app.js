// app.js
const express = require('express');
const mongoose = require('mongoose');
const financeRoutes = require('./routes/finance.route');

const app = express();

app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://tonylimbani:admin@cluster0.lrxmb3d.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB', err));

app.use('/finance', financeRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));