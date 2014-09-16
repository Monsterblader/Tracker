maintClose = function () {
  $("input[name='maintDate']").val("");
  $("input[name='maintNote']").val("");
  $(".maintenanceModal").modal("toggle");
};

maintOpen = function (ID) {
  activeItem.set("ID", ID);
  $(".maintenanceModal").modal("toggle");
};

maintSubmit = function (ID) {
  var ID = activeItem.get("ID");
  var maintDate = $("input[name='maintDate']").val();
  var maintNote = $("input[name='maintNote']").val();
  var timeStamp = new Date();
  var record = {timeStamp: timeStamp, date: maintDate, note: maintNote, user: "asdf"};
  inventory.upsert(ID, {$push: {maintenance: record}});
  $(".maintenanceModal").modal("toggle");
};

Template.maintenanceModal.record = function () {
  var record = activeItem.get("ID");
  if (record) {
    return inventory.find(record).fetch()[0].maintenance;
  }
};
