$(function() { // jQuery
  var showTime = 0;
  /*  var showClock = setInterval(function() {
      $('#iconT').removeClass();
      $('#iconT').addClass("wi wi-time-" + showTime);
      showTime++;
    }, 100);

    if (showTime > 12) {
      getLocation();
      clearInterval(showClock);

    }
  */

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

      console.log("wind deg " + w.wind.deg + " speed " + w.wind.speed);
      console.log(status + " " + w.name);
      console.log(status + " " + w.main.temp);
      $('#iconT').removeClass();
      var t12 = new Date().getHours();
      if (new Date().getHours() > 12) {
        t12 = new Date().getHours() - 12;
      }
      console.log(new Date().getHours());
      console.log("t12 " + t12);
      $('#iconT').addClass("wi wi-time-" + t12);
      $('#time').text(new Date(w.dt * 1000).toLocaleDateString("sk-sk", options)); // milisec to sec
      $('#temp').text(w.main.temp);
      if (units === "metric") {
        $('#temp').append("<i class='wi wi-celsius'></i>");
      } else {
        $('#temp').append("<i class='wi wi-fahrenheit'></i>");
      }
      $('#city').text(w.name);
      $('#descW').text(w.weather[0].main);
      console.log(typeof w.weather[0].main);
      if (w.weather[0].main === "Rain") {
        console.log("Rain bck");
        $('#wBackground').css("background", "url('sunClouds.jpg')")
      }
      if (w.weather[0].main !== "Rain") {
        console.log("ne rain bck");
        $('#wBackground').css("background", "url('sun.jpg')")
      }

      $('#icon1').removeClass();
      $('#icon1').addClass(getIcon(w.weather[0].id));
      // wind
      $('#icon2').removeClass();
      $('#icon2').addClass("wi wi-wind towards-" + windDeg + "-deg fi-fw");
      $('#wind').text(w.wind.speed + " km/h");
      // humidity
      $('#humidity').text(w.main.humidity + " %");
      // background
      /*  if (w.main.temp > 40) {
          $('body').css("background", "url('mac.jpg')");
        } else {
          $('body').css("background", "url('coffe.jpg')");

        }
        */
    });
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



  function getIcon(id) {
    switch (id) {
      case 800 : console.log("800");
        return 'wi wi-day-sunny';
        break;
      case 801 : console.log("801");
        return 'wi wi-day-cloudy';
        break;
      case 802 : console.log("802");
        return 'wi wi-cloudy';
        break;
      case 803 : console.log("803");
        return 'wi wi-cloudy-gusts';
        break;
      case 521 : console.log("521");
        return 'wi wi-showers';
        break;
      case 500 :
        return 'wi wi-rain';
        break;
      case 501 :
        return 'wi wi-rain';
        break;
      case 502 :
        return 'wi wi-rain';
        break;
      case 503 :
        return 'wi wi-rain';
        break;
      case 504 :
        return 'wi wi-rain';
        break;
      case 211 :
        return 'wi wi-thunderstorm';
        break;
      case 601 :
        return 'wi wi-snow';
        break;
      case 701 :
        return 'wi wi-fog';
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
