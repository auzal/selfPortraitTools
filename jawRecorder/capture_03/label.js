class Label{
  constructor(){
    this.x = 0 ;
    this.y = 0;
    this.h = 20;
    this.w = 20;
    this.color = color(0,0,0);
    this.textColor = color(40);
    this.label = "label";
    this.value = "0.0";
 }

  setDimensions(w, h){
    this.w = w;
    this.h = h;
  }

  setPosition(x,y){
    this.x = x;
    this.y = y;
    this.x_slider = this.x;

  }

  render(){

    push();
    rectMode(CENTER);

    noStroke();
    fill(this.textColor);
    textSize(this.h);
    textAlign(RIGHT,CENTER);
    text(this.label, this.x - this.h*.8, this.y + this.h/2 - this.h * 0.12);
    textAlign(LEFT,CENTER);
    text(" " + this.value, this.x - this.h*.5, this.y + this.h/2 - this.h * 0.12);

    pop();
  }

  update(){
  }

  setColor(c){
    this.color = c;
  }

  setTextColor(c){
    this.textColor = c;
  }

  setLabel(t){
    this.label  = t;
  }

  setValue(t){
    this.value  = t;
  }



}
