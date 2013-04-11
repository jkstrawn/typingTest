function EditorWorld(data, x, y) {
	this.width = x;
	this.height = y;
	this.element =


	this.editorWorldTiles = this.createEditorWorldTiles();
	this.mapElement = this.createMapElement();
}

EditorWorld.prototype.getElement = function() {
	return this.element;
}


EditMap.prototype.createEditorWorldTiles = function() {
	var tiles = this.world.getAllTiles();
	var editorWorldTiles = createArray(tiles.length, tiles[0].length);

	for (var i = 0; i < editorWorldTiles.length; i++) {
		for (var j = 0; j < editorWorldTiles[i].length; j++) {
			//var tileElement = $("<div></div>").attr("id", j + "_" + i).attr("class", "tile");
			var editorWorldTile = new EditorWorldTile(j, i, tiles[i][j].getSprite());
			//var tileImage = $("<img />").attr("src", tiles[i][j].getSprite());
			//tileElement.html(tileImage);
			editorWorldTiles[i][j] = editorWorldTile;
		}
	}

	return editorWorldTiles;
}


EditMap.prototype.createMapElement = function() {
	var mapElement = $("<div></div>").attr("id", "editMap");
	//var html = "";

	for (var i = 0; i < this.editorWorldTiles.length; i++) {
		var div = $("<div></div>").attr("class", "row");
		//html += "<div>"
		for (var j = 0; j < this.editorWorldTiles[i].length; j++) {
			//html += this.tileElements[i][j].html();
			div.append(this.editorWorldTiles[i][j].getElement());
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

function EditorWorldTile(x, y, imageSource) {
	this.element = $("<div></div>").attr("id", x + "_" + y).addClass("tile test");
	// order they appear in html: sprite -> surface -> highlight
	this.sprite = $("<img />").attr("src", imageSource).attr("class", "tileSprite");
	this.element.html(this.sprite);
	this.surface = null;
	this.highlighted = false;
}


EditorWorldTile.prototype.setSprite = function(imageSource) {
	this.sprite.attr("src", imageSource);
	this.removeSurface();
}


EditorWorldTile.prototype.setSurface = function(imageSource) {
	// check if the surface is set
	if (this.surface) {
		this.surface.attr("src", imageSource);
	} else {
		this.surface = $("<img />").attr("src", imageSource).attr("class", "tileSurface");
		this.sprite.after(this.surface);
	}
}


EditorWorldTile.prototype.removeSurface = function() {
	// check if the surface is set
	if (this.surface) {
		this.surface.remove();
	}
}


EditorWorldTile.prototype.setHighlighted = function(imageSource) {
	// check if it's already highlighted
	if (!this.highlighted) {
		this.highlighted = true;
		var highlight = $("<img />").attr("src", imageSource).attr("class", "tileHighlight");
		this.element.append(highlight);
	}
}


EditorWorldTile.prototype.setUnhighlighted = function() {
	if (this.highlighted) {
		this.element.find(".tileHighlight").remove();
		this.highlighted = false;
	}
}


EditorWorldTile.prototype.getElement = function() {
	return this.element;
}