
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview

    var $street = $('#street').val();
    console.log($street);
    var $city = $('#city').val();
    // YOUR CODE GOES HERE!
    $('#submit-btn').click(function(){
        $body.append('<img class="bgimg">');
        $('img').attr('src', "http://maps.googleapis.com/maps/api/streetview?size=600x400&location=" + $street + ', ' + $city); 
        console.log('added');
    });

    var nytimesUrl = 'http://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + $city + '&sort=newest&api-key=63f03140055613a8d89b96a09bdddffd:19:64206113';

    $.ajax({
      'type': 'GET',
      'url': nytimesUrl,
      'success': function(data, textStats, XMLHttpRequest) {
        articles = data.response.docs
            for(var i=0; i<articles.length; i++){
                var article = articles[i];
                var headline = article.headline.main;
                var p = article.lead_paragraph;
                var url = article.web_url;
                $nytElem.append('<li>'+'<a href="'+url+'">'+headline+'</a></li>');
            }
        }
        
    }).fail(function(){
            $('#nytimes-articles').text('Uh oh. Something got confused.');
        });

    return false;
};

$('#form-container').submit(loadData);

// loadData();
