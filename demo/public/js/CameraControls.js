/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.CameraControls = function ( camera ) {

	var scope = this;

	camera.rotation.set( 0, 0, 0 );

	var pitchObject = new THREE.Object3D();
	pitchObject.add( camera );

	var yawObject = new THREE.Object3D();
	yawObject.position.y = 10;
	yawObject.add( pitchObject );

	var isOnObject = false;
	var canJump = false;

	var prevTime = performance.now();

	var velocity = new THREE.Vector3();

	var PI_2 = Math.PI / 2;

	var onMouseMove = function ( event ) {

		if ( scope.enabled === false ) return;

		var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
		var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

		yawObject.rotation.y -= movementX * 0.003;
		pitchObject.rotation.x -= movementY * 0.003;

		pitchObject.rotation.x = Math.max( - PI_2, Math.min( PI_2, pitchObject.rotation.x ) );

	};

	document.addEventListener( 'mousemove', onMouseMove, false );

	this.enabled = false;
	
	this.setStartingView = function() {
		pitchObject.rotation.x -= .125;
	};

	this.lookUp = function() {
		pitchObject.rotation.x += .025;
	};

	this.lookDown = function() {
		pitchObject.rotation.x -= .025;
	};

	this.lookLeft = function() {
		yawObject.rotation.y += .025;
	};

	this.lookRight = function() {
		yawObject.rotation.y -= .025;
	};

	this.getObject = function () {

		return yawObject;

	};

	this.getRotation = function() {
		return {x: pitchObject.rotation.x, y: yawObject.rotation.y};
	};

	this.isOnObject = function ( boolean ) {

		isOnObject = boolean;
		canJump = boolean;

	};

	this.getPosition = function() {
		return yawObject.position.clone();
	};

	this.getDirection = function() {

		// assumes the camera itself is not rotated

		var direction = new THREE.Vector3( 0, 0, -1 );
		var rotation = new THREE.Euler( 0, 0, 0, "YXZ" );

		return function() {

			rotation.set( pitchObject.rotation.x, yawObject.rotation.y, 0 );

			var v = direction.clone().applyEuler( rotation );

			return v;

		}

	}();
	
	this.move = function(vector) {
		//debugger;
		//console.log("should be: " + vector.x + ", " + vector.y + ", " + vector.z);
		//console.log("actually is: " + yawObject.position.x + ", " + yawObject.position.y + ", " + yawObject.position.z);
		//vector.sub(yawObject.position);
		//console.log("diff: " + vector.x + ", " + vector.y + ", " + vector.z);
		//console.log(vector.x - yawObject.position.x);
		// yawObject.translateX(vector.x - yawObject.position.x);
		// yawObject.translateY(vector.y - yawObject.position.y);
		// yawObject.translateZ(vector.z - yawObject.position.z);
	//yawObject.position.set(vector.x, vector.y, vector.z);
		yawObject.translateX( vector.x );
		//yawObject.translateY( vector.x );
		yawObject.translateZ( vector.z );
		//yawObject.translateX(1);
		return yawObject.position;
	};

	this.update = function () {

	};

};
