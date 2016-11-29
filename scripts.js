var theRecipeURLs = [];
var counter = 0;
var index = 0; // for ensuring the getRecipe AJAX call happens in order


function setRecipeURL(){
	// setting the links to the recipes
	$("a.rig-cell").each(function(index){
		$(this).attr("href", theRecipeURLs[index]);
	});
}


// getting the link to the recipe
function getRecipe(IDs){
	var getURL = 'https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/';
	var recipeID = IDs[index] + '/information?includeNutrition=false';
	var getRecipeURL = getURL + recipeID;

	// if (i === index){
		// setting the link to the recipe
		$.ajax({
		    url: getRecipeURL,
		    type: 'GET',
		    dataType: 'json',
		    error: function(err) {
		    	console.log(err);
		    },
		    success: function get(data) {
		    	console.log((data));
		    	console.log(IDs[index]);

		    	// putting the URLs in the array
		    	var recipeURL = data.spoonacularSourceUrl;
		    	// console.log(recipeURL);
		    	theRecipeURLs.push(recipeURL);
		    	console.log(theRecipeURLs);

		    	index++;
		    	if (index < IDs.length){
		    		getRecipe(IDs);
		    	}
		    	// reset the index
				if (index === IDs.length){
					index = 0;
				}

		    	counter++;
		    	if (counter === 8){
		    		setRecipeURL();
		    		counter = 0;
		    	}
		    },	    
		    beforeSend: function(xhr) {
		    	xhr.setRequestHeader("X-Mashape-Authorization", "W4hzvJK9cgmshrPeTgNZP2ZeEw3np1GYKJNjsn6uhr4nJKJVyJ");
		    }
		});
	// }
		
}


// displaying the titles and images
function showOptions(titles, images, IDs){
	// setting the titles
	$("span.rig-text").each(function(index){
		$(this).html(titles[index]);
	});

	// setting the image URLs
	$("img.rig-img").each(function(index){
		$(this).attr("src", images[index]);
		$(this).attr("alt", titles[index]);
	});

	// getting the links to the recipes
	getRecipe(IDs);

	$("#rig").css("z-index", "101");
}


// searching for the API
function searchRecipe(searchTerms){
	var searchURL = 'https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/findByIngredients?fillIngredients=false&limitLicense=false&number=8&ranking=1&ingredients=';
	var searchRecipeURL = searchURL + searchTerms;

	// linking to the API
	$.ajax({
	    url: searchRecipeURL,
	    type: 'GET',
	    dataType: 'json',
	    error: function(err) {
	    	console.log(err);
	    },
	    success: function(data) {
	    	console.log((data));

	    	var titleArray = []; // to store the titles
	    	var imageArray = []; // to store the image URLs
	    	var idArray = []; // to store the ID of the recipes
	    	// storing the titles and images into arryas
	    	for (var i = 0; i < data.length; i++){
	    		titleArray[i] = data[i].title;
	    		imageArray[i] = data[i].image;
	    		idArray[i] = data[i].id;
	    	}
	    	// console.log(titleArray, imageArray);
	    	console.log(idArray);

	    	// displaying the titles and images
	    	showOptions(titleArray, imageArray, idArray);
	    },	    
	    beforeSend: function(xhr) {
	    	xhr.setRequestHeader("X-Mashape-Authorization", "W4hzvJK9cgmshrPeTgNZP2ZeEw3np1GYKJNjsn6uhr4nJKJVyJ");
	    }
	});
}




// When the search box expands, change the placeholder text
$("#input-field").focus(function() {
  $("#input-field").attr("placeholder", "apple, bacon, cheese...");
});

// When search box shrinks to normal, placeholder text resets to "Search.."
$("#input-field").blur(function() {
  $("#input-field").attr("placeholder", "Search..");
});


// when "enter" key is pressed, move search-box to the top, display images in grid layout
$('#input-field').keypress(function(event) {
	// console.log(event);
	// console.log(event.which);
	//check if enter was pressed
	if (event.which == 13) {
    	console.log("Enter was pressed!");

    	// clear stored recipe URLs
    	theRecipeURLs = [];

    	// display the unordered list of images
    	$("ul").css("display", "inherit");
	    
	    // move search-box to the top of the page
	    $(".search-box").animate({"top": "170px"}, 1000);

		$(".search-box").css({
			"height": "40px", 
			"display": "inline", 
			"background-color": "rgba(10, 10, 10, 0.9)"
		});
		$(".search-box h1").css({
			"font-size": "1.5em",
			"float": "left",
			"top": "50%",
			"margin-top": "6.5px"
		});
		$("#input-field").css({
			"position": "relative",
			"display": "inline", 
			"float": "left",
			"top": "-3px",
			"left": "10%",
			"margin-left": "-120px",
			"background-color": "rgba(10, 10, 10, 0.75)",
			"font-family": "primeFont, 'Covered By Your Grace', cursive, 'Dosis', sans-serif",
			"color": "white"
		});

		var inputValue = $('#input-field').val();
		inputValue.replace(/\s+/g, ''); // removes all whitespace
		inputValue.replace(',', '%2C'); // convert to URL format
	    searchRecipe(inputValue);
		
		$('head').append('<link rel="stylesheet" href="css/rig.css"/>');

		$("#input-field").val(""); // clearing input-field
		$("#input-field").blur(); // get focus off input-field
	}
});



// set cursor to input-field when page loads
$(document).ready(function(){
	$('#input-field').focus();
});