
var markers = [{
	"name": "Wolfbait & B-Girls",
	"type": "Shopping",
	"lat": 41.927880,
	"long": -87.706296,
	"summary": " From vintage-inspired pencil sharpeners to floral A-line skirts, there’s more than enough material to rummage for hours.",
	"url": "http://wolfbaitchicago.com/",
	"venueid": "4ba681e4f964a520285939e3"

},
{
	"name": "El Habanero",
	"type": "Bars & Restaurants",
	"lat": 41.925053,
	"long":-87.710989,
	"summary": "Try the papas con chorizo Pambazo. Trust me. Cash only!", 
	"url": "",
	"venueid":"531a8b7f498e75a62172a105"
},
{
	"name": "Owen & Engine",
	"type": "Bars & Restaurants",
	"lat": 41.930692,
	"long": -87.688105,
	"summary": "The beer geeks behind the bar know their stuff, from the cask-conditioned ales to the Euro-heavy bottle list; and the way the kitchen is executing food, it deserves its own coat of arms.",
	"url": "http://www.owenandengine.com/",
	"venueid":"4c86edce56e0370400adaea3"
},
{
	"name": "The Logan Theater",
	"type": "Entertainment",
	"lat":41.929969,
	"long": -87.708925,
	"summary":"The Logan Theatre opened in 1915 as the Paramount Theatre, a single-screen cinema. In 1922, it was taken over by the Vaselopolis family, as several waves of new ethnic groups reshaped Logan Square as their home, the Logan Theatre remained a family-owned business committed to serving the diverse families of the community.",
	"url": "http://www.thelogantheatre.com/",
	"venueid":"4b4bdde3f964a52006aa26e3"
},
{
	"name": "Logan Arcade",
	"type": "Entertainment",
	"lat": 41.925396,
	"long": -87.688260,
	"summary": " Inside, you'll find a fully stocked bar and a blinking, beeping menagerie of lovingly restored arcade games.",
	"url": "http://loganarcade.com/",
	"venueid":"53015818498ee35b40b8892b"
},
{
	"name": "The Burlington",
	"type": "Bars & Restaurants",
	"lat": 41.924696,
	"long": -87.713212,
	"summary": "This Logan Square bar has everything you could ask for—just don’t ask for too much. The spare, dim room has plenty of hipster atmosphere (but no hipster snobbery); ample seating at the full bar; delicious beers on tap; and occasional DJ sets from local and touring musicians.",
	"url": "http://www.theburlingtonbar.com/",
	"venueid":"4b12d1b2f964a520be8e23e3"
},
{
	"name": "Palmer Square Park",
	"type": "Entertainment",
	"lat": 41.921310,
	"long": -87.704786,
	"summary": "Named for the 15th Governor of Illinois, John McAuley Palmer, this seven-acre park located between Logan Square and Humboldt Park dates back to the creation of the boulevard system in the 1870s.",
	"url": "http://www.chicagoparkdistrict.com/parks/palmer-square-park/",
	"venueid":"4bb2879814cfd13a731415ab"
}];

var map;
function initialize() {
	var mapCanvas = document.getElementById('map');
		var mapOptions = {
 		center: new google.maps.LatLng(41.924707, -87.700333),
  		zoom: 14,
  		mapTypeId: google.maps.MapTypeId.ROADMAP
		};
	map = new google.maps.Map(mapCanvas, mapOptions);
}

$.each(markers, function(place, value) {
	place = new google.maps.Marker({
		position: {lat: value.lat, lng:value.long},
		map: map,
		title: value.name,
		animation: google.maps.Animation.DROP
	}); //end marker

});

var fourSquareLikes = ko.observableArray();
var fourSquareRating = ko.observableArray();
for( i=0; i <markers.length; i++) {
var foursquareUrl = "https://api.foursquare.com/v2/venues/" + markers[i].venueid + '?client_id=0J2DPJP1QTTH5Q5URVIY1BZOTVS5F01A3A41GW4NDHOJCCDH&client_secret=5RBWCXTH5414FN21DBJY1PIFM2TN3GAWRZ4WIWVRZRY1ZI1T&v=20151110';

//api call to foursquare
//include likes/rating in list view; open when clicked
$.ajax({
	url: foursquareUrl,
	dataType: "json",
	success: function(data){
		var result = data.response.venue;
		var rating = result.rating;
		fourSquareRating.push(rating);
		var likes = result.likes.count;
		var like = likes.toString();
		// fourSquarePhotos.push(photo);
		fourSquareLikes.push(like);
		console.log(fourSquareLikes());
		console.log(fourSquareRating());
	},
	error: function(){
	console.log('error');
	}
});
}
//bounce markers on click, end after 1.5sec
var toggleBounce = function(marker) {
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
	

};
// $(document).ready(function() {
// ko.applyBindings(new ViewModel());
// });
