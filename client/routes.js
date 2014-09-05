Router.map(function() {
  this.route('home', {path: '/'});
  this.route('about');
  this.route("tracker");
  this.route("showInventory", {path: 'tracker/inventory'});
  this.route("item", {path: 'tracker/item'});
});
