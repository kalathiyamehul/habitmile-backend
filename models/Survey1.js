const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  location: {
    type: String,
    required: false
  },
  age: {
    type: String,
    required: false
  },
  gender: {
    type: String,
    required: false
  },
  occupation: {
    type: String,
    required: false
  },
  habitTracking: {
    type: String,
    required: false
  },
  habitTrackingMethods: {
    type: [String],
    required: false
  },
  habitTrackingFrequency: {
    type: String,
    required: false
  },
  disciplineLevel: {
    type: String,
    required: false
  },
  goalSettingMethods: {
    type: [String],
    required: false
  },
  progressTrackingMethods: {
    type: [String],
    required: false
  },
  disciplineStrategies: {
    type: [String],
    required: false
  },
  challenges: {
    type: [String],
    required: false
  },
  personalGrowthImportance: {
    type: String,
    required: false
  },
  personalGrowthSatisfaction: {
    type: String,
    required: false
  },
  personalGrowthHabits: {
    type: [String],
    required: false
  },
  virtualHangout: {
    type: String,
    required: false
  }
});

const Survey1 = mongoose.model('Survey1', questionSchema);

module.exports = Survey1;
