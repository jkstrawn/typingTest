(function() {

	var Player = my.Class({

		constructor: function() {

			this.modelName = "traductus";
			this.id = -1;
			this.health = 10;
			this.position = {x: 0, y: 0}
			this.rotation = 0;
			this.tile = null;
			this.direction = "down";
			this.targetNpc = null;
			this.abilities = {
				ability1: this.charge,
				ability2: this.attack,
			};
			this.stance = "Stand";
		},

		init: function(tile) {
			console.log("player init");
			console.log(tile);
			this.tile = tile;
			this.sprite = type.graphics.getSprite("tr_downStand");
			this.sprite.position.x = tile.x;
			this.sprite.position.y = tile.y;
		},

		setId: function(id) {
			this.id = id;
		},

		update: function (dt) {
			if (this.sprite.position.x != this.oldX || this.sprite.position.y != this.oldY)
				console.log(this.sprite.position);
			this.oldX = this.sprite.position.x;
			this.oldY = this.sprite.position.y;
		},

		updatePosition: function(newPosition) {

		},

		doCommand: function(command) {
			console.log("doing command " + command);
			this.abilities[command].call(this);
		},

		updateSprite: function() {
			type.graphics.removeSprite(this.sprite);
			this.sprite = type.graphics.getSprite("tr_" + this.direction + this.stance);
			this.sprite.position = this.position;
		},

		convertToTweenArray: function(path) {
			shortPath = path.slice(1, -1);

			xArray = [];
			yArray = [];

			for (var i = 0; i < shortPath.length; i++) {
				var tile = type.grid.getTile(shortPath[i].x, shortPath[i].y)
				xArray.push(tile.x);
				yArray.push(tile.y);
			}

			return {x: xArray, y: yArray};
		},

		charge: function() {
			path = new AStar(type.grid.tiles, this.tile, this.targetNpc.tile);


			var that = this;
    		var tweenPath = this.convertToTweenArray(path);

			this.tween = new TWEEN.Tween(this.sprite.position).to(tweenPath, 100)
			.easing(TWEEN.Easing.Back.Out)
			.onComplete(function() {
	    		var landingLoc = path[path.length - 2];
	    		var landingTile = type.grid.getTile(landingLoc.x, landingLoc.y);

	    		that.tile = landingTile;
				that.position = {x: this.x, y: this.y};
				that.direction = landingTile.getDirection(that.targetNpc.tile);
				that.updateSprite();
				type.network.changeTile(that.tile.gridX, that.tile.gridY);
				// that.attack();
			})
			.onUpdate(function() {
				type.network.move(this.x, this.y);
			})
			.start();
		},

		attack: function() {
			var tileToAttack = type.grid.getTileInDirection(this.tile, this.direction);
			type.network.sendAttack({x: tileToAttack.gridX, y: tileToAttack.gridY});
			this.stance = "Attack";
			this.updateSprite();
		},

	});

	TYPE.Player = Player;

	var Npc = my.Class({

		constructor: function(id, tile, sprite, health) {
			this.id = id;
			this.tile = tile;
			this.graphics = type.graphics.newGraphics();
			this.sprite = type.graphics.getSprite(sprite);
			this.sprite.position.x = tile.x;
			this.sprite.position.y = tile.y;
			this.health = health;
			this.maxHealth = 10;

			this.drawHealthBar();
		},

		drawHealthBar: function() {
			type.graphics.drawHealthBar(this.graphics, this.health / this.maxHealth, this.sprite.position);
		},

		updateInfo: function(info) {
			if (info.sprite) {
				type.graphics.removeSprite(this.sprite);
				this.sprite = type.graphics.getSprite(info.sprite);
				this.sprite.position.x = this.tile.x;
				this.sprite.position.y = this.tile.y;
			}
			if (info.pos) {
				//do it
			}
			if (info.health) {
				this.health = info.health;
				this.drawHealthBar();
			}
			
		},

		die: function() {
			console.log("tis dead");
			type.graphics.clearGraphics(this.graphics);
		},

		update: function(dt) {
		},
	});

	TYPE.Npc = Npc;
})()