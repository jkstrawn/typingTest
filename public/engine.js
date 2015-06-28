(function() {

	var TypingEngine = my.Class({

		that: this,

		constructor: function() {

			this.otherPlayers = [];
			this.shapes = [];
			this.stats = null;
			this.grid = null;

			this.oldTime = 0;
			this.graphics = new TYPE.GraphicsEngine();
			this.player = new TYPE.Player();
			this.network = new TYPE.Network();
			this.grid = new TYPE.Grid();
		},

		init: function() {

			this.grid.init(100, 5, 4, 4, 128);
			this.graphics.init(this.modelUrls, $.proxy( this.loadedModels, this ), this.grid);
		},

		loadedModels: function() {

			this.player.init(this.grid.getSquare(0, 0));
		},

		// EVENTS

		updatePlayer: function(dataModel) {
			if (dataModel.id == this.player.id) return;

			var player = null;
			for (var i = this.otherPlayers.length - 1; i >= 0; i--) {
				if (this.otherPlayers[i].id == dataModel.id) {
					player = this.otherPlayers[i];
				}
			};

			if (player == null) {
				//var newPlayerModel = this.graphics.createPlayer();

				var newPlayerModel = this.graphics.getModel(this.modelUrls.live[0]);
				this.graphics.scene.add(newPlayerModel);
				newPlayerModel.play("walk", 1, 2);
				player = {id: dataModel.id, model: newPlayerModel};
				this.otherPlayers.push(player);
			}

			//console.log(player);
			this.graphics.movePlayer(player, dataModel);
		},

		// PROCESS EVENTS

		doCommand: function(name) {

			switch (name) {

				case "forwardColumn":
					this.player.moveForward();
					break;
				case "leftColumn":
					this.player.turnLeft();
					break;
				case "rightColumn":
					this.player.turnRight();
					break;
				case "fireColumn":
					this.player.shootTongue();
			}
		},

		addShape: function(shape) {

			this.graphics.addModel(shape.model);
			this.shapes.push(shape);
		},

		getShapesOfType: function(type) {

			var shapesOfType = [];

			for (var i = this.shapes.length - 1; i >= 0; i--) {
				if (this.shapes[i] instanceof type) {
					shapesOfType.push(this.shapes[i]);
				}
			};

			return shapesOfType;
		},

		removeShape: function(shape) {

			for (var i = this.shapes.length - 1; i >= 0; i--) {
				if (this.shapes[i] == shape) {
					this.shapes.splice(i, 1);
					this.graphics.removeModel(shape.model);
					return;
				}
			};

			console.log("ERROR: tried to delete non-existant shape", shape);
		},

		createAsteroid: function(mobData) {
			// console.log("creating asteroid with id of " + mobData.id);
			var model = this.graphics.getModel(this.modelUrls.dead[1]);
			model.scale.set(mobData.size / 4, mobData.size / 4, mobData.size / 4);
			model.position.set(mobData.pos.x, mobData.pos.y, 0);
			this.graphics.addModel(model);
			var shape = new TYPE.Bug(mobData.id, model, mobData.size);
			this.shapes.push(shape);
		},

		updateAsteroid: function(mobData) {
			if (this.bugIsKilled(mobData.id))
				return;
			var asteroid = this.getShapeWithId(mobData.id);
			if (asteroid) {
				asteroid.updatePosition(mobData.pos, mobData.rot);
			} else {
				this.createAsteroid(mobData);
			}
		},

		bugIsKilled: function (id) {
			for (var i = this.killedBugs.length - 1; i >= 0; i--) {
				if (this.killedBugs[i] == id)
					return true;
			};
			return false;
		},

		getShapeWithId: function(id) {
			for (var i = this.shapes.length - 1; i >= 0; i--) {
				if (this.shapes[i].id == id) {
					return this.shapes[i];
				}
			};
			return false;
		},

		// OTHER

		getShapes: function() {

			var shapes = [];

			for (var i = this.shapes.length - 1; i >= 0; i--) {
				shapes.push(this.shapes[i].model);
			};

			return shapes;
		},

		updateShapeHoverStates: function() {

			var hoveredShape = this.graphics.getHoveredShape(this.getShapes());
			this.hoveredShape = null;

			for (var i = this.shapes.length - 1; i >= 0; i--) {
				var shape = this.shapes[i];

				if (shape.model == hoveredShape) {
					this.hoveredShape = shape;
					shape.setHover(true);
				}
				else {
					shape.setHover(false);
				}
			};
		},

		// USER INPUT

		mouseMove: function(event) {
		},

		mouseDown: function(event) {
		},

		click: function( event ) {
		},

		keypress: function (event) {
			var character = String.fromCharCode(event.keyCode)
		},

		keydown: function (event) {
			var character = String.fromCharCode(event.keyCode)
			var contains = false;
			for (var i = this.keys.length - 1; i >= 0; i--) {
				if (this.keys[i] == event.keyCode)
					contains = true;
			};
			if (!contains) {
				this.keys.push(event.keyCode);
			}
		},

		keyup: function (event) {
			var character = String.fromCharCode(event.keyCode)
			for (var i = this.keys.length - 1; i >= 0; i--) {
				if (this.keys[i] == event.keyCode)
					this.keys.splice(i, 1);
			};

			this.player.keyActive(event.keyCode);
		},

		zoom: function(dt) {
			this.graphics.zoom(dt);
		},

		// UPDATING

		render: function() {

			var delta = 40;

			this.graphics.render();
		},

		update: function(dt) {

			for (var i = this.shapes.length - 1; i >= 0; i--) {
				this.shapes[i].update(dt);
			};

			// for (var i = 0; i < this.keys.length; i++) {
			// 	// this.player.keyActive(this.keys[i]);
			// }

			// this.resources.update(dt);

			// this.updateLoadingBar(dt);

			this.graphics.update(dt);

			// this.player.sendKeys(this.keys);
			this.player.update(dt);
			//this.controls.update();

			// this.audio.update(dt, this.graphics.camera);

			// this.events.update(dt);

			// this.checkCollisions();
		},

		onWindowResize: function() {

			this.graphics.resize();
		},

	});

	TYPE.TypingEngine = TypingEngine;

})()