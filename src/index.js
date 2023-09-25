let defoultTempType = true;
const now = new Date();
const dayNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const apiKey = "3f6be1c407b0d9d1933561808db358ba";
const tempValue = document.getElementById("tempValue");
const emojiIcon = document.getElementById("emoji");
const humidityValue = document.getElementById("humidity");
const descriptionValue = document.getElementById("description");
const windValue = document.getElementById("wind");
const cityInputForm = document.getElementById("city-input-form");
const cityName = document.getElementById("city-name");
const cel = document.getElementById("cel");
const far = document.getElementById("far");
const day = document.getElementById("day");
const hours = document.getElementById("hours");
const minutes = document.getElementById("minutes");

day.innerHTML = dayNames[now.getDay()];
hours.innerHTML = now.getHours().toString();
if (now.getMinutes().toString().length === 1) {
  minutes.innerHTML = "0" + now.getMinutes().toString();
} else {
  minutes.innerHTML = now.getMinutes().toString();
}

function celToFar(temp) {
  return ((temp * 9) / 5 + 32).toFixed(0);
}

cel.addEventListener("click", function () {
  if (!defoultTempType) {
    tempValue.innerHTML = tempShow.toString();
    defoultTempType = !defoultTempType;
  }
});

far.addEventListener("click", function () {
  if (defoultTempType) {
    tempValue.innerHTML = celToFar(tempShow).toString();
    defoultTempType = !defoultTempType;
  }
});

cityInputForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const cityInput = document.getElementById("city-input");
  handleCity(cityInput);
});

function handleCity(city) {
  const urlCurentWeather = `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&appid=${apiKey}&&units=metric`;

  axios
    .get(urlCurentWeather)
    .then(function (response) {
      cityName.innerHTML = city.value;
      createCurentWeatherData(response);
      cityInputForm.reset();
      handleWeatherForWeek(response.data.coord.lat, response.data.coord.lon);
    })
    .catch(function (error) {
      console.log(error);
      cityName.innerHTML = "City is not correct";
      cityInputForm.reset();
    });
}

function createCurentWeatherData(response) {
  const responseTemp = response.data.main.temp;
  tempShow = responseTemp.toFixed(0).toString();
  tempValue.innerHTML = tempShow;
  defoultTempType = true;
  emojiIcon.innerHTML = `<img src="https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png" alt="">`;
  humidityValue.innerHTML = response.data.main.humidity;
  descriptionValue.innerHTML = response.data.weather[0].description;
  windValue.innerHTML = response.data.wind.speed;
}

function handleWeatherForWeek(latitude, longitude) {
  const urlWeatherForWeek = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&appid=${apiKey}&&units=metric`;

  axios
    .get(urlWeatherForWeek)
    .then(function (response) {
      createWeatherDataForWeek(response);
    })
    .catch(function (error) {
      console.log(error);
    });
}

function getDay(index) {
  let day = now.getDay();
  let days = [
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
  ];
  return days[day + index];
}

function createWeatherDataForWeek(response) {
  weatherForWeekElement = document.getElementById("weatherForWeek");
  let weatherForWeekHtml = "";

  response.data.daily.map(function (day, index) {
    if (index < 5) {
      weatherForWeekHtml =
        weatherForWeekHtml +
        `
        <div class="col">
          <div class="WeatherForecastPreview">
            <div class="dayWeek">${getDay(index)}</div>
            <img src="https://openweathermap.org/img/wn/${
              day.weather[0].icon
            }@2x.png" alt="">
            <div class="temperatureWeek red">
              <span class="max">
                ${day.temp.max.toFixed(0).toString()}°
              </span>
              <span class="min">
                ${day.temp.min.toFixed(0).toString()}°
              </span>
            </div>
          </div>
        </div>
        `;
    }

    weatherForWeekElement.innerHTML = weatherForWeekHtml;
  });
}

handleCity({ value: "Sydney" });
