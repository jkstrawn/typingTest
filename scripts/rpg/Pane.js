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

function EditMap(world, factory) {
	this.world = world;
	this.factory = factory;
	this.element = $("<div></div>").attr("id", "tabs-1").attr("class", "editMapPane");
	this.editMapTiles = this.createEditMapTiles();
	this.mapElement = this.createMapElement();
	this.highlightedTile = null;
	this.highlightedTiles = [];
	
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
	this.tileGrid = new TileGrid(tileRowLength, factory);

	var tiles = this.tileGrid.getTileElements();
	for (var i = 0; i < tiles.length; i++) {
		this.element.append(tiles[i]);
	}

	/*var tiles = world.getTiles();
	for (var i = 0; i < tiles.length; i++) {
		var tile = tiles[i];
		var onclick = "rpgManager.editor.setSelectedTile('" + tile.name + "')";
		var tileElement = $("<div></div>").attr("id", tile.name).css("float", "left").attr("onclick", onclick);
		tileElement.append(tile.getHtml());
		this.element.append(tileElement);
	}*/
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




//**************************************************************************************
//********************************    TILEGRID     *************************************
//**************************************************************************************

function TileGrid(tileRowLength, factory) {
	this.tileRowLength = tileRowLength;
	this.factory = factory;
	this.tiles = [];
	this.startSelectX = -1;
	this.startSelectY = -1;
	this.endSelectX = -1;
	this.endSelectY = -1;

	// fill the grid with all the tiles from the factory
	var tiles = factory.getTiles();
	for (var i = 0; i < tiles.length; i++) {
		var k = i % tileRowLength;
		var j = i - k;
		if (k == 0) {
			this.tiles[j] = [];
		}
		this.tiles[j][k] = new TileGridTile(tiles[i]);
	}
}

/*TileGrid.prototype.setStartSelect = function(x, y) {
	this.startSelectX = x;
	this.startSelectY = y;
}*/

TileGrid.prototype.setStartSelect = function(tileName) {
	var coords = this.getCoordsOfTile(tileName);

	this.startSelectX = coords.x;
	this.startSelectY = coords.y;

	this.endSelectX = -1;
	this.endSelectY = -1;

	this.highlightSelectedTiles();
}

/*TileGrid.prototype.setEndSelect = function(x, y) {
	// check to make sure the endpoint is after the startpoint
	if (x < this.startSelectX || y < this.startSelectY) {
		// don't change the selection endpoint
	} else {
		this.endSelectX = x;
		this.endSelectY = y;
	}
}*/

TileGrid.prototype.setEndSelect = function(tileName) {
	var coords = this.getCoordsOfTile(tileName);

	// check to make sure the endpoint is after the startpoint
	if (coords.x < this.startSelectX || coords.y < this.startSelectY) {
		// don't change the selection endpoint
	} else {
		this.endSelectX = coords.x;
		this.endSelectY = coords.y;
	}

	this.highlightSelectedTiles();
}

TileGrid.prototype.getCoordsOfTile = function(tileName) {
	for (var i = 0; i < this.tiles.length; i++) {
		for (var j = 0; j < this.tiles[i].length; j++) {
			var tile = this.tiles[i][j];
			if (tile) {
				if (tile.getName() == tileName) {
					return {"x": j, "y": i};
				}
			}
		}
	}
}

TileGrid.prototype.highlightSelectedTiles = function() {
	for (var i = 0; i < this.tiles.length; i++) {
		for (var j = 0; j < this.tiles[i].length; j++) {
			var tile = this.tiles[i][j];
			if (tile) {
				tile.setUnhighlighted();
			}
		}
	}

	// check to see if there's an endpoint
	if (this.endSelectX != -1) {
		var xRange = this.endSelectX - this.startSelectX;
		var yRange = this.endSelectY - this.startSelectY;
		for (var j = 0; j <= yRange; j++) {
			for (var i = 0; i <= xRange; i++) {
				this.tiles[this.startSelectY + j][this.startSelectX + i].setHighlighted();
			}
		}
	} else {
		this.tiles[this.startSelectY][this.startSelectX].setHighlighted();
	}

	// to stop dragging of the highlight image
	$('img').on('dragstart', function(event) { event.preventDefault(); });
}

TileGrid.prototype.tilesAreSelected = function() {
	if (this.startSelectX == -1) {
		return false;
	} else {
		return true;
	}
}

TileGrid.prototype.getSelectedTileNames = function() {
	var result = [];

	// check to see if there's an endpoint
	if (this.endSelectX != -1) {
		var xRange = this.endSelectX - this.startSelectX;
		var yRange = this.endSelectY - this.startSelectY;
		for (var j = 0; j <= yRange; j++) {
			for (var i = 0; i <= xRange; i++) {
				if (i == 0) {
					result[j] = [];
				}
				result[j][i] = this.tiles[this.startSelectY + j][this.startSelectX + i].getName();
			}
		}
	} else {
		result[0] = [];
		result[0].push(this.tiles[this.startSelectY][this.startSelectX].getName());
	}

	return result;
}

TileGrid.prototype.getTileElements = function() {
	var tiles = []
	for (var i = 0; i < this.tiles.length; i++) {
		var row = $("<div></div>").css({"height":"32px", "float": "left", "width": this.tileRowLength*32+"px"});
		for (var j = 0; j < this.tiles[i].length; j++) {
			row.append(this.tiles[i][j].getElement());
		}
		tiles.push(row);
	}
	return tiles;
}







//**************************************************************************************
//********************************  TILEGRIDTILE   *************************************
//**************************************************************************************

function TileGridTile(tile) {
	this.name = tile.getName();
	this.passable = tile.getPassable();
	this.element = $("<div></div>").attr("id", "select_" + this.name).addClass("tile test2");
	this.sprite = $("<img />").attr("src", tile.getSprite()).attr("class", "tileSprite");
	this.element.append(this.sprite);
	
	if (!this.passable) {
		this.element.append($("<img />").attr("src", "img/impassable.png").attr("class", "tileImpassable"));
	}
	this.element.html(this.sprite);
	this.highlighted = false;
}

TileGridTile.prototype.getElement = function() {
	return this.element;
}

/*TileGridTile.prototype.highlight = function() {
	this.highlighted = true;
	// highlight element
}*/

TileGridTile.prototype.isHighlighted = function() {
	return this.highlighted;
}

/*TileGridTile.prototype.unhighlight = function() {
	this.highlighted = false;
	// unhighlight element
}*/

TileGridTile.prototype.getName = function() {
	return this.name;
}

TileGridTile.prototype.setHighlighted = function() {
	// check if it's already highlighted
	if (!this.highlighted) {
		this.highlighted = true;
		var highlight = $("<img />").attr("src", "img/highlight.png").attr("class", "tileHighlight");
		this.element.append(highlight);
	}
}

TileGridTile.prototype.setUnhighlighted = function() {
	if (this.highlighted) {
		this.element.find(".tileHighlight").remove();
		this.highlighted = false;
	}
}



/*TileGridTile.prototype.isImpassable = function() {
	return this.tile.isImpassable();
}*/

/*TileGridTile.prototype.setPassability = function(passability) {
	//this.tile.setPassability(passability)
	if (passability) {
		//this.element.attr();
	} else {

	}
}*/
