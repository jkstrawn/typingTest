var my=null;!function(){var t={};my=t,t.Class=function(){var t,n,e=arguments.length,u=arguments[e-1],p=e>1?arguments[0]:null,c=e>2;if(u.constructor===Object?t=function(){}:(t=u.constructor,delete u.constructor),p&&(n=function(){},n.prototype=p.prototype,t.prototype=new n,t.prototype.constructor=t,t.Super=p,r(t,p,!1)),c)for(var i=1;e-1>i;i++)r(t.prototype,arguments[i].prototype,!1);return o(t,u),t};var o=t.extendClass=function(t,o,n){o.STATIC&&(r(t,o.STATIC,n),delete o.STATIC),r(t.prototype,o,n)},r=function(t,o,r){var n;if(r===!1)for(n in o)n in t||(t[n]=o[n]);else{for(n in o)t[n]=o[n];o.toString!==Object.prototype.toString&&(t.toString=o.toString)}}}();
var self = {};

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var gameloop = require('node-gameloop');
var THREE = require('three-math');

var port = process.env.PORT || 8000;

app.use(express.static(__dirname + '/public'));

var players = [];
var mobs = [];

io.on('connection', function(socket) {
	var id = players.length;
	players.push({id: id, position: socket});

	socket.emit("connected", id);
	
	var mobsToSend = minifyList(mobs);
	socket.emit("mobs", mobsToSend);

	var otherPlayers = getOtherPlayers(id);
	socket.emit("players", mobsToSend);

	console.log('a user connected');

	socket.on('move', function(msg) {
		msg.id = id;
		//io.emit('moved', msg);
	});

	socket.on("killBug", function(msg) {
		removeFromList(mobs, msg.id);
	});
});

http.listen(port, function() {
	console.log('listening on *:' + port);
});

var init = function() {
	for (var i = 0; i < 10; i++) {
		var position = new THREE.Vector3(Math.random() * 100 - 50, Math.random() * 200 - 100, 0);
		var meteor = new Meteor(100 + i, 8, position);
		mobs.push(meteor);
	}
};

var minifyList = function(list) {
	var toSend = [];
	for (var i = list.length - 1; i >= 0; i--) {
		toSend.push(list[i].getMin());
	};
	return toSend;
};

var getOtherPlayers = function(id) {
	var others = [];
	for (var i = players.length - 1; i >= 0; i--) {
		if (players[i].id != id) {
			others.push(players[i]);
		}
	};
	return others;
};

var removeFromList = function(list, id) {
	for (var i = list.length - 1; i >= 0; i--) {
		if (list[i].id == id) {
			list.splice(i, 1);
			return true;
		}
	};
};

 
// start the loop at 30 fps (1000/30ms per frame) and grab its id 
var frameCount = 0;
var id = gameloop.setGameLoop(function(delta) {
	frameCount++;

	for (var i = mobs.length - 1; i >= 0; i--) {
		mobs[i].update(delta);
	};


	var mobsToSend = minifyList(mobs);
	io.emit("mobs", mobsToSend);
}, 1000 / 30);
 
// // stop the loop 2 seconds later 
// setTimeout(function() {
//     console.log('2000ms passed, stopping the game loop');
//     gameloop.clearGameLoop(id);
// }, 2000);








var Meteor = my.Class({
	constructor: function(id, size, position, speed) {
		this.id = id;
		this.size = size;
		this.position = position;
		this.speed = speed || 15;
		this.direction = 0;
		this.velocity = null;

		this.changeDirection();
	},

	update: function(dt) {

		var dx = this.velocity.x * dt * this.speed;
		var dy = this.velocity.y * dt * this.speed;

		this.position.add(new THREE.Vector3(dx, dy, 0));

		if (this.position.x > 100)
			this.position.x = -100;
		
		if (this.position.x < -100)
			this.position.x = 100;
		
		if (this.position.y > 100)
			this.position.y = -100;
		
		if (this.position.y < -100)
			this.position.y = 100;

		// console.log("moved to " + this.position.x + " and " + this.position.y);
		if (Math.random() > .9) {
			this.changeDirection();
		}
	},

	changeDirection: function() {
		var directionChange = Math.random() * 1.5 - .75;
		this.direction += directionChange;
		this.velocity = {
			x: Math.cos(this.direction), 
			y: Math.sin(this.direction)
		};
	},

	breakApart: function() {

	},

	getMin: function() {
		return {id: this.id, size: this.size, pos: {x: this.position.x, y: this.position.y}, rot: this.direction};
	},

});







init();