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

}, 1000 / 30);







var Meteor = my.Class({
	constructor: function(id) {

	},

	update: function(dt) {
	},

});







init();