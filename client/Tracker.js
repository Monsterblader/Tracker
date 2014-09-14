checkIn = function (ID) {
	var homeLocation = {lat: 37.0406475, long: -121.629169};
	inventory.update(ID, {$set: {itemLocation: homeLocation}});
	location.reload();
};

checkOut = function (ID) {
	activeItem.set("ID", ID);
	navigator.geolocation.getCurrentPosition(function(geoData) {
		var newLat = geoData.coords.latitude;
		var newLong = geoData.coords.longitude;
    var geocoder = new google.maps.Geocoder();
    var myLatLong = new google.maps.LatLng(newLat, newLong);
    geocoder.geocode({"latLng": myLatLong}, function(results, status){
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
		geocoder.geocode( { 'address': newAddr}, function(results, status) {
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

delCancel = function (ID) {
  $("#delConfirm").val("");
  $(".deleteModal").modal("toggle");
};

delConfirm = function (ID) {
  //TODO Get name of image file from database.
  //TODO Check that file is not still being used.
  //TODO Remove file.
  if ($("#delConfirm").val() === "Yes") {
    var name = inventory.findOne(activeItem.get("ID")).itemImage;
    Meteor.call("delFile", name);
    inventory.remove(activeItem.get("ID"));
    location.assign("/tracker");
  }
  $(".deleteModal").modal("toggle");
};

delItem = function (ID) {
  activeItem.set("ID", ID);
  $(".deleteModal").modal("toggle");
};

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

maintClose = function () {
	$("input[name='maintDate']").val("");
	$("input[name='maintNote']").val("");
	$(".maintenanceModal").modal("toggle");
};

maintOpen = function(ID) {
  activeItem.set("ID", ID);
	$(".maintenanceModal").modal("toggle");
};

maintSubmit = function(ID) {
	var ID = activeItem.get("ID");
	var maintDate = $("input[name='maintDate']").val();
	var maintNote = $("input[name='maintNote']").val();
	var timeStamp = new Date();
	var record = {timeStamp: timeStamp, date: maintDate, note: maintNote, user: "asdf"};
	inventory.upsert(ID, {$push: {maintenance: record}});
	$(".maintenanceModal").modal("toggle");
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
