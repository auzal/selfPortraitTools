
let panel;
let font;

let captureWidth = 640;
let captureHeight = 480;

let trails;


//*****************************************************************

function preload(){
  chromaShader = loadShader('assets/chroma.vert', 'assets/chroma.frag');
  blurHShader = loadShader('assets/base.vert', 'assets/blur.frag');
  blurVShader = loadShader('assets/base.vert', 'assets/blur.frag');
  font = loadFont('assets/unica.ttf');
}

//*****************************************************************

function setup() {
  let density = displayDensity();
  density = 1;
  createCanvas(captureWidth * 2, captureHeight * 1.5, WEBGL);
  pixelDensity(density);

  initCaptureAndChroma();
  initPanel();

  initTracker();
  textFont(font);
}

//*****************************************************************

function draw() {
  background(0);
  maxColorDist = panel.getSliderValue("color distance");
  translate(-width/2, -height/2);


  image(capture, 0, 0);
  enableBlur = panel.getToggleState("blur");

  //console.log(panel.getToggleState("blur"));

  createThresholdImage();
  image(pass2, captureWidth,0);

  fill(keyColor);
  ellipse(30,30,30,30);


  panel.setLabelValue("FPS" , nfc(frameRate(),2));
  panel.update();
  panel.render();

  if(panel.getToggleState("track")){
    trackColor();
  }

  checkColorPick();

  image(trails, captureWidth, 0);

  renderFrames();
}

//*****************************************************************

function mousePressed(){
  if(waitingForColorPick){
    keyColor = capture.get(mouseX,mouseY);
  }
  panel.checkClick(mouseX, mouseY);
}

//*****************************************************************

function mouseReleased(){
  panel.release();
}

//*****************************************************************
