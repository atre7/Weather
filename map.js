$(function() {
  var retVal ;
  var x = document.getElementById("demo");
  getLocation();

  $(window).resize(function() {
    console.log("resize");
    getLocation();
  })

  $('#location').click(function() {
    console.log("click on btn ");
    getLocation();
  })

  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
      x.innerHTML = "Geolocation is not supported by this browser.";
    }
  }


  function showPosition(position, posIP) {
    if (position !== null) {
      lat = position.coords.latitude;
      lon = position.coords.longitude;
    }
    if (position === null) {
      console.log("ip lat lon pouzil");
      lat = posIP.split(",")[0];
      lon = posIP.split(",")[1];
    }
    latlon = new google.maps.LatLng(lat, lon)
    mapholder = document.getElementById('mapholder')
    var height = $("#location").height();
    var width = $("#location").width();
    console.log("hXw " + height + "  " + width);
    mapholder.style.height = (width / 2) + 'px';
    mapholder.style.width = width + 'px';

    var myOptions = {
      center: latlon,
      zoom: 14,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      mapTypeControl: false,
      navigationControlOptions: {
        style: google.maps.NavigationControlStyle.SMALL
      }
    }

    var map = new google.maps.Map(document.getElementById("mapholder"), myOptions);
    var marker = new google.maps.Marker({
      position: latlon,
      map: map,
      title: "You are here!"
    });
  }

  function showError(error) {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        //  x.innerHTML = "User denied the request for Geolocation. IP location "
        locationIP();
        break;
      case error.POSITION_UNAVAILABLE:
        x.innerHTML = "Location information is unavailable."
        break;
      case error.TIMEOUT:
        x.innerHTML = "The request to get user location timed out."
        break;
      case error.UNKNOWN_ERROR:
        x.innerHTML = "An unknown error occurred."
        break;
    }
  }
  function locationIP() {

    $.get("http://ipinfo.io", function(location) {

      console.log("IP pos " + location.loc);
      // davalo null    console.log(location.city);
      console.log(location.country);
      retVal = location.loc;
      console.log("IP: " + retVal);
      //  weatherByPos(location.loc, " IP position", units);
      showPosition(null, location.loc);
    }, "json");
    console.log("return value " + retVal); // tu uz ma undefinied
    return retVal;
  }

})
