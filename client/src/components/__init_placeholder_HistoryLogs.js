import React, { useEffect, useState } from 'react';
import styles from './HistoryLogs.module.css';
import axios from 'axios';

export default function HistoryLogs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await axios.get('/api/history?limit=50');
        setLogs(res.data);
      } catch (err) {
        setLogs([]);
      }
    };
    fetchLogs();
    const interval = setInterval(fetchLogs, 10000); // auto-refresh every 10s
    return () => clearInterval(interval);
  }, []);

  return (
    <section className={styles.panel}>
      <h2 className={styles.title}>History Logs</h2>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Nozzle</th>
              <th>Mode</th>
              <th>Pesticide Type</th>
              <th>Action Status</th>
              <th>Predicted Disease</th>
              <th>Severity</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr><td colSpan={7} className={styles.empty}>No logs available.</td></tr>
            ) : (
              logs.map((log, idx) => (
                <tr key={log._id || idx}>
                  <td>{log.timestamp ? new Date(log.timestamp).toLocaleString() : '--'}</td>
                  <td>{log.nozzleId ?? '--'}</td>
                  <td>{log.mode ? log.mode.charAt(0).toUpperCase() + log.mode.slice(1) : '--'}</td>
                  <td>{log.pesticideType ?? '--'}</td>
                  <td>{log.status ?? '--'}</td>
                  <td>{log.diseaseName ?? '--'}</td>
                  <td><span style={{ color: log.severity === 'High' ? '#F44336' : log.severity === 'Medium' ? '#FFC107' : '#4CAF50' }}>{log.severity ?? '--'}</span></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
