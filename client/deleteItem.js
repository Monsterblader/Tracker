delCancel = function (ID) {
  $("#delConfirm").val("");
  $(".deleteModal").modal("toggle");
};

delConfirm = function (ID) {
  if ($("#delConfirm").val() === "Yes") {
    //TODO only delete file if item is only one using it.
    var name = inventory.findOne(activeItem.get("ID")).itemImage;
    inventory.find({itemImage: name}).count() === 1
            && Meteor.call("delFile", name);
    inventory.remove(activeItem.get("ID"));
    location.assign("/tracker");
  }
  $(".deleteModal").modal("toggle");
};

delItem = function (ID) {
  activeItem.set("ID", ID);
  $(".deleteModal").modal("toggle");
};
