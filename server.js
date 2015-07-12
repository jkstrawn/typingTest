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
var grid = null;
var nextId = 1;

io.on('connection', function(socket) {
	var id = nextId++;
	players.push({id: id, position: socket});

	socket.emit("connected", id);

	socket.emit("npcs", getNpcs());

	console.log('a user connected');

	socket.on('move', function(msg) {
		msg.id = id;
		//io.emit('moved', msg);
	});

	socket.on("killBug", function(msg) {
		removeFromList(mobs, msg.id);
	});

	socket.on("attack", function(tile) {
		playerAttackTile(id, tile);
	});
});

http.listen(port, function() {
	console.log('listening on *:' + port);
});

var init = function() {
	grid = new GRID(4, 4);

	var tile = grid.getTile(3, 0);
	var npc = new NPC(nextId++, 3, 0, tile);

	grid.setNpc(npc, 3, 0);

	npcs.push(npc);
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
	var npc = tile.npc;
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
	grid.removeNpc(npc.position.x, npc.position.y);
	removeFromList(npcs, npc.id);

	var x = Math.floor(Math.random() * 4);
	var y = Math.floor(Math.random() * 4);

	var newNpc = new NPC(nextId++, x, y);

	grid.setNpc(newNpc, x, y);
	npcs.push(newNpc);
	io.emit("npcs", [newNpc.minify()]);
	console.log(npcs);
};

 
// start the loop at 30 fps (1000/30ms per frame) and grab its id 
var frameCount = 0;
var id = gameloop.setGameLoop(function(delta) {
	frameCount++;

	// for (var i = mobs.length - 1; i >= 0; i--) {
	// 	mobs[i].update(delta);
	// };

}, 1000 / 30);







var NPC = my.Class({
	constructor: function(id, x, y, tile) {
		this.id = id;
		this.position = {x: x, y: y};
		this.sprite = "da_downStand";
		// this.tileX = tile.gridX;
		// this.tileY = tile.gridY;
		this.health = 10;
	},

	update: function(dt) {

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
				var tile = {x: x, y: y};
				this.tiles[x].push(tile);
			}
		}
	},

	setNpc: function(npc, x, y) {
		var tile = this.getTile(x, y);
		tile.npc = npc;
	},

	getTile: function(x, y) {
		return this.tiles[x][y];
	},

	removeNpc: function(x, y) {
		var tile = this.getTile(x, y);
		tile.npc = null;
	},

});







init();