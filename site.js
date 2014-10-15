$(document).ready(function() {
    // do trianglify things
    var t = new Trianglify({
	    cellsize: 150,
	    noiseIntensity: 0,
	    x_gradient: ["#9ecae1","#6baed6","#4292c6","#2171b5","#08519c","#08306b"]
    });
    var background = t.generate(document.body.clientWidth, document.body.clientHeight);
    $('body').css('background-image', background.dataUrl);
});