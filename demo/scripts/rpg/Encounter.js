//**************************************************************************************
//********************************    ENCOUNTER    *************************************
//**************************************************************************************

function Encounter(tile) {
	this.background = tile.getBackground();
	this.enemies = tile.getInhabitants();
}

/*Encounter.isEncounter = function(location) {
	return ($.inArray(location, this.locations) > -1)
}*/

Encounter.prototype.receiveKey = function(key) {
	var typedLetter = String.fromCharCode(key);

	if (typedLetter == 'a') {
		if (this.enemies.length > 0) {
			var monster = this.enemies[0];
			if (monster) {
				monster.takeDamage(10);
				if (monster.isDead()) {
					this.enemies.splice(0,1);
				}
			}
			this.draw();
		} else {
			rpgManager.goToMap();
		}
	}
}

Encounter.prototype.draw = function() {
	//this.zones["plains"].setZone();
	$('body').css({"background-image": "url('" + this.background + "')"});

	var html = "<div id='monsters'>"

	$.each(this.enemies, function(index, entity) {
		html += entity.getImage();
	});

	html += "</div>";
	$('body').html(html);
}