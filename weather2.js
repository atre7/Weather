$(function() { // jQuery
  var showTime = 0;
  var wbc = {}; // weather by city
  var cod = 0;
  var geoW;
  var storePosition = null;
  var units = "metric";

  function metricToImperial(c) {
    // f = c* 9/5 +32
    return Math.round((c * (9 / 5) + 32) * 1) / 1;
  }

  function imperialToMetric(f) {
    // c = (f-32) *5/9
    return Math.round(((f - 32) * (5 / 9)) * 1) / 1;
  }

  function locationIP() {
    $.get("http://ipinfo.io", function(location) {
      weatherByPos(location.loc, " IP position", units);
    }, "json");
  }

  function storeAndGo(pos) {
    if (storePosition === null) {
      storePosition = pos;
    }
    showPosition(pos);
  }
  // position navigator
  getLocation();

  function getLocation() {

    if (navigator.geolocation) {
      //  navigator.geolocation.watchPosition(showPosition, showError); getCurrentPosition
      navigator.geolocation.getCurrentPosition(storeAndGo, showError);
    } else {
      $('#city').text("Geolocation is not supported by this browser.");
    }
  }

  function showPosition(position) {
    $('#city').text("Latitude: " + position.coords.latitude +
      "  Longitude: " + position.coords.longitude);

    weatherByPos(position.coords.latitude + "," + position.coords.longitude, " GPS position", units);
  }

  function showError(error) {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        $('#city').text("User denied the request for Geolocation. Position IP is used.");
        locationIP();
        break;
      case error.POSITION_UNAVAILABLE:
        $('#city').text("Location information is unavailable.");
        locationIP();
        break;
      case error.TIMEOUT:
        $('#city').text("The request to get user location timed out.");
        locationIP();
        break;
      case error.UNKNOWN_ERROR:
        $('#city').text("An unknown error occurred.");
        locationIP();
        break;
    }
  }
  var options3 = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    ur12: false
  }

  function localDate(d) {
    var dateobj = new Date(d);

    function pad(n) {
      return n < 10 ? "0" + n : n;
    }
    var result = pad(dateobj.getDate()) + "/" + pad(dateobj.getMonth() + 1) + "/" + dateobj.getFullYear();
    return result;
  }
  // weather lat lon
  // weather by city
  //weatherByCity("Bratislava");
  function weatherByCity(city) {
    var url2 = "http://api.openweathermap.org/data/2.5/weather?q=" + city
    $.getJSON(url2, function(wx) {
      showWeather(wx);
    });
  }
  //  weatherByPos();
  function weatherByPos(pos, status, units) {

    var lat = 48;
    var lon = 17;
    var latlon = pos.split(",");
    lat = latlon[0];
    lon = latlon[1];

    //  var units = "metric";
    var url = "http://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&units=" + units + "&APPID=37c56062e5723ab31907e1f5fa58f823";
    geoW = $.getJSON(url, function(w) {
      cod = w.cod;
      if (w.cod !== "404") {
        showWeather(w);
      } else {
        $('#city').text("Location failed ");
      }
    }).done(function() {
      if (cod === "404") {
        var c = prompt("Enter your city", "Bratislava");
        weatherByCity(c);
      }
    }).fail(function() {}).always(function() {});
    geoW.complete(function() {});
  }

  function showWeather(w) {
    var windDeg = w.wind.deg;
    $('#iconT').removeClass();
    var t12 = new Date().getHours();
    if (new Date().getHours() > 12) {
      t12 = new Date().getHours() - 12;
    }
    $('#iconT').addClass("wi wi-time-" + t12);
    $('#time').find("i").remove();
    $('#time').text(new Date(w.dt * 1000).toLocaleDateString("sk-sk", options)); // milisec to sec
    $('#temp>span').text(Math.round(Number(w.main.temp) * 1) / 1);
    if (units === "metric") {
      $('#temp>i').remove();
      $('#temp').append("<i class='wi wi-celsius'></i>");
    } else {
      $('#temp>i').remove();
      $('#temp').append("<i class='wi wi-fahrenheit'></i>");
    }
    $('#city').text(w.name);
    $('#mainW').text(w.weather[0].main);
    $('#descW').text(w.weather[0].description);
    if (w.weather[0].main === "Rain") {
      $('#wBackground').css("background", "url('http://i.ytimg.com/vi/Sv0LwXYAVVg/maxresdefault.jpg') no-repeat center center");
    } else if (w.weather[0].main === "Clouds") {
      $('#wBackground').css("background", "url('sunCloudsRes.jpg') no-repeat center center");
    } else {
      $('#wBackground').css("background", "url('Sun2Res.jpg') no-repeat center center");
    }
    $('#icon1').removeClass();
    $('#icon1').addClass(getIcon(w.weather[0].id));
    // wind
    $('#icon2').removeClass();
    $('#icon2').addClass("wi wi-wind towards-" + windDeg + "-deg fi-fw");
    $('#wind').text(w.wind.speed);
    if (units === "metric") {
      $('#wind').append(" m/s");
    } else {
      $('#wind').append(" mph");
    }
    // humidity
    $('#humidity').text(w.main.humidity + " %");
    $('#sunrise').text(new Date(w.sys.sunrise * 1000).toLocaleDateString("sk-sk", options2));
    $('#sunset').text(new Date(w.sys.sunset * 1000).toLocaleDateString("sk-sk", options2));
  }
  // time
  var options = {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    ur12: false
  };
  var options2 = {
    weekday: 'long',
    hour: 'numeric',
    minute: 'numeric',
    ur12: false
  };

  function getIcon(id) {
    switch (id) {
      case 800:
        return 'wi wi-day-sunny';
        break;
      case 801:
        return 'wi wi-day-cloudy';
        break;
      case 802:
        return 'wi wi-cloudy';
        break;
      case 803:
        return 'wi wi-cloudy-gusts';
        break;
      case 804:
        return 'wi wi-cloudy-gusts';
        break;
      case 521:
        return 'wi wi-showers';
        break;
      case 500:
        return 'wi wi-rain';
        break;
      case 501:
        return 'wi wi-rain';
        break;
      case 502:
        return 'wi wi-rain';
        break;
      case 503:
        return 'wi wi-rain';
        break;
      case 504:
        return 'wi wi-rain';
        break;
      case 211:
        return 'wi wi-thunderstorm';
        break;
      case 601:
        return 'wi wi-snow';
        break;
      case 701:
        return 'wi wi-fog';
        break;
      default:
        return 'wi wi-day-fog';
    }
  }
  // farenhait to celsius convert or reverse API
  $('#fc').click(function() {
    if (units === "metric") {
      units = "imperial";
      getLocation();
    } else {
      units = "metric";
      getLocation();
    }
  });

  $('#fcCalc').click(function() {
    var u = $('#temp > i').hasClass("wi-celsius");
    if (u) {
      $('#temp>span').text(metricToImperial(Number($('#temp>span').text())));
      $('#temp>i').remove();
      $('#temp').append("<i class='wi wi-fahrenheit'></i>");
    } else {
      $('#temp>span').text(imperialToMetric(Number($('#temp>span').text())));
      $('#temp>i').remove();
      $('#temp').append("<i class='wi wi-celsius'></i>");
    }
  });

})
