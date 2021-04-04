class Pattern {

  int duration;
  float [] aperture;
  int [] time;
  float w;
  float h;

  Pattern() {

    generateRandom();

    w = width;
    h = 200;
  }

  void render() {
    pushStyle();
    pushMatrix();
    translate(0, height/2);


    for (int i = 0; i < aperture.length; i++) {

      float x = map(time[i], 0, duration, 0, width);
      float l = aperture[i] * h;
      
      stroke(255,0,108, 255*aperture[i]);
      
      line(x, 0, x, 0 - l);
    }

    popMatrix();
    popStyle();
  }

  void generateRandom() {

    duration = int(random(2000, 4500));
    int interval = 40;
    int sampleCount = int(duration/interval);
    println("sampleCount -> " + sampleCount); 
    aperture = new float [sampleCount];
    time = new int [sampleCount];

    float noiseScale = 0.3;
    float seed = random(125398186);

    for (int i = 0; i < sampleCount; i++) {

      float noise = noise((seed + i) * noiseScale);
      aperture[i] = noise;
      time[i] = i * interval;
    }
  }
}
