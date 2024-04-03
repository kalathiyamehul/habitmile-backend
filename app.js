// // app.js
// const express = require('express');
// const mongoose = require('mongoose');
// const financeRoutes = require('./routes/finance.route');

// const app = express();

// app.use(express.json());

// // Connect to MongoDB
// mongoose.connect('mongodb+srv://tonylimbani:admin@cluster0.lrxmb3d.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => console.log('Connected to MongoDB'))
//     .catch(err => console.error('Failed to connect to MongoDB', err));

// app.use('/finance', financeRoutes);

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));


// app.js
const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');

const app = express();
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb+srv://hexablockstech:DkuBaPXYNrJ4Zse2@cluster0.ntmrtcb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Routes
app.use('/api/user', userRoutes);
app.use('/info', (req, res, next) => {
  res.status(200).json({ status: 'success', data: 'Server is Running' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports=app