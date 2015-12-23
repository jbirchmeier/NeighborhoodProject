//my list of places...please add your favorite Logan Square establishment with foursquare venueid!
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
	"summary": "This Logan Square bar has everything you could ask for, just don’t ask for too much. The spare, dim room has plenty of hipster atmosphere (but no hipster snobbery); ample seating at the full bar; delicious beers on tap; and occasional DJ sets from local and touring musicians.",
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

//create google map and apply knockout bindings
var map;
function initialize() {
	var mapCanvas = document.getElementById('map');
		var mapOptions = {
 		center: new google.maps.LatLng(41.925061, -87.710989),
  		zoom: 14,
  		disableDefaultUI: true,
  		mapTypeId: google.maps.MapTypeId.ROADMAP
		};
	map = new google.maps.Map(mapCanvas, mapOptions);

	ko.applyBindings(new ViewModel());
}


//bounce markers on click, end after 3.5sec
var toggleBounce = function(marker) {
	var self = this;
	if(self.getAnimation() !== null) {
		self.setAnimation(null);
	} else {
		self.setAnimation(google.maps.Animation.BOUNCE);
		setTimeout(function(){self.setAnimation(null); }, 3500);
	}
};



//run initialize function for google map on window load
google.maps.event.addDomListener(window, 'load', initialize);

//create Place class
function Place(data) {
	this.name = ko.observable(data.name);
	this.summary = ko.observable(data.summary);
	this.type = ko.observable(data.type);
	this.url = ko.observable(data.url);
	this.lat = ko.observable(data.lat);
	this.long = ko.observable(data.long);
	this.venueid = ko.observable(data.venueid);
	this.likes = ko.observable('');
	this.rating = ko.observable('');
	this.marker = ko.observable();
}

//viewModel - all items that are part of the app's UI
function ViewModel() {
	"use strict";
	var self = this;
	//create observable array of all my places to use with knockout features
	this.places = ko.observableArray([]);

	//for every marker object, add new place based on Place class
	markers.forEach(function (place) {
		self.places.push(new Place(place));
	});
	//establish infowindows
	var infowindow = new google.maps.InfoWindow({
		maxWidth: 200, 
		zIndex: 200
	});

	var marker;

	//create map markers, call foursquare api, 
	self.places().forEach(function(place){

		marker = new google.maps.Marker({
			position: {lat: place.lat(), lng:place.long()},
			map: map,
			title: place.name(),
			animation: google.maps.Animation.DROP
		}); 
		place.marker = marker;
 		// Make AJAX request to Foursquare
        $.ajax({
            url: "https://api.foursquare.com/v2/venues/" + place.venueid() + '?client_id=0J2DPJP1QTTH5Q5URVIY1BZOTVS5F01A3A41GW4NDHOJCCDH&client_secret=5RBWCXTH5414FN21DBJY1PIFM2TN3GAWRZ4WIWVRZRY1ZI1T&v=20151110',
            dataType: "json",
            success: function (data) {
            	//store results to make displaying easier
                var result = data.response.venue;

                //verify that foursquare property exists; credit "https://discussions.udacity.com/t/foursquare-results-undefined-until-the-second-click-on-infowindow/39673/12"
                var likes = result.hasOwnProperty('likes') ? result.likes : '';
                place.likes(likes.count || '');

                var rating = result.hasOwnProperty('rating') ? result.rating : '';
                place.rating(rating || '');

                // Infowindow code is in the success function so that the error message
                // displayed in infowindow works properly
                // found at: https://discussions.udacity.com/t/trouble-with-infowindows-and-contentstring/39853/14

                // set infowindow content
                var contentString = '<div>'+ place.type() + '</div>' + '<div>'+ place.summary() + '</div>' + '<div><a href='+ place.url() + '>' + place.url() + '</a></div>' + '<div>Likes: ' + place.likes() + '</div><div>Rating: ' + place.rating() + '</div>';
                
                // Add infowindows to markers
                google.maps.event.addListener(place.marker, 'click', function () {
                    infowindow.open(map, this);
                    place.marker.setAnimation(google.maps.Animation.BOUNCE);
                    setTimeout(function () {
                        place.marker.setAnimation(null);
                    }, 500);
                    infowindow.setContent(contentString);
                });
            },
            // Alert the user on error. Set messages in the DOM and infowindow
            error: function (e) {
                infowindow.setContent('<h5>Foursquare data is unavailable. Please try refreshing later.</h5>');
                document.getElementById("error").innerHTML = "<h4>Foursquare data is unavailable. Please try refreshing later.</h4>";
            }
        });

        // make the error message on AJAX error display in the infowindow
        google.maps.event.addListener(marker, 'click', function () {
            infowindow.open(map, this);
            place.marker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function () {
                place.marker.setAnimation(null);
            }, 3500);
        });
    });
    
    // Activate the appropriate marker when the user clicks a list item
    self.showInfo = function (place) {
        google.maps.event.trigger(place.marker, 'click');
    };

    self.input = ko.observable('');
    self.visiblePlaces = ko.observableArray();
    self.places().forEach(function (place) {
    	self.visiblePlaces.push(place);
    });


    //function to filter list and markers
    self.search = function() {
		self.visiblePlaces.removeAll();

		self.places().forEach(function (place){
			place.marker.setVisible(false);
			infowindow.close();
			if(place.name().toLowerCase().indexOf(self.input().toLowerCase()) >= 0){
				self.visiblePlaces.push(place);
				place.marker.setVisible(true);
			}
		});

		self.visiblePlaces().forEach(function(place) {
			place.marker.setVisible(true);
		})	;
	};

	(function($){
    	$('.menu-btn').click(function(){
    	     $('.responsive-menu').toggleClass('expand');
    	});
    })(jQuery);

}





