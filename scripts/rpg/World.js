//**************************************************************************************
//********************************      WORLD      *************************************
//**************************************************************************************

function World() {
	this.character = new Character(10, 10);
	this.tiles = createArray(20, 20);

	for (var i = 0; i < this.tiles.length; i++) {
		for (var j = 0; j < this.tiles[i].length; j++) {
			this.tiles[i][j] = new Plains();
		}
	}

	this.tiles[10][10] = this.character;
}

World.prototype.draw = function() {
	var html = "<div id='map'>";

	for (var i = 0; i < this.tiles.length; i++) {
		for (var j = 0; j < this.tiles[i].length; j++) {
			console.log(i + ", " + j);
			html += this.tiles[i][j].getImage();
		}
	}

	html += "</div>";
	$('body').html(html);
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