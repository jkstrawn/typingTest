//**************************************************************************************
//********************************      EDITOR     *************************************
//**************************************************************************************

function Editor() {
	this.world = new World(20, 20, false);;
	this.selectedTile = null;
	this.hoveredX = -1;
	this.hoveredY = -1;
	this.offsetX = 0;
	this.offsetY = 0;
	this.tiles = [new Plains(), new Mountains()];

	this.database = new Database();
	var tileData = this.database.getTiles();
	this.selectorTileList = new TileList(tileData);
	this.editorTileList = new TileList(tileData);

	this.menuBar = new MenuBar();

	this.editMap = new EditMap(this.world);
	this.editTerrains = new EditTerrains();
	this.editTiles = new EditTiles();
	this.editCreatures = new EditCreatures();
	this.editSurfaces = new EditSurfaces();

	this.selectTerrains = new SelectTerrains();
	this.selectTiles = new SelectTiles();
	this.selectCreatures = new SelectCreatures();
	this.selectSurfaces = new SelectSurfaces();
	

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

			if (this.hoveredX != -1 && this.hoveredY != -1) {
				this.world.setTile(this.hoveredX, this.hoveredY, tile);
				this.drawMap();
				this.drawMiniMap();
			}
		}
	}
	
}

Editor.prototype.draw = function() {
	var body = $('body');
	body.html("");

	// menu bar
	body.append(this.menuBar.getHtml());
	body.append("<br />");

	//html += "<br />";

	// work area
	var workArea = $("<div></div>").attr("id", "tabs");
	//html += "<div id='tabs'>";
		
		var tabList = $("<ul></ul>");
		tabList.append("<li><a href='#tabs-1'>Map</a></li>");
		tabList.append("<li><a href='#tabs-2'>Tiles</a></li>");
		tabList.append("<li><a href='#tabs-3'>Terrains</a></li>");
		tabList.append("<li><a href='#tabs-4'>Surfaces</a></li>");
		tabList.append("<li><a href='#tabs-5'>Creatures</a></li>");

		workArea.append(tabList);

		/*html += "<ul>";
			// title of map area
			html += ;
			// title of tiles tab
			html += ;
			// tite of terrains tab
			html += ;
			// title of surfaces tab
			html += ;
			// title of creatures tab
			html += ;
		html += "</ul>";*/

		// edit map tab
		
		workArea.append(this.editMap.getHtml());
		//html += this.editMap.getHtml();

		/*html += "<div id='tabs-1' class='jeremy' tabindex='0' style='overflow:hidden;width: 564px;height: 440px;z-index: 1'>";

			html += this.world.getAllHtml();

		html += "</div>";*/

		// edit tiles tab
		/*html += "<div id='tabs-2'>";
			html += "<p>Morbi tincidunt.</p>";
		html += "</div>";*/

		workArea.append(this.editTerrains.getHtml());
		workArea.append(this.editTiles.getHtml());
		workArea.append(this.editCreatures.getHtml());
		workArea.append(this.editSurfaces.getHtml());
		

		workArea.append(this.selectTerrains.getHtml());
		workArea.append(this.selectTiles.getHtml());
		workArea.append(this.selectCreatures.getHtml());
		workArea.append(this.selectSurfaces.getHtml());

		body.append(workArea);

		// edit terrains tab
		/*html += "<div id='tabs-3'>";
			html += "<p>Mauris eleifend est et turpis.</p>";
			html += "<p>Duis cursus.</p>";
		html += "</div>";

		// edit surfaces tab
		html += "<div id='tabs-4'>";
			html += "<p>Mauris eleifend est et turpis.</p>";
			html += "<p>Duis cursus.</p>";
		html += "</div>";

		// edit creatures tab
		html += "<div id='tabs-5'>";
			html += "<p>Mauris eleifend est et turpis.</p>";
			html += "<p>Duis cursus.</p>";
		html += "</div>";*/
		
	//html += "</div>";
	
	// minimap
	var minimap = $("<div></div>").attr("id", "minimap").html(this.world.getMinimapHtml());
	body.append(minimap);
	//html += "<div id='minimap'>";
	//html += this.world.getMinimapHtml();
	/*html += "<div id='minimap'>";
		html += "<p style='margin-top:20px; margin-left:20px;'>minimap</p>";
	html += "</div>";*/
	//html += "</div>";

	// Selector area tab element
	var selectorArea = $("<div></div>").attr("id", "objects");


	//html += "<div id='objects'>";
		var html = "<ul>";
			html += "<li><a href='#tabs-1'>tiles</a></li>";
			html += "<li><a href='#tabs-2'>Proin</a></li>";
		html += "</ul>";
		html += "<div id='tabs-1'>";

			var tiles = this.world.getTiles();
			for (var i = 0; i < tiles.length; i++) {
				var tile = tiles[i];
				html += "<div id='" + tile.name + "' style='float:left' onclick='rpgManager.editor.setSelectedTile(\"" + tile.name + "\")'>";
				html += tile.getHtml();
				html += "</div>";
			}

		html += "</div>";
		html += "<div id='tabs-2'>";
			html += "<p>Morbi arcu, dui sit amet arcu arcu, odio metus arcu ante, ut arcu massa metus id nunc. Duis arcu arcu turpis.</p>";
		html += "</div>";
	//html += "</div>";
	selectorArea.html(html);
	body.append(selectorArea);

	//$('body').html(html);

	


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
	$(".tile").hover(
		function() {
			//$(this).css({"height": "30px", "width": "30px", "border-style": "solid", "border-width": "1px", "border-color": "blue"});
			var id = $(this).attr('id');
			if (id) {
				var coords = id.split("_");
				var x = coords[0];
				var y = coords[1];

				rpgManager.editor.editMap.highlightTile(x, y);

				//rpgManager.editor.hoveredX = coords[0];
				//rpgManager.editor.hoveredY = coords[1];
			}
		},
		function() {
			//$(this).css({"height": "32px", "width": "32px", "border-style": "solid", "border-width": "0px", "border-color": "blue"});
			var id = $(this).attr('id');
			if (id) {
				var coords = id.split("_");
				var x = coords[0];
				var y = coords[1];

				rpgManager.editor.editMap.unhighlightTile(x, y);

				//rpgManager.editor.hoveredX = coords[0];
				//rpgManager.editor.hoveredY = coords[1];
			}
		}
	);
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