<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Air Quality Dashboard - My Project</title>

<script src="https://unpkg.com/react@18/umd/react.development.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>

<style>
  body {
    background-color: #0a0e1a;
    color: white;
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
  }

  h1 {
    text-align: center;
    color: #00e5ff;
    margin-top: 30px;
  }

  /* Navigation */
  nav {
    background-color: #1f2937;
    padding: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .logo {
    font-size: 30px;
    font-weight: bold;
  }

  .logo span {
    color: #00e5ff;
  }

  /* Search */
  .search {
    text-align: center;
    margin: 20px;
  }

  input {
    padding: 12px;
    width: 400px;
    font-size: 18px;
    border: 2px solid gray;
  }

  button {
    padding: 12px 25px;
    font-size: 18px;
    background-color: #00e5ff;
    color: black;
    border: none;
    cursor: pointer;
  }

  /* Cards Container */
  .cards {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    padding: 20px;
    justify-content: center;
  }

  /* City Card */
  .card {
    background-color: #1f2937;
    border: 3px solid #00e5ff;
    border-radius: 10px;
    width: 300px;
    padding: 15px;
    text-align: center;
  }

  .card h2 {
    margin: 10px 0;
    font-size: 24px;
  }

  .aqi {
    font-size: 70px;
    font-weight: bold;
    margin: 10px 0;
  }

  .info {
    background-color: #111827;
    padding: 10px;
    margin: 10px 0;
    border-radius: 5px;
  }

  /* Modal */
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.8);
    display: none;
    justify-content: center;
    align-items: center;
    z-index: 999;
  }

  .modal-content {
    background-color: #1f2937;
    padding: 30px;
    border-radius: 15px;
    width: 90%;
    max-width: 500px;
    text-align: center;
    border: 4px solid #00e5ff;
  }

  .close-btn {
    background-color: red;
    color: white;
    padding: 10px 20px;
    border: none;
    margin-top: 20px;
    cursor: pointer;
  }

  /* Random stuff I added */
  .live {
    color: lime;
    font-weight: bold;
  }
</style>
</head>
<body>

<nav>
  <div class="logo">Air<span>Watch</span></div>
  <div>
    <span class="live">● LIVE</span> 
    <button onclick="alert('Refreshing data... (not working yet lol)')">Refresh Data</button>
  </div>
</nav>

<h1>Real Time Air Quality Monitor</h1>
<p style="text-align:center; color:gray;">My First Year Web Development Project</p>

<div class="search">
  <input type="text" id="searchInput" placeholder="Search city name..." onkeyup="filterCities()">
  <button onclick="filterCities()">Search</button>
</div>

<div class="cards" id="cardsContainer">
  <!-- Cards will be added by JavaScript -->
</div>

<!-- Modal -->
<div class="modal" id="myModal">
  <div class="modal-content">
    <h2 id="modalCity"></h2>
    <p id="modalCountry"></p>
    <div id="modalAQI" class="aqi"></div>
    <div class="info">
      <p>PM2.5: <span id="pm25"></span></p>
      <p>PM10: <span id="pm10"></span></p>
    </div>
    <button class="close-btn" onclick="closeModal()">Close</button>
  </div>
</div>

<footer style="text-align:center; padding:30px; color:#666; margin-top:50px;">
  Made by Saiyam • First Year Student<br>
  Still learning React and JavaScript 😊
</footer>

<script type="text/babel">
const { useState, useEffect } = React;

// My data (I made this myself)
const cityData = [
  { id:1, city:"Delhi", country:"India 🇮🇳", aqi:187, pm25:134, pm10:198 },
  { id:2, city:"Beijing", country:"China 🇨🇳", aqi:152, pm25:98, pm10:142 },
  { id:3, city:"Los Angeles", country:"USA 🇺🇸", aqi:68, pm25:19, pm10:34 },
  { id:4, city:"London", country:"UK 🇬🇧", aqi:42, pm25:9, pm10:21 },
  { id:5, city:"Tokyo", country:"Japan 🇯🇵", aqi:55, pm25:13, pm10:29 },
  { id:6, city:"Karachi", country:"Pakistan 🇵🇰", aqi:204, pm25:148, pm10:215 },
  { id:7, city:"Sydney", country:"Australia 🇦🇺", aqi:28, pm25:6, pm10:15 }
];

// Function to get color based on AQI
function getColor(aqi) {
  if (aqi <= 50) return "lime";
  if (aqi <= 100) return "yellow";
  if (aqi <= 150) return "orange";
  return "red";
}

// Create all cards
function createCards(filteredData) {
  const container = document.getElementById("cardsContainer");
  container.innerHTML = "";   // clear previous cards

  filteredData.forEach(city => {
    const color = getColor(city.aqi);

    const cardHTML = `
      <div class="card" onclick="showDetails(${city.id})" style="border-color: ${color};">
        <h2>${city.city}</h2>
        <p style="color:gray;">${city.country}</p>
        <div class="aqi" style="color: ${color};">${city.aqi}</div>
        <p>AQI</p>
        <div class="info">
          <small>PM2.5: ${city.pm25}</small><br>
          <small>PM10: ${city.pm10}</small>
        </div>
      </div>
    `;
    container.innerHTML += cardHTML;
  });
}

// Show city details in modal
function showDetails(id) {
  const city = cityData.find(c => c.id === id);
  if (!city) return;

  document.getElementById("modalCity").innerText = city.city;
  document.getElementById("modalCountry").innerText = city.country;
  document.getElementById("modalAQI").innerHTML = city.aqi;
  document.getElementById("modalAQI").style.color = getColor(city.aqi);
  document.getElementById("pm25").innerText = city.pm25 + " µg/m³";
  document.getElementById("pm10").innerText = city.pm10 + " µg/m³";

  document.getElementById("myModal").style.display = "flex";
}

function closeModal() {
  document.getElementById("myModal").style.display = "none";
}

// Simple search filter
function filterCities() {
  const searchValue = document.getElementById("searchInput").value.toLowerCase();
  
  const filtered = cityData.filter(city => 
    city.city.toLowerCase().includes(searchValue) || 
    city.country.toLowerCase().includes(searchValue)
  );

  createCards(filtered);
}

// Initial load
createCards(cityData);

console.log("AirWatch Project Loaded - Made by First Year Student");
</script>

</body>
</html>