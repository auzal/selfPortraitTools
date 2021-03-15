

//var capture;
var tracker;

var rhi, ghi, bhi;
var rlo, glo, blo;

let offscreenCanvas;

//*****************************************************************

function setTarget(r, g, b, range) {
    range = range || 32;
    rhi = r + range, rlo = r - range;
    ghi = g + range, glo = g - range;
    bhi = b + range, blo = b - range;
}

//*****************************************************************

// var offscreenCanvas;
//
// function setup() {
//     var w = 640,
//         h = 480;
//     capture = createCapture({
//         audio: false,
//         video: {
//             width: w,
//             height: h
//         }
//     }, function() {
//         console.log('capture ready.')
//     });
//     capture.elt.setAttribute('playsinline', '');
//     capture.size(w, h);
//     capture.parent('container');
//     capture.elt.id = 'p5video';

// createCanvas(w, h);
// //    cnv.parent('container');
//      capture.hide(); // tracking.js can't track the video when it's hidden

function initTracker(){

    setTarget(255, 255, 255); // by default track white
    tracking.ColorTracker.registerColor('match', function (r, g, b) {
        if (r <= rhi && r >= rlo &&
            g <= ghi && g >= glo &&
            b <= bhi && b >= blo) {
            return true;
        }
        return false;
    });

//    console.log('img', img);

    offscreenCanvas = createGraphics(captureWidth, captureHeight);
    offscreenCanvas.canvas.id = 'newOffscreenCanvasId'
    //offscreenCanvas.canvas.style.display = 'block'
    //offscreenCanvas.canvas.style.top = '400px'
  //  offscreenCanvas.image(img, 0, 0)
  //  console.log('offscreenCanvas.canvas', offscreenCanvas.canvas);


    var offscreenCanvasElement = document.querySelector('#newOffscreenCanvasId')
    var width = offscreenCanvasElement.width;
    var height = offscreenCanvasElement.height;
    var context = offscreenCanvasElement.getContext('2d');
  //  var imageData = context.getImageData(0, 0, width, height);
//    console.log('imageData', imageData);
    // tracker.track(imageData.data, width, height);


    tracker = new tracking.ColorTracker(['match']);
  //  let minDim = panel.getSliderValue();
    tracker.minDimension = 40; // make this smaller to track smaller objects
}

function trackColor() {

  let minDim = panel.getSliderValue("mindimension");

      tracker.minDimension = minDim; // make this smaller to track smaller objects
    // if (mouseIsPressed &&
    //     mouseX > 0 && mouseX < width &&
    //     mouseY > 0 && mouseY < height) {
    //     capture.loadPixels();
    //     target = capture.get(mouseX, mouseY);
    //     setTarget(target[0], target[1], target[2]);
    // }

//    image(offscreenCanvas,0,0);

//    clear();
    offscreenCanvas.image(pass2,0,0);
    tracking.track('#newOffscreenCanvasId', tracker);

    // -----------------------

    tracker.on('track', function (event) {
  //    console.log('event', event);
      //  cnv.clear();
      push();
        strokeWeight(1);
        stroke(255, 128, 0);
        noFill();
        event.data.forEach(function (r) {
            push();
            rectMode(CENTER);
            translate(r.x + captureWidth + r.width/2, r.y + r.height/2);
            rect(0,0, r.width, r.height);
            line(-r.width*.4, 0, r.width*.4, 0);
            line(0, -r.height*.4, 0, r.height*.4);
            pop();
        })
        pop();
    });

}


//*****************************************************************


//*****************************************************************


//*****************************************************************


//*****************************************************************
