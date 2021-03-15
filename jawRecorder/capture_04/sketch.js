// https://kylemcdonald.github.io/cv-examples/

var capture;
var tracker;

var rhi, ghi, bhi;
var rlo, glo, blo;

function setTarget(r, g, b, range) {
    range = range || 32;
    rhi = r + range, rlo = r - range;
    ghi = g + range, glo = g - range;
    bhi = b + range, blo = b - range;
}

var img;

function preload() {
  img = loadImage('/screenshot.png');
}

var offscreenCanvas;

function setup() {
    var w = 640,
        h = 480;
    capture = createCapture({
        audio: false,
        video: {
            width: w,
            height: h
        }
    }, function() {
        console.log('capture ready.')
    });
    capture.elt.setAttribute('playsinline', '');
    capture.size(w, h);
    capture.parent('container');
    capture.elt.id = 'p5video';

createCanvas(w, h);
//    cnv.parent('container');
     capture.hide(); // tracking.js can't track the video when it's hidden

    setTarget(255, 255, 255); // by default track white
    tracking.ColorTracker.registerColor('match', function (r, g, b) {
        if (r <= rhi && r >= rlo &&
            g <= ghi && g >= glo &&
            b <= bhi && b >= blo) {
            return true;
        }
        return false;
    });

    console.log('img', img);

    offscreenCanvas = createGraphics(500, 500);
    offscreenCanvas.canvas.id = 'newOffscreenCanvasId'
    //offscreenCanvas.canvas.style.display = 'block'
    //offscreenCanvas.canvas.style.top = '400px'
    offscreenCanvas.image(img, 0, 0)
    console.log('offscreenCanvas.canvas', offscreenCanvas.canvas);


    var offscreenCanvasElement = document.querySelector('#newOffscreenCanvasId')
    var width = offscreenCanvasElement.width;
    var height = offscreenCanvasElement.height;
    var context = offscreenCanvasElement.getContext('2d');
    var imageData = context.getImageData(0, 0, width, height);
    console.log('imageData', imageData);
    // tracker.track(imageData.data, width, height);


    tracker = new tracking.ColorTracker(['match']);
    tracker.minDimension = 10; // make this smaller to track smaller objects





}

function draw() {
    if (mouseIsPressed &&
        mouseX > 0 && mouseX < width &&
        mouseY > 0 && mouseY < height) {
        capture.loadPixels();
        target = capture.get(mouseX, mouseY);
        setTarget(target[0], target[1], target[2]);
    }

    image(offscreenCanvas,0,0);

//    clear();
    offscreenCanvas.ellipse(mouseX, mouseY, 10, 10);
    tracking.track('#newOffscreenCanvasId', tracker);

    // -----------------------

    tracker.on('track', function (event) {
      console.log('event', event);
      //  cnv.clear();
        strokeWeight(4);
        stroke(255, 0, 0);
        noFill();
        event.data.forEach(function (r) {
            rect(r.x, r.y, r.width, r.height);
        })
    });

}
