(function() {

	var GraphicsEngine = my.Class({

		constructor: function() {

			this.sphere = null;
			this.renderer = null;
			this.scene = null;
			this.camera = null;
			this.projector = null;
			this.container = null;
			this.mouse = new THREE.Vector2();

			this.raycaster = new THREE.Raycaster();
			this.models = [];
			this.numModelsToLoad = 0;
			this.tempObjects = [];
			this.particles = new SIM.ParticleSystem();

			this.eyeX = 0;
			this.eyeY = -200;
			this.eyeZ = 400;
			this.cameraAngle1 = 180;
			this.cameraAngle2 = 45;

			this.parameters = {
				width: 2000,
				height: 2000,
				widthSegments: 250,
				heightSegments: 250,
				depth: 1500,
				param: 4,
				filterparam: 1
			};
		},

		init: function(urls, callback) {

			this.container = document.createElement( 'div' );
			document.body.appendChild( this.container );

			stats = new Stats();
			this.container.appendChild( stats.domElement );
			this.scene = new THREE.Scene();
			this.projector = new THREE.Projector();
			this.scene.fog = new THREE.Fog( 0xffffff, 1000, 10000 );

			this.addCamera();
			this.addLights();
			this.addRendered();

			this.addGround();


			//this.controls = new THREE.OrbitControls( this.camera, this.renderer.domElement );
            
			this.numModelsToLoad = urls.dead.length + urls.live.length;
			for (var i = urls.dead.length - 1; i >= 0; i--) {
				this.loadModel(urls.dead[i], callback);
			};
			for (var i = urls.live.length - 1; i >= 0; i--) {
				this.loadAnimated(urls.live[i], callback);
			};
			//callback();
			this.particles.init(this.scene);



			var vector = new THREE.Vector3( 0, 0, -1 );
			vector.applyQuaternion( this.camera.quaternion );
			this.camera.position.add( vector.multiplyScalar( -30 ));



		},

		addGround: function() {

			var floorTexture = new THREE.ImageUtils.loadTexture( 'res/textures/swamp.jpg' );
			floorTexture.anisotropy = 16;
			floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping; 
			floorTexture.repeat.set( 10, 10 );
			var floorMaterial = new THREE.MeshLambertMaterial( { map: floorTexture, side: THREE.DoubleSide } );
			var floorGeometry = new THREE.PlaneGeometry(200, 200, 10, 10);
			var floor = new THREE.Mesh(floorGeometry, floorMaterial);
			// floor.position.set(0, 0, 0);
			//floor.rotation.x = Math.PI / 2;
			this.scene.add(floor);
		},

		addRoomSpotParticles: function(startX, startY, segments, gridWidth, gridLength) {

			var position = new THREE.Vector3(startX + 4, startY, 4);
			var width = gridWidth * segments - 8;
			var length = gridLength - 8;

			this.particles.addBoundingEmitter(position, width, length, segments);
		},

		addFlame: function(position) {

			var flameLight = new THREE.PointLight( 0xffcc00, 1.5, 20 );
			flameLight.position.set(position.x, position.y, position.z);
			this.scene.add( flameLight );
			this.particles.addFlameEmitter(position);
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

		loadAnimated: function(url, callback) {

			var self = this;

			var model = new AnimatedModelLoader();

			model.load( url, function() {

				console.log(model);
				self.models.push({
					model: model,
					url: url,
					animated: true
				});
				self.numModelsToLoad--;
				if (self.numModelsToLoad == 0) {
					callback();
				}
			});
		},

		removeDraggingObjects: function() {
			for (var i = this.tempObjects.length - 1; i >= 0; i--) {
				this.scene.remove(this.tempObjects[i]);
			};

			this.tempObjects = [];
			this.particles.stopParticles("Bounding");
		},

		addTempObject: function(room) {

			this.tempObjects.push(room);
			this.scene.add(room);
		},

		addBoundingBox: function(gridSection) {

			gridSection.updateMaterialVector(this.camera.position);
			this.tempObjects.push(gridSection.model);
			this.scene.add(gridSection.model);
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

		addCamera: function() {

			this.camera = new THREE.PerspectiveCamera( 55, window.innerWidth / window.innerHeight, 1, 2000 );
			this.camera.position.set( 0, 0, 175 );
			this.camera.lookAt( new THREE.Vector3( 0, 0, 0 ) );
		},

		addLights: function() {
			var hemiLight = new THREE.HemisphereLight(0x404040, 0x404040, .6);
			hemiLight.position.set( 0, 500, 0 );
			this.scene.add(hemiLight);

			var ambientLight = new THREE.AmbientLight( 0xffffff );
			this.scene.add( ambientLight );

			sim.pointLight = new THREE.PointLight( 0xffcc00, 2, 30 );
			sim.pointLight.position.set( 0, 100, 0 );
			this.scene.add( sim.pointLight );
		},

		addRendered: function() {
			this.renderer = new THREE.WebGLRenderer();
			this.renderer.setPixelRatio( window.devicePixelRatio );
			this.renderer.setSize( window.innerWidth, window.innerHeight );
			this.container.appendChild( this.renderer.domElement );
		},

		getParent: function(model) {

			if (model.parent.parent != null ) {
				return this.getParent(model.parent);
			}
			return model;
		},

		setRightMouseButtonDown: function(isDown) {
			this.mouse.isRightDown = isDown;
		},

		mouseMove: function(event) {

			var newX = ( event.clientX / window.innerWidth ) * 2 - 1;
			var newY = - ( (event.clientY - 19) / window.innerHeight ) * 2 + 1;

			var distanceX = this.mouse.x - newX;
			var distanceY = this.mouse.y - newY;

			this.mouse.x = newX;
			this.mouse.y = newY;
		},

		getMousePositionByZ: function(event, z) {

			var x = ( event.clientX / window.innerWidth ) * 2 - 1;
			var y = - ( (event.clientY - 19) / window.innerHeight ) * 2 + 1;

			var vector = new THREE.Vector3(x, y, 0.5);
			this.projector.unprojectVector( vector, this.camera );
			this.raycaster.set( this.camera.position, vector.sub( this.camera.position ).normalize() );
			var factor = (z - this.camera.position.z) / this.raycaster.ray.direction.z;
	        var position = new THREE.Vector3(
	            this.camera.position.x + this.raycaster.ray.direction.x * factor,
	            this.camera.position.y + this.raycaster.ray.direction.y * factor,
	            this.camera.position.z + this.raycaster.ray.direction.z * factor
	        );

			return position;
		},

		resize: function() {
			
			// this.camera.aspect = window.innerWidth / window.innerHeight;
			// this.camera.updateProjectionMatrix();

			// this.renderer.setSize( window.innerWidth, window.innerHeight );

		},

		zoom: function(increase) {

			var vector = new THREE.Vector3( 0, 0, -1 );

			vector.applyQuaternion( this.camera.quaternion );

			this.camera.position.add( vector.multiplyScalar( increase * 6 ));

			if (this.camera.position.z < 0)
				this.camera.position.z = 0;
		},

		moveCamera: function(direction) {
			switch (direction) {
				case "up":
					this.camera.position.y += 1;
					break
				case "down":
					this.camera.position.y -= 1;
					break
				case "left":
					this.camera.position.x -= 1;
					break
				case "right":
					this.camera.position.x += 1;
					break
			}
		},

		addModel: function(model) {
			this.scene.add(model);
		},

		removeModel: function(model) {
			this.scene.remove(model);
		},

		render: function() {

			this.particles.render();
			this.renderer.render( this.scene, this.camera );
			TWEEN.update();
		},

		update: function(dt) {
			THREE.AnimationHandler.update( dt / 1000 );
		},

	});

	SIM.GraphicsEngine = GraphicsEngine;
})()