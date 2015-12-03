
var map;
var markers = [];
var content = [];
var map;
// var myPlaces = [];

// $.getJSON("js/neighborhood.json", function(data) { 
// 	ViewModel.myPlaces(data);
// 	$.each(data, function(i) {
// 		myPlaces.push(data[i]);
// });
// console.log(myPlaces);
// }).fail(function() {console.log('error')})

function initialize() {

	var mapCanvas = document.getElementById('map');
		var mapOptions = {
 		center: new google.maps.LatLng(41.924707, -87.700333),
  		zoom: 14,
  		mapTypeId: google.maps.MapTypeId.ROADMAP
		};
	map = new google.maps.Map(mapCanvas, mapOptions);

}

//run initialize function for google map on window load
google.maps.event.addDomListener(window, 'load', initialize);

function Place(data) {
	this.name = ko.observable(data.name);;
	this.summary = ko.observable(data.summary);
	this.type = ko.observable(data.type);
	this.url = ko.observable(data.url);
	this.lat = ko.observable(data.lat);
	this.long = ko.observable(data.long);
}

function ViewModel() {
	var self = this;
	
	self.myPlaces = ko.observableArray([]);	

	$.getJSON("/neighborhood.json", function(data) { 
		var mappedPlaces = $.map(data, function(item) {
			return new Place(item)
		});
		self.myPlaces(mappedPlaces);
		// self.myPlaces(data);
		// $.each(data, function(i) {
		// 	myPlaces.push(data[i]);
	console.log(myPlaces);
	});

	self.markers = ko.observableArray([]);

	for(var i in self.myPlaces) {
		var lat = parseFloat(self.myPlaces[i].lat);
		var long = parseFloat(self.myPlaces[i].long);

		self.markers[i] = new google.maps.Marker({
			position: {lat: lat, lng: long},
			map: map,
			title: self.myPlaces[i].name,
			animation: google.maps.Animation.DROP
		});
	}

	self.query = ko.observable('');

	self.buttonClick = function() {
		console.log('clicked');
		var details = document.getElementById('details');
		self.details.style.display ='block';
	};

	self.search = function(value) {
		viewModel.myPlaces.removeAll();
		
		for(var x in myPlaces) {
			markers[x].setVisible(false);
			if(myPlaces[x].name.toLowerCase().indexOf(value.toLowerCase()) >= 0){
				viewModel.myPlaces.push(myPlaces[x]);
				markers[x].setVisible(true);
			}
		}
	};
};
$(document).ready(function() {
ko.applyBindings(new ViewModel());
});
