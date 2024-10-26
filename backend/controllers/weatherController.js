const axios = require('axios');
const { Weather, DailySummary } = require('../models/weatherModel');

const fetchWeatherData = async (city) => {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
  const response = await axios.get(url);
  const data = response.data;

  const tempCelsius = data.main.temp - 273.15;
  const feelsLikeCelsius = data.main.feels_like - 273.15;

  const weather = new Weather({
    city,
    temperature: tempCelsius,
    feels_like: feelsLikeCelsius,
    weather_main: data.weather[0].main,
    wind_speed: data.wind.speed,
    humidity: data.main.humidity,
    timestamp: new Date(data.dt * 1000),  // Correct timestamp
  });

  await weather.save();
};


// Function to calculate daily summary and save it
const calculateDailySummary = async () => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 1);  // Get data from the last 24 hours

  // Fetch weather data for the last 24 hours
  const weatherData = await Weather.find({ timestamp: { $gte: startDate } });


  if (weatherData.length === 0) {
    console.log("No weather data found for the past 24 hours");
    return;
  }

  // Group weather data by city
  const cityData = weatherData.reduce((acc, item) => {
    if (!acc[item.city]) {
      acc[item.city] = { temperatures: [], humidities:[], windSpeeds:[], weatherConditions: [] };
    }
    acc[item.city].temperatures.push(item.temperature);
    acc[item.city].humidities.push(item.humidity);
    acc[item.city].windSpeeds.push(item.wind_speed);
    acc[item.city].weatherConditions.push(item.weather_main);
    return acc;
  }, {});

  // Calculate daily summary for each city
  for (const [city, data] of Object.entries(cityData)) {
    const avgTemperature = data.temperatures.reduce((sum, temp) => sum + temp, 0) / data.temperatures.length;
    const maxTemperature = Math.max(...data.temperatures);
    const minTemperature = Math.min(...data.temperatures);
    
    const avgHumidity = data.humidities.reduce((sum, humidity) => sum + humidity, 0) / data.humidities.length;
    const avgWindSpeed = data.windSpeeds.reduce((sum, speed) => sum + speed, 0) / data.windSpeeds.length;

    const dominantCondition = data.weatherConditions.sort((a,b) =>
      data.weatherConditions.filter(v => v===a).length
      - data.weatherConditions.filter(v => v===b).length
    ).pop();

    try {
      const dailySummary = new DailySummary({
        city,
        date: new Date(),
        avgTemperature,
        maxTemperature,
        minTemperature,
        avgHumidity,
        avgWindSpeed,
        dominantCondition,
      });
    
      await dailySummary.save();
      console.log(`Daily summary saved for ${city}`);
    } catch (error) {
      console.error(`Failed to save daily summary for ${city}: `, error);
    }
  }    
};
const fetchCurrentWeather = async (city) => {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
  const response = await axios.get(url);
  const data = response.data;

  return {
    city: data.name,
    temperature: data.main.temp - 273.15, // Convert to Celsius
    weather_main: data.weather[0].main,
  };
};
const fetchWeatherForecast = async (city) => {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;
  const response = await axios.get(url);
  const data = response.data;

  // Process the forecast data as needed
  const forecastList = data.list.map(forecast => ({
    timestamp: forecast.dt,
    temperature: forecast.main.temp - 273.15, // Convert to Celsius
    weather_main: forecast.weather[0].main,
  }));

  return { city, forecastList };
};

const calculateForecastSummary = (forecastData) => {
  const avgTemperature = forecastData.reduce((sum, forecast) => sum + forecast.temperature, 0) / forecastData.length;
  const maxTemperature = Math.max(...forecastData.map(f => f.temperature));
  const minTemperature = Math.min(...forecastData.map(f => f.temperature));

  return {
    avgTemperature,
    maxTemperature,
    minTemperature,
  };
};

// Combine current weather and forecast
const getWeatherData = async (city) => {
  const currentWeather = await fetchCurrentWeather(city);
  const forecast = await fetchWeatherForecast(city);
  const summary = calculateForecastSummary(forecast.forecastList);

  return {
    currentWeather,
    forecast,
    summary,
  };
};

module.exports = { fetchWeatherData, calculateDailySummary, fetchWeatherForecast, fetchCurrentWeather, calculateForecastSummary, getWeatherData };
