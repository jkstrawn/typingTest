//**************************************************************************************
//********************************      TILE       *************************************
//**************************************************************************************

function Tile(name, sprite, background, passable) {
	this.name = name;
	this.sprite = sprite;
	this.background = background;
	this.passable = passable;
	this.inhabitants = [];
}

/*Tile.prototype.getImage = function() {
	return "<img style='float:left' src='" + this.sprite + "'/>";
}*/

Tile.prototype.getImage = function() {
	//return "<img style='float:left' src='" + this.sprite + "'/>";
	var html = "<div class='tile' style=\"background-image:url('" + this.sprite + "')\">";
	
	if (this.hasInhabitant()) {
		this.sprite = 'img/plains-cow.png';
		html += "<img src='" + this.inhabitants[0].getIcon() + "'/>";
	} else {
		this.sprite = 'img/plains.png';
	}

	html += "</div>";
	return html;
}

Tile.prototype.getBackground = function() {
	return this.background;
}

Tile.prototype.getInhabitants = function() {
	return this.inhabitants;
}

Tile.prototype.hasInhabitant = function() {
	return (this.inhabitants.length > 0);
}


//**************************************************************************************
//********************************     PLAINS      *************************************
//**************************************************************************************

function Plains() {
	Tile.call(this, "Plains", "img/plains.png", "plains-old.png", true);

	//Tile.call(this, "Plains", 'img/plains.png', true);
	if (Math.floor((Math.random()*50)+1) == 50) {
		this.inhabitants.push(new Cow());
		this.inhabitants.push(new Cow());
	}
}
Plains.prototype = new Tile();
Plains.prototype.constructor = Plains;


//**************************************************************************************
//********************************     FOREST      *************************************
//**************************************************************************************

function Forest() {
	Tile.call(this, "forest", "asgf", "hgjr", true);
	this.sprite = 'img/forest.png';
}
Forest.prototype = new Tile();
Forest.prototype.constructor = Forest;