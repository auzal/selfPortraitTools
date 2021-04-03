
let imageWidth;
let imageHeight;
let canvasWidth;
let canvasHeight;

let chromaShader;


let capture;
let chroma;

let keyColor;

let maxDist = 0.0;


let blurH, blurV;
// the camera variable
let cam;

// we need two createGraphics layers for our blur algorithm
let pass1, pass2;

let myVida;

let font;

function preload(){
  chromaShader = loadShader('assets/chroma.vert', 'assets/chroma.frag');
  blurH = loadShader('assets/base.vert', 'assets/blur.frag');
  blurV = loadShader('assets/base.vert', 'assets/blur.frag');
  font = loadFont('assets/unica.ttf');
}

function setup() {
  let density = displayDensity();
  density = 1;
  createCanvas(640 * 2, 480, WEBGL);
  pixelDensity(density);
  capture = createCapture(VIDEO);
  capture.size(640, 480);
  capture.hide();
  chroma = createGraphics(640, 480, WEBGL)
  chroma.noStroke();
  keyColor = color(255,0,0);
  pass1 = createGraphics(640, 480, WEBGL);
  pass2 = createGraphics(640, 480, WEBGL);
  // turn off the cg layers stroke
  pass1.noStroke();
  pass2.noStroke();

  initVida();
}



function draw() {
  background(0);
  maxDist = map(mouseY,0,height,0.0,1.0);
  translate(-width/2, -height/2);
  noFill();
  stroke(0,255,255);
  rect(0,0,width,height);

  image(capture, 0, 0);
  createThresholdImage();
  handleBlobs();

  fill(keyColor);
  ellipse(30,30,30,30);
}

function mousePressed(){
  keyColor = capture.get(mouseX,mouseY);
}

function createThresholdImage(){
  chromaShader.setUniform("iResolution", [chroma.width, chroma.height]);
  chromaShader.setUniform("key", [red(keyColor) / 255.0, green(keyColor) / 255.0, blue(keyColor) / 255.0]);
  chromaShader.setUniform("maxDist", maxDist);
  //chromaShader.setUniform("iFrame", frameCount);
  //  chromaShader.setUniform('tex0', skull);
  //chromaShader.setUniform('tex1', face);
  chromaShader.setUniform('texRef', capture);
  //chromaShader.setUniform('threshold',thresh );

  chroma.shader(chromaShader);
  chroma.rect(0,0,width,height);
  //  image(chroma,0 + width/2 ,0);
  pass1.shader(blurH);

  // send the camera texture to the horizontal blur shader
  // send the size of the texels
  // send the blur direction that we want to use [1.0, 0.0] is horizontal

  let texelSize = 0.8;
  blurH.setUniform('tex0', chroma);
  blurH.setUniform('texelSize', [texelSize/width, texelSize/height]);
  blurH.setUniform('direction', [1.0, 0.0]);

  // we need to make sure that we draw the rect inside of pass1
  pass1.rect(0,0,width, height);

  // set the shader for our second pass
  pass2.shader(blurV);

  // instead of sending the webcam, we will send our first pass to the vertical blur shader
  // texelSize remains the same as above
  // direction changes to [0.0, 1.0] to do a vertical pass
  blurV.setUniform('tex0', pass1);
  blurV.setUniform('texelSize', [texelSize/width, texelSize/height]);
  blurV.setUniform('direction', [0.0, 1.0]);

  // again, make sure we have some geometry to draw on in our 2nd pass
  pass2.rect(0,0,width, height);

  // draw the second pass to the screen
  //image(pass2,0 + width/2 ,0);



  //  chromaShader.shader(noiseThresholdShader);
  //  chromaShader.rect(0,0,width,height);
  //  imageMode(CENTER);
  //  image(noiseResult,0,0);
}


function initVida(){
  myVida = new Vida(this); // create the object
  /*
  Turn off the progressive background mode.
  */
  myVida.progressiveBackgroundFlag = false;
  /*
  The value of the threshold for the procedure that calculates the threshold
  image. The value should be in the range from 0.0 to 1.0 (float).
  */
  myVida.imageFilterThreshold = 0.2;
  /*
  In order for VIDA to handle blob detection (it doesn't by default), we set
  this flag.
  */
  myVida.handleBlobsFlag = true;
  /*
  Normalized values of parameters defining the smallest and highest allowable
  mass of the blob.
  */
  //myVida.normMinBlobMass = 0.0002;  // uncomment if needed
  //myVida.normMaxBlobMass = 0.5;  // uncomment if needed
  /*
  Normalized values of parameters defining the smallest and highest allowable
  area of the blob boiunding box.
  */
  //myVida.normMinBlobArea = 0.0002;  // uncomment if needed
  //myVida.normMaxBlobArea = 0.5;  // uncomment if needed
  /*
  If this flag is set to "true", VIDA will try to maintain permanent
  identifiers of detected blobs that seem to be a continuation of the
  movement of objects detected earlier - this prevents random changes of
  identifiers when changing the number and location of detected blobs.
  */
  myVida.trackBlobsFlag = true;
  /*
  Normalized value of the distance between the tested blobs of the current
  and previous generation, which allows treating the new blob as the
  continuation of the "elder".
  */
  //myVida.trackBlobsMaxNormDist = 0.3; // uncomment if needed
  /*
  VIDA may prefer smaller blobs located inside larger or the opposite: reject
  smaller blobs inside larger ones. The mechanism can also be completely
  disabled. Here are the possibilities:
  [your vida object].REJECT_NONE_BLOBS
  [your vida object].REJECT_INNER_BLOBS
  [your vida object].REJECT_OUTER_BLOBS
  The default value is REJECT_NONE_BLOBS.
  */
  //myVida.rejectBlobsMethod = myVida.REJECT_NONE_BLOBS; // uncomment if needed
  /*
  If this flag is set to "true", VIDA will generate polygons that correspond
  approximately to the shape of the blob. If this flag is set to "false", the
  polygons will not be generated. Default vaulue is false. Note: generating
  polygons can be burdensome for the CPU - turn it off if you do not need it.
  */
  myVida.approximateBlobPolygonsFlag = true;
  /*
  Variable (integer) that stores the value corresponding to the number of
  polygon points describing the shape of the blobs. The minimum value of this
  variable is 3.
  */
  myVida.pointsPerApproximatedBlobPolygon = 8;


  let blackImage = createGraphics(640, 480);
  blackImage.background(0);

  myVida.setBackgroundImage(blackImage);

}


function handleBlobs(){

    /*
      Wait for user interaction. Some browsers prevent video playback if the
      user does not interact with the webpage yet.
    */


    /*
      Call VIDA update function, to which we pass the current video frame as a
      parameter. Usually this function is called in the draw loop (once per
      repetition).
    */
   myVida.update(pass2);
    /*
      Now we can display images: source video and subsequent stages
      of image transformations made by VIDA.
    */
    //image(myVideo, 0, 0);
    //image(myVida.backgroundImage, 320, 0);
    //image(myVida.differenceImage, 0, 240);
    image(myVida.thresholdImage, width/2, 0);
    // let's also describe the displayed images
    // noStroke(); fill(255, 255, 255);
    // text('raw video', 20, 20);
    // text('vida: progressive background image', 340, 20);
    // text('vida: difference image', 20, 260);
    // text('vida: threshold image', 340, 260);
    /*
      VIDA has two built-in versions of the function drawing detected blobs:
        [your vida object].drawBlobs(x, y);
      and
        [your vida object].drawBlobs(x, y, w, h);
      But we want to create our own drawing function, which at the same time
      will be used for the current handling of blobs and reading their
      parameters.
      To manually get to the data describing detected blobs we call the
      [your vida object].getBlobs() function, which returns an array containing
      detected blobs. This function (although it does not make any
      time-consuming calculations) should be called at most once per draw()
      loop, because (if you do not use VIDA in an unusual way, you trickster)
      the parameters of the blobs do not change within one frame.
    */
    var temp_blobs = myVida.getBlobs();
    // define size of the drawing
    var temp_w = width / 2; var temp_h = height ;
    // offset from the upper left corner
    var offset_x = width/2; var offset_y = 0;
    // pixel-based blob coords
    var temp_rect_x, temp_rect_y, temp_rect_w, temp_rect_h,
        temp_mass_center_x, temp_mass_center_y;
    push(); // store current drawing style and font
    translate(offset_x, offset_y); // translate coords
    // set text style and font
    textFont(font, 14); textAlign(LEFT, BOTTOM); textStyle(NORMAL);
    // let's iterate over all detected blobs and draw them
    for(var i = 0; i < temp_blobs.length; i++) {
      /*
        Having access directly to objects that store detected blobs, we can
        read values of the individual parameters. Here is a list of parameters
        to which we have access:
          normRectX, normRectY, normRectW, normRectH - normalized coordinates
        of the rectangle in which the blob is contained (bounding box).;
          normMassCenterX, normMassCenterY, normMass - normalized parameters of
        the blob's "mass"; the "mass" is calculated based on the ratio of the
        number of pixels occupied by the blob to the number of pixels in the
        image being processed; the mass center is calculated based on the
        average position of the pixels that make up the blob;
          approximatedPolygon - an array storing normalized coordinates of the
        approximate polygon "describing" the blob; every cell of the array
        contains one point (format: {normX: float, normY: float}); if detecting
        polygon is disabled, the array will be empty;
          creationTime, creationFrameCount - detection time of the blob
        expressed in milliseconds and frames;
          id - unique identifier (integer) of the blob; if blob tracking is also
        enabled in addition to the detection of blobs, VIDA will try to
        recognize the blobs in subsequent frames and give them the same
        identifiers;
          isNewFlag - the flag whose value will be "true" if the blob is
        considered new (as a result of blob tracking mechanism); otherwise, the
        flag will be set to "false".
      */
      // convert norm coords to pixel-based
      temp_rect_x = Math.floor(temp_blobs[i].normRectX * temp_w);
      temp_rect_y = Math.floor(temp_blobs[i].normRectY * temp_h);
      temp_rect_w = Math.floor(temp_blobs[i].normRectW * temp_w);
      temp_rect_h = Math.floor(temp_blobs[i].normRectH * temp_h);
      temp_mass_center_x = Math.floor(temp_blobs[i].normMassCenterX * temp_w);
      temp_mass_center_y = Math.floor(temp_blobs[i].normMassCenterY * temp_h);
      // draw bounding box
      strokeWeight(1); stroke(255, 255, 0); noFill();
      rect(temp_rect_x, temp_rect_y, temp_rect_w, temp_rect_h);
      // draw mass center
      noStroke(); fill(255, 0 , 0); ellipseMode(CENTER);
      ellipse(temp_mass_center_x, temp_mass_center_y, 3, 3);
      // print id
      noStroke(); fill(255, 255 , 0);
      text(temp_blobs[i].id, temp_rect_x, temp_rect_y - 1);
      // draw approximated polygon (if available)
      strokeWeight(1); stroke(255, 0, 0); noFill();
      beginShape();
      for(var j = 0; j < temp_blobs[i].approximatedPolygon.length; j++) {
        vertex(
          temp_blobs[i].approximatedPolygon[j].normX * temp_w,
          temp_blobs[i].approximatedPolygon[j].normY * temp_h,
        );
      }
      endShape(CLOSE);
    }
    pop(); // restore memorized drawing style and font

}
