//**************************************************************************************
//********************************    TILEGRID     *************************************
//**************************************************************************************

function TileGrid(parent, tileRowLength, factory) {
	this.parent = parent;
	this.tileRowLength = tileRowLength;
	this.factory = factory;
	this.tiles = [];
	this.startSelectX = -1;
	this.startSelectY = -1;
	this.endSelectX = -1;
	this.endSelectY = -1;

	this.factory.addObserver(this);
}

TileGrid.prototype.setTiles = function(tiles) {
	this.tiles = [];

	// fill the grid with all the tiles from the factory
	for (var i = 0; i < tiles.length; i++) {
		var k = i % tileRowLength;
		var j = i - k;
		if (k == 0) {
			this.tiles[j] = [];
		}
		this.tiles[j][k] = new TileGridTile(tiles[i]);
	}

	parent.renderTiles();
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
