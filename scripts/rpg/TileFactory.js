//**************************************************************************************
//********************************   TILEFACTORY   *************************************
//**************************************************************************************

function TileFactory() {
	this.tileData = [];
	this.observers = [];
}

TileFactory.prototype.setData = function(tileData) {
	this.tileData = tileData;
}

TileFactory.prototype.addTile = function(tile) {
	this.tileData.push(tile);
}

TileFactory.prototype.createTile = function(tileName) {
	if (this.isATileName(tileName)) {
		var tileData = this.tileData[tileName];
		var sprite;
		var background;
		var passable;
		return new Tile();
	} else {
		return null;
	}
}

TileFactory.prototype.isATileName = function(tileName) {
	$.each(this.tileData, function(index, element){
		if (index == tileName) {
			return true;
		}
	});

	return false;
}

TileFactory.prototype.getTileNames = function() {

}


TileFactory.prototype.getTiles = function() {
	// return an array of tile objects
	var tiles = [new Plains(), new Mountains()];
	return tiles;
}

TileFactory.prototype.getTileByName = function(tileName) {
	if (tileName == "plains") {
		return new Plains();
	} else if (tileName == "mountains") {
		return new Mountains();
	}

	return null;
}

TileFactory.prototype.addObserver = function(observer) {
	this.observers.push(observer);
}

TileFactory.prototype.updateObservers = function() {
	for (var i = 0; i < this.observers.length; i++) {
		this.observers[i].setTiles(tiles);
	}
}