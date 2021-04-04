class Notification {

  String text;
  float duration;
  float opacity;
  float x;
  float y;
  float h;
  float w;
  PFont font;
  float margin;

  int startTime;
  boolean active;

  Notification() {
    margin = 0.5;
    font = createFont("ShareTechMono-Regular.ttf", 15);
    setText("notif");
    duration = 1500;
    opacity = 0;
    x = 20;
    y = 20;
    active = false;
  }


  void render() {
    if (active) {
      pushStyle();
      pushMatrix();
      translate(x, y);
      rectMode(CENTER);
      textAlign(CENTER, CENTER);
      translate(w/2, h/2);
      noStroke();
      fill(255, 90 * opacity);
      rect(0, 0, w, h);
      fill(0, 255 * opacity);
      textFont(font);
      text(text, 0, 0 - h*.1);
      popMatrix();
      popStyle();
    }
  }
  
  void setPosition(float x_, float y_){
    x = x_;
    y = y_;
  }

  void update() {

    int currTime = millis() - startTime;
    currTime = int(constrain(currTime, 0, duration));
    opacity = 1.0 - (currTime / duration);
    if(currTime >= duration){
      active = false;
    }
    
  }
  
  void setAndStart(String t){
    setText(t);
    start();
  }

  void start() {
    startTime = millis();
    opacity = 1.0;
    active = true;
  }

  void setText(String t) {
    text = t;
    pushStyle();
    textFont(font);
    w = textWidth(text);
    h = textAscent() + textDescent();
    w += w * margin;
    h += h * margin;
    popStyle();
  }
}
