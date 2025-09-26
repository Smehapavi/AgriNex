// Save ML prediction result
app.post('/api/predictions', async (req, res) => {
  try {
    const { disease, severity, status } = req.body;
    if (!disease || !severity || !status) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const prediction = new Prediction({
      disease,
      severity,
      status,
      timestamp: new Date()
    });
    await prediction.save();
    res.json({ success: true, prediction });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save prediction', details: error.message });
  }
});

// Get all predictions sorted by newest first
app.get('/api/predictions', async (req, res) => {
  try {
    const predictions = await Prediction.find().sort({ timestamp: -1 });
    res.json(predictions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch predictions', details: error.message });
  }
});
// Delete all predictions (for cleanup)
app.delete('/api/predictions', async (req, res) => {
  try {
    await Prediction.deleteMany({});
    res.json({ success: true, message: 'All predictions deleted.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete predictions' });
  }
});
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
const multer = require('multer');
const upload = multer();
const axios = require('axios');

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

// ML Prediction endpoint
// ML Prediction endpoint
// ML Prediction endpoint
app.post('/api/ml-predict', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    // Send image to Python ML service
    const response = await axios.post('http://localhost:5001/predict', req.file.buffer, {
      headers: {
        'Content-Type': 'application/octet-stream'
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity
    });

    const mlPrediction = response.data.prediction; // single object
    const { disease, severity, status } = mlPrediction;

    // Save prediction to MongoDB
    const predictionDoc = new Prediction({
      disease,
      severity,
      status,
      timestamp: new Date()
    });

    const savedPrediction = await predictionDoc.save();

    res.json({ success: true, prediction: savedPrediction });

  } catch (error) {
    console.error('ML prediction failed:', error);
    res.status(500).json({ error: 'ML prediction failed', details: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
