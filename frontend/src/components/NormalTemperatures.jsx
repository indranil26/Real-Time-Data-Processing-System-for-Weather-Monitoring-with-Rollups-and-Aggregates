// src/components/NormalTemperatures.jsx
import React, { useEffect, useState } from 'react';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import axios from 'axios';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const NormalTemperatures = ({ unit }) => {
  const [chartData, setChartData] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  // Define a color palette
  const colorPalette = [
    'rgba(255, 99, 132, 1)', // Red
    'rgba(54, 162, 235, 1)', // Blue
    'rgba(255, 206, 86, 1)', // Yellow
    'rgba(75, 192, 192, 1)', // Green
    'rgba(153, 102, 255, 1)', // Purple
    'rgba(255, 159, 64, 1)', // Orange
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const normalTempResponse = await axios.get('http://localhost:5000/api/weather/normal_temp');
        const weatherData = normalTempResponse.data;

        if (weatherData.cities) {
          const datasets = weatherData.cities.map((city, index) => {
            // Convert temperatures based on user preference
            const convertedTemperatures = city.temperatures.map(temp => {
              return unit === 'Fahrenheit' ? (temp * 9/5) + 32 : temp;
            });

            return {
              label: city.name,
              data: convertedTemperatures,
              borderColor: colorPalette[index % colorPalette.length],
              backgroundColor: colorPalette[index % colorPalette.length],
            };
          });

          setChartData({
            labels: weatherData.dates.map(date => formatDate(date)), // Format dates
            datasets,
          });
        }
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

    fetchData();
  }, [unit]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  };

  if (isMobile) {
    return <p className="text-gray-500">View on a larger screen to see the chart.</p>;
  }

  return (
    <div className='mt-6 overflow-x-auto'>
      <div className="min-w-[300px] max-w-full">
      <h2 className='text-xl font-semibold'>Normal Temperature</h2>
      {chartData ? (
        <Line data={chartData}/>
      ) : (
        <p className="text-gray-500">Loading chart data...</p>
      )}
      </div>
    </div>
  );
};

export default NormalTemperatures;
