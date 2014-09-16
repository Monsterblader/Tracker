initMap = function(myLatLong, mapDOM, markerTitle) {
	GoogleMaps.init(
	  {
	    'sensor': true
	  },
	  function(){
	    var mapOptions = {
	          zoom: 15,
	          mapTypeId: google.maps.MapTypeId.ROADMAP,
	          center: myLatLong
	        };
	    var map = new google.maps.Map(document.getElementById(mapDOM), mapOptions);
	    var marker = new google.maps.Marker({
	      position: myLatLong,
	      map: map,
	      title: markerTitle
	    });
	  }
	);
};

reMap = function() {
	var newAddr = $("input[name='altAddress']").val();
	$("input[name='altAddress']").val("");
	var geocoder = new google.maps.Geocoder();
  geocoder.geocode( { 'address': newAddr}, function(results, status) {
    if (status === google.maps.GeocoderStatus.OK) {
    	var newLat = results[0].geometry.location.k;
    	var newLong = results[0].geometry.location.B;
    	var myLatLong = new google.maps.LatLng(newLat, newLong);
    	$(".detectedAddress").html(results[0].formatted_address);
			activeItem.set("lat", newLat);
			activeItem.set("long", newLong);
    	initMap(myLatLong, "detectedMap", newAddr);
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
};

scanBarCode = function() {
	window.location="http://zxing.appspot.com/scan?ret=http://localhost:3000/tracker/item&SCAN_FORMATS=UPC_A,EAN_13";
};
