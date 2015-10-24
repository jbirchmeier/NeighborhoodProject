

//load neighborhood data
var data = [];
var viewModel = {
	places: ko.observableArray(data)
};
$(document).ready(function() {
	ko.applyBindings(viewModel);
});

$.getJSON("js/neighborhood.json", function(data) { 
	viewModel.places(data);
	console.log(data);
}).fail(function() {console.log('error')})



function initialize() {
			var mapCanvas = document.getElementById('map');
       		var mapOptions = {
         		center: new google.maps.LatLng(41.924707, -87.700333),
          		zoom: 15,
          		mapTypeId: google.maps.MapTypeId.ROADMAP
        		}
        	var map = new google.maps.Map(mapCanvas, mapOptions)
      	}
      	google.maps.event.addDomListener(window, 'load', initialize);