const mongoose = require('mongoose');

const sprayLogSchema = new mongoose.Schema({
  nozzleId: {
    type: String,
    required: true,
    index: true
  },
  pesticideType: {
    type: String,
    required: true,
    enum: ['fungicide', 'herbicide', 'insecticide', 'fertilizer']
  },
  mode: {
    type: String,
    required: true,
    enum: ['manual', 'auto']
  },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'completed', 'failed'],
    default: 'completed'
  },
  duration: {
    type: Number, // in seconds
    default: 30
  },
  volume: {
    type: Number, // in ml
    default: 100
  },
  targetPlant: {
    plantId: String,
    diseaseName: String
  },
  location: {
    zone: String,
    coordinates: {
      x: Number,
      y: Number
    }
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  }
});

// Index for efficient queries
sprayLogSchema.index({ nozzleId: 1, timestamp: -1 });

module.exports = mongoose.model('SprayLog', sprayLogSchema);
