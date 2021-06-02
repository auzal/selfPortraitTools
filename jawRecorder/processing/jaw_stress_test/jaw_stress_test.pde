import processing.serial.*;

float angle;
float aperture = 0;
float minAngle = 0;
float maxAngle = 30;

PFont font;
int offset = 75;

boolean send = false;

Serial myPort;  // Create object from Serial class

boolean run = false;

int interval = 30;
int lastChange = 0;
int hitCounter = 889;
boolean opening = true;

void setup() {
  size(500, 500);
  font = createFont("OverpassMono-Regular.ttf", 15);  
  angle = 0;
  aperture = 0.0;
  textFont(font);

  String portName = Serial.list()[2];
  println(Serial.list());
  myPort = new Serial(this, portName, 9600);
}


void draw() {

  if (run) {

    updatePosition();
  }

  angle = map(aperture, 0, 1, minAngle, maxAngle);
  background(0);

  renderUi();

  if (send) {
    sendSerial();
  }
}


void updatePosition() {

  if (millis() - lastChange > interval) {
    lastChange = millis() - (millis() - lastChange - interval) ;

    if (opening) {
      aperture += 0.05;
      aperture = constrain(aperture, 0, 1);
      if (aperture >= 1) {
        opening = false;
      }
    } else {
      aperture -= 0.05;
      aperture = constrain(aperture, 0, 1);
      if (aperture <= 0) {
        opening = true;
        hitCounter ++;
        println(hitCounter);
      }
    }
    prepareSend();
  }
}

void mouseDragged() {
  //if (mouseY < pmouseY) {
  //  decreaseAngle(pmouseY - mouseY);
  //} else if (mouseY > pmouseY) {
  //  increaseAngle(mouseY - pmouseY);
  //}
  //prepareSend();
}

void prepareSend() {
  send = true;
}

void sendSerial() {

  myPort.write(int(angle + offset)+"\n");
  send = false;
}


void decreaseAngle(float delta) {
  aperture -= delta * .003;
  aperture = constrain(aperture, 0, 1);
}


void increaseAngle(float delta) {
  aperture += delta * .003;
  aperture = constrain(aperture, 0, 1);
}

void renderUi() {
  pushMatrix();
  translate(width*.3, height*.3); 
  stroke(255);
  noFill();
  strokeWeight(1);
  fill(255, map(angle, minAngle, maxAngle, 255, 0), 0, 128);
  noStroke();
  arc(0, 0, 400, 400, 0, radians(angle));

  noFill();
  stroke(255);
  strokeWeight(3);

  ellipse(0, 0, 30, 30);
  strokeWeight(1);

  dashedLine(0, 0, 500, 0);
  fill(255, 255, 0);
  text("MIN: " + minAngle + "º", 250, - 5);
  
  
  pushStyle();
  pushMatrix();
  translate(0, - 80);
  float w = textWidth("IMPACTS: " + hitCounter);
  fill(255, 255, 0);
  noStroke();
  rect(0,4,w,-20);
  fill(0);
  text("IMPACTS: " + hitCounter, 0, 0);
  popMatrix();
  popStyle();

  pushMatrix();
  rotate(radians(maxAngle));
  dashedLine(0, 0, 500, 0);
  translate(250, -5);
  rotate(-radians(maxAngle));
  text("MAX: " + maxAngle + "º", 0, 0);
  popMatrix();
  strokeWeight(3);
  pushMatrix();
  rotate(radians(angle));
  line(0, 0, 300, 0);
  translate(50, -5);
  rotate(-radians(angle));
  text(nfc(angle, 1) + "º (" + nfc(aperture, 2) +")", 0, 0);
  pushStyle();

  textSize(10);
  fill(0);
  text(int(angle + offset) + "º", 50+1, 15+1);
  fill(0, 255, 255);
  text(int(angle + offset) + "º", 50, 15);
  popStyle();
  popMatrix();
  popMatrix();
}

void dashedLine(float x1, float y1, float x2, float y2) {

  float l = 5;
  float dist = dist(x1, y1, x2, y2);
  boolean dash = true;
  for (int i = 0; i < dist - l; i+= l) {

    if (dash) {
      float lerpA = i/dist;
      float lerpB = (i+l)/(dist);

      float xa = lerp(x1, x2, lerpA);
      float ya = lerp(y1, y2, lerpA);
      float xb = lerp(x1, x2, lerpB);
      float yb = lerp(y1, y2, lerpB);

      line(xa, ya, xb, yb);
    }

    dash = !dash;
  }
}

void keyPressed() {

  if (key == ' ') {

    run = ! run;
  } else  if (key == 'r' || key == 'R') {

    hitCounter = 0;
  }
}
