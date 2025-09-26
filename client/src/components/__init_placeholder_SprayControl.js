import React, { useState } from 'react';
import styles from './SprayControl.module.css';
import axios from 'axios';

export default function SprayControl() {
  const [mode, setMode] = useState('Manual');
  const [pesticideType, setPesticideType] = useState('Organic');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSpray = async () => {
    setLoading(true);
    setMessage('');
    try {
      const res = await axios.post('/api/spray', {
        nozzleId: 1, // Placeholder, can be dynamic
        pesticideType,
        mode: mode.toLowerCase()
      });
      setMessage(res.data.message || 'Spray command sent!');
    } catch (err) {
      setMessage('Failed to send spray command.');
    }
    setLoading(false);
  };

  return (
    <section className={styles.panel}>
      <h2 className={styles.title}>Spray Control</h2>
      <div className={styles.controls}>
        <select
          className={styles.dropdown}
          value={pesticideType}
          onChange={e => setPesticideType(e.target.value)}
        >
          <option value="Organic">Organic</option>
          <option value="Chemical">Chemical</option>
        </select>
        <button
          className={mode === 'Manual' ? styles.activeBtn : styles.btn}
          onClick={() => setMode('Manual')}
        >Manual Spray</button>
        <button
          className={mode === 'Auto' ? styles.activeBtn : styles.btn}
          onClick={() => setMode('Auto')}
        >Auto Spray</button>
        <button
          className={styles.sprayBtn}
          onClick={handleSpray}
          disabled={loading}
        >{loading ? 'Spraying...' : 'Send Spray Command'}</button>
      </div>
      {message && <div className={styles.message}>{message}</div>}
    </section>
  );
}
