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
var npcs = [];
var projectiles = [];
var grid = null;
var nextId = 1;

io.on('connection', function(socket) {
	var id = nextId++;
	var tile = grid.getTile(0, 1);
	var player = new PLAYER(id, socket, tile);
	tile.player = player;

	players.push(player);

	socket.emit("connected", {id: id, position: {x: tile.x, y: tile.y}});
	socket.emit("npcs", getNpcs());

	console.log('a user connected');

	socket.on('move', function(msg) {
		msg.id = id;
		//io.emit('moved', msg);
	});

	socket.on("tile", function(msg) {
		changePlayerTile(player, msg.x, msg.y);
	});

	socket.on("attack", function(tile) {
		playerAttackTile(id, tile);
	});
});

http.listen(port, function() {
	console.log('listening on *:' + port);

	init();
});




















var init = function() {
	grid = new GRID(4, 4);

	var tile = grid.getTile(3, 0);
	var npc = new NPC(nextId++, 3, 0, tile);
	tile.player = npc;

	npcs.push(npc);

	startGame();
};

var startGame = function() {

	// start the loop at 30 fps (1000/30ms per frame) and grab its id 
	var frameCount = 0;
	var id = gameloop.setGameLoop(function(delta) {
		frameCount++;

		for (var i = npcs.length - 1; i >= 0; i--) {
			npcs[i].update(delta);
		};

		for (var i = npcs.length - 1; i >= 0; i--) {
			projectiles[i].update(delta);
		};

	}, 1000 / 30);

};

var getNpcs = function() {
	var npcsToSend = [];
	for (var i = npcs.length - 1; i >= 0; i--) {
		npcsToSend.push(npcs[i].minify());
	};
	return npcsToSend;
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

var playerAttackTile = function(id, tile) {
	var tile = grid.getTile(tile.x, tile.y);
	var npc = tile.player;
	if (npc) {
		console.log(id + " hit npc " + npc.id + "!");
		npc.health -= 2;
		if (npc.health <= 0) {
			killNpc(npc);
		} else {
			io.emit("npcs", [npc.minify()]);
		}
	} else {
		console.log("missed at " + tile.x + "," + tile.y + "!");
	}
};

var killNpc = function(npc) {
	io.emit("killNpc", {id: npc.id});
	grid.removePlayer(npc.position.x, npc.position.y);
	removeFromList(npcs, npc.id);

	var x = Math.floor(Math.random() * 4);
	var y = Math.floor(Math.random() * 4);

	var tile = grid.getTile(x, y);
	var newNpc = new NPC(nextId++, x, y, tile);
	tile.player = newNpc;

	npcs.push(newNpc);
	io.emit("npcs", [newNpc.minify()]);
};

var changePlayerTile = function(player, x, y) {
	console.log("change player tile to " + x + "," + y);

	var tile = grid.getTile(x, y);

	player.tile.player = null;
	player.tile = tile;
};

var createProjectile = function(x, y, direction) {
	var projectile = new PROJECTILE(x, y, speed, direction);
};


















var NPC = my.Class({
	constructor: function(id, x, y, tile) {
		this.id = id;
		this.position = {x: x, y: y};
		this.sprite = "da_downStand";
		this.tile = tile;
		this.health = 10;
		this.timeToAttack = 2;
		this.direction = "down";
	},

	update: function(dt) {
		this.timeToAttack -= dt;
		if (this.timeToAttack < 0) {
			this.attack();
			this.timeToAttack = 2;
		}
	},

	attack: function() {
		console.log("prepare to attack");

		var player = players[players.length - 1];
		if (player) {
			console.log("here is " + this.tile.x + "," + this.tile.y + " and there is " + player.tile.x + ", " + player.tile.y);
			this.direction = this.tile.getDirection(player.tile);
		}

		createProjectile(this.tile.x, this.tile.y, this.direction);
		io.emit("npcs", [{id: this.id, sprite: "da_" + this.direction + "Attack"}]);
	},

	minify: function() {
		return {
			id: this.id, 
			pos: {x: this.position.x, y: this.position.y}, 
			sprite: this.sprite, 
			health: this.health
		};
	},

});

var GRID = my.Class({
	constructor: function(width, height) {
		this.tiles = [];

		for (var x = 0; x < width; x++) {
			var row = [];
			this.tiles.push(row);
			for (var y = 0; y < height; y++) {
				var tile = new TILE(x, y);
				this.tiles[x].push(tile);
			}
		}
	},

	setPlayer: function(player, x, y) {
		var tile = this.getTile(x, y);
		tile.player = player;
	},

	getTile: function(x, y) {
		return this.tiles[x][y];
	},

	removePlayer: function(x, y) {
		var tile = this.getTile(x, y);
		tile.player = null;
	},



});

var TILE = my.Class({
	constructor: function(x, y) {
		this.x = x;
		this.y = y;
	},

	getDirection: function(otherTile) {
		if (this.x > otherTile.x)
			return "left";
		if (this.y > otherTile.y)
			return "up";
		if (this.x < otherTile.x)
			return "right";
		if (this.y < otherTile.y)
			return "down";

		return "right";
	},

});

var PLAYER = my.Class({
	constructor: function(id, socket, tile) {
		this.id = id;
		this.socket = socket;
		this.tile = tile;
	},
});

var PROJECTILE = my.Class({
	constructor: function(x, y, speed, direction) {
		this.x = x;
		this.y = y;
		this.speed = speed;
		this.direction = direction;
		this.sprite = "fireball";

		this.velocity = {
			x: Math.cos(this.direction), 
			y: Math.sin(this.direction)
		};		
	},

	update: function(dt) {
		this.x += this.velocity.x * dt * this.speed;
		this.y += this.velocity.y * dt * this.speed;
	},

	minify: function() {
		return {id: this.id, x: this.x, y: this.y};
	},

});