class Button{
  constructor(){
    this.x = 0 ;
    this.y = 0;
    this.h = 20;
    this.w = 20;
    this.min = 0.0;
    this.max = 1.0;
    this.pressed = false;
    this.color = color(0,0,0);
    this.textColor = color(40);
    this.label = "slider";
    this.opacity = 0;
    this.isToggle = false;
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

    stroke(this.color);

    //  ellipse(this.x, this.y, 5,5);

    //noStroke();
    //fill(0);
    if(!this.isToggle){
      fill(red(this.color), green(this.color), blue(this.color), this.opacity);
    }
    else{
      noFill();
      if(this.pressed){
        let tempWidth = this.h*0.6/2;
        line(this.x - tempWidth, this.y + this.h/2 - tempWidth, this.x + tempWidth, this.y + this.h/2 + tempWidth);
        line(this.x - tempWidth, this.y + this.h/2 + tempWidth, this.x + tempWidth, this.y + this.h/2 - tempWidth);
      }
    }
    rect(this.x, this.y + this.h/2, this.h*0.6,  this.h*0.6);

    noStroke();
    fill(this.textColor);
    textSize(this.h);
    textAlign(RIGHT,CENTER);
    text(this.label, this.x - this.h*.8, this.y + this.h/2 - this.h * 0.12);



    pop();
  }

  update(){
    if(this.opacity > 0){
      this.opacity -= 20;
      this.opacity = constrain(this.opacity, 0, 255);
    }
    if(this.pressed){
      if(!this.isToggle){
        this.pressed = false;
      }
    }
  }

  getPressed(){
    return this.pressed;
  }

  release(){
    this.pressed = false;
  }

  checkClick(x, y){
    if(x > this.x - this.h*.3 && x < this.x + this.h*.3){
      if(y > this.y + this.h/2 - this.h*0.6 && y < this.y + this.h/2 + this.h*0.6){
        if(!this.isToggle){
          this.pressed = true;
        }else{
          this.pressed = ! this.pressed;
        }
        this.opacity = 200;
      }
    }
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

  setToggle(t){
    this.isToggle = true;
  }

  setState(state){
    if(this.isToggle){
      this.pressed = state;
    }
  }

}
