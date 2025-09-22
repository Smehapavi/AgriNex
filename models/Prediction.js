const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
  plantId: {
    type: String,
    required: true,
    index: true
  },
  diseaseName: {
    type: String,
    required: true
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    required: true
  },
  confidence: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  thumbnail: {
    type: String,
    default: null
  },
  location: {
    x: Number,
    y: Number,
    zone: String
  },
  recommendation: {
    type: String,
    default: 'Monitor closely'
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  }
});

// Index for efficient queries
predictionSchema.index({ plantId: 1, timestamp: -1 });

module.exports = mongoose.model('Prediction', predictionSchema);
