import "./App.css";
import { useState } from "react";

const api = {
  key: "8e7224e6efd4521110f0076b685e3d4d",
  base: "https://api.openweathermap.org/data/2.5/",
};

function App() {
  const [search, setSearch] = useState("");
  const [forecast, setForecast] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const searchPressed = () => {
    setLoading(true);
    setError("");
    fetch(`${api.base}forecast?q=${search}&units=metric&APPID=${api.key}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok " + res.statusText);
        }
        return res.json();
      })
      .then((result) => {
        setForecast(result);
        setLoading(false);
      })
      .catch((error) => {
        setError("Unable to fetch weather data. Please try again.");
        setLoading(false);
      });
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      searchPressed();
    }
  };

  const getWeatherIcon = (weather) => {
    switch (weather) {
      case "Clear":
        return "fa-sun";
      case "Clouds":
        return "fa-cloud";
      case "Rain":
        return "fa-cloud-showers-heavy";
      case "Snow":
        return "fa-snowflake";
      case "Thunderstorm":
        return "fa-bolt";
      default:
        return "fa-smog";
    }
  };

  const formatDate = (dateString) => {
    const options = { weekday: "long", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div>
      <nav className="navbar">
        <h1>
          <i className="fas fa-cloud-sun"></i> Weather App
        </h1>
      </nav>
      <div className="App">
        <header className="App-header">
          <div>
            <input
              type="text"
              placeholder="Enter city/town..."
              onChange={(e) => setSearch(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button onClick={searchPressed}>Search</button>
          </div>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="error">{error}</p>
          ) : forecast.list ? (
            <div className="forecast">
              <h2>
                {forecast.city.name}, {forecast.city.country}
              </h2>
              {forecast.list
                .filter((_, index) => index % 8 === 0)
                .map((weather, index) => (
                  <div key={index} className="forecast-item">
                    <p>{formatDate(weather.dt_txt)}</p>
                    <i
                      className={`fas ${getWeatherIcon(
                        weather.weather[0].main
                      )} weather-icon`}
                    ></i>
                    <p>{weather.main.temp}°C</p>
                    <p>{weather.weather[0].main}</p>
                  </div>
                ))}
            </div>
          ) : (
            <p>Enter a city to get the weather forecast</p>
          )}
        </header>
      </div>
    </div>
  );
}

export default App;
