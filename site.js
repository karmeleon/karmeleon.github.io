$(document).ready(function() {
    // do trianglify things
    var t = new Trianglify();
    var background = t.generate(document.body.clientWidth, document.body.clientHeight);
    $('body').css('background-image', background.dataUrl);
});