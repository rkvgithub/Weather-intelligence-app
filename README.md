# Weather Intelligence App - Docker & WSL Deployment Guide

This repository contains the source code for the **Weather Intelligence App**, created in Google AI Studio App Build and configured for local deployment and containerization inside **Ubuntu WSL**.

---

## 🌟 App Features & Open-Meteo API Integration

- **City Search & Geocoding**: Converts city names into precise latitude and longitude using the Open-Meteo Geocoding API (`https://geocoding-api.open-meteo.com/v1/search`).
- **Real-Time Current Weather**: Displays current temperature, feels like, weather condition, sunrise/sunset, humidity, wind, pressure, precipitation, and UV index using Open-Meteo Forecast API (`https://api.open-meteo.com/v1/forecast`).
- **7-Day Detailed Forecast**: High/low temperature ranges, condition icons, rain probabilities, and expandable 24-hour hourly modal breakdowns.
- **Interactive Telemetry Charts**: Powered by Recharts for 24-hour temperature/precipitation trends and 7-day high/low curves.
- **Smart Weather Intelligence Hub**:
  - Outdoor Activity Score (0–100)
  - Recommended Outfit & Clothing Advice
  - UV Protection Advisory
  - Optimal Outdoor Workout Window Calculation
  - Travel & Commute Safety Report
- **Unit Customization**: Dynamic switching between °C / °F and km/h / mph / m/s.
- **Error Handling**: Graceful messaging for invalid search queries or network disconnects.

---

## 🛠️ Step-by-Step Instructions for Ubuntu WSL

> **Important WSL & Docker Requirement**:
> Per assignment requirements, all `Node.js`, `npm`, and `Docker` commands **MUST** be run inside the **Ubuntu WSL** terminal. Do not execute Docker build or run commands directly from Windows PowerShell or Command Prompt.

### Step 1: Open Ubuntu WSL & Verify Requirements
Open your **Ubuntu WSL** terminal and check that `Node.js`, `npm`, and `Docker` are installed and running:

```bash
node -v
npm -v
docker --version
```

### Step 2: Extract & Navigate to Project Directory
Extract the downloaded source code archive into your WSL filesystem and navigate into the folder:

```bash
cd /path/to/weather-intelligence-app
```

### Step 3: Run the Application Locally
Install npm dependencies and boot the development server inside WSL:

```bash
npm install
npm run dev
```

Open your browser at `http://localhost:3000` to verify local functionality.

---

## 🐳 Dockerization Steps (inside Ubuntu WSL)

### Step 4: Build the Docker Image
Build the production multi-stage Docker image from inside Ubuntu WSL:

```bash
docker build -t weather-intelligence-app .
```

### Step 5: Run the Docker Container
Launch the container mapping port `3000` on your host machine to port `80` in the Nginx container:

```bash
docker run -d -p 3000:80 --name weather-app weather-intelligence-app
```

### Step 6: Verify Container Execution
Check running containers in WSL:

```bash
docker ps
```

Open `http://localhost:3000` in your web browser. You should see the Weather Intelligence App running seamlessly inside the Docker container!

To stop or remove the container when finished:

```bash
docker stop weather-app
docker rm weather-app
```

---

## 📸 Mandatory Submission Evidence Checklist

1. **City Search Validation**: Search for at least two valid cities (e.g., *London* and *Tokyo*) and verify that weather metrics and 7-day forecast cards update correctly.
2. **Error State Testing**: Enter an invalid city string (e.g., `xyz12345`) to verify the error alert banner.
3. **WSL Terminal Screenshots**: Capture terminal screenshots showing `docker build` logs and `docker ps` output inside Ubuntu WSL.
4. **Browser Screenshot**: Capture the app running at `http://localhost:3000` displaying city weather data and Docker deployment guide.

---

## 🔧 Troubleshooting Guide

- **Port 3000 in use error**: If port 3000 is already in use by another local process, run the Docker container on port 8080 instead:
  ```bash
  docker run -d -p 8080:80 --name weather-app weather-intelligence-app
  ```
- **Docker daemon not connected in WSL**: Ensure Docker service is active inside Ubuntu WSL by running `sudo service docker start` or ensuring WSL integration is enabled.
