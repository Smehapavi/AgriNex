# AgriNex - Intelligent Pesticide Sprinkling System Dashboard

A comprehensive MERN stack dashboard for monitoring and controlling an intelligent pesticide sprinkling system in agricultural environments.

## Features

- **Real-time Plant Disease Detection**: AI-powered predictions with severity levels and confidence scores
- **Live Sensor Monitoring**: Soil moisture, NPK levels, temperature, humidity, and weather conditions
- **Smart Spray Control**: Both manual and automatic spray modes with intelligent recommendations
- **Comprehensive History Logs**: Track all predictions, sensor readings, and spray actions
- **Responsive Design**: Works on desktop and tablet devices
- **Auto-refresh**: Data updates every 8 seconds automatically

## Technology Stack

### Frontend
- **React.js** - User interface framework
- **Material-UI** - Component library and theming
- **Axios** - HTTP client for API calls
- **Recharts** - Data visualization and charts

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB object modeling

## Project Structure

```
AgriNex/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── Header.js
│   │   │   ├── LiveStatus.js
│   │   │   ├── SensorPanel.js
│   │   │   ├── SprayControl.js
│   │   │   ├── HistoryLogs.js
│   │   │   └── Footer.js
│   │   ├── services/       # API services
│   │   │   └── apiService.js
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── models/                 # MongoDB schemas
│   ├── Prediction.js
│   ├── Sensor.js
│   └── SprayLog.js
├── scripts/                # Database seeding
│   └── seedData.js
├── server.js              # Express server
└── package.json
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### 1. Clone the Repository
```bash
git clone <repository-url>
cd AgriNex
```

### 2. Install Dependencies

#### Backend Dependencies
```bash
npm install
```

#### Frontend Dependencies
```bash
cd client
npm install
cd ..
```

### 3. Database Setup

#### Start MongoDB
Make sure MongoDB is running on your system:
```bash
# On Windows
net start MongoDB

# On macOS/Linux
sudo systemctl start mongod
```

#### Seed Sample Data
```bash
node scripts/seedData.js
```

### 4. Environment Configuration

Create a `.env` file in the root directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/agrinex
NODE_ENV=development
```

### 5. Run the Application

#### Development Mode (Both frontend and backend)
```bash
npm run dev
```

#### Run Backend Only
```bash
npm run server
```

#### Run Frontend Only
```bash
npm run client
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## API Endpoints

### Predictions
- `GET /api/predict` - Get latest plant disease predictions

### Sensors
- `GET /api/sensors` - Get latest sensor readings

### Spray Control
- `POST /api/spray` - Send spray command
  ```json
  {
    "nozzleId": "nozzle-1",
    "pesticideType": "fungicide",
    "mode": "manual"
  }
  ```

### History
- `GET /api/history` - Get all history logs
- `GET /api/history?type=predictions` - Get prediction logs only
- `GET /api/history?type=sensors` - Get sensor logs only
- `GET /api/history?type=sprays` - Get spray logs only

## Database Schema

### Prediction Model
```javascript
{
  plantId: String,
  diseaseName: String,
  severity: ['low', 'medium', 'high', 'critical'],
  confidence: Number (0-100),
  thumbnail: String,
  location: { x: Number, y: Number, zone: String },
  recommendation: String,
  timestamp: Date
}
```

### Sensor Model
```javascript
{
  soilMoisture: Number (0-100),
  npkLevels: {
    nitrogen: Number (0-100),
    phosphorus: Number (0-100),
    potassium: Number (0-100)
  },
  temperature: Number,
  humidity: Number (0-100),
  weather: {
    condition: String,
    windSpeed: Number,
    pressure: Number
  },
  location: { zone: String, coordinates: { lat: Number, lng: Number } },
  timestamp: Date
}
```

### SprayLog Model
```javascript
{
  nozzleId: String,
  pesticideType: ['fungicide', 'herbicide', 'insecticide', 'fertilizer'],
  mode: ['manual', 'auto'],
  status: ['pending', 'in_progress', 'completed', 'failed'],
  duration: Number,
  volume: Number,
  targetPlant: { plantId: String, diseaseName: String },
  location: { zone: String, coordinates: { x: Number, y: Number } },
  timestamp: Date
}
```

## Features Overview

### Live Status Dashboard
- Displays real-time plant disease predictions
- Shows severity levels with color-coded indicators
- Confidence scores for each prediction
- Plant location and zone information

### Sensor Panel
- Real-time soil moisture monitoring
- NPK (Nitrogen, Phosphorus, Potassium) levels
- Temperature and humidity readings
- Weather conditions and atmospheric pressure
- Visual progress bars with color-coded status

### Spray Control System
- **Auto Mode**: Intelligent recommendations based on:
  - Disease severity levels
  - Soil moisture conditions
  - Weather conditions
- **Manual Mode**: Direct control over:
  - Nozzle selection (4 zones)
  - Pesticide type selection
  - Spray execution

### History Logs
- Comprehensive logging of all system activities
- Filterable by type (predictions, sensors, sprays)
- Timestamp tracking
- Status and value monitoring
- Location information

## Customization

### Adding New Sensor Types
1. Update the Sensor model in `models/Sensor.js`
2. Modify the SensorPanel component to display new data
3. Update the API endpoints if needed

### Adding New Pesticide Types
1. Update the SprayLog model enum in `models/SprayLog.js`
2. Modify the SprayControl component dropdown options

### Styling Customization
- Modify the Material-UI theme in `client/src/App.js`
- Update component styles in individual component files
- Change color schemes and typography as needed

## Production Deployment

### Build for Production
```bash
npm run build
```

### Environment Variables for Production
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://your-production-db-url
```

### Deploy to Heroku
1. Create a Heroku app
2. Set environment variables
3. Deploy using Git:
```bash
git push heroku main
```

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in environment variables

2. **Port Already in Use**
   - Change PORT in .env file
   - Kill existing processes using the port

3. **CORS Issues**
   - Verify proxy setting in client/package.json
   - Check CORS configuration in server.js

4. **Missing Dependencies**
   - Run `npm install` in both root and client directories
   - Clear node_modules and reinstall if needed

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please contact the AgriNex development team.
