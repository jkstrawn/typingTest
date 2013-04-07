//**************************************************************************************
//********************************   RPGMANAGER    *************************************
//**************************************************************************************

function RpgManager() {
	
	this.zones = [];
	this.zone = "";
	this.character = "";
	this.world = new World(20, 20, true);
	this.menu = new Menu();
	this.editor = new Editor();
	this.encounter = null;
	this.state = "menu";
	
	

	// all the zones
	this.zones["plains"] = new Plains();
}

RpgManager.prototype.initialize = function() {
	$('body').css({"background-image": "url('img/home.png')"});

	this.menu.displayActions();
}

RpgManager.prototype.sendKey = function(event) {
	if (this.state == "menu") {
		this.menu.receiveKey(event.keyCode);
		return false;
	} else if (this.state == "world") {
		this.world.receiveKey(event.keyCode);
		return false;
	} else if (this.state == "encounter") {
		if (this.encounter == null) {
			// error
		} else {
			this.encounter.receiveKey(event.keyCode);
		}
		return false;
	} else if (this.state == "editor") {
		this.editor.receiveKey(event.keyCode);
		return false;
	}
}

RpgManager.prototype.sendKeyDown = function(event) {
	if (this.state == "menu") {
		return false;
	} else if (this.state == "world") {
		return false;
	} else if (this.state == "encounter") {
		return false;
	} else if (this.state == "editor") {
		this.editor.receiveKeyDown(event);
		return false;
	}
}

RpgManager.prototype.sendKeyUp = function(event) {
	if (this.state == "menu") {
		return false;
	} else if (this.state == "world") {
		return false;
	} else if (this.state == "encounter") {
		return false;
	} else if (this.state == "editor") {
		this.editor.receiveKeyUp(event);
		return false;
	}
}

RpgManager.prototype.sendMouseUp = function(event) {
	if (this.state == "menu") {

	} else if (this.state == "world") {
		
	} else if (this.state == "encounter") {
		
	} else if (this.state == "editor") {
		this.editor.receiveMouseUp(event);
	}
}

RpgManager.prototype.goToMap = function() {
	//$('body').css({"background-image": "url('img/map.png')"});
	$('body').css({"background-image": "none"});

	//var html = "<div id='map'><img src='img/plains-icon.png' onclick=\"rpgManager.setZone('plains')\" /></div>";
	//$('body').html(html);
	this.state = "world";
	this.world.draw();
}

RpgManager.prototype.test = function() {
	$.getJSON( "services/test.php")
		.done(function( json ) {
			var data = "";
			/*$.each(json, function(index, element){
				data += element + ", ";
			});*/
			console.log( "JSON Data: " + json );
		})
		.fail(function( jqxhr, textStatus, error ) {
			var err = textStatus + ', ' + error;
			console.log( "Request Failed: " + err);
	});
}

RpgManager.prototype.test2 = function() {
	$.getJSON( "services/test2.php")
		.done(function( json ) {
			console.log( "JSON Data: " + json.a );
		})
		.fail(function( jqxhr, textStatus, error ) {
			var err = textStatus + ', ' + error;
			console.log( "Request Failed: " + err);
	});
}

RpgManager.prototype.setEncounter = function(location) {
	this.state = "encounter";

	this.encounter = new Encounter(location);
	this.encounter.draw();
	
}

RpgManager.prototype.clearEncounter = function() {
	this.encounter = null;
	this.state = "world";
	this.world.draw();
}

RpgManager.prototype.goToEditor = function() {
	$('body').css({"background-image": "none"});

	this.state = "editor";
	this.editor.draw();
}