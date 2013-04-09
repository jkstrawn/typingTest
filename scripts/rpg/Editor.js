//**************************************************************************************
//********************************      EDITOR     *************************************
//**************************************************************************************

function Editor() {
	var tileRowLength = 4;

	this.world = new World(20, 20, false);
	this.selectedTile = null;
	this.hoveredX = -1;
	this.hoveredY = -1;
	this.offsetX = 0;
	this.offsetY = 0;
	this.tiles = [new Plains(), new Mountains()];
	this.tileRowLength = tileRowLength;
	this.factory = new TileFactory();

	this.database = new Database();
	var tileData = this.database.getTiles();
	this.selectorTileList = new TileList(tileData);
	this.editorTileList = new TileList(tileData);



	this.menuBar = new MenuBar();

	this.editMap = new EditMap(this.world, this.factory);
	this.editTiles = new EditTiles();
	this.editTerrains = new EditTerrains();
	this.editSurfaces = new EditSurfaces();
	this.editCreatures = new EditCreatures();

	this.selectTiles = new SelectTiles(tileRowLength, this.factory);
	this.selectTerrains = new SelectTerrains();
	this.selectSurfaces = new SelectSurfaces();
	this.selectCreatures = new SelectCreatures();
	

}

Editor.prototype.receiveKey = function(key) {
	var typedLetter = String.fromCharCode(key);
	var character = this.character;
	if (typedLetter == 'w') {
		console.log("got w.");
		var wrapper = document.getElementsByClassName("editMapPane")[0];
		this.offsetY -= 10;
		if (this.offsetY < 0)
			this.offsetY = 0;
		wrapper.scrollTop = this.offsetY;

    	//wrapper.scrollTop(wrapper.scrollTop() - 1);
	} else if (typedLetter == 'a') {
		console.log("got a.");
		var wrapper = document.getElementsByClassName("editMapPane")[0];
		this.offsetX -= 10;
		if (this.offsetX < 0)
			this.offsetX = 0;
		wrapper.scrollLeft = this.offsetX;

	} else if (typedLetter == 's') {
		console.log("got s.");
		var wrapper = document.getElementsByClassName("editMapPane")[0];
		this.offsetY += 10;
		wrapper.scrollTop = this.offsetY;

    	//wrapper.scrollTop(wrapper.scrollTop() + 1);

	} else if (typedLetter == 'd') {
		console.log("got d.");
		var wrapper = document.getElementsByClassName("editMapPane")[0];
		this.offsetX += 10;
		wrapper.scrollLeft = this.offsetX;
	}
}

Editor.prototype.receiveKeyDown = function(e) {
	var typedLetter = String.fromCharCode(e.keyCode);
	if (e.keyCode == 17) {
		console.log("control pressed.");
	} else if (typedLetter == 'W') {
		console.log("got w.");
		var wrapper = document.getElementsByClassName("editMapPane")[0];
		this.offsetY -= 10;
		if (this.offsetY < 0)
			this.offsetY = 0;
		wrapper.scrollTop = this.offsetY;

    	//wrapper.scrollTop(wrapper.scrollTop() - 1);
	} else if (typedLetter == 'A') {
		console.log("got a.");
		var wrapper = document.getElementsByClassName("editMapPane")[0];
		this.offsetX -= 10;
		if (this.offsetX < 0)
			this.offsetX = 0;
		wrapper.scrollLeft = this.offsetX;

	} else if (typedLetter == 'S') {
		console.log("got s.");
		var wrapper = document.getElementsByClassName("editMapPane")[0];
		this.offsetY += 10;
		wrapper.scrollTop = this.offsetY;

    	//wrapper.scrollTop(wrapper.scrollTop() + 1);

	} else if (typedLetter == 'D') {
		console.log("got d.");
		var wrapper = document.getElementsByClassName("editMapPane")[0];
		this.offsetX += 10;
		wrapper.scrollLeft = this.offsetX;
	} else if (e.keyCode == 65) {
		 console.log("got a");
	} else if (e.keyCode == 87) {
		console.log("got w");
	}
}

Editor.prototype.receiveKeyUp = function(e) {
	var typedLetter = String.fromCharCode(e.keyCode);
	if (e.keyCode == 17) {
		console.log("control up.");
	}
}

Editor.prototype.receiveMouseUp = function(event) {
	if (this.selectedTile != null) {
		var tile = Tile.factory(this.selectedTile);
		if (tile != null) {

			/*if (this.hoveredX != -1 && this.hoveredY != -1) {
				this.world.setTile(this.hoveredX, this.hoveredY, tile);
				this.drawMap();
				this.drawMiniMap();
			}*/
			this.editMap.setSelectedTile(tile.getSprite());
		}
	}
	
}

Editor.prototype.draw = function() {
	var body = $('body');
	body.html("");

	// menu bar
	body.append(this.menuBar.getHtml());
	body.append("<br />");

	// work area
	var workArea = $("<div></div>").attr("id", "tabs");
		
		var tabList = $("<ul></ul>");
		tabList.append("<li><a href='#tabs-1'>Map</a></li>");
		tabList.append("<li><a href='#tabs-2'>Tiles</a></li>");
		tabList.append("<li><a href='#tabs-3'>Terrains</a></li>");
		tabList.append("<li><a href='#tabs-4'>Surfaces</a></li>");
		tabList.append("<li><a href='#tabs-5'>Creatures</a></li>");

		workArea.append(tabList);

		// edit map tab
		workArea.append(this.editMap.getHtml());

		// edit terrains tab
		workArea.append(this.editTerrains.getHtml());


		workArea.append(this.editTiles.getHtml());

		// edit creatures tab
		workArea.append(this.editCreatures.getHtml());

		// edit surfaces tab
		workArea.append(this.editSurfaces.getHtml());

		body.append(workArea);
	
	// minimap
	var minimap = $("<div></div>").attr("id", "minimap").html(this.world.getMinimapHtml());
	body.append(minimap);

	// Selector area tab element
	var selectorArea = $("<div></div>").attr("id", "objects");


	// Selector area
		var tabList2 = $("<ul></ul>");
		tabList2.append("<li><a href='#tabs-1'>Tiles</a></li>");
		//tabList2.append("<li><a href='#tabs-2'>Terrains</a></li>");
		tabList2.append("<li><a href='#tabs-3'>Surfaces</a></li>");
		tabList2.append("<li><a href='#tabs-4'>Creatures</a></li>");
		selectorArea.append(tabList2);
		
		selectorArea.append(this.selectTiles.getHtml());
		//selectorArea.append(this.selectTerrains.getHtml());
		selectorArea.append(this.selectSurfaces.getHtml());
		selectorArea.append(this.selectCreatures.getHtml());

		
		
	//selectorArea.html(html);
	body.append(selectorArea);


	$("#tabs").tabs();
	$("#objects").tabs();

	this.setEvents();
}

Editor.prototype.drawMap = function() {
	$('.jeremy').first().html(this.world.getAllHtml());
	this.setEvents();
}

Editor.prototype.drawMiniMap = function() {
	$('#minimap').html(this.world.getMinimapHtml());
}

Editor.prototype.setEvents = function() {
	$(".test").hover(
		function() {
			var id = $(this).attr('id');
			if (id) {
				var coords = id.split("_");
				var x = parseInt(coords[0]);
				var y = parseInt(coords[1]);

				rpgManager.editor.editMap.highlightTile(x, y);
			}
		},
		function() {
			/*var id = $(this).attr('id');
			if (id) {
				var coords = id.split("_");
				var x = parseInt(coords[0]);
				var y = parseInt(coords[1]);

				rpgManager.editor.editMap.unhighlightTiles();
			}*/
		}
	);

	$(".test").click(function() {
		var id = $(this).attr('id');
			if (id) {
				var coords = id.split("_");
				var x = parseInt(coords[0]);
				var y = parseInt(coords[1]);

				rpgManager.editor.editMap.replaceHighlightedTiles(x, y);
			}
	});

	/*$(".test2").click(function() {
		var id = $(this).attr('id');
		if (id) {
			var coords = id.split("_");
			var tileName = coords[1];

			rpgManager.editor.selectTiles.setStartSelect(tileName);
			rpgManager.editor.selectTiles.setEndSelect(tileName);
		}
	});*/

	$(".test2").mousedown(function(){
		var id = $(this).attr('id');
		if (id) {
			var coords = id.split("_");
			var tileName = coords[1];

			rpgManager.editor.selectTiles.setStartSelect(tileName);
		}
	}).mouseup(function(){
		var id = $(this).attr('id');
		if (id) {
			var coords = id.split("_");
			var tileName = coords[1];

			rpgManager.editor.selectTiles.setEndSelect(tileName);
		}
	});

	/*$(".test").hover(
		function() {
			var id = $(this).attr('id');
			if (id) {
				var coords = id.split("_");
				var x = parseInt(coords[0]);
				var y = parseInt(coords[1]);

				rpgManager.editor.editMap.highlightTile(x, y);
			}
		},
		function() {
			/*var id = $(this).attr('id');
			if (id) {
				var coords = id.split("_");
				var x = parseInt(coords[0]);
				var y = parseInt(coords[1]);

				rpgManager.editor.editMap.unhighlightTiles();
			}
		}
	);*/

	$('img').on('dragstart', function(event) { event.preventDefault(); });
}

Editor.prototype.setSelectedTile = function(tileName) {
	this.selectedTile = tileName;
	var name = '#' + tileName;

	$.each(this.tiles, function(index, element){
		var name = '#' + element.name;
		$(name).css({"border-width": "0px"});
	});

	$(name).css({"border-style": "solid", "border-width": "1px", "border-color": "orange"});
}





//**************************************************************************************
//********************************   TILEFACTORY   *************************************
//**************************************************************************************

function TileFactory() {
	this.tileData = [];
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