const express = require('express');
const mongoose = require('mongoose');
const cors=require('cors');
const dotenv = require('dotenv');
const cron = require('node-cron');
// const axios = require('axios');
const weatherRoutes = require('./routes/weather');
const fetchWeatherData = require('./controllers/weatherController');

dotenv.config();
const app = express();
const port = 5000;

app.use(cors());

// MongoDB connection
mongoose.connect('mongodb://localhost/weatherApp', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

  app.use('/api/weather', weatherRoutes);

// Cron job to fetch weather every 5 minutes
const cities = ['Delhi', 'Mumbai', 'Chennai', 'Bangalore', 'Kolkata', 'Hyderabad'];
const fetchWeatherForAllCities=async()=>{
  console.log('Fetching weather data...');
  try {
    for (const city of cities) {
      await fetchWeatherData.fetchWeatherData(city);
      console.log(`Weather data for ${city} saved`);
    }
    await fetchWeatherData.calculateDailySummary();
  } catch (error) {
    console.error('Error fetching weather data:', error);
  }
}

fetchWeatherForAllCities()

cron.schedule('*/5 * * * *', fetchWeatherForAllCities);
// cron.schedule('*/5 * * * *', async () => {
//   console.log('Fetching weather data and calculating daily summary...');
//   await fetchWeatherData.calculateDailySummary();
// });


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});