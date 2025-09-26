import React, { useEffect, useState } from 'react';
import styles from './AnalyticsPanel.module.css';
import axios from 'axios';

export default function AnalyticsPanel() {
  const [diseaseData, setDiseaseData] = useState([]);
  const [sensorData, setSensorData] = useState([]);

  useEffect(() => {
    // Placeholder fetches
    const fetchDisease = async () => {
      try {
        const res = await axios.get('/api/predict');
        setDiseaseData(res.data);
      } catch (err) {
        setDiseaseData([]);
      }
    };
    const fetchSensor = async () => {
      try {
        const res = await axios.get('/api/sensors');
        setSensorData([res.data]);
      } catch (err) {
        setSensorData([]);
      }
    };
    fetchDisease();
    fetchSensor();
  }, []);

  // Placeholder analytics: count of each disease
  const diseaseCounts = diseaseData.reduce((acc, plant) => {
    const name = plant.diseaseName || 'Healthy';
    acc[name] = (acc[name] || 0) + 1;
    return acc;
  }, {});

  return (
    <section className={styles.panel}>
      <h2 className={styles.title}>Analytics</h2>
      <div className={styles.charts}>
        <div className={styles.chartCard}>
          <h3>Disease Trends</h3>
          <ul>
            {Object.entries(diseaseCounts).map(([name, count]) => (
              <li key={name}>
                <span className={styles.diseaseName}>{name}:</span> <span className={styles.diseaseCount}>{count}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.chartCard}>
          <h3>Sensor Snapshot</h3>
          {sensorData.length === 0 ? (
            <div>No sensor data</div>
          ) : (
            <ul>
              <li>Moisture: {sensorData[0].moisture ?? '--'}%</li>
              <li>NPK: {sensorData[0].npk ?? '--'}</li>
              <li>Temperature: {sensorData[0].temperature ?? '--'}°C</li>
              <li>Humidity: {sensorData[0].humidity ?? '--'}%</li>
            </ul>
          )}
        </div>
      </div>
      {/* Placeholder for heatmap/graphs */}
      <div className={styles.heatmapPlaceholder}>Severity Heatmap (Coming Soon)</div>
    </section>
  );
}
