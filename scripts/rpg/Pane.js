//**************************************************************************************
//********************************      PANE       *************************************
//**************************************************************************************

function Pane() {
	this.element = null;
}

Pane.prototype.getHtml = function() {
	//var temp = $("<div></div>").html(this.element);
	//return temp.html();
	return this.element;
}




//**************************************************************************************
//********************************     MENUBAR     *************************************
//**************************************************************************************

function MenuBar() {
	var html = "<div id='menu'>";
	html += "<button style='margin:3px'>Button</button>";
	html += "<button style='margin:6px'>Button</button>";
	html += "<button style='margin:3px'>Button</button>";
	html += "<button style='margin:3px'>Button</button>";
	html += "</div>";

	this.element = $("<div></div>").attr("id", "menuBar").html(html);
}
MenuBar.prototype = new Pane();
MenuBar.prototype.constructor = MenuBar;





//**************************************************************************************
//********************************     EDITMAP     *************************************
//**************************************************************************************

function EditMap(world) {
	this.world = world;
	this.element = $("<div></div>").attr("id", "tabs-1").attr("class", "editMapPane");
	//this.tileElements = this.createTileElements();
	this.editMapTiles = this.createEditMapTiles();
	this.mapElement = this.createMapElement();
	
	this.element.html(this.mapElement);
}
EditMap.prototype = new Pane();
EditMap.prototype.constructor = EditMap;

EditMap.prototype.setTile = function(x, y, tile) {
	// check if tile is different
	// change tile in world
	// find corresponding tile in html element
	// update to the tile element passed in
	// no need to set jquery event since it's the same element, just with different contents
}

EditMap.prototype.highlightTile = function(x, y) {
	var tile = Tile.factory(rpgManager.editor.selectedTile);
	if (tile) {
		this.editMapTiles[y][x].setHighlighted(tile.getSprite());
	}
}

EditMap.prototype.unhighlightTile = function(x, y) {
	this.editMapTiles[y][x].setUnhighlighted();
}

/*EditMap.prototype.createTileElements = function() {
	var tiles = this.world.getAllTiles();
	var tileElements = createArray(tiles.length, tiles[0].length);

	for (var i = 0; i < tileElements.length; i++) {
		for (var j = 0; j < tileElements[i].length; j++) {
			var tileElement = $("<div></div>").attr("id", j + "_" + i).attr("class", "tile");
			var tileImage = $("<img />").attr("src", tiles[i][j].getSprite());
			tileElement.html(tileImage);
			tileElements[i][j] = tileElement;
		}
	}

	return tileElements;
}*/

EditMap.prototype.createEditMapTiles = function() {
	var tiles = this.world.getAllTiles();
	var editMapTiles = createArray(tiles.length, tiles[0].length);

	for (var i = 0; i < editMapTiles.length; i++) {
		for (var j = 0; j < editMapTiles[i].length; j++) {
			//var tileElement = $("<div></div>").attr("id", j + "_" + i).attr("class", "tile");
			var editMapTile = new EditMapTile(j, i, tiles[i][j].getSprite());
			//var tileImage = $("<img />").attr("src", tiles[i][j].getSprite());
			//tileElement.html(tileImage);
			editMapTiles[i][j] = editMapTile;
		}
	}

	return editMapTiles;
}

EditMap.prototype.createMapElement = function() {
	var mapElement = $("<div></div>").attr("id", "editMap");
	//var html = "";

	for (var i = 0; i < this.editMapTiles.length; i++) {
		var div = $("<div></div>").attr("class", "row");
		//html += "<div>"
		for (var j = 0; j < this.editMapTiles[i].length; j++) {
			//html += this.tileElements[i][j].html();
			div.append(this.editMapTiles[i][j].getElement());
		}
		//html += "</div>";
		mapElement.append(div);
	}

	//mapElement.html(html);
	return mapElement;
}


//*
//*   EDITMAPTILE
//**************************************************************************************

function EditMapTile(x, y, imageSource) {
	this.element = $("<div></div>").attr("id", x + "_" + y).attr("class", "tile");
	// order they appear in html: sprite -> surface -> highlight
	this.sprite = $("<img />").attr("src", imageSource).attr("class", "tileSprite");
	this.element.html(this.sprite);
	this.surface = null;
	this.highlighted = false;
}

EditMapTile.prototype.setSprite = function(imageSource) {
	this.sprite.attr("src", imageSource);
}

EditMapTile.prototype.setSurface = function(imageSource) {
	// check if the surface is set
	if (this.surface) {
		this.surface.attr("src", imageSource);
	} else {
		this.surface = $("<img />").attr("src", imageSource).attr("class", "tileSurface");
		this.sprite.after(this.surface);
	}
}

EditMapTile.prototype.setHighlighted = function(imageSource) {
	// check if it's already highlighted
	if (!this.highlighted) {
		this.highlighted = true;
		var highlight = $("<img />").attr("src", imageSource).attr("class", "tileHighlight");
		this.element.append(highlight);
	}
}

EditMapTile.prototype.setUnhighlighted = function() {
	if (this.highlighted) {
		this.element.find(".tileHighlight").remove();
		this.highlighted = false;
	}
}

EditMapTile.prototype.getElement = function() {
	return this.element;
}



//**************************************************************************************
//********************************  EDITTERRAINS   *************************************
//**************************************************************************************

function EditTerrains() {
	this.element = $("<div></div>").attr("id", "tabs-3").html("<p>Mauris eleifend est et turpis.</p>");
}
EditTerrains.prototype = new Pane();
EditTerrains.prototype.constructor = EditTerrains;



//**************************************************************************************
//********************************    EDITTILES    *************************************
//**************************************************************************************

function EditTiles() {
	this.element = $("<div></div>").attr("id", "tabs-2").html("<p>Morbi tincidunt.</p>");
}
EditTiles.prototype = new Pane();
EditTiles.prototype.constructor = EditTiles;



//**************************************************************************************
//********************************  EDITCREATURES  *************************************
//**************************************************************************************

function EditCreatures() {
	this.element = $("<div></div>").attr("id", "tabs-5").html("<p>eleifend est et.</p>");
}
EditCreatures.prototype = new Pane();
EditCreatures.prototype.constructor = EditCreatures;



//**************************************************************************************
//********************************   EDITSURFACES  *************************************
//**************************************************************************************

function EditSurfaces() {
	this.element = $("<div></div>").attr("id", "tabs-4").html("<p>Duis cursus.</p>");
}
EditSurfaces.prototype = new Pane();
EditSurfaces.prototype.constructor = EditSurfaces;



//**************************************************************************************
//*******************************  SELECTTERRAINS  *************************************
//**************************************************************************************

function SelectTerrains() {

}
SelectTerrains.prototype = new Pane();
SelectTerrains.prototype.constructor = SelectTerrains;



//**************************************************************************************
//********************************   SELECTTILES   *************************************
//**************************************************************************************

function SelectTiles() {

}
SelectTiles.prototype = new Pane();
SelectTiles.prototype.constructor = SelectTiles;



//**************************************************************************************
//******************************** SELECTCREATURES *************************************
//**************************************************************************************

function SelectCreatures() {

}
SelectCreatures.prototype = new Pane();
SelectCreatures.prototype.constructor = SelectCreatures;



//**************************************************************************************
//*******************************  SELECTSURFACES  *************************************
//**************************************************************************************

function SelectSurfaces() {

}
SelectSurfaces.prototype = new Pane();
SelectSurfaces.prototype.constructor = SelectSurfaces;