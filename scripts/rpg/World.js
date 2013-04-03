//**************************************************************************************
//********************************      WORLD      *************************************
//**************************************************************************************

function World(x, y) {
	this.x = x;
	this.y = y;

	this.character = new Character(10, 10);
	this.tiles = createArray(x, y);
	this.screenSize = 11;
	this.outOfBoundsSprite = "img/oob.png";

	for (var i = 0; i < this.tiles.length; i++) {
		for (var j = 0; j < this.tiles[i].length; j++) {
			if (Math.floor((Math.random()*8)+1) == 8) {
				this.tiles[i][j] = new Mountains();
			} else {
				this.tiles[i][j] = new Plains();
			}
		}
	}

	this.tiles[10][10] = this.character;
}

World.prototype.draw = function() {
	var html = this.getHtml();
	$('body').html(html);
}

World.prototype.getHtml = function() {
	var html = "<div id='map'>";
	var x = this.character.getX();
	var y = this.character.getY();

	var startX = x - (this.screenSize - 1)/2;
	var startY = y - (this.screenSize - 1)/2;

	for (var i = startX; i < startX + this.screenSize; i++) {
		for (var j = startY; j < startY + this.screenSize; j++) {
			console.log(i + ", " + j);
			if (this.indexIsOutOfBounds(i) || this.indexIsOutOfBounds(j)) {
				html += this.getOutOfBoundsImage();
			} else {
				html += this.tiles[i][j].getImage();
			}
		}
	}

	html += "</div>";
	return html;
}

World.prototype.getAllHtml = function() {
	//var html = "<div style='width:" + this.x*32 + ";height:" + this.y*32 + ";overflow:scroll'>";
	//var html = "<div style='overflow:scroll'>";
	var html = "<div id='jeremy'>";

	for (var i = 0; i < this.x; i++) {
		html += "<div id='row'>"
		for (var j = 0; j < this.y; j++) {
			console.log(i + ", " + j);
			if (this.indexIsOutOfBounds(i) || this.indexIsOutOfBounds(j)) {
				html += this.getOutOfBoundsImage();
			} else {
				html += this.tiles[i][j].getImage();
			}
		}
		html += "</div><br />";
	}

	html += "</div>";
	return html;
}

World.prototype.getTile = function() {
	return new Plains();
}

World.prototype.getTiles = function() {
	return [new Plains(), new Mountains()];
}


World.prototype.indexIsOutOfBounds = function(index) {
	return (index < 0 || index > (this.x - 1))
}

World.prototype.getOutOfBoundsImage = function() {
	return "<div class='tile' style=\"background-image:url('" + this.outOfBoundsSprite + "')\"></div>";
}

World.prototype.moveCharacter = function(i, j, x, y) {
	this.tiles[i][j] = new Plains();
	var plains = this.tiles[x][y];
	this.tiles[x][y] = this.character;

	if (plains.hasInhabitant()) {
		rpgManager.setEncounter(plains);
	} else {
		this.draw();
	}
}

World.prototype.receiveKey = function(key) {
	var typedLetter = String.fromCharCode(key);
	var character = this.character;
	if (typedLetter == 'w') {
		if (character.canMoveUp()) {
			character.moveUp();
		}
	} else if (typedLetter == 'a') {
		if (character.canMoveLeft()) {
			character.moveLeft();
		}
	} else if (typedLetter == 's') {
		if (character.canMoveDown()) {
			character.moveDown();
		}
	} else if (typedLetter == 'd') {
		if (character.canMoveRight()) {
			character.moveRight();
		}
	}
}


function createArray(length) {
	var a = new Array(length || 0);

	if (arguments.length > 1) {
	var args = Array.prototype.slice.call(arguments, 1);
		for (var i = 0; i < length; i++) {
			a[i] = createArray.apply(this, args);
		}
	}

	return a;
}