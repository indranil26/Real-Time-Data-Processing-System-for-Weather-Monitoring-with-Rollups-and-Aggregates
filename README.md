# Real-Time Weather Monitoring System with Rollups & Aggregates

This project is a Node.js and MongoDB-based system for real-time weather monitoring in Indian cities. It leverages the OpenWeatherMap API to:

- Continuously track weather conditions for specified cities (Delhi, Mumbai, Chennai, Bangalore, Kolkata, Hyderabad).
- Generate daily summaries, including average, minimum, and maximum temperatures, and the dominant weather condition.
- Trigger alerts based on user-defined thresholds (e.g., temperature exceeding a limit).
- Optionally visualize weather data (requires React.js frontend; examples provided).

## Getting Started

1. **Clone the repository**:
   ```bash
   git clone <repo-url>
2. **Install dependencies**:
   ```bash
   cd <repo-url/backend>
   npm install
   
3. **Create a .env file in the project root and add your OpenWeatherMap API key**:
   ```bash
   `OPENWEATHER_API_KEY=your_api_key`

## Backend Setup

1. **Start the MongoDB server (if using a local instance).**
   
2. **Run the beckend server**:
   ```bash
   node server.js
   ```

## Frontend Setup

1. **Navigate to the frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

## API Reference
- **Save Weather Data**: `POST /api/weather/save/:city` - Saves weather data for a specified city.
- **Retrieve Daily Summaries**: `GET /api/weather/summary` - Retrieves daily weather summaries for all cities.
- **Set Temperature Alert Threshold**: `POST /api/weather/set-alert-threshold` - Sets the temperature alert threshold.
- **Check Alerts**: `GET /api/weather/check-alerts` - Retrieves triggered weather alerts.
- **Retrieve Normal Temperature Data**: `GET /api/weather/normal_temp` - Retrieves normal temperature data for the past day (requires frontend visualization).
- **Retrieve Current Weather Data**: `GET /api/weather/:city` - Retrieves weather data (current, forecast, summary) for a specified city (requires frontend visualization).

## Additional Notes
- This is a basic implementation and can be customized further.
- Consider implementing error handling and logging for robustness.
- For detailed instructions and explanations, refer to the individual files within the project.
  
Feel free to replace `<repo-url>` and `<mongo-db-uri>` with the actual values! Let me know if you need any more changes.
