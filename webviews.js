document.addEventListener("DOMContentLoaded", function(event) { 
	
	// This will run when the FB SDK is loaded
	window.extAsyncInit = function() {

		// Populate our screen with recipes upon first loading the page
	  ext.loadDefaultRecipes();

	  document.getElementById("search-input").disabled = false;
	  document.getElementById("search-form").onsubmit = function(e){
			e.preventDefault();

			var search_term = document.getElementById("search-input").value
			ext.search(search_term);

			// Deselect the input field, which hides keyboard in mobile
			document.getElementById("search-input").blur();
		};
	};

	// FOR TESTING in browser:
	ext.loadDefaultRecipes();

  document.getElementById("search-input").disabled = false;
  document.getElementById("search-form").onsubmit = function(e){
		e.preventDefault();
		var search_term = document.getElementById("search-input").value
		ext.search(search_term);
		document.getElementById("search-input").blur();
	};

});

var ext = {

	loadDefaultRecipes: function() {
		document.getElementById("title-container").innerHTML = "All Recipes";
  	for(var key in ext.recipe_data){
  		var recipe = ext.buildRecipeCard(ext.recipe_data[key])
  		document.getElementById("results-container").appendChild(recipe)
  	}
	},

	search: function(query) {
		ext.resetDom();
		if(query.length > 0) {
	  	document.getElementById("title-container").innerHTML = 'Search results for "' + query + '"';
	  	for(var key in ext.recipe_data){
	  		var query = query.toLowerCase()
	  		if(ext.recipe_data[key]["name"].toLowerCase().indexOf(query) > -1 ){
	  			var recipe = ext.buildRecipeCard(ext.recipe_data[key])
	  			document.getElementById("results-container").appendChild(recipe)
	  		}
	  	}
	  } else {
	  	ext.loadDefaultRecipes();
	  }
	},

	resetDom: function () {
		document.getElementById("title-container").innerHTML = "";
		document.getElementById("results-container").innerHTML = "";
		document.getElementById("notification-container").innerHTML = "";
	},

	notify: function(message, type) {
		document.getElementById('notification-container').classList.remove('closed')
		var timeout = 3000;
		if(type === "success"){
			document.getElementById("notification-container").innerHTML = "<div class='success-notification'>"
				+ message
				+ "</div>"
		} else {
			document.getElementById("notification-container").innerHTML = "<div class='error-notification'>"
				+ message
				+ "</div>"
			var timeout = 10000;
		}

		setTimeout(function(){
			document.getElementById('notification-container').classList.add('closed')
		}, timeout);
	},

	recipeSelect: function (dom) {
		var recipe = ext.recipe_data[dom.dataset.recipeId];

		var message_to_share = {
      "attachment":{
         "type":"template",
         "payload":{
             "template_type":"generic",
             "elements": [{
                 "title": recipe["name"],
                 "image_url": recipe["image"],
                 "subtitle": "By " + recipe["chef"],
                 "default_action":{
                     "type":"web_url",
                     "url": recipe["url"]
                 },
                 "buttons":[
                 		{
											"type":"web_url",
											"url": recipe["url"],
											"title":"Get Recipe",
											"webview_height_ratio": "full"
                  	}
                  ]
             }]
         }
      }
    };
    console.log(message_to_share);
    ext.notify("Shared!", "success");
    
    MessengerExtensions.beginShareFlow(function success(response) {
    	if(response["is_sent"] === true || response["is_sent"] === "true"){
    		ext.notify("Shared!", "success");
    	}

	  }, function error(errorCode, errorMessage) {
	    ext.notify(errorCode + ": " + errorMessage + " [from recipeSelect]", "error");
	  }, message_to_share, "current_thread");
	  
	},

	buildRecipeCard: function(json) {
		var inner_html =
		"<div class='recipe-card-inner-box' onclick='ext.recipeSelect(this)' data-recipe-id='" + json["id"] + "' >"
			+ "<div class='img-container'>"
				+ "<img src='" + json["image"] + "'>"
			+ "</div>"
			+ "<div class='txt-container'>"
				+ "<div class='name'>" + json["name"] + "</div>"
				+ "<div class='talent-name'>By " + json["chef"] + "</div>"
				+ "<img class='send-blue' src='https://s3.amazonaws.com/messenger-code-assets.fott.snidigital/ic_send_lg_blue@3x.png' >"
			+ "</div>"
		+ "</div>"
		var div = document.createElement('div');
		div.className = "recipe-card"
		div.innerHTML = inner_html;
		return div
	},

	recipe_data: {
		 "1": {
		 		"id": "1",
			 	"name": "Asian Grilled Salmon",
			  "image": "http://food.fnr.sndimg.com/content/dam/images/food/fullset/2011/5/27/0/IG0505_Asian-Grilled-Salmon_s4x3.jpg",
			  "chef": "Ina Garten",
			  "url": "http://www.foodnetwork.com/recipes/ina-garten/asian-grilled-salmon-recipe-1944413.html"},
		 "2": {
		 		"id": "2",
			 	"name": "Chicken Parmesan",
			  "image": "http://food.fnr.sndimg.com/content/dam/images/food/fullset/2008/10/28/0/top10_chickenparmesan_s4x3.jpg",
			  "chef": "Tyler Florence",
			  "url": "http://www.foodnetwork.com/recipes/tyler-florence/chicken-parmesan-recipe-1951852.html"},
		 "3": {
		 		"id": "3",
			 	"name": "Mac and Cheese",
			  "image": "http://food.fnr.sndimg.com/content/dam/images/food/fullset/2014/6/5/1/IG1B07F_Mac-and-Cheese_s4x3.jpg",
			  "chef": "Ina Garten",
			  "url": "http://www.foodnetwork.com/recipes/ina-garten/mac-and-cheese-recipe2-1945401.html"},
		 "4": {
		 		"id": "4",
			 	"name": "Macaroni and Cheese",
			  "image": "http://food.fnr.sndimg.com/content/dam/images/food/fullset/2011/11/14/0/WU-0103_mac-and-cheese_s4x3.jpg",
			  "chef": "Ree Drummond",
			  "url": "http://www.foodnetwork.com/recipes/ree-drummond/macaroni-and-cheese-recipe-1952854.html"},
		 "5": {
		 		"id": "5",
			 	"name": "Chicken Pot Pie",
			  "image": "http://food.fnr.sndimg.com/content/dam/images/food/fullset/2009/6/12/0/IG0604H_33099_s4x3.jpg",
			  "chef": "Ina Garten",
			  "url": "http://www.foodnetwork.com/recipes/ina-garten/chicken-pot-pie-recipe-2014304.html"},
		 "6": {
		 		"id": "6",
			 	"name": "Chicken Cacciatore",
			  "image": "http://food.fnr.sndimg.com/content/dam/images/food/fullset/2010/12/10/0/EI1D10_chicken-cacciatore_s4x3.jpg",
			  "chef": "Giada De Laurentiis",
			  "url": "http://www.foodnetwork.com/recipes/giada-de-laurentiis/chicken-cacciatore-recipe-1943042.html"},
		 "7": {
		 		"id": "7",
			 	"name": "The Best Cauliflower Ever",
			  "image": "http://food.fnr.sndimg.com/content/dam/images/food/fullset/2015/2/25/0/DH0103H_Best-Cauliflower-Ever_s4x3.jpg",
			  "chef": "Daphne Brogdon",
			  "url": "http://www.foodnetwork.com/recipes/daphne-brogdon/the-best-cauliflower-ever-2687885.html"},
		 "8": {
		 		"id": "8",
			 	"name": "Salisbury Steak",
			  "image": "http://food.fnr.sndimg.com/content/dam/images/food/fullset/2012/11/19/1/WU0313H_salisbury-steak-recipe_s4x3.jpg",
			  "chef": "Ree Drummond",
			  "url": "http://www.foodnetwork.com/recipes/ree-drummond/salisbury-steak-recipe-2126533.html"},
		 "9": {
		 		"id": "9",
			 	"name": "No-Bake Chocolate-Pretzel-Peanut Butter Squares",
			  "image": 
			   "http://food.fnr.sndimg.com/content/dam/images/food/fullset/2014/3/11/0/YW0407_No-Bake-Chocolate-Pretzel-Peanut-Butter-Squares_s4x3.jpg",
			  "chef": "Trisha Yearwood",
		  "url": "http://www.foodnetwork.com/recipes/trisha-yearwood/no-bake-chocolate-pretzel-peanut-butter-squares-2254342.html"},
		 "10": {
		 		"id": "10",
				"name": "Blackberry Cobbler",
			  "image": "http://food.fnr.sndimg.com/content/dam/images/food/fullset/2011/11/14/0/WU-0105_dessert-plate_s4x3.jpg",
			  "chef": "Ree Drummond",
			  "url": "http://www.foodnetwork.com/recipes/ree-drummond/blackberry-cobbler-recipe-1925731.html"}
		}
}
