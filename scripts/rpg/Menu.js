//**************************************************************************************
//********************************      MENU       *************************************
//**************************************************************************************

function Menu() {
	this.buttons = [];

	// buttons on the home screen
	this.buttons.push("<button class='action' type='button' onclick='rpgManager.goToMap()'> View Map </button>");
	this.buttons.push("<button class='action' type='button' onclick='rpgManager.test()'> test </button>");
}

Menu.prototype.receiveKey = function(key) {
	var typedLetter = String.fromCharCode(key);
}

Menu.prototype.displayActions = function() {
	var html = "<div id='actions'>";

	$.each(this.buttons, function(index, element) {
		html += element + "<br />";
	});

	html += "</div>";
	$('body').html(html);
}