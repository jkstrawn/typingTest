(function() {

	var Network = my.Class({

		constructor: function() {
			this.socket = io();
			this.socket.on('moved', function(msg) {
				sim.updatePlayer(msg);
			});

			this.socket.on('connected', function(msg) {
				sim.player.setId(msg);
				console.log("should have refreshed");
				console.log("ID: " + msg);
			});

			this.socket.on('mobs', function(mobList) {
				for (var i = mobList.length - 1; i >= 0; i--) {
					sim.updateAsteroid(mobList[i]);
				};
			});
		},

		sendPlayerLocation: function(position) {
			console.log(this.socket);
			this.socket.emit('move', { position: position });
		},

		killBug: function(id) {
			this.socket.emit('killBug', {id: id});
		},

	});

	SIM.Network = Network;
})()