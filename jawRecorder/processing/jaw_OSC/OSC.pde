/**
 * oscP5message by andreas schlegel
 * example shows how to create osc messages.
 * oscP5 website at http://www.sojamo.de/oscP5
 */

import oscP5.*;
import netP5.*;

OscP5 oscP5;
NetAddress myRemoteLocation;

/* incoming osc message are forwarded to the oscEvent method. */
void oscEvent(OscMessage theOscMessage) {
  /* print the address pattern and the typetag of the received OscMessage */
  //print(frameCount);
  //print("### received an osc message.");
  //print(" addrpattern: "+theOscMessage.addrPattern());
  //println(" typetag: "+theOscMessage.typetag());
  if (theOscMessage.addrPattern().equals("/aperture")) {
    if (theOscMessage.typetag().equals("f")) {
      float f = theOscMessage.get(0).floatValue();
      setAperture(f);
      prepareSend();
    } else {
      int i = theOscMessage.get(0).intValue();

      if (i == 0 || i == 1) {
        setAperture(i);
        prepareSend();
      }
    }
  }
}
