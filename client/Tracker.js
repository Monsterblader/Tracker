checkIn = function(ID) {
	var item = inventory.findOne({itemID: "" + ID})._id;
	var homeLocation = {lat: 37.0406475, long: -121.629169};
	inventory.update(item, {$set: {itemLocation: homeLocation}});
	location.reload();
}

checkOut = function(ID) {
	var item = inventory.findOne({itemID: "" + ID})._id;
	$("#detectedMap").data("ID", item);
	navigator.geolocation.getCurrentPosition(function(geoData) {
		var item = inventory.findOne({itemID: "" + ID})._id;
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
    	$("#detectedMap").data("lat", newLat);
    	$("#detectedMap").data("long", newLong);
    });
	});
}

checkOutConfirm = function() {
	var ID = $("#detectedMap").data("ID");
	var newAddr = $("input[name='altAddress']").val();
	var timeStamp = new Date();
	if (newAddr) {
		var geocoder = new google.maps.Geocoder();
		geocoder.geocode( { 'address': newAddr}, function(results, status) {
		    if (status == google.maps.GeocoderStatus.OK) {
		    	var newLat = results[0].geometry.location.k;
		    	var newLong = results[0].geometry.location.B;
		    	inventory.upsert(ID, {$set: {itemLocation: {lat: newLat, long: newLong}, timeStamp: timeStamp}});
		    } else {
		    	$("input[name='altAddress']").val("");
		      alert('Geocode was not successful for the following reason: ' + status);
		    }
		  });
	} else {
		var newLat = $("#detectedMap").data("lat");
		var newLong = $("#detectedMap").data("long");
    inventory.upsert(ID, {$set: {itemLocation: {lat: newLat, long: newLong}, timeStamp: timeStamp}});
	}
	$(".confirmAddress").modal("toggle");
	location.reload();
}

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
}

maintClose = function() {
	$(".maintenanceModal").modal("toggle");
}

maintOpen = function(ID) {
	$(".maintenanceModal").modal("toggle");
}

maintSubmit = function(ID) {
	;
}

reMap = function() {
	var newAddr = $("input[name='altAddress']").val();
	$("input[name='altAddress']").val("");
	var geocoder = new google.maps.Geocoder();
  geocoder.geocode( { 'address': newAddr}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
    	var newLat = results[0].geometry.location.k;
    	var newLong = results[0].geometry.location.B;
    	var myLatLong = new google.maps.LatLng(newLat, newLong);
    	$(".detectedAddress").html(results[0].formatted_address);
    	$("#detectedMap").data("lat", newLat);
    	$("#detectedMap").data("long", newLong);
    	initMap(myLatLong, "detectedMap", newAddr);
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}

scanBarCode = function() {
	window.location="http://zxing.appspot.com/scan?ret=http://localhost:3000/tracker/item&SCAN_FORMATS=UPC_A,EAN_13";
}

Template.home.greeting = function () {
  return "Welcome to Tracker.";
}

Template.home.events({
  'click input': function () {
    // template data, if any, is available in 'this'
    if (typeof console !== 'undefined')
      console.log("You pressed the button");
  }
});

Template.item.events({
	'submit form' : function(event, template) {
		var reader = new FileReader();
	  event.preventDefault();

	  itemName = template.find("input[name=itemName]");
	  itemID = template.find("input[name=itemID]");
	  itemImage = template.find("input[type=file]").files[0];
	  initialLocation = {lat: 37.0392772, long: -121.6286111};

  // Do form validation

	  var data = {
	    itemName: itemName.value,
	    itemID: itemID.value,
	    itemImage: itemImage.name,
	    itemLocation: initialLocation
	  };

	  itemName.value="";
	  itemID.value="";
	  template.find("input[name=itemImage]").value="";

	  inventory.insert(data, function(err) { console.log(err); });
    _.each(event.originalEvent.srcElement.childNodes[5].files, function(file) {
//    	resizeBase64Img(file, 100, 100).then(function(newImg){
    		var reader = new FileReader();
    		reader.onload = (function(file) {
    			console.log("Reader loaded.");
    		})();
    		Meteor.saveFile(file, file.name);
    		var result = reader.readAsBinaryString(file);
    		console.log("result: " + result);
//    });
    });
	}
});

Template.item.rendered = function() {
	Meteor.subscribe("itemList", function() {});
	window.location.search && $("input[name='itemID']").val(window.location.search.split("=")[1]);
}

Template.item.item = function() {
	var result;
	var findBarCode = window.location.href.split("=");
	if (findBarCode[1]) {
		result = inventory.find({itemID: findBarCode[1]}).fetch();
	}
	return result;
}

Template.itemLayout.created = function() {
	var itemData = this.data;
	GoogleMaps.init(
	  {
	    'sensor': true, //optional
	    //'key': 'MY-GOOGLEMAPS-API-KEY', //optional
	    //'language': 'de' //optional
	  }, 
	  function(){
	    var myLatLong = new google.maps.LatLng(itemData.itemLocation.lat, itemData.itemLocation.long);
	    var mapOptions = {
	          zoom: 15,
	          mapTypeId: google.maps.MapTypeId.ROADMAP,
	          center: myLatLong
	        };
	    var map = new google.maps.Map(document.getElementById("map-" + itemData.itemID), mapOptions);
	    var marker = new google.maps.Marker({
	      position: myLatLong,
	      map: map,
	      title: itemData.itemName
	    });
	  }
	);
}

Template.tracker.inventoryList = function() {
	var list = inventory.find().fetch();
	return list;
}

Template.tracker.rendered = function() {
  Meteor.subscribe('itemList', function(){ });
}
