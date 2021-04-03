class Slider{
  constructor(){
    this.x = 0 ;
    this.y = 0;
    this.h = 20;
    this.w = 100;
    this.min = 0.0;
    this.max = 1.0;
    this.pressed = false;
    this.x_slider = this.x;
    this.value = 0;
    this.color = color(0,0,0);
    this.textColor = color(40);
    this.label = "slider";
  //  this.randomize();
  }

  setDimensions(w, h){
    this.w = w;
    this.h = h;
  }

  setPosition(x,y){
    this.x = x;
    this.y = y;
    this.x_slider = this.x;
    this.randomize();
  }

  render(){

    push();
    rectMode(CENTER);
    stroke(255);
    //ellipse(this.x, this.y, 50,50);
    stroke(this.color);
    line(this.x, this.y + this.h/2, this.x + this.w, this.y + this.h/2);

    //noStroke();
    //fill(0);
    noFill();
    rect(this.x_slider, this.y + this.h/2, this.h*0.6,  this.h*0.6);

    noStroke();
    fill(this.textColor);
    textSize(this.h);
    textAlign(RIGHT,CENTER);
    text(this.label, this.x - this.h*.5, this.y + this.h/2 - this.h * 0.12);
    textAlign(LEFT,CENTER);
    text(nfc(this.value,2), this.x  + this.w + this.h*.5, this.y + this.h/2 - this.h * 0.12);
    pop();
  }

  update(){
    if(this.pressed){
      this.x_slider = mouseX;
      this.x_slider = constrain(this.x_slider, this.x, this.x + this.w);
    }
    this.value = map(this.x_slider, this.x, this.x + this.w, this.min, this.max);
  }

  getValue(){
    return this.value;
  }

  release(){
    this.pressed = false;
  }

  checkClick(x, y){
    if(dist(x, y, this.x_slider, this.y) < this.h*0.7){
      this.pressed = true;
    }else if(x > this.x && x < this.x + this.w){
      if(y > this.y + this.h/2 - this.h*0.5 && y < this.y + this.h/2 + this.h*0.5){
        this.x_slider = x;
        this.x_slider = constrain(this.x_slider, this.x, this.x + this.w);
        this.pressed = true;
      }
    }
  }

  setColor(c){
    this.color = c;
  }

  setTextColor(c){
    this.textColor = c;
  }

  randomize(){
    this.x_slider = random(this.x, this.x + this.w);
  }

  setLabel(t){
    this.label  = t;
  }

}
