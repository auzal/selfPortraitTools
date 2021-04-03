
let chromaShader;
let capture;
let chromaImage;
let blurHShader, blurVShader;
let keyColor;
let maxColorDist = 0.0;
let pass1, pass2;
let texelSize = 0.8;
let waitingForColorPick = false;
let enableBlur = true;

//*****************************************************************

function createThresholdImage(){
  chromaShader.setUniform("iResolution", [chromaImage.width, chromaImage.height]);
  chromaShader.setUniform("key", [red(keyColor) / 255.0, green(keyColor) / 255.0, blue(keyColor) / 255.0]);
  chromaShader.setUniform("maxDist", maxColorDist);
  chromaShader.setUniform('texRef', capture);

  chromaImage.shader(chromaShader);
  chromaImage.rect(0,0,width,height);


  if(enableBlur){
    pass1.shader(blurHShader);

    blurHShader.setUniform('tex0', chromaImage);
    blurHShader.setUniform('texelSize', [texelSize/width, texelSize/height]);
    blurHShader.setUniform('direction', [1.0, 0.0]);

    pass1.rect(0,0,width, height);
    pass2.shader(blurVShader);

    blurVShader.setUniform('tex0', pass1);
    blurVShader.setUniform('texelSize', [texelSize/width, texelSize/height]);
    blurVShader.setUniform('direction', [0.0, 1.0]);


    pass2.rect(0,0,width, height);
  }else{
    pass2.clear();
    pass2.image(chromaImage,-captureWidth/2,-captureHeight/2);
  }



  //  image(pass2,0 + width/2 ,0);

}
