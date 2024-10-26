// src/components/WeatherChart.jsx
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const WeatherChart = ({ unit }) => {
  const [weatherData, setWeatherData] = useState([]);
  // const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const colorPalette = [
    'rgba(255, 99, 132, 1)',   // Red
    'rgba(54, 162, 235, 1)',   // Blue
    'rgba(255, 206, 86, 1)',   // Yellow
    'rgba(75, 192, 192, 1)',   // Green
    'rgba(153, 102, 255, 1)',  // Purple
    'rgba(255, 159, 64, 1)',   // Orange
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const summaryResponse = await axios.get('http://localhost:5000/api/weather/summary');
        setWeatherData(summaryResponse.data);

        // const alertsResponse = await axios.get('http://localhost:5000/api/weather/check-alerts');
        // setAlerts(alertsResponse.data);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching weather data or alerts:', error);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <p className="text-gray-500">Loading...</p>;
  }
  if (isMobile) return <p className="text-gray-500">View on a larger screen to see the charts.</p>;

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  };

  const cities = [...new Set(weatherData.map((data) => data.city))];

  const convertTemperature = (tempCelsius) => {
    return unit === 'Celsius' ? tempCelsius : (tempCelsius * 9 / 5) + 32;
  };

  const createChartData = (temperatureType) => {
    return {
      labels: weatherData.map((data) => formatDate(data.date)),
      datasets: cities.map((city, index) => {
        return {
          label: `${city} ${temperatureType}`,
          data: weatherData
            .filter((data) => data.city === city)
            .map((data) => convertTemperature(data[temperatureType])),
          fill: false,
          borderColor: colorPalette[index % colorPalette.length],
          backgroundColor: colorPalette[index % colorPalette.length],
          tension: 0.1,
        };
      }),
    };
  };

  return (
    <div>
      <div className='mt-6 overflow-x-auto'>
        <div className="min-w-[300px] max-w-full">
          <h2 className='text-xl font-semibold'>Max Temperature</h2>
          <Line data={createChartData('maxTemperature')}/>
        </div>
      </div>
      <div className='mt-6 overflow-x-auto'>
        <div className="min-w-[300px] max-w-full">
          <h2 className='text-xl font-semibold'>Avg Temperature</h2>
          <Line data={createChartData('avgTemperature')}/>
        </div>
      </div>
      <div className='mt-6 overflow-x-auto'>
        <div className="min-w-[300px] max-w-full">
          <h2 className='text-xl font-semibold'>Min Temperature</h2>
          <Line data={createChartData('minTemperature')}/>
        </div>
      </div>

      {/* <h2>Alerts</h2>
      {alerts.length > 0 ? (
        <ul>
          {alerts.map((alert, index) => (
            <li key={index}>{alert}</li>
          ))}
        </ul>
      ) : (
        <p>No alerts triggered.</p>
      )} */}
    </div>
  );
};

export default WeatherChart;
