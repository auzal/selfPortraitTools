
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 iResolution;
uniform int iFrame;
uniform vec2 iMouse;
uniform float iTime;
uniform sampler2D tex0;
uniform sampler2D tex1;
uniform sampler2D texRef;
uniform vec3 key;
uniform float maxDist;
uniform float threshold;

void main()
{
	// Normalized pixel coordinates (from 0 to 1)
	vec2 uv = gl_FragCoord.xy/iResolution.xy;

	uv.y = 1.0 - uv.y;

	// sample texture and output to screen
	// vec4 channel0FragColor = texture2D(tex0, uv);
	// vec4 channel1FragColor = texture2D(tex1, uv);

	vec4 texColor = texture2D(texRef, uv);

	float redValue = texColor.r;
	float greenValue = texColor.g;
	float blueValue = texColor.b;


	bool found = false;

	float lowThresh = 0.6;
	float highThresh = 0.6;

	if(redValue  < key.r  + maxDist/2.0 && redValue > key.r  - maxDist/2.0){
		if(greenValue  < key.g  + maxDist/2.0 && greenValue > key.g  - maxDist/2.0){
			if(blueValue  < key.b  + maxDist/2.0 && blueValue > key.b  - maxDist/2.0){
				found = true;
			}
		}
	}



	// if(value > threshold) {
	// 	if(channel0FragColor.a < 0.9){
	// 		gl_FragColor = vec4(bgColor, 1.0);
	// 		}else{
	// 			gl_FragColor = channel0FragColor;
	// 		}
	// 		} else {
	// 			gl_FragColor = channel1FragColor;
	// 		}
	if(found){
		  gl_FragColor = vec4(key.r, key.g, key.b, 1.0);
		}else{
			gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);

		}
	}
