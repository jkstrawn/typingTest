(function() {

	var Grid = my.Class({

		constructor: function() {
			this.grid = [];
		},

		init: function(gridPosX, gridPosY, width, height, size) {
			this.x = gridPosX;
			this.y = gridPosY;

			for (var x = 0; x < width; x++) {
				var row = [];
				this.grid.push(row);
				for (var y = 0; y < height; y++) {
					var posX = x * size + this.x;
					var posY = y * size + this.y;
					var square = {x: posX, y: posY, gridX: x, gridY: y, size: size};
					this.grid[x].push(square);
				}
			}
		},

		getSquares: function() {
			var squares = [];
			for (var x = 0; x < this.grid.length; x++) {
				for (var y = 0; y < this.grid[0].length; y++) {
					squares.push(this.grid[x][y]);
				}
			}
			return squares;
		},

		getSquare: function(x, y) {
			return this.grid[x][y];
		},

	});

	TYPE.Grid = Grid;
})()