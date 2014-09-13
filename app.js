/* URL for accessing localhost from Android emulator: 10.0.2.2:3000 */

inventory = new Meteor.Collection("inventory");
activeItem = new ReactiveVar;

if (Meteor.isServer) {
	Meteor.publish("itemList", function() {
		return inventory.find();
	});
}