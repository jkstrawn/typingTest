(function() {

	var Network = my.Class({

		constructor: function() {
			this.socket = null;
		},

		init: function() {
			this.socket = io();
			this.socket.on('moved', function(msg) {
				type.updatePlayer(msg);
			});

			this.socket.on('connected', function(msg) {
				type.player.setId(msg);
				console.log("should have refreshed");
				console.log("ID: " + msg);
			});

			this.socket.on('npcs', function(npcs) {
				for (var i = npcs.length - 1; i >= 0; i--) {
					console.log(npcs[i]);
					type.updateNpc(npcs[i]);
				};
			});

			this.socket.on('killNpc', function(npc) {
				type.killNpc(npc);
			});
		},

		sendPlayerLocation: function(position) {
			console.log(this.socket);
			this.socket.emit('move', { position: position });
		},

		sendAttack: function(tile) {
			this.socket.emit('attack', tile);
		},

		killBug: function(id) {
			this.socket.emit('killBug', {id: id});
		},

	});

	TYPE.Network = Network;
})()