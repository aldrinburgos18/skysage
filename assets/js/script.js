const apiKey = "a1d8b8f684383df9eff3ae909b0d743e";

var getCoord = function (city) {
  fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`).then((response) => {
    if (response.ok) {
      response.json().then((data) => {
        getWeatherData(data[0].lat, data[0].lon);
      });
    } else {
      alert("There was an error with your request.");
    }
  });
};

var getWeatherData = function (lat, lon) {
  fetch(
    `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&appid=${apiKey}`
  ).then((response) => {
    if (response.ok) {
      response.json().then((weather) => {
        console.log(weather);
      });
    } else {
      alert("There was an error with your request.");
    }
  });
};

getCoord("las vegas, nv, us");
