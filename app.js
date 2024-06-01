const express = require('express');
const mongoose = require('mongoose');
const surveyRoutes = require('./routes/survey.route');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors({
  origin: '*'
}));
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
app.use('/api/survey', surveyRoutes);
app.use('/api/info', (req, res, next) => {
  res.status(200).json({ status: 'success', data: 'Server is Running' });
});

// Start server
const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports=app