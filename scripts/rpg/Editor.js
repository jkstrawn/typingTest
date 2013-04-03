//**************************************************************************************
//********************************      EDITOR     *************************************
//**************************************************************************************

function Editor(world) {
	this.world = world;
	this.selectedTile = "mountains";
	this.offsetX = 0;
	this.offsetY = 0;
}

Editor.prototype.receiveKey = function(key) {
	var typedLetter = String.fromCharCode(key);
	var character = this.character;
	if (typedLetter == 'w') {
		console.log("got w.");
		var wrapper = document.getElementById('tabs-1');
		this.offsetY -= 2;
		if (this.offsetY < 0)
			this.offsetY = 0;
		wrapper.scrollTop = this.offsetY;

    	//wrapper.scrollTop(wrapper.scrollTop() - 1);
	} else if (typedLetter == 'a') {
		console.log("got a.");
		var wrapper = document.getElementById('tabs-1');
		this.offsetX -= 2;
		if (this.offsetX < 0)
			this.offsetX = 0;
		wrapper.scrollLeft = this.offsetX;

	} else if (typedLetter == 's') {
		console.log("got s.");
		var wrapper = document.getElementById('tabs-1');
		this.offsetY += 2;
		wrapper.scrollTop = this.offsetY;

    	//wrapper.scrollTop(wrapper.scrollTop() + 1);

	} else if (typedLetter == 'd') {
		console.log("got d.");
		var wrapper = document.getElementById('tabs-1');
		this.offsetX += 2;
		wrapper.scrollLeft = this.offsetX;
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
		html += "<div id='tabs-1' class='jeremy' tabindex='0' style='overflow:scroll;width: 564px;height: 440px;z-index: 1'>";

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
		html += "<p style='margin-top:20px; margin-left:20px;'>minimap</p>";
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
				html += "<div style='float:left'>";
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
}