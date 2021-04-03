let faceData;

class FaceData{

  constructor(){
    this.leftReference = createVector(0,0);
    this.rightReference = createVector(0,0);
    this.ready = false;
    this.distancesSet = false;
    this.topLip = createVector(0,0);
    this.bottomLip = createVector(0,0);
    this.rawData = [];
    this.referenceDistance = 0;
    this.lipDistance = 0;
    this.lipDistanceNormalized = 0;
    this.maxAperture = 0;
    this.minAperture = 0;
    this.scaleFactor = 0;
    this.history = [];
    this.hFactor = 8;
    this.historyLength = captureWidth/this.hFactor;
  }

  setData(data){
    this.rawData = data;
  }


  update(){
    this.ready = false;
    if(this.rawData.length === 4){

      let leftIndex = 0;
      let topIndex = 0;
      let rightIndex = 0;
      let bottomIndex = 0;
      for(let i = 0 ; i < this.rawData.length ; i++){
        let point = this.rawData[i];
        if(point.x < this.rawData[leftIndex].x){
          leftIndex = i;
        }

        if(point.x > this.rawData[rightIndex].x){
          rightIndex = i;
        }

        if(point.y > this.rawData[bottomIndex].y){
          bottomIndex = i;
        }
      }


      for(let i = 0 ; i < 4 ; i++){
        if(i != rightIndex && i != leftIndex && i != bottomIndex){
          topIndex = i;
          break;
        }
      }

      this.leftReference = this.rawData[leftIndex];
      this.rightReference = this.rawData[rightIndex];
      this.topLip = this.rawData[topIndex];
      this.bottomLip = this.rawData[bottomIndex];

      this.ready = true;
    }

    if(this.ready && this.distancesSet){
      this.calculateAperture();
      this.updateHistory();
    }
  }

  calculateAperture(){
    let currDistance = dist(this.topLip.x, this.topLip.y, this.bottomLip.x, this.bottomLip.y);
    let currRefDistance = dist(this.leftReference.x, this.leftReference.y, this.rightReference.x, this.rightReference.y);
    this.scaleFactor = currRefDistance/this.referenceDistance;

    this.lipDistance = map(currDistance, this.minAperture, this.maxAperture, 0, 1) / this.scaleFactor;
    this.lipDistanceNormalized = constrain(this.lipDistance, 0, 1);
  }

  updateHistory(){
    if(this.history.length < this.historyLength){
      this.history.push(this.lipDistanceNormalized);
    }else{
      this.history.shift();
      this.history.push(this.lipDistanceNormalized);
    }

  }

  setReferenceDistance(){
    if(this.ready){
      this.referenceDistance = dist(this.leftReference.x, this.leftReference.y, this.rightReference.x, this.rightReference.y);
      this.checkDistanceSettings();
    }
  }

  setMinDistance(){
    if(this.ready){
      this.minAperture = dist(this.topLip.x, this.topLip.y, this.bottomLip.x,  this.bottomLip.y);
      this.checkDistanceSettings();
    }
  }

  setMaxDistance(){
    if(this.ready){
      this.maxAperture = dist(this.topLip.x, this.topLip.y, this.bottomLip.x,  this.bottomLip.y);
      console.log("done!");
      this.checkDistanceSettings();
    }
  }


  checkDistanceSettings(){
    if(this.maxAperture > 0 && this.minAperture > 0 && this.referenceDistance > 0){
      this.distancesSet = true;
    }
  }

  render(){
    push();
    translate(captureWidth,0);
    if(this.ready){
      this.renderNotif();
      this.renderPoint(this.leftReference, "L");
      this.renderPoint(this.rightReference, "R");
      this.renderPoint(this.topLip, "T");
      this.renderPoint(this.bottomLip, "B");
      this.renderConnections();
      if(this.distancesSet){
        this.renderRefDistance();
        this.renderAperture();
      //  this.renderHistory();
      }
    }
    pop();
  }

  renderHistory(){
    push();
    if(this.history.length > 1){
      let w = this.historyLength * this.hFactor;
      let h = 50;
      translate(0,captureHeight + h * 2);
      strokeWeight(1);
      for(let i = 1 ; i < this.history.length ; i ++){
        let l = this.history[i] * h;
          let lp = this.history[i-1] * h;
        stroke(255,128 + 128*(1-this.history[i]), 255*(1-this.history[i]));
        line((i-1)*this.hFactor, -lp, i*this.hFactor, -l);
      }
    }
    pop();
  }

  renderConnections(){
    push();

    stroke(255,128);
    strokeWeight(1);
    this.dashedLine(this.leftReference.x, this.leftReference.y, this.rightReference.x, this.rightReference.y);
    strokeWeight(2);
    stroke(255);
    line(this.topLip.x, this.topLip.y, this.bottomLip.x, this.bottomLip.y);
    pop();

  }

  renderNotif(){

    push();
    textSize(20);
    let w = textWidth("ready") + 10;
    noStroke();
    fill(255);
    rect(captureWidth - w, 0, w, 25);
    fill(0,0,0);
    text("ready", captureWidth - w + 5, 20);
    pop();

  }

  renderPoint(pos, tag){
    push();
    stroke(255,0,0, 40);
    translate(pos.x, pos.y);
    //console.log(pos.x);
    let steps = 15;
    let diam = 35;
    push();
    rotate(frameCount * 0.01);
    for(let i = 0 ; i < steps ; i++){
      push();
      rotate(TWO_PI/steps * i);
      translate(diam/2,0);
      line(0,-2,0,2);
      pop();

    }
    pop();

    let l = 30;
    line(0,0,l,-l);
    line(l,-l,l+15,-l)
    fill(255);
    noStroke();
    textSize(20);
    text(tag, l + 2, - l - 2);

    pop();

  }

  renderAperture(){
    push();
    let middle =  p5.Vector.sub(this.bottomLip, this.topLip);
    translate(this.topLip.x + middle.x/2, this.topLip.y + middle.y/2);

    stroke(255, 255, 0);
    let l = 30;
    line(0,0,-l,-l);
    line(-l,-l,-l-35,-l)

    textAlign(RIGHT,TOP);

    fill(255,255,0);
    noStroke();
    textSize(20);
    text( nfc(this.lipDistanceNormalized,2) , -l, -l - 22);
    textSize(15);
    text( "(" + nfc(this.lipDistance,2) + ")" , -l, -l );

    pop();
  }

  renderRefDistance(){
    push();
    let middle =  p5.Vector.sub(this.rightReference, this.leftReference);
    translate(this.leftReference.x + middle.x/2, this.leftReference.y + middle.y/2);
    fill(198,120,221);
    noStroke();
    textSize(15);
    text("(" + nfc(this.scaleFactor,2) + ")", 0, -20);
    text( nfc(this.referenceDistance,2) , 0, -5);

    pop();
  }

  dashedLine(x1, y1, x2, y2){
    let l = 4;
    let distance = dist(x1,y1,x2,y2);
    let dash = true;
    for(let i = 0 ; i < distance - l ; i += l){
      if(dash){
        let lerp1 = i/distance;
        let lerp2 = (i+l)/distance;
        line(lerp(x1,x2,lerp1), lerp(y1,y2,lerp1), lerp(x1,x2,lerp2), lerp(y1,y2,lerp2));
      }
      dash = ! dash;
    }
  }

}
