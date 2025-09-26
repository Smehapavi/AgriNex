const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
  disease: {
    type: String,
    required: true
  },
  severity: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    required: true
  },
  status: {
    type: String,
    enum: ['Healthy', 'Unhealthy'],
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now,
    required: true
  }
});

module.exports = mongoose.model('Prediction', predictionSchema);
