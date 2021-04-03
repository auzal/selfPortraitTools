class Panel{

  constructor(){
    this.sliders = [];
    this.buttons = [];
    this.toggles = [];
    this.labels = [];
    this.x = 0;
    this.y = 0;
    this.elementHeight = 20;
    this.margin = 5;
    this.width = 100;
    this.yAcumulated = 0;

  }

  addLabel(labelLabel){
    let label = new Label();
    label.setColor(color(178, 42, 54));
    label.setTextColor(color(136, 33, 22));
    label.setPosition(this.x,this.y + this.yAcumulated);
    label.setDimensions(this.width,  this.elementHeight);
    label.setLabel(labelLabel);
    this.labels.push(label);
    this.yAcumulated += this.elementHeight + this.margin;
  }

  addSlider(label){
    let slider = new Slider();
    slider.setColor(color(178, 42, 54));
    slider.setTextColor(color(136, 33, 22));
    slider.setPosition(this.x,this.y + this.yAcumulated);
    slider.setDimensions(this.width,  this.elementHeight);
    slider.setLabel(label);
    this.sliders.push(slider);
    this.yAcumulated += this.elementHeight + this.margin;
  }

  addButton(label){
    let button = new Button();
    button.setColor(color(178, 42, 54));
    button.setTextColor(color(136, 33, 22));
    button.setPosition(this.x,this.y + this.yAcumulated);
    button.setLabel(label);
    this.buttons.push(button);
    this.yAcumulated += this.elementHeight + this.margin;
  }

  addToggle(label){
    let toggle = new Button();
    toggle.setColor(color(178, 42, 54));
    toggle.setTextColor(color(136, 33, 22));
    toggle.setPosition(this.x,this.y + this.yAcumulated);
    toggle.setLabel(label);
    toggle.setToggle(true);
    this.toggles.push(toggle);
    this.yAcumulated += this.elementHeight + this.margin;
  }

  update(){
    for(let i = 0 ; i < this.sliders.length ; i ++){
      this.sliders[i].update();
    }
    for(let i = 0 ; i < this.buttons.length ; i ++){
      this.buttons[i].update();
    }
    for(let i = 0 ; i < this.toggles.length ; i ++){
      this.toggles[i].update();
    }
    for(let i = 0 ; i < this.labels.length ; i ++){
      this.labels[i].update();
    }

  }

  render(){

    for(let i = 0 ; i < this.sliders.length ; i ++){
      this.sliders[i].render();
    }
    for(let i = 0 ; i < this.buttons.length ; i ++){
      this.buttons[i].render();
    }
    for(let i = 0 ; i < this.toggles.length ; i ++){
      this.toggles[i].render();
    }
    for(let i = 0 ; i < this.labels.length ; i ++){
      this.labels[i].render();
    }

  }

  release(){
    for(let i = 0 ; i < this.sliders.length ; i ++){
      this.sliders[i].release();
    }
  }


  checkClick(x,y){
    for(let i = 0 ; i < this.sliders.length ; i ++){
      this.sliders[i].checkClick(x,y);
    }
    for(let i = 0 ; i < this.buttons.length ; i ++){
      this.buttons[i].checkClick(x,y);
    }
    for(let i = 0 ; i < this.toggles.length ; i ++){
      this.toggles[i].checkClick(x,y);
    }

  }

  setPosition(x, y){
    this.x = x;
    this.y = y;
  //  this.moveElements();
  }

  getSliderValue(label){
    let val = null;
    for(let i = 0 ; i < this.sliders.length ; i ++){
      let sliderLabel = this.sliders[i].label.toLowerCase();
      if(sliderLabel === label.toLowerCase()){
        val = this.sliders[i].getValue();
        break;
      }
    }
    return val;
  }

  getButtonState(label){
    let val = null;
    for(let i = 0 ; i < this.buttons.length ; i ++){
      let buttonLabel = this.buttons[i].label.toLowerCase();
      if(buttonLabel === label.toLowerCase()){
        val = this.buttons[i].getPressed();
        break;
      }
    }
    return val;
  }

  getToggleState(label){
    let val = null;
    for(let i = 0 ; i < this.toggles.length ; i ++){
      let toggleLabel = this.toggles[i].label.toLowerCase();
      if(toggleLabel === label.toLowerCase()){
        val = this.toggles[i].getPressed();
        break;
      }
    }
    return val;
  }

  setLabelValue(label, val){
    for(let i = 0 ; i < this.labels.length ; i ++){
      let labelLabel = this.labels[i].label.toLowerCase();
      if(labelLabel === label.toLowerCase()){
        this.labels[i].value = val;
        break;
      }
    }
  }


}
