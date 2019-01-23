
//based on Shiffman's example code found here:
//https://github.com/shiffman/The-Nature-of-Code-Examples-p5.js/blob/master/chp05_libraries/box2d-html5/NOC_5_03_ChainShape_Simple/particle.js
//for player 1

class Baguette {
   constructor(x) {
    
    var totalLength = 5;
    var numPoints = 5;
    var bread = false;
    this.ps = [];

    var len = totalLength/numPoints;
    for(var i = 0; i<numPoints; i++){
      bread = (i==numPoints-1);
      if(i==0) var newParticle = new Particle(x, i*len, true, bread);
      else var newParticle = new Particle(x, i*len, false, bread);
      this.ps.push(newParticle);
      if(i>0){
        var djd = new box2d.b2DistanceJointDef();
        var previous = this.ps[i-1];
        djd.bodyA = previous.body;
        djd.bodyB = newParticle.body;
        djd.length = scaleToWorld(len);
        djd.frequencyHz = 4;
        djd.dampingRatio = 0.7;
        var dj = world.CreateJoint(djd);
      }
    }
  }
  getPos(){
    return scaleToPixels(this.ps[this.ps.length-1].body.GetPosition());
  }
  getRot(){
    var a = this.ps[this.ps.length-1].body.GetPosition();
    var b = this.ps[0].body.GetPosition();
    var x = [a.x, a.y];
    var y = [b.x, b.y];
    var z = [b.x, height];
    var num = sq(distance(x,y))+sq(distance(y,z))-sq(distance(x,z));
    var denom = 2*distance(x,y)*distance(y,z);
    var angle = acos(num/denom);
    return angle;
  }

  display() {
    for(var i = 0; i<this.ps.length; i++){
      this.ps[i].display();
    }
  }
}
