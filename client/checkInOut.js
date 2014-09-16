checkIn = function (ID) {
  inventory.update(ID, {$set: {itemLocation: HOMELOCATION}});
  location.reload();
};

checkOut = function (ID) {
  activeItem.set("ID", ID);
  navigator.geolocation.getCurrentPosition(function (geoData) {
    var newLat = geoData.coords.latitude;
    var newLong = geoData.coords.longitude;
    var geocoder = new google.maps.Geocoder();
    var myLatLong = new google.maps.LatLng(newLat, newLong);
    geocoder.geocode({"latLng": myLatLong}, function (results, status) {
      console.log(results);
      var addr = results[0].formatted_address;
      initMap(myLatLong, "detectedMap", addr);
      $(".confirmAddress").modal("toggle");
      $(".detectedAddress").html(addr);
      activeItem.set("lat", newLat);
      activeItem.set("long", newLong);
    });
  });
};

checkOutConfirm = function () {
  var newAddr = $("input[name='altAddress']").val();
  var timeStamp = new Date();
  if (newAddr) {
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({'address': newAddr}, function (results, status) {
      if (status === google.maps.GeocoderStatus.OK) {
        var newLat = results[0].geometry.location.k;
        var newLong = results[0].geometry.location.B;
        inventory.upsert(ID, {$set: {itemLocation: {lat: newLat, long: newLong}, timeStamp: timeStamp}});
      } else {
        $("input[name='altAddress']").val("");
        alert('Geocode was not successful for the following reason: ' + status);
      }
    });
  } else {
    var newLat = activeItem.get("lat");
    var newLong = activeItem.get("long");
    inventory.upsert(activeItem.get("ID"), {$set: {itemLocation: {lat: newLat, long: newLong}, timeStamp: timeStamp}});
  }
  $(".confirmAddress").modal("toggle");
  location.reload();
};
