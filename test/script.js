function myFunction() {
	var canvas = document.getElementById("myCanvas");
	var ctx = canvas.getContext("2d");
	var imageObj = new Image();

	ctx.drawImage(imageObj, 0, 0);
	imageObj.src = "grass.png";

	var imageWidth = 192;
	var imageHeight = 32;
	var tileWidth = 32;
	var tileHeight = 32;

	var tilesX = imageWidth / tileWidth;
	var tilesY = imageHeight / tileHeight;
	var totalTiles = tilesX * tilesY;        
	var tileData = new Array();
	for(var i=0; i<tilesY; i++) {
		for(var j=0; j<tilesX; j++) {
			// Store the image data of each tile in the array.
			tileData.push(ctx.getImageData(j*tileWidth, i*tileHeight, tileWidth, tileHeight));
		}
	}
	//From here you should be able to draw your images back into a canvas like so:
	ctx.putImageData(tileData[0], 0, 0);
}