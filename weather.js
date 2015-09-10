$(function() { // jQuery
  var units = "metric";
  // position IP
  //locationIP();

  // c = (f-32) *5/9
  // f = c* 9/5 +32
  function locationIP() {
    // atom coment
    $.get("http://ipinfo.io", function(location) {

      console.log("IP pos " + location.loc);
      console.log(location.city);
      console.log(location.country);

      weatherByPos(location.loc, " IP position", units);
    }, "json");


  }
  // position navigator
  getLocation();

  function getLocation() {
    console.log("units " + units);
    if (navigator.geolocation) {
      //  navigator.geolocation.watchPosition(showPosition, showError); getCurrentPosition
      navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
      $('#city').text("Geolocation is not supported by this browser.");
    }
  }

  function showPosition(position) {
    $('#city').text("Latitude: " + position.coords.latitude +
      "  Longitude: " + position.coords.longitude);
    console.log("gpsPosition");
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

        break;
      case error.TIMEOUT:
        $('#city').text("The request to get user location timed out.");

        break;
      case error.UNKNOWN_ERROR:
        $('#city').text("An unknown error occurred.");

        break;
    }
  }
  // &APPID=ba7b81140fa7455096e194fe94222d86
  // weather city
  //weatherByCity();
  function weatherByCity() {
    $.getJSON("http://api.openweathermap.org/data/2.5/weather?q=Bratislava&units=metric&APPID=ba7b81140fa7455096e194fe94222d86", function(pocasie) {
      console.log(pocasie);
      console.log(pocasie.name);
      console.log(pocasie.main.temp);
      $('#mesto').text("mesto : " + pocasie.name);
      $('#teplota').text("teplota : " + pocasie.main.temp);
      $('#pocasie').text("pocasie : " + pocasie.weather[0].description);
      $('#cas').text("cas : " + new Date(pocasie.dt * 1000).toLocaleDateString("sk-sk", options3)); // milisec to sec
      $('#cas2').text("cas2 : " + localDate(pocasie.dt * 1000));
    })



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

  //  weatherByPos();
  function weatherByPos(pos, status, units) {

    var lat = 48;
    var lon = 17;
    var latlon = pos.split(",");
    lat = latlon[0];
    lon = latlon[1];

    //  var units = "metric";
    var url = "http://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&units=" + units + "&APPID=ba7b81140fa7455096e194fe94222d86";
    $.getJSON(url, function(w) {
      var windDeg = w.wind.deg ;
      console.log(w);
      console.log("icon id : " + w.weather[0].icon);
      console.log("id : " + w.weather[0].id);
      getIcon(w.weather[0].id);
      console.log("wind deg " + w.wind.deg + " speed " + w.wind.speed);
      console.log(status + " " + w.name);
      console.log(status + " " + w.main.temp);
      $('#temp').text(w.main.temp);
      $('#city').text(w.name);
      $('#icon').find("img:first-child").remove();
      $('#icon')
        .prepend("<img src='http://openweathermap.org/img/w/" + w.weather[0].icon + ".png'>");
      if (units === "metric") {
        $('#temp').append("<i class='wi wi-celsius'></i>");
      } else {
        $('#temp').append("<i class='wi wi-fahrenheit'></i>");
      }
      $('#temp').prepend("Temperature ");
      $('#city').prepend("City : ");
      if (w.main.temp > 40) {
        $('body').css("background", "url('mac.jpg')");
      } else {
        $('body').css("background", "url('coffe.jpg')");

      }
      //wi-wind.towards-0-deg
      // <i class="wi wi-night-sleet fi-fw" style="font-size: 6em"></i>
      $('#windIcon').append("<i class='wi wi-wind towards-" + windDeg + "-deg fi-fw' style='font-size: 8em'></i>");
    });
  }
  function getIcon(id) {
    switch (id) {
      case 800 : console.log("800");
        return "<i class='wi wi-day-sunny'></i>";
        break;
      case 801 : console.log("801");
        return "<i class='wi wi-day-cloudy'></i>";
        break;
      case 802 : console.log("802");
        return "<i class='wi wi-cloudy'></i>";
        break;
      case 803 : console.log("803");
        return "<i class='wi wi-cloudy-gusts'></i>";
        break;
      case 521 : console.log("521");
        return "<i class='wi wi-showers'></i>";
        break;
      case 500 :
        return "<i class='wi wi-rain'></i>";
        break;
      case 211 :
        return "<i class='wi wi-thunderstorm'></i>";
        break;
      case 601 :
        return "<i class='wi wi-snow'></i>";
        break;
      case 701 :
        return "<i class='wi wi-fog'></i>";
        break;
    }
  }

  // farenhait to celsius convert or reverse
  $('#fc').click(function() {
    console.log("1" + units);
    if (units === "metric") {
      units = "imperial";
      getLocation();
      console.log("2" + units);
    } else {
      units = "metric";
      getLocation();
      console.log("2" + units);
    }
  })
}) // jQuery end
