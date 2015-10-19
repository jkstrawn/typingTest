(function() {

	var GraphicsEngine = my.Class({

		constructor: function() {

			this.models = [];
			this.numModelsToLoad = 0;
			this.loader = new PIXI.loaders.Loader();
			console.log(this.loader.add);
			this.stage = new PIXI.Stage(0xFFFFFF);
			this.renderer = PIXI.autoDetectRenderer(800, 800, null, true);
			this.groundOutlineGraphics = new PIXI.Graphics();

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
			this.stage.removeChild(model);
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

			this.stage.addChild(this.groundOutlineGraphics);

			PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;

			// for (bar in this.loader)
			// {
			//     console.log("Foo has property " + bar);
			// }

			// this.addGround();

			// this.numModelsToLoad = urls.dead.length + urls.live.length;
			// for (var i = urls.dead.length - 1; i >= 0; i--) {
			// 	this.loadModel(urls.dead[i], callback);
			// };

			document.body.appendChild(this.renderer.view);

			this.playerContainer = new PIXI.Container();
			// this.playerContainer.scale.set(2);

// this.playerContainer.scale.x = this.playerContainer.scale.y = 2;
			
			this.stage.addChild(this.playerContainer);

			this.loader
			    .add("traductus", "sprites_traductus.json", null)
			    .add("daedolon", "sprites_daedolon.json", null)
			    .add("icons", "sprites_abilities.json", null)
			    .add("fireball", "sprites_fireball.json", null, $.proxy(this.loadAnimated, this))
			    .add("grass.png", null)
			    .on("complete", callback)
			    .load($.proxy( this.loadedSprites, this ));

		},

		removeSprite: function(sprite) {
			this.playerContainer.removeChild(sprite);
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

			this.addGround();
			this.addAbilitySprites();
			// this.loadFireBall();

			// start animating
			window.requestAnimationFrame( animate );
		},


/************************************************************************* CUSTOM **********************************************************************/


		addAbilitySprites: function() {

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

		addGround: function() {


			var texture = PIXI.utils.TextureCache["grass.png"];
			var tiles = type.grid.getTiles();

			for (var i = tiles.length - 1; i >= 0; i--) {
				var tile = tiles[i];
				var sprite = new PIXI.Sprite(texture);
				sprite.position.x = tile.x;
				sprite.position.y = tile.y;
				sprite.scale.set(2);
				this.stage.addChildAt(sprite, 0);
			};

			this.groundOutlineGraphics.lineStyle(1, 0x000000);
			for (var i = tiles.length - 1; i >= 0; i--) {
				this.groundOutlineGraphics.drawRect(tiles[i].x, tiles[i].y, tiles[i].size, tiles[i].size);
			};
		},

		loadAnimated: function(resource) {
			console.log(resource);

			var sprite = PIXI.Sprite.fromFrame("fireball_anim_1");
			console.log(sprite);
			var explosionTextures = [];
			
			for (var i=0; i < 5; i++) 
			{
			 	var texture = PIXI.Texture.fromFrame("fireball_anim_" + (i+1));
			 	explosionTextures.push(texture);
			};
			
			// create a texture from an image path
			// add a bunch of aliens
				// create an explosion MovieClip
				var explosion = new PIXI.MovieClip(explosionTextures);
				
			
				explosion.position.x = 200
				explosion.position.y = 200;
				explosion.animationSpeed = .15;
				
				// explosion.rotation = Math.random() * Math.PI;
				explosion.scale.x = 2;
				explosion.scale.y = 2;
				
				explosion.gotoAndPlay(0);
				
				this.stage.addChild(explosion);
			
			// // start animating
			// requestAnimFrame( animate );
		},

		newGraphics: function() {
			var graphics = new PIXI.Graphics();

			this.stage.addChild(graphics);

			return graphics;
		},

		clearGraphics: function(graphics) {
			graphics.clear();
			this.stage.removeChild(graphics);
		},

		drawHealthBar: function(graphics, healthPercent, position) {
			graphics.clear();
			console.log("draw health at " + healthPercent);

			graphics.fillColor = null;
			// console.log(graphics.fillAlpha);
			// console.log(graphics.fillColor);
			// console.log(graphics.filling);
			graphics.lineStyle(1, 0xDD0000);
			graphics.drawRect(position.x + 15.5, position.y + 130.5, 50, 10);


			graphics.beginFill(0xDD0000);
			graphics.drawRect(position.x + 15.5, position.y + 130.5, healthPercent * 50, 10);

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