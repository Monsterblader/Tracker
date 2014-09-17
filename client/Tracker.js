initMap = function(myLatLong, mapDOM, markerTitle) {
  GoogleMaps.init(
          {
            'sensor': true
          },
  function () {
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
  });
};

scanBarCode = function() {
	window.location="http://zxing.appspot.com/scan?ret=http://localhost:3000/tracker/item&SCAN_FORMATS=UPC_A,EAN_13";
};
