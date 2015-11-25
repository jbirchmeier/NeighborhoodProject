//create empty array for storing neighborhood spots
var myPlaces = new Array();

//load JSON neighborhood data from neighborhood.json in to empty myPlaces array
$.getJSON("js/neighborhood.json", function(data) { 
	viewModel.myPlaces(data);
	$.each(data, function(i) {
		myPlaces.push(data[i]);
	});
	console.log(myPlaces);
}).fail(function() {console.log('error')})


//empty array for infowindow contents
var content = [];
var markers = [];
//empty array for foursquare response data
var fourSquare = [];

//create and set Google Map with marker
function initialize() {
	var mapCanvas = document.getElementById('map');
		var mapOptions = {
 		center: new google.maps.LatLng(41.924707, -87.700333),
  		zoom: 14,
  		mapTypeId: google.maps.MapTypeId.ROADMAP
		}
	var map = new google.maps.Map(mapCanvas, mapOptions)

//loop through myPlaces array and place a marker and infowindow at each lat/long
	for (i=0; i<myPlaces.length; i++) {
		markers[i] = new google.maps.Marker({
			position: {lat: myPlaces[i].lat, lng:myPlaces[i].long},
			map: map,
			title: myPlaces[i].name,
			animation: google.maps.Animation.DROP
		}); //end marker
		google.maps.event.addListener(markers[i], 'click', toggleBounce);
		
		//api call to foursquare
		var foursquareUrl = "https://api.foursquare.com/v2/venues/" + myPlaces[i].venueid + '?client_id=0J2DPJP1QTTH5Q5URVIY1BZOTVS5F01A3A41GW4NDHOJCCDH&client_secret=5RBWCXTH5414FN21DBJY1PIFM2TN3GAWRZ4WIWVRZRY1ZI1T&v=20151110';	
		$.ajax({
			url: foursquareUrl,
			data: data,
			dataType: 'json',
			success: function(data){
				// console.log(data);
				fourSquare.push(data);
				console.log(fourSquare);
			}
		})//end foursquare call
		//push all infowindow contents to the contents array
		content.push('<div>'+ myPlaces[i].type + '</div>' + '<div>'+ myPlaces[i].summary+ '</div>' + '<div><a href='+ myPlaces[i].url+ '>' + myPlaces[i].url + '</a></div>');
		attachWindow(markers[i], content[i]);


	} //end for loop
} //end initialize

//add infowindows and attach to corresponding marker
function attachWindow(marker, contents) {
  var infowindow = new google.maps.InfoWindow({
    content: contents
  });

  marker.addListener('click', function() {
    infowindow.open(marker.get('map'), marker);
  });
}

//bounce markers on click, end after 1.5sec
function toggleBounce(marker) {
	var self = this;
	if(self.getAnimation() !== null) {
		self.setAnimation(null);
	} else {
		self.setAnimation(google.maps.Animation.BOUNCE);
		setTimeout(function(){self.setAnimation(null); }, 1500);
	}
}

//run initialize function for google map on window load
google.maps.event.addDomListener(window, 'load', initialize);

//create empty data array, apply Knockout.js
var data = [];
var viewModel = {
	myPlaces: ko.observableArray(data),
	query: ko.observable(''),
	buttonClick: function() {
		console.log('clicked');
		var details = document.getElementById('details');
		details.style.display ='block';
	},
	search: function(value) {
		viewModel.myPlaces.removeAll();
		
		for(var x in myPlaces) {
			markers[x].setVisible(false);
			if(myPlaces[x].name.toLowerCase().indexOf(value.toLowerCase()) >= 0){
				viewModel.myPlaces.push(myPlaces[x]);
				markers[x].setVisible(true);
			}
		}
	}
};

$(document).ready(function() {
	ko.applyBindings(viewModel);
});
viewModel.query.subscribe(viewModel.search);

