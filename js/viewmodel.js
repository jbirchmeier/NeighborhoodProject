

//create empty data array, apply Knockout.js
var data = [];
var viewModel = {
	places: ko.observableArray(data)
};
$(document).ready(function() {
	ko.applyBindings(viewModel);
});

var myPlaces = new Array();

//load JSON neighborhood data from neighborhood.json
$.getJSON("js/neighborhood.json", function(data) { 
	viewModel.places(data);
	$.each(data, function(i) {
		myPlaces.push(data[i]);
	});
	console.log(data);
}).fail(function() {console.log('error')})

var marker = [];
var content = [];
var infowindow = [];

//create and set Google Map with markers
function initialize() {
	var mapCanvas = document.getElementById('map');
		var mapOptions = {
 		center: new google.maps.LatLng(41.924707, -87.700333),
  		zoom: 14,
  		mapTypeId: google.maps.MapTypeId.ROADMAP
		}
	var map = new google.maps.Map(mapCanvas, mapOptions)

	for (i=0; i<myPlaces.length; i++) {
		marker[i]= new google.maps.Marker({
			position: {lat: myPlaces[i].lat, lng:myPlaces[i].long},
			map: map,
			title: myPlaces[i].name,
			animation: google.maps.Animation.DROP
		});
		marker[i].addListener('click', toggleBounce);
	}

//bounce markers on click - need to fix!
	function toggleBounce() {
		if(marker.getAnimation() !== null) {
			console.log('isnull');
			marker.setAnimation(null);
		} else {
			marker.setAnimation(google.maps.Animation.BOUNCE);
		}
	}
}
//run initialize function for google map on window load
google.maps.event.addDomListener(window, 'load', initialize);