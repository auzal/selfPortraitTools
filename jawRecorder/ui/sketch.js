let font;
let panel;

function preload(){

  font = loadFont('assets/unica.ttf');
}

function setup() {
  let density = displayDensity();
  density = 1;
  createCanvas(windowWidth, windowHeight);
  pixelDensity(density);
  panel = new Panel();
  panel.setPosition(500,500);
  panel.addSlider("test");
  panel.addButton("butt");
  panel.addToggle("togggggg");
  panel.addSlider("yes");
  textFont(font);
}

function draw() {
  background(panel.getSliderValue("test") * 255,panel.getSliderValue("yes") * 255,0);


  if(panel.getButtonState("butt")){
    background(0);
  }

  if(panel.getToggleState("togggggg")){
    ellipse(mouseX, mouseY, sin(frameCount*0. 1) * 50);
  }


  panel.update();
  panel.render();

}

function mousePressed(){
  panel.checkClick(mouseX, mouseY);
}

function mouseReleased(){
  panel.release();
}
