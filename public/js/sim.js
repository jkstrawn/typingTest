(function() {

	var CastleSim = my.Class({

		//http://javascriptissexy.com/understand-javascript-callback-functions-and-use-them/
		that: this,

		constructor: function() {

			this.otherPlayers = [];
			this.shapes = [];
			this.killedBugs = [];
			this.pointLight = null;
			this.stats = null;

			this.clock = new THREE.Clock();
			this.gui = null;
			this.keys = [];
			this.controls = new SIM.Controls();
			this.graphics = new SIM.GraphicsEngine();
			this.audio = new SIM.AudioManager();
			this.events = new SIM.EventManager();
			this.player = new SIM.Player();
			this.network = new SIM.Network();

			this.modelUrls = {
				dead: [
					"res/models/frog/frog_final2.json",
					"res/models/bug/bugLowRes.js",
					"res/models/frog/tongue.json",
				],
				live: [
					"res/models/servant/manfred.js"
				]
			};

			this.loadingBar = {
				max: 0,
				current: 0,
				finished: null
			};
		},

		init: function() {

			// listen for messages from the gui
			// window.addEventListener( 'create-room', $.proxy(this.clickRoomButton, this) );
			// window.addEventListener( 'hire-servant', $.proxy(this.hireServant, this) );
			// window.addEventListener( 'build-peasant', $.proxy(this.buildPeasantHouse, this) );
			// window.addEventListener( 'slider', $.proxy(this.sliderChanged, this) );
			// window.addEventListener("toggleMute", $.proxy(function() {
			// 	this.audio.toggleSound();
			// }, this));

			// this.grid.init();
			this.graphics.init(this.modelUrls, $.proxy( this.loadedModels, this ));
			// this.gui = new BlendCharacterGui();
		},

		loadedModels: function() {

			this.player.init();

			// //add initial hall
			// this.initialHall = this.rooms.addInitialHall();

			// //add initial servant
			// this.finishedHireServant();

			// var flameLocations = [new THREE.Vector3(-9.3, 9.5, 5.2), new THREE.Vector3(-30, 9.5, 5.2), 
			// 	new THREE.Vector3(-48, 9.5, 5.2), new THREE.Vector3(12, 9.5, 5.2), new THREE.Vector3(34, 9.5, 5.2)];

			// for(var i = 0; i < flameLocations.length; i++) {
			// 	this.graphics.addFlame(flameLocations[i]);
			// 	this.audio.addSound(["torch1.mp3"], 50, 1, flameLocations[i], 
			// 		{ loop: true, autoplay: true })
			// }
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

		clickRoomButton: function(data) {

			if (data.detail.room != "Bedroom" || this.resources.stone >= 2) {
				var roomType = this.rooms.getTypeByName(data.detail.room);
				this.grid.show(roomType.width);

				var room = this.rooms.generateDraggingRoom(data.detail.room);

				this.draggingShape = room;
				this.graphics.addTempObject(room.model);

			}
		},

		hireServant: function() {

			if (this.resources.food >= 2) {
				var that = this;
				this.setLoadingBar(3, "Getting Servant", $.proxy(this.finishedHireServant, this), function() {
					that.resources.changeValue("Food", -2);
				});
			}
		},

		buildPeasantHouse: function() {

			this.setLoadingBar(3, "Getting Peasant", $.proxy(this.finishedBuildPeasantHouse, this), function() {});
		},

		sliderChanged: function(data) {

			this.resources.setPeasantProductionSlider(data.detail.food, data.detail.stone);
		},

		// PROCESS EVENTS

		setLoadingBar: function(time, name, callback, successful) {

			if (this.loadingBar.current) {
				return;
			}

			successful();
			this.loadingBar.max = time * 1000;
			this.loadingBar.finished = callback;
			this.gui.createLoadingBar(name, time);
		},

		finishedHireServant: function() {

			this.resources.servants++;
			this.gui.setValue("Servants", this.resources.servants);

			var gridSection = this.grid.get(2, 0);
			var mesh = new THREE.Mesh(
				new THREE.BoxGeometry(5, 10, 5), 
				new THREE.MeshBasicMaterial( { color: 0xFFFFFF } )
				);

			mesh = this.graphics.getModel(this.modelUrls.live[0]);
			mesh.position.set(gridSection.x + 20, gridSection.y + 1.2, 10);

			var servant = new SIM.Servant(mesh, this.initialHall);
			this.servant = servant;
			this.addShape(servant);
		},

		finishedBuildPeasantHouse: function() {

			this.resources.peasants++;
			this.gui.setValue("Peasants", this.resources.peasants);		
		},

		clearDragging: function() {
			for (var i = this.shapes.length - 1; i >= 0; i--) {
				if (this.shapes[i] instanceof SIM.GridSnapper) {
					this.shapes.splice(i, 1);
				}
			};

			this.graphics.removeDraggingObjects();
			this.draggingShape = null;
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

		placeRoomOnHoverLocation: function() {

			var cost = 0;
			var rooms = this.rooms.getRoomsToPlace(this.hoveredShape, this.draggingShape.type.name);
			var roomChanges = this.rooms.getRoomsToChange(this.hoveredShape, this.draggingShape.type.name);

			for (var i = rooms.length - 1; i >= 0; i--) {
				this.grid.setRoom(rooms[i].grid, rooms[i].room);
				this.addShape(rooms[i].room);
				cost += rooms[i].room.type.cost;
			};
			for (var i = roomChanges.length - 1; i >= 0; i--) {
				roomChanges[i].room.model = roomChanges[i].model;
				this.graphics.removeModel(roomChanges[i].model);
				this.graphics.addModel(roomChanges[i].model);
			};

			this.resources.changeValue("Stone", cost * -1);
			this.clearDragging();
			this.rooms.clearTempRoom();
			this.rooms.clearRoomGridNames();
			this.grid.updateRoomPoints();
		},

		createAsteroid: function(mobData) {
			console.log("creating asteroid with id of " + mobData.id);
			var model = this.graphics.getModel(this.modelUrls.dead[1]);
			model.scale.set(mobData.size / 4, mobData.size / 4, mobData.size / 4);
			model.position.set(mobData.pos.x, mobData.pos.y, 0);
			this.graphics.addModel(model);
			var shape = new SIM.Bug(mobData.id, model, mobData.size);
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

		turnServantsRed: function() {

			for (var i = this.shapes.length - 1; i >= 0; i--) {
				if (this.shapes[i] instanceof SIM.Servant) {
					this.shapes[i].turnRed();
				}
			};
		},

		getRoomByName: function(roomName) {

			return this.rooms.getRoomByName(roomName);
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

			var delta = this.clock.getDelta();

			this.graphics.render();
		},

		update: function(dt) {

			for (var i = this.shapes.length - 1; i >= 0; i--) {
				this.shapes[i].update(dt);
			};

			for (var i = 0; i < this.keys.length; i++) {
				// this.player.keyActive(this.keys[i]);
			}

			// this.resources.update(dt);

			// this.updateLoadingBar(dt);

			this.graphics.update(dt);

			this.player.update(dt);
			//this.controls.update();

			// this.audio.update(dt, this.graphics.camera);

			// this.events.update(dt);

			this.checkCollisions();
		},



		checkCollisions: function() {

			//for each bullet
				//check against each asteroid and enemy
					// (endOfPoint.x - this.position.)^2 + (y - center_y)^2 < radius^2.
					//if collision, destroy asteroid and bullet
		},

		randomizeWind: function() {

		},

		updateLoadingBar: function(dt) {

			if (this.loadingBar.max) {

				this.loadingBar.current += dt;
				this.gui.setLoadingBar(this.loadingBar.current / 1000);

				if (this.loadingBar.current > this.loadingBar.max) {
					this.loadingBar.max = 0;
					this.loadingBar.current = 0;
					this.gui.removeLoadingBar();
					this.loadingBar.finished();
				}
			}
		},

		onWindowResize: function() {

			this.graphics.resize();
		},

	});

	SIM.CastleSim = CastleSim;

})()