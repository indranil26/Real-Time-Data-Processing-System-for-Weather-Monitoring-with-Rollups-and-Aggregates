const mongoose = require('mongoose');

const WeatherSchema = new mongoose.Schema({
  city: String,
  date: { type: Date, default: Date.now },
  temperature: Number,
  feels_like: Number,
  weather_main: String,
  wind_speed: Number,
  humidity: Number,
  timestamp: Number,
});

const DailySummarySchema = new mongoose.Schema({
  city: String,
  date: { type: Date, required: true },
  avgTemperature: Number,
  maxTemperature: Number,
  minTemperature: Number,
  avgHumidity: Number, // New field for average humidity
  avgWindSpeed: Number, // New field for average wind speed
  dominantCondition: String,
});


module.exports = {
  Weather: mongoose.model('Weather', WeatherSchema),
  DailySummary: mongoose.model('DailySummary', DailySummarySchema),
};
