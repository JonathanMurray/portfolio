
function mod(n, m) {
	return ((m % n) + n) % n;
}

$(document).ready(setup);
$(document).keydown(keyHandler);

function setup(){
	var tab = getActiveTabFromUrl();
	setActiveTab(tab);
	$("nav a").click(navClick);
	setupChatbot();
}

function getActiveTabFromUrl(){
	var activeTab = window.location.hash.substring(1);
	if(activeTab){
		return activeTab;
	}
	return TABS[0] //DEFAULT
}

function navClick(event){
	var tabName = event.target.hash.substring(1); //Substring gets rid of first char '#'
	setActiveTab(tabName);
}

function setActiveTab(tabName){
	window.location.href = "#" + tabName;
	$(".active-link").removeClass("active-link");
	$("a[href='#" + tabName + "']").addClass("active-link");
	$(".active-tab").removeClass("active-tab");
	$("#" + tabName + "-tab").addClass("active-tab");
}

function keyHandler(event){
	var currentTab = getActiveTabFromUrl();
	var currentTabIndex = TABS.indexOf(currentTab);
	var indexChange = 0;
	if(event.keyCode == 37){ // left arrow
		indexChange = - 1;
	}else if(event.keyCode == 39){ // right arrow
		indexChange = 1;
	}
	if(indexChange != 0){
		var newTab = TABS[mod(TABS.length, currentTabIndex + indexChange)];
		setActiveTab(newTab);	
	}
}

function setupChatbot(){
	$("#send-chatbot-input").click(
		function(){
			sendChatbotInput($("#chatbot-input").val());
		});
}

function sendChatbotInput(input){
	console.log("senc chatbot input:" + input);	
	formattedInput = input.replace(" ", "+");
	$.ajax({
	  url: "http://localhost:5001/?input=" + formattedInput,
	  context: $("#chatbot-output")
	}).done(function(data) {
	  $( this ).html(data);
	});
}