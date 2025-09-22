const mongoose = require('mongoose');
const Prediction = require('../models/Prediction');
const Sensor = require('../models/Sensor');
const SprayLog = require('../models/SprayLog');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/agrinex', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB for seeding'))
.catch(err => console.log('MongoDB connection error:', err));

// Sample data for predictions
const samplePredictions = [
  {
    plantId: 'P001',
    diseaseName: 'Leaf Blight',
    severity: 'high',
    confidence: 87,
    location: { x: 10, y: 15, zone: 'A' },
    recommendation: 'Immediate fungicide treatment required'
  },
  {
    plantId: 'P002',
    diseaseName: 'Root Rot',
    severity: 'critical',
    confidence: 92,
    location: { x: 25, y: 30, zone: 'B' },
    recommendation: 'Emergency treatment needed'
  },
  {
    plantId: 'P003',
    diseaseName: 'Powdery Mildew',
    severity: 'medium',
    confidence: 75,
    location: { x: 40, y: 20, zone: 'C' },
    recommendation: 'Monitor and treat if condition worsens'
  },
  {
    plantId: 'P004',
    diseaseName: 'Healthy',
    severity: 'low',
    confidence: 95,
    location: { x: 15, y: 45, zone: 'A' },
    recommendation: 'Continue regular monitoring'
  },
  {
    plantId: 'P005',
    diseaseName: 'Aphid Infestation',
    severity: 'medium',
    confidence: 68,
    location: { x: 50, y: 35, zone: 'D' },
    recommendation: 'Apply insecticide treatment'
  }
];

// Sample sensor data
const sampleSensorData = [
  {
    soilMoisture: 45,
    npkLevels: {
      nitrogen: 65,
      phosphorus: 42,
      potassium: 58
    },
    temperature: 24.5,
    humidity: 68,
    weather: {
      condition: 'cloudy',
      windSpeed: 12,
      pressure: 1013
    },
    location: {
      zone: 'Main Field',
      coordinates: { lat: 40.7128, lng: -74.0060 }
    }
  },
  {
    soilMoisture: 38,
    npkLevels: {
      nitrogen: 58,
      phosphorus: 35,
      potassium: 62
    },
    temperature: 26.2,
    humidity: 72,
    weather: {
      condition: 'sunny',
      windSpeed: 8,
      pressure: 1015
    },
    location: {
      zone: 'Main Field',
      coordinates: { lat: 40.7128, lng: -74.0060 }
    }
  }
];

// Sample spray logs
const sampleSprayLogs = [
  {
    nozzleId: 'nozzle-1',
    pesticideType: 'fungicide',
    mode: 'auto',
    status: 'completed',
    duration: 45,
    volume: 150,
    targetPlant: {
      plantId: 'P001',
      diseaseName: 'Leaf Blight'
    },
    location: {
      zone: 'A',
      coordinates: { x: 10, y: 15 }
    }
  },
  {
    nozzleId: 'nozzle-2',
    pesticideType: 'insecticide',
    mode: 'manual',
    status: 'completed',
    duration: 30,
    volume: 100,
    targetPlant: {
      plantId: 'P005',
      diseaseName: 'Aphid Infestation'
    },
    location: {
      zone: 'D',
      coordinates: { x: 50, y: 35 }
    }
  },
  {
    nozzleId: 'nozzle-3',
    pesticideType: 'fertilizer',
    mode: 'auto',
    status: 'completed',
    duration: 60,
    volume: 200,
    location: {
      zone: 'B',
      coordinates: { x: 25, y: 30 }
    }
  }
];

// Function to generate timestamps for the last 24 hours
const generateTimestamps = (count) => {
  const now = new Date();
  const timestamps = [];
  
  for (let i = 0; i < count; i++) {
    const timestamp = new Date(now.getTime() - (i * 60 * 60 * 1000)); // Every hour
    timestamps.push(timestamp);
  }
  
  return timestamps;
};

// Seed function
const seedDatabase = async () => {
  try {
    // Clear existing data
    await Prediction.deleteMany({});
    await Sensor.deleteMany({});
    await SprayLog.deleteMany({});
    
    console.log('Cleared existing data');
    
    // Generate timestamps for the last 24 hours
    const timestamps = generateTimestamps(24);
    
    // Seed predictions with timestamps
    const predictionsWithTimestamps = [];
    for (let i = 0; i < 20; i++) {
      const prediction = {
        ...samplePredictions[i % samplePredictions.length],
        timestamp: timestamps[i % timestamps.length]
      };
      predictionsWithTimestamps.push(prediction);
    }
    
    await Prediction.insertMany(predictionsWithTimestamps);
    console.log(`Seeded ${predictionsWithTimestamps.length} predictions`);
    
    // Seed sensor data with timestamps
    const sensorsWithTimestamps = [];
    for (let i = 0; i < 15; i++) {
      const sensor = {
        ...sampleSensorData[i % sampleSensorData.length],
        timestamp: timestamps[i % timestamps.length]
      };
      sensorsWithTimestamps.push(sensor);
    }
    
    await Sensor.insertMany(sensorsWithTimestamps);
    console.log(`Seeded ${sensorsWithTimestamps.length} sensor readings`);
    
    // Seed spray logs with timestamps
    const spraysWithTimestamps = [];
    for (let i = 0; i < 10; i++) {
      const spray = {
        ...sampleSprayLogs[i % sampleSprayLogs.length],
        timestamp: timestamps[i % timestamps.length]
      };
      spraysWithTimestamps.push(spray);
    }
    
    await SprayLog.insertMany(spraysWithTimestamps);
    console.log(`Seeded ${spraysWithTimestamps.length} spray logs`);
    
    console.log('Database seeded successfully!');
    process.exit(0);
    
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();
