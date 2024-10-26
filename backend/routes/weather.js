const express = require('express');
const router = express.Router();
const { fetchWeatherData, fetchWeatherForecast, getWeatherData } = require('../controllers/weatherController');
const { Weather, DailySummary } = require('../models/weatherModel');

// Fetch and save weather data
router.get('/save/:city', async (req, res) => {
  const { city } = req.params;
  await fetchWeatherData(city);
  res.json({ message: `Weather data for ${city} saved.` });
});

// Fetch daily summary
router.get('/summary', async (req, res) => {
  const summaries = await DailySummary.find({});
  res.json(summaries);
});

// Set temperature alert threshold
let alertThreshold = 35; // Example threshold in Celsius

router.post('/set-alert-threshold', (req, res) => {
  const { threshold } = req.body;
  alertThreshold = threshold;
  res.json({ message: `Alert threshold set to ${threshold}°C` });
});

// Check alerts
router.get('/check-alerts', async (req, res) => {
  const latestWeather = await Weather.find({}).sort({ timestamp: -1 }).limit(6); // Last 6 updates

  let alerts = [];

  latestWeather.forEach(data => {
    if (data.temperature > alertThreshold) {
      alerts.push(`${data.city}: Temperature of ${data.temperature.toFixed(2)}°C exceeded the threshold.`);
    }
  });

  res.json(alerts.length ? alerts : { message: 'No alerts triggered.' });
});

router.get('/normal_temp', async (req, res) => { 
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 1); // Fetch data from the last day

    const weatherData = await Weather.find({ date: { $gte: startDate } });

    const cities = weatherData.reduce((acc, item) => {
      if (!acc[item.city]) {
        acc[item.city] = { name: item.city, temperatures: [] };
      }
      acc[item.city].temperatures.push(item.temperature);
      return acc;
    }, {});

    const dates = weatherData.map(item => item.date.toISOString().split('T')[0]);

    res.json({ dates, cities: Object.values(cities) });
  } catch (error) {
    console.error('Error fetching weather summary:', error);
    res.status(500).json({ message: 'Error fetching weather summary' });
  }
});

router.get('/forecast/:city', async (req, res) => {
  const city = req.params.city;
  try {
    const forecastData = await fetchWeatherForecast(city);
    res.json(forecastData);
  } catch (error) {
    res.status(500).json({ message: "Error fetching forecast data." });
  }
});

// Route for getting weather data (current + forecast + summary)
router.get('/:city', async (req, res) => {
  const city = req.params.city;
  try {
    const weatherData = await getWeatherData(city);
    res.json(weatherData);
  } catch (error) {
    res.status(500).json({ message: "Error fetching weather data." });
  }
});

module.exports = router;
