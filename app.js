/* URL for accessing localhost from Android emulator: 10.0.2.2:3000 */

inventory = new Meteor.Collection("inventory");

if (Meteor.isServer) {
	Meteor.publish("itemList", function() {
		return inventory.find();
	});
}