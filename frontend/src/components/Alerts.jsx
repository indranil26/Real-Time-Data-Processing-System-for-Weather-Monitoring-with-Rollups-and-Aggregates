import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const alertsResponse = await axios.get('http://localhost:5000/api/weather/check-alerts');
        setAlerts(alertsResponse.data);
      } catch (error) {
        console.error('Error fetching weather data or alerts:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="mt-6 bg-red-100 p-4 rounded-md">
      <h2 className="text-lg font-bold text-red-600">Alerts</h2>
      {alerts.length > 0 ? (
        <ul className="list-disc ml-4 text-red-800">
          {alerts.map((alert, index) => (
            <li key={index}>{alert}</li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600">No alerts triggered.</p>
      )}
    </div>
  );
};

export default Alerts;
