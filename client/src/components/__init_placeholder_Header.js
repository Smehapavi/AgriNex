import React from 'react';
import styles from './Header.module.css';

const statusColors = {
  healthy: '#4CAF50', // green
  warning: '#FFC107', // yellow
  critical: '#F44336' // red
};

export default function Header({ systemStatus = 'healthy' }) {
  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <span role="img" aria-label="leaf" className={styles.leaf}>🌱</span>
        <span className={styles.title}>AgriNex – Smart Pesticide Sprinkler</span>
      </div>
      <div className={styles.status}>
        <span
          className={styles.statusIndicator}
          style={{ backgroundColor: statusColors[systemStatus] }}
          title={systemStatus.charAt(0).toUpperCase() + systemStatus.slice(1)}
        />
        <span className={styles.statusText}>{systemStatus.charAt(0).toUpperCase() + systemStatus.slice(1)}</span>
      </div>
    </header>
  );
}
