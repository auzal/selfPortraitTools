function   initCaptureAndChroma(){

  capture = createCapture(VIDEO);
  capture.size(captureWidth, captureHeight);
  capture.hide();
  chromaImage = createGraphics(captureWidth, captureHeight, WEBGL)
  chromaImage.noStroke();
  keyColor = color(255,0,0);
  pass1 = createGraphics(640, 480, WEBGL);
  pass2 = createGraphics(640, 480, WEBGL);
  pass1.noStroke();
  pass2.noStroke();

}

//*****************************************************************

function initPanel(){
  panel = new Panel();
  panel.setPosition(0 + 150,captureHeight + 10);
  panel.addLabel("FPS");
  panel.addSlider("color distance");
  panel.addToggle("blur", true);
  //  panel.addToggle("togggggg");
  //panel.addSlider("yes");
}

//*****************************************************************

function renderFrames(){
  push();

  stroke(255);
  noFill();
  strokeWeight(2);
  rect(0,0,width, height);
  line(captureWidth,0,captureWidth, captureHeight);
  line(0,captureHeight,width, captureHeight);
  line(panel.x-12,captureHeight,panel.x-12, height);
  line(panel.x + panel.width + 50,captureHeight,panel.x + panel.width + 50, height);
  pop();
}

//*****************************************************************

function renderColorPickCursor(){
  push();
  let size = 10;
  rectMode(CENTER);
  noFill();
  stroke(255);
  strokeWeight(1);
  rect(mouseX, mouseY, size, size);
  line(mouseX, 0, mouseX, mouseY - size/2);
  line(mouseX, captureHeight, mouseX, mouseY + size/2);
  line(0, mouseY, mouseX - size/2, mouseY);
  line(captureWidth, mouseY, mouseX + size/2, mouseY);
  pop();
}

//*****************************************************************

function checkColorPick(){

  if(mouseX > 0 && mouseX < width/2 && mouseY > 0 && mouseY < captureHeight){

    waitingForColorPick = true;

  }else{
    waitingForColorPick = false;
  }
  if(waitingForColorPick){
    noCursor();
    renderColorPickCursor();
  }else{
    cursor();
  }

}
