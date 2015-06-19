(function() {

	var GraphicsEngine = my.Class({

		constructor: function() {

			this.sphere = null;
			this.toIncrease = 1.02;
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

		createMobModel: function() {
			var mapB = THREE.ImageUtils.loadTexture( "res/textures/archer.png" );

			var materialB = new THREE.SpriteMaterial( { map: mapB, color: 0xffffff} );
			var material = materialB.clone();

			var sprite = new THREE.Sprite( material );
			sprite.scale.set( 10, 20, 1 );
			return sprite;
		},

		createCircleAroundMob: function(x, y, z) {
			var material = new THREE.MeshBasicMaterial({
				color: 0x00ff00, transparent: true, opacity: .2
			});

			var radius = 50;
			var segments = 32;

			var circleGeometry = new THREE.CircleGeometry( radius, segments );				
			var circle = new THREE.Mesh( circleGeometry, material );
			circle.rotation.x = -Math.PI / 2;
			circle.position.set(x, y + .1, z);
			this.scene.add( circle );
		},

		createPlayer: function() {

			model = new THREE.Mesh(new THREE.BoxGeometry(5, 5, 5), new THREE.MeshLambertMaterial({color: 0xcccccc}));
			this.scene.add(model);
			return model;
		},

		movePlayer: function(player, dataModel) {
			player.model.position.x = dataModel.x;
			player.model.position.y = dataModel.y;
			player.model.position.z = dataModel.z;
			player.model.rotation.y = dataModel.rotation;
		},

		getBeamModel: function(width, length, rotation) {


			var lightTexture = THREE.ImageUtils.loadTexture("res/textures/light4.png");
			var lightMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFF99, map: lightTexture, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false, side: THREE.DoubleSide });
			
			var lightBeamShape = new THREE.PlaneBufferGeometry(length, width, width, 100);
			var lightBeamMesh = new THREE.Mesh(lightBeamShape, lightMaterial);
			

			lightBeamMesh.rotation.set(0, 0, rotation);

			return lightBeamMesh;
		},

		getCustomMaterial: function(index, camera) {


			var fShader = THREE.FresnelShader;
			
			var fresnelUniforms = 
			{
				"mRefractionRatio": { type: "f", value: 1.02 },
				"mFresnelBias": 	{ type: "f", value: 0.1 },//0.1
				"mFresnelPower": 	{ type: "f", value: 2.0 }, //2.0
				"mFresnelScale": 	{ type: "f", value: 1.0 }, //1.0
				"tCube": 			{ type: "t", value: camera.renderTarget } //  textureCube }
			};
			
			// create custom material for the shader
			var customMaterial = new THREE.ShaderMaterial( 
			{
			    uniforms: 		fresnelUniforms,
				vertexShader:   fShader.vertexShader,
				fragmentShader: fShader.fragmentShader
			}   );
			
			return customMaterial;
		},

		addGround: function() {



			var floorTexture = new THREE.ImageUtils.loadTexture( 'res/textures/swamp.jpg' );
			floorTexture.anisotropy = 16;
			floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping; 
			floorTexture.repeat.set( 10, 10 );
			var floorMaterial = new THREE.MeshLambertMaterial( { map: floorTexture, side: THREE.DoubleSide } );
			var floorGeometry = new THREE.PlaneGeometry(1200, 1200, 50, 50);
			var floor = new THREE.Mesh(floorGeometry, floorMaterial);
			floor.position.set(0, 0, -20);
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
				console.log(faceMaterial);
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
								//thing.material.map.anisotropy = 16;
							}
						});						
					}


					return model;
				}
			};

			return null;
		},

		addCamera: function() {

			// var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
			// var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;
			// this.camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
			// //this.scene.add(this.camera);
			// this.camera.position.set(0, 150, 400);
			// this.camera.lookAt(new THREE.Vector3( 0, 0, 0 ));	

			this.camera = new THREE.PerspectiveCamera( 55, window.innerWidth / window.innerHeight, 0.5, 3000000 );
			this.camera.position.set( 0, 0, 100 );
			this.camera.lookAt( new THREE.Vector3( 0, 0, 0 ) );

			// this.camera = new THREE.PerspectiveCamera( 55, window.innerWidth / window.innerHeight, 1, 1000000 );
		},

		addLights: function() {
			var hemiLight = new THREE.HemisphereLight(0x404040, 0x404040, .6);
			hemiLight.position.set( 0, 500, 0 );
			this.scene.add(hemiLight);

			//var hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
			//hemiLight.color.setHSL( .5, .5, .5 );
			//hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
			//hemiLight.position.set( 0, 500, 0 );
			//this.scene.add( hemiLight );

			var ambientLight = new THREE.AmbientLight( 0xffffff );
			this.scene.add( ambientLight );

			sim.pointLight = new THREE.PointLight( 0xffcc00, 2, 30 );
			sim.pointLight.position.set( 0, 100, 0 );
			this.scene.add( sim.pointLight );



			// var spotlight3 = new THREE.SpotLight(0xffffff);
			// spotlight3.position.set(100, 60, 0);
			// spotlight3.shadowDarkness = 0.7;
			// spotlight3.intensity = 2;
			// spotlight3.castShadow = true;
			// spotlight3.shadowCameraFov = 100;
			// spotlight3.shadowCameraFar = 150;
			// var lightTarget = new THREE.Object3D();
			// lightTarget.position.set(120, 0, 0);
			// spotlight3.target = lightTarget;
			// this.scene.add(spotlight3);
			// sim.l = spotlight3;
		},

		addRendered: function() {

			this.renderer = new THREE.WebGLRenderer( { 
				antialias: true, 
				alpha: false, 
				clearColor: 0xfafafa, 
				clearAlpha: 1, 
				shadowMapEnabled: true,
				shadowMapType: THREE.PCFSoftShadowMap

			} );

			this.renderer.setSize( window.innerWidth, window.innerHeight );
			this.renderer.domElement.style.position = "relative";
			this.container.appendChild( this.renderer.domElement );

			this.renderer.setClearColor( this.scene.fog.color, 1 );

			this.renderer.gammaInput = true;
			this.renderer.gammaOutput = true;
			this.renderer.physicallyBasedShading = true;

			this.renderer.shadowMapEnabled = true;
			this.renderer.shadowMapSoft = true;

// this.renderer.shadowCameraNear = 3;
// this.renderer.shadowCameraFar = this.camera.far;
// this.renderer.shadowCameraFov = 50;

// this.renderer.shadowMapBias = 0.0039;
// this.renderer.shadowMapDarkness = 0.5;
// this.renderer.shadowMapWidth = 1024;
// this.renderer.shadowMapHeight = 1024;
		},

		addSkyDome: function() {

			var cubeMap = new THREE.CubeTexture( [] );
			cubeMap.format = THREE.RGBFormat;
			cubeMap.flipY = false;

			var loader = new THREE.ImageLoader();
			loader.load( 'res/textures/marsh.jpg', function ( image ) {
				var getSide = function ( x, y ) {
					var size = 512;

					var canvas = document.createElement( 'canvas' );
					canvas.width = size;
					canvas.height = size;

					var context = canvas.getContext( '2d' );
					context.drawImage( image, - x * size, - y * size );

					return canvas;

				};

				cubeMap.images[ 0 ] = getSide( 2, 1 ); // px
				cubeMap.images[ 1 ] = getSide( 0, 1 ); // nx
				cubeMap.images[ 2 ] = getSide( 1, 0 ); // py
				cubeMap.images[ 3 ] = getSide( 1, 2 ); // ny
				cubeMap.images[ 4 ] = getSide( 1, 1 ); // pz
				cubeMap.images[ 5 ] = getSide( 3, 1 ); // nz
				cubeMap.needsUpdate = true;

			} );

			var cubeShader = THREE.ShaderLib['cube'];
			cubeShader.uniforms['tCube'].value = cubeMap;

			var skyBoxMaterial = new THREE.ShaderMaterial( {
				fragmentShader: cubeShader.fragmentShader,
				vertexShader: cubeShader.vertexShader,
				uniforms: cubeShader.uniforms,
				depthWrite: false,
				side: THREE.BackSide
			});

			var skyBox = new THREE.Mesh(
				new THREE.BoxGeometry( 1000000, 1000000, 1000000 ),
				skyBoxMaterial
			);
			
			this.scene.add( skyBox );
		},

		getHoveredShape: function(shapes) {

			var vector = new THREE.Vector3( this.mouse.x, this.mouse.y, 1 );
			this.projector.unprojectVector( vector, this.camera );
			this.raycaster.set( this.camera.position, vector.sub( this.camera.position ).normalize() );
			var intersects = this.raycaster.intersectObjects( shapes, true );

			if ( intersects.length > 0 ) {
				return this.getParent(intersects[0].object);
			}
			return null;
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

			if (this.mouse.isRightDown) {
				console.log("move");

				var glowMaterial = this.getCustomMaterial(this.toIncrease);

				this.sphere.material = glowMaterial;

				this.toIncrease -= .01;
				console.log(this.toIncrease);
			}




			// camRot = sim.controls.getRotation();

			// var vector = new THREE.Vector3( -3, 0, -3 );
			// var axis = new THREE.Vector3( 0, 1, 0 );
			// vector.applyAxisAngle( axis, camRot.y - Math.PI/2 );
			// playerPos = sim.player.model.position;
			// vector.add(playerPos);
			// sim.box.position.set(vector.x, vector.y + 6, vector.z);



			// var camDir = sim.controls.getDirection();
			// camPos = sim.controls.getPosition();
			// handPos = camPos.multiply(new THREE.Vector3(.01, .01, 0));
			// newPosition = camDir.multiply(new THREE.Vector3(250, 250, 250)).add(sim.box.position);




			// this.beam.rotation.set(0, camRot.y - Math.PI/2, -camRot.x);
			// this.beam.position.set(newPosition.x, newPosition.y, newPosition.z);

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
			
			this.camera.aspect = window.innerWidth / window.innerHeight;
			this.camera.updateProjectionMatrix();

			this.renderer.setSize( window.innerWidth, window.innerHeight );

		},

		focusCamera: function(x, y, z) {

			var cameraZ = this.camera.position.z;

			var tween = new TWEEN.Tween(this.camera.position).to({
			    x: x,
			    y: y + cameraZ / 2 - 15,
			    z: cameraZ
			}, 800).easing(TWEEN.Easing.Linear.None).onUpdate(function (time) {
				//console.log(test + " at " + new Date())
			    //that.camera.lookAt(new THREE.Vector3(x,y,cameraZ));
			}).onComplete(function () {
			    //that.camera.lookAt(new THREE.Vector3(x,y,cameraZ));
			}).start();
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


			// this.sphere.visible = false;
			// this.refractSphereCamera.updateCubeMap( this.renderer, this.scene );
			// this.sphere.visible = true;
			// this.sphere2.visible = false;
			// this.refractSphereCamera2.updateCubeMap( this.renderer, this.scene );
			// this.sphere2.visible = true;

			this.particles.render();
			this.renderer.render( this.scene, this.camera );
			TWEEN.update();
		},

		update: function(dt) {


			//var glowMaterial = this.getCustomMaterial(this.toIncrease, this.refractSphereCamera);

			//this.sphere.material = glowMaterial.clone();
			//this.sphere2.material = glowMaterial.clone();

			this.toIncrease -= .005;
			if (this.toIncrease < -1)
				this.toIncrease = 1;
			//console.log(this.toIncrease);
			//this.controls.update();
			THREE.AnimationHandler.update( dt / 1000 );
		},

	});

	SIM.GraphicsEngine = GraphicsEngine;
})()