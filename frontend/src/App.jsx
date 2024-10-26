import React from 'react';
import WeatherDashboard from './components/WeatherDashboard';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-200 to-blue-500 p-4 text-center">
      <h1 className="text-3xl font-bold text-white mb-6">Weather Monitoring System</h1>
      <WeatherDashboard />
    </div>
  );
}

export default App;
