//**************************************************************************************
//********************************      EDITOR     *************************************
//**************************************************************************************

function Editor(world) {
	this.world = world;
	this.selectedTile = null;
	this.hoveredX = -1;
	this.hoveredY = -1;
	this.offsetX = 0;
	this.offsetY = 0;
	this.tiles = [new Plains(), new Mountains()];

	/*$("button").hover(
		function() {
			$(this).html("Hover");
		},
		function() {
			$(this).html("Button");
		}
	);*/
}

Editor.prototype.receiveKey = function(key) {
	var typedLetter = String.fromCharCode(key);
	var character = this.character;
	if (typedLetter == 'w') {
		console.log("got w.");
		var wrapper = document.getElementsByClassName("jeremy")[0];
		this.offsetY -= 10;
		if (this.offsetY < 0)
			this.offsetY = 0;
		wrapper.scrollTop = this.offsetY;

    	//wrapper.scrollTop(wrapper.scrollTop() - 1);
	} else if (typedLetter == 'a') {
		console.log("got a.");
		var wrapper = document.getElementsByClassName("jeremy")[0];
		this.offsetX -= 10;
		if (this.offsetX < 0)
			this.offsetX = 0;
		wrapper.scrollLeft = this.offsetX;

	} else if (typedLetter == 's') {
		console.log("got s.");
		var wrapper = document.getElementsByClassName("jeremy")[0];
		this.offsetY += 10;
		wrapper.scrollTop = this.offsetY;

    	//wrapper.scrollTop(wrapper.scrollTop() + 1);

	} else if (typedLetter == 'd') {
		console.log("got d.");
		var wrapper = document.getElementsByClassName("jeremy")[0];
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
		var wrapper = document.getElementsByClassName("jeremy")[0];
		this.offsetY -= 10;
		if (this.offsetY < 0)
			this.offsetY = 0;
		wrapper.scrollTop = this.offsetY;

    	//wrapper.scrollTop(wrapper.scrollTop() - 1);
	} else if (typedLetter == 'A') {
		console.log("got a.");
		var wrapper = document.getElementsByClassName("jeremy")[0];
		this.offsetX -= 10;
		if (this.offsetX < 0)
			this.offsetX = 0;
		wrapper.scrollLeft = this.offsetX;

	} else if (typedLetter == 'S') {
		console.log("got s.");
		var wrapper = document.getElementsByClassName("jeremy")[0];
		this.offsetY += 10;
		wrapper.scrollTop = this.offsetY;

    	//wrapper.scrollTop(wrapper.scrollTop() + 1);

	} else if (typedLetter == 'D') {
		console.log("got d.");
		var wrapper = document.getElementsByClassName("jeremy")[0];
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
			/*var xMouse = event.clientX;
			var yMouse = event.clientY;

			var element = document.getElementById('jeremy');
			var style = window.getComputedStyle(element);
			//var yOffset = style.getPropertyValue('top');
			//var xOffset = style.getPropertyValue('left');

			var yOffset = element.style.top;
			var xOffset = element.style.left;

			var x = xMouse - xOffset + this.offsetX;
			var y = yMouse - yOffset + this.offsetY;

			var xTile = Math.floor(x/32);
			var yTile = Math.floor(y/32);*/

			if (this.hoveredX != -1 && this.hoveredY != -1) {
				this.world.setTile(this.hoveredX, this.hoveredY, tile);
				this.drawMap();
				this.drawMiniMap();
			}
		}
	}
	
}

Editor.prototype.draw = function() {
	var html = "<div id='menu'>";
		html += "<button style='margin:3px'>Button</button>";
		html += "<button style='margin:6px'>Button</button>";
		html += "<button style='margin:3px'>Button</button>";
		html += "<button style='margin:3px'>Button</button>";
	html += "</div>";
	html += "<br />";
	html += "<div id='tabs'>";
		html += "<ul>";
			html += "<li><a href='#tabs-1'>Nunc tincidunt</a></li>";
			html += "<li><a href='#tabs-2'>Proin dolor</a></li>";
			html += "<li><a href='#tabs-3'>Aenean lacinia</a></li>";
		html += "</ul>";
		html += "<div id='tabs-1' class='jeremy' tabindex='0' style='overflow:hidden;width: 564px;height: 440px;z-index: 1'>";

			html += this.world.getAllHtml();

		html += "</div>";
		html += "<div id='tabs-2'>";
			html += "<p>Morbi tincidunt.</p>";
		html += "</div>";
		html += "<div id='tabs-3'>";
			html += "<p>Mauris eleifend est et turpis.</p>";
			html += "<p>Duis cursus.</p>";
		html += "</div>";
	html += "</div>";
	
	html += "<div id='minimap'>";
	html += this.world.getMinimapHtml();
	/*html += "<div id='minimap'>";
		html += "<p style='margin-top:20px; margin-left:20px;'>minimap</p>";
	html += "</div>";*/
	html += "</div>";

	html += "<div id='objects'>";
		html += "<ul>";
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
	html += "</div>";

	$('body').html(html);
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
			$(this).css({"height": "30px", "width": "30px", "border-style": "solid", "border-width": "1px", "border-color": "blue"});
			var id = $(this).attr('id');
			if (id) {
				var coords = id.split("_");
				rpgManager.editor.hoveredX = coords[0];
				rpgManager.editor.hoveredY = coords[1];
			}
		},
		function() {
			$(this).css({"height": "32px", "width": "32px", "border-style": "solid", "border-width": "0px", "border-color": "blue"});
			rpgManager.editor.hoveredX = -1;
			rpgManager.editor.hoveredY = -1;
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