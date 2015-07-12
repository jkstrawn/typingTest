(function() {

	var Grid = my.Class({

		constructor: function() {
			this.tiles = [];
		},

		init: function(gridPosX, gridPosY, width, height, size) {
			this.x = gridPosX;
			this.y = gridPosY;

			for (var x = 0; x < width; x++) {
				var row = [];
				this.tiles.push(row);
				for (var y = 0; y < height; y++) {
					var posX = x * size + this.x;
					var posY = y * size + this.y;
					var tile = new TYPE.Tile(posX, posY, x, y, size, null);
					this.tiles[x].push(tile);
				}
			}
		},

		getTiles: function() {
			var tiles = [];
			for (var x = 0; x < this.tiles.length; x++) {
				for (var y = 0; y < this.tiles[0].length; y++) {
					tiles.push(this.tiles[x][y]);
				}
			}
			return tiles;
		},

		getTile: function(x, y) {
			return this.tiles[x][y];
		},

		getTileInDirection: function(tile, direction) {
			var tileInDirection = null;

			switch(direction) {
				case "up":
					tileInDirection = this.getTile(tile.gridX, tile.gridY - 1);
					break;
				case "down":
					tileInDirection = this.getTile(tile.gridX, tile.gridY + 1);
					break;
				case "left":
					tileInDirection = this.getTile(tile.gridX - 1, tile.gridY);
					break;
				case "right":
					tileInDirection = this.getTile(tile.gridX + 1, tile.gridY);
					break;
			}

			if (!tileInDirection) {
				console.log("Could not find tile to the " + direction + " of " + tile.gridX + ", " + tile.gridY);
			}

			return tileInDirection;
		},

	});

	TYPE.Grid = Grid;

	var Tile = my.Class({
		constructor: function(x, y, gridX, gridY, size, player) {
			this.x = x;
			this.y = y;
			this.gridX = gridX;
			this.gridY = gridY;
			this.size = size;
			this.player = player;
		},

		getDirection: function(otherTile) {
			if (this.gridX > otherTile.gridX)
				return "left";
			if (this.gridY > otherTile.gridY)
				return "up";
			if (this.gridX < otherTile.gridX)
				return "right";
			if (this.gridY < otherTile.gridY)
				return "down";

			return "right";
		},
	});

	TYPE.Tile = Tile;
})()