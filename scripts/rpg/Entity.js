//**************************************************************************************
//********************************     ENTITY      *************************************
//**************************************************************************************

function Monster(name, life, damage, sprite, icon) {
	this.name = name;
	this.maxLife = life;
	this.life = life;
	this.damage = damage;
	this.sprite = sprite;
	this.attackInterval = 0;
	this.dead = false;
	this.icon = icon;
}

Monster.prototype.attackPlayer = function() {

}

Monster.prototype.getImage = function() {
	if (!this.dead) {
		var hp = Math.ceil((this.life/this.maxLife)*69);
		return "<div class='monster' style=\"background-image:url('" + this.sprite + 
			"')\"><img height='9' width='" + hp + "' src='img/hp.png'/></div>";
	}
}

Monster.prototype.getIcon = function() {
	return this.icon;
}

Monster.prototype.takeDamage = function(damage) {
	this.life -= damage;
	if (this.life < 1) {
		this.dead = true;
	}
}

Monster.prototype.isDead = function() {
	return this.dead;
}


//**************************************************************************************
//********************************       COW       *************************************
//**************************************************************************************

function Cow() {
	Monster.call(this, "cow", 20, 1, 'img/cow.png', 'img/cow-icon.gif');
}
Cow.prototype = new Monster();
Cow.prototype.constructor = Cow;



//**************************************************************************************
//********************************     DRAGON      *************************************
//**************************************************************************************

function Dragon() {
	Monster.call(this, "dragon", 100, 1, 'img/dragon.png', 'img/dragon-icon.gif');
}
Dragon.prototype = new Monster();
Dragon.prototype.constructor = Dragon;



//**************************************************************************************
//********************************       OGRE      *************************************
//**************************************************************************************

function Ogre() {
	Monster.call(this, "ogre", 50, 1, 'img/ogre.png', 'img/ogre-icon.gif');
}
Ogre.prototype = new Monster();
Ogre.prototype.constructor = Ogre;


//**************************************************************************************
//********************************    CHARACTER    *************************************
//**************************************************************************************

function Character(y, x) {
	this.sprite = "img/plains-char.png";
	this.x = x;
	this.y = y;
}

Character.prototype.getImage = function() {
	return "<img style='float:left' src='" + this.sprite + "'/>";
}

Character.prototype.canMoveUp = function() {
	return (this.x >= 1);
}

Character.prototype.canMoveDown = function() {
	return (this.x <= 18);
}

Character.prototype.canMoveLeft = function() {
	return (this.y >= 1);
}

Character.prototype.canMoveRight = function() {
	return (this.y <= 18);
}

Character.prototype.moveUp = function() {
	rpgManager.world.moveCharacter(this.x, this.y, --this.x, this.y);
}

Character.prototype.moveDown = function() {
	rpgManager.world.moveCharacter(this.x, this.y, ++this.x, this.y);
}

Character.prototype.moveLeft = function() {
	rpgManager.world.moveCharacter(this.x, this.y, this.x, --this.y);
}

Character.prototype.moveRight = function() {
	rpgManager.world.moveCharacter(this.x, this.y, this.x, ++this.y);
}

Character.prototype.getX = function() {
	return this.x;
}

Character.prototype.getY = function() {
	return this.y;
}

Character.prototype.getImageWithCoords = function(x, y) {
	return "<img style='float:left' src='" + this.sprite + "'/>";
}