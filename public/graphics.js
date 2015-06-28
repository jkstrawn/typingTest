(function() {

	var GraphicsEngine = my.Class({

		constructor: function() {

			this.models = [];
			this.numModelsToLoad = 0;
			this.loader = new PIXI.loaders.Loader();
			this.stage = null;
			this.graphics = new PIXI.Graphics();
			this.stage = new PIXI.Stage(0xFFFFFF);
			this.renderer = PIXI.autoDetectRenderer(800, 800, null, true);

			this.playerContainer = null;
			this.staminaBar = null;
		},

		loadModel: function(url, callback) {

			var that = this;
			var loader = new THREE.JSONLoader();


			loader.load( url, function ( geometry, materials ) {

				var faceMaterial = new THREE.MeshFaceMaterial( materials );
				var model = new THREE.Mesh( geometry, faceMaterial );

				that.models.push({
					model: model,
					url: url,
					animated: false
				});

				that.numModelsToLoad--;
				if (that.numModelsToLoad == 0) {
					callback();
				}
			} );
		},

		resize: function() {
			
			// this.camera.aspect = window.innerWidth / window.innerHeight;
			// this.camera.updateProjectionMatrix();

			// this.renderer.setSize( window.innerWidth, window.innerHeight );

		},

		addModel: function(model) {
			this.scene.add(model);
		},

		removeModel: function(model) {
			this.scene.remove(model);
		},

		render: function() {
	    	this.renderer.render(this.stage);
		},

		update: function(dt) {
			// THREE.AnimationHandler.update( dt / 1000 );
		},

		getModel: function(url) {

			for (var i = this.models.length - 1; i >= 0; i--) {
				if (this.models[i].url == url) {

					var model;

					if (this.models[i].animated) {
						model = this.models[i].model.createModel();
					} else {
						model = this.models[i].model.clone();

						model.traverse(function(thing) {
							if (thing.material instanceof THREE.MeshLambertMaterial) {
								//thing.material.map.magFilter = THREE.LinearFilter;
								//thing.material.map.minFilter = THREE.NearestMipMapLinearFilter;
								thing.material.map.anisotropy = 16;
							}
						});						
					}


					return model;
				}
			};

			return null;
		},

		init: function(urls, callback, grid) {

			this.renderer.backgroundColor = 0xFFFFFF;
			console.log(this.renderer);
			this.graphics.lineStyle(1, 0xFF0000);

			this.stage.addChild(this.graphics);

			PIXI.scaleModes.DEFAULT = PIXI.scaleModes.NEAREST;

			// for (bar in this.loader)
			// {
			//     console.log("Foo has property " + bar);
			// }

			// this.addGround();

			// this.numModelsToLoad = urls.dead.length + urls.live.length;
			// for (var i = urls.dead.length - 1; i >= 0; i--) {
			// 	this.loadModel(urls.dead[i], callback);
			// };

			this.drawStaminaBar();

			document.body.appendChild(this.renderer.view);

			this.playerContainer = new PIXI.DisplayObjectContainer();
			// this.playerContainer.scale.set(2);

// this.playerContainer.scale.x = this.playerContainer.scale.y = 2;
			
			this.stage.addChild(this.playerContainer);

			this.loader
			    .add("traductus", "SpriteSheet.json", null)
			    .add("icons", "abilitySprites.json", null)
			    .add("tile.png", null)
			    .on("complete", callback)
			    .load($.proxy( this.loadedSprites, this ));

		},

		getSprite: function(name) {
			console.log("create sprite with name " + name);

			var sprite = PIXI.Sprite.fromFrame(name);
			// sprite.anchor.x = 0.5;
			// sprite.anchor.y = 0.5;
			sprite.scale.set(2)
			this.playerContainer.addChild(sprite);
			return sprite;
		},

		loadedSprites: function(loader, resources) {

			var texture = PIXI.TextureCache["tile.png"];
			var squares = type.grid.getSquares();

			for (var i = squares.length - 1; i >= 0; i--) {
				var square = squares[i];
				var sprite = new PIXI.Sprite(texture);
				sprite.position.x = square.x;
				sprite.position.y = square.y;
				sprite.scale.set(2);
				this.stage.addChildAt(sprite, 0);
			};

			for (var i = squares.length - 1; i >= 0; i--) {
				this.graphics.drawRect(squares[i].x, squares[i].y, squares[i].size, squares[i].size);
			};

			this.setAbilitySprites();
			// start animating
			window.requestAnimationFrame( animate );
		},

		setAbilitySprites: function() {

			var sprite = PIXI.Sprite.fromFrame("charge");
			sprite.position.x = 100;
			sprite.position.y = 530;
			sprite.scale.set(2);
			this.playerContainer.addChild(sprite);

			var sprite = PIXI.Sprite.fromFrame("attack");
			sprite.position.x = 240;
			sprite.position.y = 530;
			sprite.scale.set(2);
			this.playerContainer.addChild(sprite);

			var sprite = PIXI.Sprite.fromFrame("crush");
			sprite.position.x = 380;
			sprite.position.y = 530;
			sprite.scale.set(2);
			this.playerContainer.addChild(sprite);

			var sprite = PIXI.Sprite.fromFrame("smash");
			sprite.position.x = 520;
			sprite.position.y = 530;
			sprite.scale.set(2);
			this.playerContainer.addChild(sprite);
		},


/************************************************************************* CUSTOM **********************************************************************/

		addGround: function() {

			// var floorTexture = new THREE.ImageUtils.loadTexture( 'res/textures/swamp.jpg' );
			// floorTexture.anisotropy = 16;
			// floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping; 
			// floorTexture.repeat.set( 2, 2 );
			// var floorMaterial = new THREE.MeshLambertMaterial( { map: floorTexture, side: THREE.DoubleSide } );
			// var floorGeometry = new THREE.PlaneGeometry(200, 200, 2, 2);
			// var floor = new THREE.Mesh(floorGeometry, floorMaterial);
			// // floor.position.set(0, 0, 0);
			// //floor.rotation.x = Math.PI / 2;
			// this.scene.add(floor);
		},

		drawStaminaBar: function() {
			// var geometry = new THREE.PlaneGeometry( 5 , 10 );
			// var material = new THREE.MeshBasicMaterial( {color: 0x22aa22, side: THREE.DoubleSide} );
			// this.staminaBar = new THREE.Mesh( geometry, material );
			// this.staminaBar.position.set(-100 + 2.5, 100, 1);
			// this.scene.add( this.staminaBar );
		},

		updateStaminaBar: function(amount) {
			// this.scene.remove(this.staminaBar);
			// var geometry = new THREE.PlaneGeometry( amount , 10 );
			// var material = new THREE.MeshBasicMaterial( {color: 0x22aa22, side: THREE.DoubleSide} );
			// this.staminaBar = new THREE.Mesh( geometry, material );
			// this.staminaBar.position.set(-100 + amount/2, 100, 1);
			// this.scene.add( this.staminaBar );
		},
	});

	TYPE.GraphicsEngine = GraphicsEngine;
})()