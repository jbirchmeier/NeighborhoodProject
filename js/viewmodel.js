//create empty array for storing neighborhood spots
var myPlaces = new Array();

//load JSON neighborhood data from neighborhood.json in to empty myPlaces array
$.getJSON("js/neighborhood.json", function(data) { 
	viewModel.myPlaces(data);
	$.each(data, function(i) {
		myPlaces.push(data[i]);
	});
	console.log(data);
}).fail(function() {console.log('error')})

//create empty data array, apply Knockout.js
var data = [];
var viewModel = {
	myPlaces: ko.observableArray(data),
	query: ko.observable(''),
	buttonClick: function() {
		console.log('clicked');
		var details = document.getElementById('details');
		details.style.display='block';
	},
	search: function(value) {
		viewModel.myPlaces.removeAll();
		for(var x in myPlaces) {
			if(myPlaces[x].name.toLowerCase().indexOf(value.toLowerCase()) >= 0){
				viewModel.myPlaces.push(myPlaces[x]);
			}
		}
	}
};

$(document).ready(function() {
	ko.applyBindings(viewModel);
});
viewModel.query.subscribe(viewModel.search);



var marker = [];
var content = [];
var infowindow = [];

//create and set Google Map with marker
function initialize() {
	var mapCanvas = document.getElementById('map');
		var mapOptions = {
 		center: new google.maps.LatLng(41.924707, -87.700333),
  		zoom: 14,
  		mapTypeId: google.maps.MapTypeId.ROADMAP
		}
	var map = new google.maps.Map(mapCanvas, mapOptions)

//loop through myPlaces array and place a marker at each lat/long
	for (i=0; i<myPlaces.length; i++) {
		marker = marker[i]
		marker = new google.maps.Marker({
			position: {lat: myPlaces[i].lat, lng:myPlaces[i].long},
			map: map,
			title: myPlaces[i].name,
			animation: google.maps.Animation.DROP
		});
		google.maps.event.addListener(marker, 'click', toggleBounce);
		google.maps.event.addListener(marker, 'click', function() {
    	infowindow.open(map, this);
  		}); //end listener

//where does infowindow go?!
		var infowindow = new google.maps.InfoWindow({
    	content: '<div>'+ myPlaces[i].type+ '</div>' + '<div>'+ myPlaces[i].summary+ '</div>' + '<div>'+ myPlaces[i].url+ '</div>' 
  		});

	} //end for loop




//bounce markers on click 
	function toggleBounce(marker) {
		if(this.getAnimation() !== null) {
			this.setAnimation(null);
		} else {
			this.setAnimation(google.maps.Animation.BOUNCE);
		}
	}


}
//run initialize function for google map on window load
google.maps.event.addDomListener(window, 'load', initialize);



