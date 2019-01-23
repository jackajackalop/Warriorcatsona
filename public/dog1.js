//based on Shiffman's example code found here:
//https://github.com/shiffman/The-Nature-of-Code-Examples-p5.js/blob/master/chp05_libraries/box2d-html5/NOC_5_03_ChainShape_Simple/particle.js
//for player 1

class Dog {
   constructor(x) {
    var y = height*.75;
    var r = 5;
    this.r = r;

    // Define a body
    var bd = new box2d.b2BodyDef();
    bd.type = box2d.b2BodyType.b2_dynamicBody;
    bd.position = scaleToWorld(x, y);

    // Define a fixture
    var fd = new box2d.b2FixtureDef();
    // Fixture holds shape
    fd.shape = new box2d.b2CircleShape();
    fd.shape.m_radius = scaleToWorld(this.r);

    // Some physics
    fd.density = 3.0;
    fd.friction = 0.4;
    fd.restitution = 0.3;

    // Create the body
    this.body = world.CreateBody(bd);
    // Attach the fixture
    this.body.CreateFixture(fd);
  }

  getPos(){
    return scaleToPixels(this.body.GetPosition());
  }

  jump(power){
    var force = new box2d.b2Vec2(0, power*50);
    this.body.ApplyForce(force, this.body.GetWorldCenter());
  }

  // Drawing the Particle
  display() {
    // Get the body's position
    var pos = scaleToPixels(this.body.GetPosition());
    // Get its angle of rotation
    var a = this.body.GetAngleRadians();

    // Draw it!
    rectMode(CENTER);
    push();
    translate(pos.x, pos.y);
    rotate(a);
    fill(127);
    stroke(200);
    strokeWeight(2);
    ellipse(0, 0, this.r * 2, this.r * 2);
    // Let's add a line so we can see the rotation
    line(0, 0, this.r, 0);
    pop();
  }
}