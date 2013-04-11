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
//********************************     EDITMAP     *************************************
//**************************************************************************************

function EditMap(factory) {
	this.world = null;
	this.factory = factory;
	this.element = $("<div></div>").attr("id", "tabs-1").attr("class", "editMapPane");
	
	this.highlightedTiles = [];
	this.highlightedTile = null;
}
EditMap.prototype = new Pane();
EditMap.prototype.constructor = EditMap;

EditMap.prototype.setWorld = function(world) {
	this.world = world;
}

EditMap.prototype.updateHtml = function() {
	this.editMapTiles = this.createEditMapTiles();
	this.mapElement = this.createMapElement();



	this.element.html(this.world.getElement());
}






EditMap.prototype.setTile = function(x, y, tile) {
	// check if tile is different
	// change tile in world
	// find corresponding tile in html element
	// update to the tile element passed in
	// no need to set jquery event since it's the same element, just with different contents
}

EditMap.prototype.setTiles = function(tiles) {
	
}

EditMap.prototype.setSelectedTile = function(imageSource) {
	if (this.highlightedTile) {
		this.highlightedTile.setSprite(imageSource);
	}
}

EditMap.prototype.replaceHighlightedTiles = function(x, y) {
	var tileNames = rpgManager.editor.selectTiles.getSelectedTileNames();

	for (var i = 0; i < tileNames.length; i++) {
		for (var j = 0; j < tileNames[i].length; j++) {
			var sprite = this.factory.getTileByName(tileNames[i][j]).getSprite();
			this.editMapTiles[y+i][x+j].setSprite(sprite);
		}
	}
}

EditMap.prototype.highlightTile = function(x, y) {
	if (!rpgManager.editor.selectTiles.tilesAreSelected()) {
		return;
	}

	this.unhighlightTiles();
	var tileNames = rpgManager.editor.selectTiles.getSelectedTileNames();

	for (var i = 0; i < tileNames.length; i++) {
		for (var j = 0; j < tileNames[i].length; j++) {
			var sprite = this.factory.getTileByName(tileNames[i][j]).getSprite();
			this.editMapTiles[y+i][x+j].setHighlighted(sprite);
			this.highlightedTiles.push(this.editMapTiles[y+i][x+j]);
		}
	}

	/*var tile = Tile.factory(rpgManager.editor.selectedTile);
	if (tile) {
		this.editMapTiles[y][x].setHighlighted(tile.getSprite());
		this.highlightedTile = this.editMapTiles[y][x];
	}*/
}

EditMap.prototype.unhighlightTiles = function() {
	for (var i = 0; i < this.highlightedTiles.length; i++) {
		this.highlightedTiles[i].setUnhighlighted();
	}

	this.highlightedTiles = [];
}

EditMap.prototype.unhighlightTile = function(x, y) {
	for (var i = 0; i < this.highlightedTiles.length; i++) {
		this.highlightedTiles[i].setUnhighlighted();
	}

	this.editMapTiles[y][x].setUnhighlighted();
	this.highlightedTile = null;
}

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
	this.element = $("<div></div>").attr("id", x + "_" + y).addClass("tile test");
	// order they appear in html: sprite -> surface -> highlight
	this.sprite = $("<img />").attr("src", imageSource).attr("class", "tileSprite");
	this.element.html(this.sprite);
	this.surface = null;
	this.highlighted = false;
}

EditMapTile.prototype.setSprite = function(imageSource) {
	this.sprite.attr("src", imageSource);
	this.removeSurface();
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

EditMapTile.prototype.removeSurface = function() {
	// check if the surface is set
	if (this.surface) {
		this.surface.remove();
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
	this.element = $("<div></div>").attr("id", "tabs-2").html("<p>Morbi arcu.</p>");
}
SelectTerrains.prototype = new Pane();
SelectTerrains.prototype.constructor = SelectTerrains;



//**************************************************************************************
//********************************   SELECTTILES   *************************************
//**************************************************************************************

function SelectTiles(tileRowLength, factory) {
	this.element = $("<div></div>").attr("id", "tabs-1");
	this.tileRowLength = tileRowLength;
	this.factory = factory;
	this.tileGrid = new TileGrid(this, tileRowLength, factory);
}
SelectTiles.prototype = new Pane();
SelectTiles.prototype.constructor = SelectTiles;

SelectTiles.prototype.setStartSelect = function(tileName) {
	this.tileGrid.setStartSelect(tileName);
}

SelectTiles.prototype.setEndSelect = function(tileName) {
	this.tileGrid.setEndSelect(tileName);
}

SelectTiles.prototype.getSelectedTileNames = function() {
	return this.tileGrid.getSelectedTileNames();
}

SelectTiles.prototype.tilesAreSelected = function() {
	return this.tileGrid.tilesAreSelected();
}

SelectTiles.prototype.renderTiles = function() {
	this.element.html("");

	var tiles = this.tileGrid.getTileElements();
	for (var i = 0; i < tiles.length; i++) {
		this.element.append(tiles[i]);
	}
}



//**************************************************************************************
//******************************** SELECTCREATURES *************************************
//**************************************************************************************

function SelectCreatures() {
	this.element = $("<div></div>").attr("id", "tabs-4").html("<p>Moagsgee arcu.</p>");
}
SelectCreatures.prototype = new Pane();
SelectCreatures.prototype.constructor = SelectCreatures;



//**************************************************************************************
//*******************************  SELECTSURFACES  *************************************
//**************************************************************************************

function SelectSurfaces() {
	this.element = $("<div></div>").attr("id", "tabs-3").html("<p>Morge lhkppee.</p>");
}
SelectSurfaces.prototype = new Pane();
SelectSurfaces.prototype.constructor = SelectSurfaces;







//**************************************************************************************
//********************************    TILELIST     *************************************
//**************************************************************************************

function TileList() {
	this.tiles = [];
	this.selectedTile = -1;
}

TileList.prototype.addTile = function(tile) {
	var name = tile.getName();

	if (this.getTileIndex(name) == -1) {
		this.tiles.push(tile);
	} else {
		// error - tile with that name is already in list
		console.log("Tried to add a tile that's already in the list.");
	}	
}

TileList.prototype.addTiles = function(tiles) {
	for (var i = 0; i < tiles.length; i++) {
		var tile = tiles[i];
		this.addTile(tile);
	}
}

TileList.prototype.selectTile = function(tileName) {
	var index = this.getTileIndex(tileName);

	if (index != -1) {
		this.unhighlightTile(this.selectedTile);
		this.selectedTile = index;
		this.highlightTile(index);

	} else {
		// error - tilename isn't in list
		console.log("Tried to select a tile that's not in the list.");
	}
}

TileList.prototype.getTileIndex = function(tileName) {
	for (var i = 0; i < this.tiles.length; i++) {
		if (tileName == this.tiles[i].getName()) {
			return i;
		}
	}

	return -1;
}

TileList.prototype.unhighlightTile = function(index) {
	/*$.each(this.tiles, function(index, element){
		var name = '#' + element.name;
		$(name).css({"border-width": "0px"});
	});*/

}

TileList.prototype.highlightTile = function(index) {
	//$(name).css({"border-style": "solid", "border-width": "1px", "border-color": "orange"});
}




//**************************************************************************************
//********************************  TILELISTTILE   *************************************
//**************************************************************************************

function TileListTile(tile) {
	this.tile = tile;
	//this.htmlObject = $("<img />").attr("height", 10).attr("width", 10).html
}