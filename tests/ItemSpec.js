describe("inventory", function () {
  it("should exist in Jasmine", function () {
    expect(inventory).not.toBeNull();
  });

  it("should be able to findOne()", function () {
    expect(inventory.findOne()).not.toBeNull();
  });
});

describe("Item", function () {
  var data = {
    itemName: "Test name",
    itemID: "1234",
    itemImage: "Image name",
    itemLocation: {lat: 37.0376331, long: -121.6260641}
  };

  beforeEach(function () {
    var HOMELOCATION = {lat: 'abc', long: '123'};
    mock(window, "inventory");
    spyOn(inventory, "update");
    spyOn(inventory, "upsert");
  });

  afterEach(function () {
    inventory.remove("abc123");
  });

  it("container should be rendered", function () {
    expect($(".itemContainer")).not.toBeUndefined();
  });

  it("checkIn should call inventory.update with HOMELOCATION", function () {
    checkIn("abc123");
    expect(inventory.update).toHaveBeenCalledWith("abc123", {$set: {itemLocation: HOMELOCATION}});
  });

  it("check out should call inventory.upsert with {lat: '123', long: '456'}", function () {
    activeItem.set("lat", "123");
    activeItem.set("long", "456");
    expect(inventory.find("abc123")).not.toBeUndefined();
  });
});
