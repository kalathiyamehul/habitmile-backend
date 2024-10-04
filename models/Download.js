const mongoose = require('mongoose');

const downloadSchema = new mongoose.Schema({
  downloadTime: { type: Date, default: Date.now }
});

const Download = mongoose.model('Download', downloadSchema);

module.exports = Download;
