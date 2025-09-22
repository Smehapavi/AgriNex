const mongoose = require('mongoose');

const sensorSchema = new mongoose.Schema({
  soilMoisture: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  npkLevels: {
    nitrogen: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    phosphorus: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    potassium: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    }
  },
  temperature: {
    type: Number,
    required: true,
    min: -50,
    max: 100
  },
  humidity: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  weather: {
    condition: {
      type: String,
      enum: ['sunny', 'cloudy', 'rainy', 'stormy', 'foggy'],
      required: true
    },
    windSpeed: {
      type: Number,
      min: 0,
      max: 200
    },
    pressure: {
      type: Number,
      min: 800,
      max: 1200
    }
  },
  location: {
    zone: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  }
});

// Index for efficient queries
sensorSchema.index({ timestamp: -1 });

module.exports = mongoose.model('Sensor', sensorSchema);
