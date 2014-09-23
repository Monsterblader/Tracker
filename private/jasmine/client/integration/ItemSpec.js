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
  });

  afterEach(function () {
    inventory.remove("abc123");
  });

  it("container should be rendered", function () {
    expect($(".itemContainer")).not.toBeUndefined();
  });

  it("checkIn should call inventory.update with HOMELOCATION", function () {
    spyOn(inventory, "update");
    checkIn("abc123");
    expect(inventory.update).toHaveBeenCalledWith("abc123", {$set: {itemLocation: HOMELOCATION}});
  });

  it("checkOutConfirm should call inventory.upsert", function () {
    spyOn(inventory, "upsert");
    activeItem.set("ID", "abc123");
    activeItem.set("lat", "123");
    activeItem.set("long", "456");
    checkOutConfirm();
    expect(inventory.upsert).toHaveBeenCalled();
  });

  it("delConfirm should call inventory.remove", function () {
    spyOn(inventory, "remove");
    $("#delConfirm").val("Yes");
    delConfirm("abc123");
    expect(inventory.remove).toHaveBeenCalled();
  });

  it("delConfirm should close the delete modal window", function () {
    spyOn($, "modal");
    delConfirm("abc123");
    expect($().modal).toHaveBeenCalled();
  });
});
