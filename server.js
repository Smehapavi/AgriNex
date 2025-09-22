const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Import models
const Prediction = require('./models/Prediction');
const Sensor = require('./models/Sensor');
const SprayLog = require('./models/SprayLog');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/agrinex', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.log('MongoDB connection error:', err));

// API Routes

// Get latest AI predictions for plants
app.get('/api/predict', async (req, res) => {
  try {
    const predictions = await Prediction.find()
      .sort({ timestamp: -1 })
      .limit(10);
    res.json(predictions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch predictions' });
  }
});

// Get latest sensor readings
app.get('/api/sensors', async (req, res) => {
  try {
    const sensors = await Sensor.find()
      .sort({ timestamp: -1 })
      .limit(1);
    res.json(sensors[0] || {});
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sensor data' });
  }
});

// Send spray command
app.post('/api/spray', async (req, res) => {
  try {
    const { nozzleId, pesticideType, mode } = req.body;
    
    // Create spray log entry
    const sprayLog = new SprayLog({
      nozzleId,
      pesticideType,
      mode,
      timestamp: new Date(),
      status: 'completed'
    });
    
    await sprayLog.save();
    
    res.json({ 
      success: true, 
      message: `Spray command executed on nozzle ${nozzleId}`,
      sprayLog 
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to execute spray command' });
  }
});

// Get history logs
app.get('/api/history', async (req, res) => {
  try {
    const { type, limit = 50 } = req.query;
    
    let logs = [];
    
    if (type === 'predictions') {
      logs = await Prediction.find()
        .sort({ timestamp: -1 })
        .limit(parseInt(limit));
    } else if (type === 'sensors') {
      logs = await Sensor.find()
        .sort({ timestamp: -1 })
        .limit(parseInt(limit));
    } else if (type === 'sprays') {
      logs = await SprayLog.find()
        .sort({ timestamp: -1 })
        .limit(parseInt(limit));
    } else {
      // Get all types
      const [predictions, sensors, sprays] = await Promise.all([
        Prediction.find().sort({ timestamp: -1 }).limit(20),
        Sensor.find().sort({ timestamp: -1 }).limit(20),
        SprayLog.find().sort({ timestamp: -1 }).limit(20)
      ]);
      
      logs = [
        ...predictions.map(p => ({ ...p.toObject(), type: 'prediction' })),
        ...sensors.map(s => ({ ...s.toObject(), type: 'sensor' })),
        ...sprays.map(s => ({ ...s.toObject(), type: 'spray' }))
      ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }
    
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch history logs' });
  }
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
