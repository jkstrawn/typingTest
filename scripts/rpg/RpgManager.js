//**************************************************************************************
//********************************   RPGMANAGER    *************************************
//**************************************************************************************

function RpgManager() {
	
	this.zones = [];
	this.zone = "";
	this.character = "";
	this.world = new World();
	this.menu = new Menu();
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
	alert("test");
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