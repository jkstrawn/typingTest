//**************************************************************************************
//********************************     MENUBAR     *************************************
//**************************************************************************************

function MenuBar() {
	this.element = $("<div></div>").attr("id", "menuBar");

	var button1 = $("<button></button>").html("Load Tiles").addClass("button").attr("onclick", "rpgManager.getEditor().loadTiles()");
	this.element.append(button1);

	this.dropDown = $("<select></select>");
	this.element.append(this.dropDown);

	var button2 = $("<button></button>").html("Load Map").addClass("button").attr("onclick", "rpgManager.getEditor().loadMap()");
	this.element.append();

	this.selectedMap = null;
	this.maps = [];


	// dropdown
	// default selected map



}
MenuBar.prototype = new Pane();
MenuBar.prototype.constructor = MenuBar;

MenuBar.prototype.getSelectedMapName = function() {
	return this.dropDown.val();
}

MenuBar.prototype.getSelectedMapData = function() {
	var name = this.dropDown.val();
	var coords = this.getMapSize(name);
	coords.name = name;

	return coords;
}

MenuBar.prototype.populateDropDown = function(data) {
	for (var i = 0; i < data.length; i++) {
		var option = $("<option></option>").attr("value", data[i].name).html(data[i].name + " - " + data[i].x + "x" + data[i].y);
		this.maps.push(data[i]);
		this.dropDown.append(option);
	}
}

MenuBar.prototype.addMapOption = function(data) {
	var option = $("<option></option>").attr("value", data.name).html(data.name + " - " + data.x + "x" + data.y);
	this.maps.push(data);
	this.dropDown.append(option);
}

MenuBar.prototype.getMapSize = function(mapName) {
	for (var i = 0; i < this.maps.length; i++) {
		if (this.maps[i] == mapName) {
			return {"x": this.maps[i].x, "y": this.maps[i].y};
		}
	}
	return null;
}