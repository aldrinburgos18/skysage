const apiKey = "a1d8b8f684383df9eff3ae909b0d743e";

var isFahrenheit = true;
var isMPH = true;

var getCoord = function (city) {
  fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`).then((response) => {
    if (response.ok) {
      response.json().then((data) => {
        if (data.length) {
          var city = `${data[0].name}, ${data[0].state ? data[0].state + "," : ""} ${data[0].country}`;
          getWeatherData(data[0].lat, data[0].lon, city);
        } else {
          alert("No search result found. Please try again.");
        }
      });
    } else {
      alert("There was an error with your request.");
    }
  });
};

var getWeatherData = function (lat, lon, city) {
  if (isFahrenheit) {
    fetch(
      `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&units=imperial&appid=${apiKey}`
    ).then((response) => {
      if (response.ok) {
        response.json().then((weather) => {
          displayTodayWeather(weather, city);
        });
      } else {
        alert("There was an error with your request.");
      }
    });
  } else {
    fetch(
      `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&units=metric&appid=${apiKey}`
    ).then((response) => {
      if (response.ok) {
        response.json().then((weather) => {
          displayTodayWeather(weather, city);
        });
      } else {
        alert("There was an error with your request.");
      }
    });
  }
};

var displayTodayWeather = function (weather, city) {
  var icon = weather.current.weather[0].icon;
  var tempUnit;
  var windUnit;
  if (isFahrenheit) {
    tempUnit = "°F";
    windUnit = "mph";
    $("#wspeed-unit").bootstrapToggle("off");
    isMPH = true;
  } else {
    tempUnit = "°C";
    windUnit = "km/h";
    $("#wspeed-unit").bootstrapToggle("on");
    isMPH = false;
  }
  $("#today-container").html(`<div class="card border-0 p-0 w-lg-75 w-xl-50 today-card">
            <div class="card-header">Current Weather for ${city}</div>
            <div class="card-body w-${setBG(icon)}">
              <div class="text-center align-top">
                <div class="d-inline-block align-top cweather-img">
                  <img src="./assets/img/${icon}.svg" class="mr-2 ${setSVGColor(icon)}" id="icon"/>
                </div>
                <div class="d-inline-block cweather-info">
                  <p class="display-2 m-0 text-center"><span class="temp">${roundTemp(
                    weather.current.temp
                  )}${tempUnit}</span></p>
                  <div class="d-inline-block text-start temp-div">
                    <p class="m-0 mb-1">Feels Like: <strong><span class="temp">${roundTemp(
                      weather.current.feels_like
                    )}${tempUnit}</span></strong></p>
                    <p class="m-0 mb-1">Low: <strong><span class="temp">${roundTemp(
                      weather.daily[0].temp.min
                    )}${tempUnit}</span></strong> | High: <strong><span class="temp">${roundTemp(
    weather.daily[0].temp.max
  )}${tempUnit}</span></strong></p>
                    <p class="m-0 mb-1">Humidity: <strong>${weather.current.humidity}%</strong></p>
                  </div>
                  <div class="d-inline-block text-start align-top">
                    <p class="m-0 mb-1">Wind: <strong><span class="wind">${convertWind(
                      weather.current.wind_deg,
                      weather.current.wind_speed,
                      windUnit
                    )}</span></strong></p>
                    <p class="m-0 mb-1">UV Index: <strong>${formatUv(weather.current.uvi)}</strong></p>
                  </div>
                </div>
                <h5 class="m-0">${weather.daily[0].summary}.</h5>
              </div>
            </div>
          </div>
          ${displayAlerts(weather.alerts)}
          `);
  displayForecast(weather.daily, tempUnit, windUnit);
};

var displayAlerts = function (alert) {
  if (alert) {
    return `<div class="alert alert-danger w-lg-75 advisories">
        <h3 class="text-center text-decoration-underline">Weather Alerts:</h3>
        <strong>${alert[0].event}:</strong> ${alert[0].description};
    </div>`;
  } else {
    return ``;
  }
};

var displayForecast = function (forecast, unit, windUnit) {
  $(".forecast").show();
  $("#forecast-container").html("");
  for (let i = 1; i <= 5; i++) {
    $("#forecast-container").append(`
        <div class="card forecast-card w-sm-100 w-md-25">
            <div class="card-header"><strong>${convertDT(forecast[i].dt)}</strong></div>
                <ul class="list-group list-group-flush">
                    <img class="d-block mx-auto my-2" src="./assets/img/${
                      forecast[i].weather[0].icon
                    }.svg" height="70" />
                    <li class="list-group-item pt-1 pb-1 border-0">Low: <strong><span class="temp">${roundTemp(
                      forecast[i].temp.min
                    )}${unit}</span></strong> | High: <strong><span class="temp">${roundTemp(
      forecast[i].temp.max
    )}${unit}</span></strong></li>
                    <li class="list-group-item pt-1 pb-1 border-0">Humidity: <strong>${
                      forecast[i].humidity
                    }%</strong></li>
                    <li class="list-group-item pt-1 pb-1 border-0">Wind: <strong><span class="wind">${convertWind(
                      forecast[i].wind_deg,
                      forecast[i].wind_speed,
                      windUnit
                    )}</span></strong></li>
                    <li class="list-group-item pt-1 pb-1 border-0">UV Index: <strong>${formatUv(
                      forecast[i].uvi
                    )}</strong></li>
                </ul>
            </div>
        </div>`);
  }
};

var convertDT = function (dt) {
  return `${moment.unix(dt).format("dddd, MMMM Do")}`;
};

var roundTemp = function (temp) {
  return Math.round(temp * 10) / 10;
};

var fToC = function () {
  $(".temp").each(function () {
    var fahrenheit = $(this).text().split("°")[0];
    var celsius = `<span class="temp">${roundTemp(((fahrenheit - 32) * 5) / 9)}°C</span>`;
    $(this).replaceWith(celsius);
  });
  isFahrenheit = false;
};

var cToF = function () {
  $(".temp").each(function () {
    var celsius = $(this).text().split("°")[0];
    var fahrenheit = `<span class="temp">${roundTemp((celsius * 9) / 5 + 32)}°F</span>`;
    $(this).replaceWith(fahrenheit);
  });
  isFahrenheit = true;
};

var mphToKph = function () {
  $(".wind").each(function () {
    var mph = $(this).text().split("m")[0];
    var kph = `<span class="wind">${Math.round(mph * 1.60934)}km/h ${$(this).text().split(" ")[1]}`;
    $(this).replaceWith(kph);
  });
  isMPH = false;
};

var kphToMph = function () {
  $(".wind").each(function () {
    var kph = $(this).text().split("k")[0];
    var mph = `<span class="wind">${Math.round(kph / 1.609344)}mph ${$(this).text().split(" ")[1]}`;
    $(this).replaceWith(mph);
  });
  isMPH = true;
};

var convertWind = function (windDeg, windSpeed, windUnit) {
  var directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  windDeg = Math.round(((windDeg %= 360) < 0 ? windDeg + 360 : windDeg) / 45) % 8;
  windSpeed = Math.round((windSpeed * 10) / 10);
  return `${windSpeed}${windUnit} ${directions[windDeg]}`;
};

var formatUv = function (uv) {
  uv = Math.floor(uv);
  if (uv <= 2) {
    return `${uv} (Low)`;
  } else if (uv <= 5) {
    return `${uv} (Moderate)`;
  } else if (uv <= 7) {
    return `${uv} (High)`;
  } else {
    return `${uv} (Extreme)`;
  }
};

var setBG = function (weather) {
  var dayOrNight = weather.split("")[2];
  if (dayOrNight === "n") {
    return weather + " text-white";
  } else {
    return weather;
  }
};

var setSVGColor = function (weather) {
  var dayOrNight = weather.split("")[2];
  if (dayOrNight === "n") {
    return "svg-white";
  } else {
    return ``;
  }
};

var loadSettings = function () {
  var tempUnit = localStorage.getItem("temp");
  if (tempUnit === "c") {
    $("#temp-unit").bootstrapToggle("on");
    isFahrenheit = false;
  }
};

// save button in modal was clicked
$("#settingsModal .save-btn").click(function () {
  var tempUnit = $("#temp-unit");
  var windUnit = $("#wspeed-unit");

  if ($(tempUnit).is(":checked")) {
    if (isFahrenheit) {
      localStorage.setItem("temp", "c");
      fToC();
    }
  } else {
    if (!isFahrenheit) {
      localStorage.setItem("temp", "f");
      cToF();
    }
  }

  if ($(windUnit).is(":checked")) {
    if (isMPH) {
      mphToKph();
    }
  } else {
    if (!isMPH) {
      kphToMph();
    }
  }

  $("#settingsModal").modal("hide");
});

$("#search").keypress(function (e) {
  var city = $("#search").val().trim();
  if (e.which == 13) {
    if (city) {
      getCoord(city);
      $("#search").trigger("blur");
    }
  }
});

loadSettings();
