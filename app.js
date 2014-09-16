/* URL for accessing localhost from Android emulator: 10.0.2.2:3000 */

inventory = new Meteor.Collection("inventory");
activeItem = new ReactiveDict;
HOMELOCATION = {lat: 37.0376331, long: -121.6260641};

if (Meteor.isServer) {
	Meteor.publish("itemList", function() {
		return inventory.find();
	});
}
