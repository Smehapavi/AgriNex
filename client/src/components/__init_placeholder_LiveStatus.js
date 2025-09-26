import React, { useEffect, useState } from 'react';
import styles from './LiveStatus.module.css';
import axios from 'axios';

const severityColors = {
  High: '#F44336', // red
  Medium: '#FFC107', // yellow
  Low: '#4CAF50' // green
};

export default function LiveStatus() {
  const [plants, setPlants] = useState([]);

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const res = await axios.get('/api/predict');
        setPlants(res.data);
      } catch (err) {
        setPlants([]);
      }
    };
    fetchPlants();
    const interval = setInterval(fetchPlants, 5000); // auto-refresh every 5s
    return () => clearInterval(interval);
  }, []);

  return (
    <section className={styles.panel}>
      <h2 className={styles.title}>Live Plant Status</h2>
      <div className={styles.cards}>
        {plants.length === 0 ? (
          <div className={styles.empty}>No plant data available.</div>
        ) : (
          plants.map(plant => (
            <div
              key={plant._id || plant.id}
              className={styles.card}
              style={{ borderColor: severityColors[plant.severity] || '#8BC34A' }}
            >
              <img
                src={plant.leafImage || '/placeholder-leaf.png'}
                alt={`Plant ${plant.plantId} Leaf`}
                className={styles.image}
              />
              <div className={styles.info}>
                <div className={styles.row}><strong>ID:</strong> {plant.plantId}</div>
                <div className={styles.row}><strong>Disease:</strong> {plant.diseaseName || 'Healthy'}</div>
                <div className={styles.row}><strong>Severity:</strong> <span style={{ color: severityColors[plant.severity] }}>{plant.severity}</span></div>
                <div className={styles.row}><strong>Confidence:</strong> {plant.confidence ? `${plant.confidence}%` : '--'}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
