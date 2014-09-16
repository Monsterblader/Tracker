Template.home.greeting = function () {
  return "Welcome to Tracker.";
};

Template.home.events({
  'click input': function () {
    // template data, if any, is available in 'this'
    if (typeof console !== 'undefined')
      console.log("You pressed the button");
  }
});

Template.item.events({
  'submit form': function (event, template) {
    var reader = new FileReader();
    event.preventDefault();

    itemName = template.find("input[name=itemName]");
    itemID = template.find("input[name=itemID]");
    itemImage = template.find("input[type=file]").files[0];
    initialLocation = HOMELOCATION;

    // Do form validation

    var data = {
      itemName: itemName.value,
      itemID: itemID.value,
      itemImage: itemImage.name,
      itemLocation: initialLocation
    };

    itemName.value = "";
    itemID.value = "";
    template.find("input[name=itemImage]").value = "";

    inventory.insert(data, function (err) {
      console.log(err);
    });
    _.each(event.originalEvent.srcElement.childNodes[9].files, function (file) {
//    	resizeBase64Img(file, 100, 100).then(function(newImg){
      var reader = new FileReader();
      reader.onload = (function (file) {
        console.log("Reader loaded.");
      })();
      Meteor.saveFile(file, file.name);
      var result = reader.readAsBinaryString(file);
      console.log("result: " + result);
//    });
    });
  }
});

Template.item.rendered = function () {
  Meteor.subscribe("itemList", function () {
  });
  window.location.search && $("input[name='itemID']").val(window.location.search.split("=")[1]);
};

Template.item.item = function () {
  var result;
  var findBarCode = window.location.href.split("=");
  if (findBarCode[1]) {
    result = inventory.find({itemID: findBarCode[1]}).fetch();
  }
  return result;
};

Template.itemLayout.created = function () {
  var itemData = this.data;
  GoogleMaps.init({
            'sensor': true //optional
                    //'key': 'MY-GOOGLEMAPS-API-KEY', //optional
                    //'language': 'de' //optional
          },
  function () {
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
  });
};

Template.tracker.inventoryList = function () {
  var list = inventory.find().fetch();
  return list;
};

Template.tracker.rendered = function () {
  Meteor.subscribe('itemList', function () {
  });
};
