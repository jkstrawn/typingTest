//**************************************************************************************
//********************************     ENTITY      *************************************
//**************************************************************************************

function Monster(name, life, damage, sprite, icon) {
	this.name = name;
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
		return "<div class='monster' style=\"background-image:url('" + this.sprite + "')\"><img height='9' width='" + this.life + "' src='img/hp.png'/></div>";
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
	Monster.call(this, "cow", 69, 1, 'img/cow.png', 'img/cow-icon.gif');
}
Cow.prototype = new Monster();
Cow.prototype.constructor = Monster;



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