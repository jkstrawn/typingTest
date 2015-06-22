(function() {

	var Player = my.Class({

		constructor: function() {


			this.keys = {	"forward":38,
							"turnL":37, 
							"turnR":39,
							"fire":32,
			};
			this.id = -1;
			this.health = 10;
			this.position = new THREE.Vector3(0, 0, 0);
			this.speed = 30;
			this.velocity = {x: 0, y: 0};
			this.rotation = 0;
			this.tongue = null;
			this.tongueTimer = 0;
			this.stamina = 5;


			//this.move();
		},

		init: function() {
			console.log("inited");
			this.model = sim.graphics.getModel(sim.modelUrls.dead[0]);
			this.model.position.set(this.position.x, this.position.y, this.position.z);
			this.model.rotation.set(Math.PI/2, 0, 0);
			// this.model.scale.set(4, 4, 4);
			sim.graphics.addModel(this.model);
		},

		setId: function(id) {
			this.id = id;
		},

		sendKeys: function(keys) {
			for (var i = keys.length - 1; i >= 0; i--) {
				switch (keys[i]) {

					case this.keys.turnL:
						this.turnLeft();
						break;
					case this.keys.turnR:
						this.turnRight();
						break;
				}
			};
		},

		keyActive: function(key) {
			switch (key) {

				case this.keys.forward:
					this.moveForward();
					break;
				case this.keys.fire:
					this.shootTongue();
			}
		},

		addStamina: function() {
			this.stamina += 5;
			sim.graphics.updateStaminaBar(this.stamina);
		},

		shootTongue: function() {
			if (this.stamina < 1) {
				return;
			}
			if (this.tongueTimer > 0) {
				return;
			}

			this.stamina--;
			sim.graphics.updateStaminaBar(this.stamina);

			this.tongue = sim.graphics.getModel(sim.modelUrls.dead[2]);
			this.setTonguePositionAndRotation();
			sim.graphics.addModel(this.tongue);
			this.tongueTimer = 300;










			// var points = this.getTonguePoints();

			// var geometry = new THREE.Geometry();

			// // add new geometry based on the specified positions
			// geometry.vertices.push(points[0]);
			// geometry.vertices.push(points[3]);
			// geometry.vertices.push(points[2]);

			// geometry.faces.push(new THREE.Face3(0, 2, 1));

			// var redMat = new THREE.MeshBasicMaterial({color: 0xff0000});
			// var triangle = new THREE.Mesh(geometry, redMat);
			// sim.graphics.addModel(triangle);



			// var length = 30;
			// var width = 2;
			// var pos2 = this.position.clone().add(new THREE.Vector3(Math.cos(this.rotation) * 5, Math.sin(this.rotation) * 5, 5));
			// var pos = pos2.add(new THREE.Vector3(Math.cos(this.rotation - Math.PI/2) * width, Math.sin(this.rotation - Math.PI/2) * width, 5));
			// var geometry = new THREE.SphereGeometry( 1, 16, 16 );
			// var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
			// var sphere = new THREE.Mesh( geometry, material );
			// sphere.position.copy(pos);
			// sim.graphics.addModel( sphere );

			// var pos2 = this.position.clone().add(new THREE.Vector3(Math.cos(this.rotation) * length, Math.sin(this.rotation) * length, 5));
			// var point1 = pos2.add(new THREE.Vector3(Math.cos(this.rotation - Math.PI/2) * width, Math.sin(this.rotation - Math.PI/2) * width, 5));

			// var length = 17.5;
			// var pos = this.position.clone().add(new THREE.Vector3(Math.cos(this.rotation) * length, Math.sin(this.rotation) * length, 5));
			// var geometry = new THREE.SphereGeometry( 1, 16, 16 );
			// var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
			// var sphere = new THREE.Mesh( geometry, material );
			// sphere.position.copy(pos);
			// sim.graphics.addModel( sphere );


		},



		moveForward: function() {
			if (this.stamina < 1) {
				return;
			}

			this.stamina--;
			sim.graphics.updateStaminaBar(this.stamina);
			this.velocity.x += Math.cos(this.rotation);
			this.velocity.y += Math.sin(this.rotation);
		},

		turnRight: function() {
			this.rotation -= .1;
			this.model.rotation.set(Math.PI/2, this.rotation, 0);

			this.setTonguePositionAndRotation();
		},

		turnLeft: function() {
			this.rotation += .1;
			this.model.rotation.set(Math.PI/2, this.rotation, 0);

			this.setTonguePositionAndRotation();
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

			if (this.velocity.x < .1 && this.velocity.x > -.1) this.velocity.x = 0;
			if (this.velocity.y < .1 && this.velocity.y > -.1) this.velocity.y = 0;

			this.updatePosition(newPosition);


			this.tongueTimer -= dt;
			if (this.tongueTimer < 0) {
				sim.graphics.removeModel(this.tongue);
				this.tongue = null;
			} else {
				this.checkIfTongueHittingBug();
			}

		},

		checkIfTongueHittingBug: function() {

			var bugs = sim.getShapesOfType(SIM.Bug);

			for (var i = bugs.length - 1; i >= 0; i--) {

				var bug = bugs[i];
				if (this.bugWithinBounds(bug.position)) {
					sim.killedBugs.push(bug.id);
					sim.removeShape(bug);
					sim.network.killBug(bug.id);
				}
			};
		},

		bugWithinBounds: function(bug) {

			var points = this.getTonguePoints();
			var inFirstTri = this.ptInTriangle(bug, points[0], points[2], points[3]);
			var inSecondTri = this.ptInTriangle(bug, points[0], points[1], points[3]);

			return inFirstTri || inSecondTri;
		},

		getTonguePoints: function() {

			var start = 5;
			var length = 36;
			var width = 7;

			var pos2 = this.position.clone().add(new THREE.Vector3(Math.cos(this.rotation) * start, Math.sin(this.rotation) * start, 1));
			var pointA = pos2.add(new THREE.Vector3(Math.cos(this.rotation - Math.PI/2) * width, Math.sin(this.rotation - Math.PI/2) * width, 0));

			var pos2 = this.position.clone().add(new THREE.Vector3(Math.cos(this.rotation) * start, Math.sin(this.rotation) * start, 1));
			var pointB = pos2.add(new THREE.Vector3(Math.cos(this.rotation + Math.PI/2) * width, Math.sin(this.rotation + Math.PI/2) * width, 0));

			var pos2 = this.position.clone().add(new THREE.Vector3(Math.cos(this.rotation) * length, Math.sin(this.rotation) * length, 1));
			var pointC = pos2.add(new THREE.Vector3(Math.cos(this.rotation - Math.PI/2) * width, Math.sin(this.rotation - Math.PI/2) * width, 0));

			var pos2 = this.position.clone().add(new THREE.Vector3(Math.cos(this.rotation) * length, Math.sin(this.rotation) * length, 1));
			var pointD = pos2.add(new THREE.Vector3(Math.cos(this.rotation + Math.PI/2) * width, Math.sin(this.rotation + Math.PI/2) * width, 0));

			return [pointA, pointB, pointC, pointD];
		},

		ptInTriangle: function(p, p0, p1, p2) {
		    var A = 1/2 * (-p1.y * p2.x + p0.y * (-p1.x + p2.x) + p0.x * (p1.y - p2.y) + p1.x * p2.y);
		    var sign = A < 0 ? -1 : 1;
		    var s = (p0.y * p2.x - p0.x * p2.y + (p2.y - p0.y) * p.x + (p0.x - p2.x) * p.y) * sign;
		    var t = (p0.x * p1.y - p0.y * p1.x + (p0.y - p1.y) * p.x + (p1.x - p0.x) * p.y) * sign;
		    
		    return s > 0 && t > 0 && (s + t) < 2 * A * sign;
		},

		updatePosition: function(newPosition) {

			if (newPosition.x > 100)
				newPosition.x = -100;
			
			if (newPosition.x < -100)
				newPosition.x = 100;
			
			if (newPosition.y > 100)
				newPosition.y = -100;
			
			if (newPosition.y < -100)
				newPosition.y = 100;

			this.model.position.copy(newPosition);
			this.position.copy(newPosition);
			this.setTonguePositionAndRotation();
		},

		setTonguePositionAndRotation: function() {
			if (!this.tongue)
				return;

			var length = 17.5;
			var pos = this.position.clone().add(new THREE.Vector3(Math.cos(this.rotation) * length, Math.sin(this.rotation) * length, 5));


			this.tongue.rotation.set(Math.PI/2, this.rotation - Math.PI/2, 0);
			this.tongue.position.copy(pos);
		},


	});

	SIM.Player = Player;
})()