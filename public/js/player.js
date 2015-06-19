(function() {

	var Player = my.Class({

		constructor: function() {


			this.keys = {	"forward":38,
							"turnL":37, 
							"turnR":39,
							"fire":32
			};
			this.id = -1;
			this.health = 10;
			this.position = new THREE.Vector3(0, 0, 0);
			this.speed = 30;
			this.velocity = {x: 0, y: 0};
			this.rotation = 0;


			//this.move();
		},

		init: function() {
			console.log("inited");
			this.model = sim.graphics.getModel(sim.modelUrls.dead[0]);
			this.model.position.set(this.position.x, this.position.y, this.position.z);
			this.model.rotation.set(Math.PI/2, 0, 0);
			// this.model.scale.set(4, 4, 4);
			sim.graphics.scene.add(this.model);
		},

		setId: function(id) {
			this.id = id;
		},

		keyActive: function(key) {
			switch (key) {

				case this.keys.forward:
					this.moveForward();
					break;
				case this.keys.turnL:
					this.turnLeft();
					break;
				case this.keys.turnR:
					this.turnRight();
					break;
				case this.keys.fire:
					this.fireBullet();
			}
		},

		fireBullet: function() {

			var model = sim.graphics.getBeamModel(1, 10, this.rotation);
			sim.graphics.scene.add(model);
			model.position.copy(this.position);
			var bullet = new SIM.Projectile(model, this.position.clone(), this.rotation);

			sim.addShape(bullet);
		},

		moveForward: function() {
			this.velocity.x += Math.cos(this.rotation);
			this.velocity.y += Math.sin(this.rotation);
		},

		turnRight: function() {
			this.rotation -= .4;
			this.model.rotation.set(Math.PI/2, this.rotation, 0);
		},

		turnLeft: function() {
			this.rotation += .4;
			this.model.rotation.set(Math.PI/2, this.rotation, 0);
		},

		move: function(direction) {

			if (sim) {
				console.log("moving camera");
				sim.graphics.zoom(1);
			}
		},

		degreesToRadians: function(degrees) {
			return degrees * Math.PI / 180;
		},

		update: function (dt) {

			var delta = dt / 1000;

			var newPosition = this.position.clone();
			var dx = this.velocity.x * delta * this.speed;
			var dy = this.velocity.y * delta * this.speed;
			newPosition.add(new THREE.Vector3(dx, dy, 0));

			this.velocity.x *= .99;
			this.velocity.y *= .99;

			// if (this.velocity < .1) this.velocity = 0;

			if (this.velocity.x < .1 && this.velocity.x > -.1) this.velocity.x = 0;
			if (this.velocity.y < .1 && this.velocity.y > -.1) this.velocity.y = 0;
			// if (this.velocity.z < .5 && this.velocity.z > -.5) this.velocity.z = 0;

			// this.velocity.x -= this.velocity.x * 10.0 * delta;
			// this.velocity.z -= this.velocity.z * 10.0 * delta;

		// 	//this.velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

		// 	if ( this.moveForward ) this.velocity.z -= 400.0 * delta;
		// 	if ( this.moveBackward ) this.velocity.z += 400.0 * delta;

		// 	if ( this.moveLeft ) this.velocity.x -= 400.0 * delta;
		// 	if ( this.moveRight ) this.velocity.x += 400.0 * delta;

		// 	if ( this.isOnObject === true ) {

		// 		this.velocity.y = Math.max( 0, this.velocity.y );

		// 	}

		// 	var toMove = new THREE.Vector3(this.velocity.x * delta, this.velocity.y * delta, this.velocity.z * delta);

		// 	var planes = [];
		// 	planes.push(sim.graphics.plane);
		// 	var newPosition = sim.controls.move(toMove);

			this.model.position.copy(newPosition);
			this.position.copy(newPosition);

		// 	if (this.velocity.x || this.velocity.y || this.velocity.z) {
		// 	    newPosition.x = Math.round(newPosition.x * 100) / 100;
		// 	    newPosition.y = Math.round(newPosition.y * 100) / 100;
		// 	    newPosition.z = Math.round(newPosition.z * 100) / 100;
		// 	    newPosition.id = 1;
				
		// 		this.model.playContinued("walk", 1, 2);
		// 		sim.network.sendPlayerLocation(newPosition);
  //           } else {
		// 		this.model.playContinued("idle", 1, 2);
  //           }




		// 	this.raycaster.ray.origin.copy( newPosition );
		// 	var collisionResults = this.raycaster.intersectObjects( planes );
			

		// // 	yawObject.translateX( this.velocity.x * delta );
		// // 	yawObject.translateY( this.velocity.y * delta ); 
		// // 	yawObject.translateZ( this.velocity.z * delta );

		// 	if ( this.position.y < 10 ) {

		// 		this.velocity.y = 0;
		// 		this.position.y = 10;

		// 		canJump = true;

		// 	}
		// 	this.moveForward = this.moveRight = this.moveLeft = this.moveBackward = false;

		// 	// sim.controls.move(this.position);

		},


	});

	SIM.Player = Player;
})()