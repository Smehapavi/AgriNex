import React, { useEffect, useState } from 'react';
import styles from './SensorPanel.module.css';
import axios from 'axios';

const getColor = (type, value) => {
  // Example thresholds, adjust as needed
  if (type === 'moisture') {
    if (value < 20) return '#F44336'; // critical
    if (value < 40) return '#FFC107'; // warning
    return '#4CAF50'; // normal
  }
  if (type === 'temperature') {
    if (value < 10 || value > 40) return '#F44336';
    if (value < 18 || value > 32) return '#FFC107';
    return '#4CAF50';
  }
  if (type === 'humidity') {
    if (value < 30 || value > 90) return '#F44336';
    if (value < 40 || value > 80) return '#FFC107';
    return '#4CAF50';
  }
  if (type === 'npk') {
    if (value < 50) return '#F44336';
    if (value < 100) return '#FFC107';
    return '#4CAF50';
  }
  return '#8BC34A';
};

export default function SensorPanel() {
  const [data, setData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('/api/sensors');
        setData(res.data);
      } catch (err) {
        setData({});
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 7000); // auto-refresh every 7s
    return () => clearInterval(interval);
  }, []);

  return (
    <section className={styles.panel}>
      <h2 className={styles.title}>Sensor Data</h2>
      <div className={styles.grid}>
        <div className={styles.card} style={{ borderColor: getColor('moisture', data.moisture) }}>
          <span className={styles.label}>Soil Moisture</span>
          <span className={styles.value}>{data.moisture ?? '--'}%</span>
        </div>
        <div className={styles.card} style={{ borderColor: getColor('npk', data.npk) }}>
          <span className={styles.label}>NPK</span>
          <span className={styles.value}>{data.npk ?? '--'}</span>
        </div>
        <div className={styles.card} style={{ borderColor: getColor('temperature', data.temperature) }}>
          <span className={styles.label}>Temperature</span>
          <span className={styles.value}>{data.temperature ?? '--'}°C</span>
        </div>
        <div className={styles.card} style={{ borderColor: getColor('humidity', data.humidity) }}>
          <span className={styles.label}>Humidity</span>
          <span className={styles.value}>{data.humidity ?? '--'}%</span>
        </div>
      </div>
    </section>
  );
}
