
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

  panel.setLabelValue("FPS" , nfc(frameRate(),2));

  panel.render();

  if(panel.getToggleState("track")){
    trackColor();
    setFaceData();
    faceData.update();
    faceData.render();
  }

  checkColorPick();

  if(panel.getToggleState("show trails")){
    image(trails, captureWidth, 0);
  }

  if(panel.getButtonState("set ref")){
    faceData.setReferenceDistance();
  }

  if(panel.getButtonState("set min")){
    faceData.setMinDistance();
  }

  if(panel.getButtonState("set max")){
    faceData.setMaxDistance();
  }

  push();
  fill(keyColor);
  stroke(255);
  strokeWeight(2);
  rect(captureWidth,0,25,25);
  pop();

  panel.update();
  renderFrames();
}

//*****************************************************************

function mousePressed(){
  if(waitingForColorPick){
    keyColor = capture.get(mouseX,mouseY);
    trails.clear();
  }
  panel.checkClick(mouseX, mouseY);
}

//*****************************************************************

function mouseReleased(){
  panel.release();
}

//*****************************************************************
