

//var capture;
var tracker;

var rhi, ghi, bhi;
var rlo, glo, blo;

let offscreenCanvas;
let trackingData;

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

  trails = createGraphics(captureWidth, captureHeight);
  trails.clear();

  faceData = new FaceData();

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


    tracker.on('track', function (event) {
      //    console.log('event', event);
      //  cnv.clear();

      trackingData = event.data;

    });
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


    push();
    strokeWeight(2);
    stroke(0, 255, 191);
    noFill();
    if(trackingData){ //if there is tracking data to look at, then...
      for (var i = 0; i < trackingData.length; i++) { //loop through each of the detected colors
        //   console.log( trackingData[i] );
        let blob = trackingData[i];
        push();
        rectMode(CENTER);
        translate(blob.x + captureWidth + blob.width/2, blob.y + blob.height/2);
        rect(0,0, blob.width, blob.height);
        line(-blob.width*.2, 0, blob.width*.2, 0);
        line(0, -blob.height*.2, 0, blob.height*.2);
        pop();

        trails.push();
        trails.fill(255, 0, 93, 30);
        trails.noStroke();
        trails.ellipse(blob.x + blob.width/2, blob.y + blob.height/2, 5, 5);
        trails.pop();
      }
    }
    pop();


  }


  //*****************************************************************

  function setFaceData(){
    if(trackingData){ //if there is tracking data to look at, then...
      let dataArray = [];
      for (var i = 0; i < trackingData.length; i++) { //loop through each of the detected colors
          let blob = trackingData[i];
          let pos = createVector(blob.x + blob.width/2, blob.y + blob.height/2);
        dataArray.push(pos);
      }
      faceData.setData(dataArray);
    }


  }

  //*****************************************************************


  //*****************************************************************


  //*****************************************************************
