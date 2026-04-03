

```markdown
# Weather Forecast Application

A modern, responsive weather app built with **JavaScript**, **Tailwind CSS**, and the **OpenWeatherMap API**.  
Search for any city, use your current location, and get a 5‑day forecast with dynamic backgrounds, temperature unit toggle, and extreme weather alerts.

## ✨ Features

- **City search** – get current weather and 5‑day forecast by entering a city name.
- **Geolocation** – one‑click weather for your exact location (browser permission required).
- **Recent cities** – automatically saves up to 5 recently searched cities (localStorage) with a clear button.
- **Temperature unit toggle** – switch between °C and °F for the current temperature only (forecast remains in °C as required).
- **Dynamic background** – the page gradient changes based on weather conditions (clear, clouds, rain, snow, thunderstorm).
- **Extreme temperature alerts** – displays a red banner when temperature >40°C or <0°C.
- **5‑day forecast** – each day shows date, weather icon, temperature, wind speed, and humidity in a clean card layout.
- **Fully responsive** – adapts to desktop, iPad Mini (768px), and iPhone SE (375px) using Tailwind’s responsive grid.
- **No `alert()` popups** – all errors are shown in styled UI elements.
- **Clean code** – uses `var`, full `if-else`, and no arrow functions for maximum compatibility and readability.


## 📦 Dependencies

- [Tailwind CSS](https://tailwindcss.com/) – via CDN (utility‑first CSS framework)
- [OpenWeatherMap API](https://openweathermap.org/api) – free tier for current weather and 5‑day forecast

No npm or build steps required – all scripts are loaded directly.

## 🛠️ Setup Instructions

1. **Clone the repository** (or download the ZIP):
   ```bash
   git clone https://github.com/yA-005/weather-forecast-app.git
   cd weather-forecast-app
   ```

2. **Get an API key** from [OpenWeatherMap](https://home.openweathermap.org/users/sign_up):
   - Sign up / log in.
   - Go to “API Keys” tab.
   - Copy your default key or create a new one.


## 📖 Usage Guidelines

- **Search by city** – type a city name (e.g., “London”) and click the **Search** button.
- **Use my location** – click the **📍 My Location** button and allow location access when prompted.
- **Toggle temperature unit** – click **°C / °F** to switch the current temperature display (forecast remains in °C).
- **Recent cities** – after searching, a dropdown appears with your last 5 cities. Click any to reload its weather. Use the **🗑️ Clear** button to erase the history.
- **5‑day forecast** – automatically appears below the current weather card.
- **Error handling** – invalid city names or network issues show a friendly red error message.

## 🧪 Testing Responsiveness

Open the browser’s developer tools (F12) and use the device toolbar to test:
- **Desktop** – 5 forecast cards in one row.
- **iPad Mini** (768px) – cards wrap into 2 rows.
- **iPhone SE** (375px) – cards stack vertically, buttons become full width.

## 📁 Project Structure

```
weather-forecast-app/
├── index.html      # Main HTML structure with Tailwind
├── script.js       # All JavaScript logic (API, DOM, localStorage)
├── style.css       # Custom spinner animation (Tailwind covers rest)
└── README.md       # This file
```

## 🤝 Contributing

This is an academic project for a weather forecast assignment. No external contributions are needed, but feedback is welcome.

## 📄 License

This project is open source

---

**Built with ❤️ using JavaScript, Tailwind CSS, and OpenWeatherMap API.**
```