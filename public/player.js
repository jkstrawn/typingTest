(function() {

	var Player = my.Class({

		constructor: function() {

			this.modelName = "traductus";
			this.id = -1;
			this.health = 10;
			this.position = {x: 0, y: 0}
			this.rotation = 0;

		},

		init: function(square) {
			this.gridSquare = square;
			this.sprite = type.graphics.getSprite("forwardStand");
			this.sprite.position.x = square.x;
			this.sprite.position.y = square.y;
		},

		setId: function(id) {
			this.id = id;
		},

		update: function (dt) {


		},

		updatePosition: function(newPosition) {

		},

		doCommand: function(command) {
			console.log("doing command " + command);
		},

	});

	TYPE.Player = Player;
})()