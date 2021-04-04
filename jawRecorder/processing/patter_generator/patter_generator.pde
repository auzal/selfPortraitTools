Notification notification;
Pattern p;

void setup(){
  size(800,800);
  notification = new Notification();
  p = new Pattern();
}

void draw(){
  background(20);
  notification.update();
  notification.render();
  
  p.render();
  
  
 
}

void mousePressed(){
  
  p.generateRandom();
  notification.setAndStart("generated random pattern");

}
