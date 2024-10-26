// src/components/WeatherForecast.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const WeatherForecast = ({ city }) => {
  const [forecastData, setForecastData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTable, setShowTable] = useState(false); // State to control table visibility
  useEffect(() => {
    const fetchForecast = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/weather/forecast/${city}`);
        setForecastData(response.data.forecastList);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching forecast data:', error);
        setLoading(false);
      }
    };

    fetchForecast();
  }, [city]);

  const handleToggleTable = () => {
    setShowTable(prevShowTable => !prevShowTable); // Toggle table visibility
  };

  if (loading) {
    return <p>Loading forecast...</p>;
  }

  return (
    <div className='mt-6 overflow-x-auto'>
      {showTable && (<h2 className='text-xl font-semibold'>Weather Forecast for {city}</h2>)}
      <button 
        onClick={handleToggleTable} 
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        {showTable ? 'Hide Table' : 'Show Table'} {/* Button text based on state */}
      </button>
      {showTable && ( // Render table only if showTable is true
      <table className="w-full mt-4 border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">Date</th>
            <th className="border border-gray-300 px-4 py-2">Time</th>
            <th className="border border-gray-300 px-4 py-2">Temp (°C)</th>
            <th className="border border-gray-300 px-4 py-2">Weather</th>
          </tr>
        </thead>
        <tbody>
          {forecastData.map((forecast, index) => {
            const date = new Date(forecast.timestamp * 1000);
            const dateString = date.toLocaleDateString();
            const timeString = date.toLocaleTimeString();

            return (
              <tr key={index}>
                <td className="border border-gray-300 px-4 py-2">{dateString}</td>
                <td className="border border-gray-300 px-4 py-2">{timeString}</td>
                <td className="border border-gray-300 px-4 py-2">{forecast.temperature.toFixed(2)}</td>
                <td className="border border-gray-300 px-4 py-2">{forecast.weather_main}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      )}
    </div>
  );
};

export default WeatherForecast;
