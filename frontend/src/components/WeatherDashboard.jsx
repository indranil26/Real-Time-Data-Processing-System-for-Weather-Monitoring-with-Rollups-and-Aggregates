import React, { useState, useEffect } from 'react';
import WeatherChart from './WeatherChart';
import NormalTemperatures from './NormalTemperatures';
import Alerts from './Alerts';
import WeatherForecast from './WeatherForecast';
import axios from 'axios';

const WeatherDashboard = () => {
  const [unit, setUnit] = useState('Celsius');
  const [city, setCity] = useState('Delhi');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/weather/${city}`);
        setWeatherData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching weather data:', error);
        setLoading(false);
      }
    };
    fetchWeatherData();
  }, [city]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto">
      <div className="flex justify-between mb-4">
        <div className="flex flex-col md:flex-row items-center">
          <label className="mr-2 font-semibold">Select Unit:</label>
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="border border-gray-300 rounded-md p-1"
          >
            <option value="Celsius">Celsius</option>
            <option value="Fahrenheit">Fahrenheit</option>
          </select>
        </div>
        <div className="flex flex-col md:flex-row items-center">
          <label className="mr-2 font-semibold">Select City:</label>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="border border-gray-300 rounded-md p-1"
          >
            <option value="Delhi">Delhi</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Chennai">Chennai</option>
            <option value="Bangalore">Bangalore</option>
            <option value="Kolkata">Kolkata</option>
            <option value="Hyderabad">Hyderabad</option>
          </select>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading weather data...</p>
      ) : (
        <div>
          <WeatherChart unit={unit} />
          <NormalTemperatures unit={unit} />
          <WeatherForecast city={city} />

          <div className="mt-6 bg-gray-100 p-4 rounded-md">
            <h3 className="text-xl font-bold">Weather Summary for {city}</h3>
            <p>Average Temperature: {weatherData.summary.avgTemperature.toFixed(2)} °C</p>
            <p>Maximum Temperature: {weatherData.summary.maxTemperature.toFixed(2)} °C</p>
            <p>Minimum Temperature: {weatherData.summary.minTemperature.toFixed(2)} °C</p>
          </div>
          <Alerts />
        </div>
      )}
    </div>
  );
};

export default WeatherDashboard;
