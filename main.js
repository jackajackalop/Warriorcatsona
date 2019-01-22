//special thanks to Golan Levin for the chunks of code I took from his etch-a-sketch
//and to this code https://editor.p5js.org/Char/sketches/HkzbwITc7

//server things
// var express = require('express');
// var app = express();
// var server = app.listen(8000);
// app.use(express.static('public'));

let ctracker;
let prevDist = 0;
let open = false;
let world;
let surface;
let baguette1_body;
let player1;
let dog1_idle;
let dog1_jump;
let dog1_bite;
let biting1;
let bites_needed1;
let bites1 = 0;
let baguettes=[];
let baguette1_level = 0;
let baguette_heights = [470, 410, 370, 320, 290, 250, 200, 170];
let power = 0;
let increase = true;
let win = 0;

function setup() {
    // setup camera capture
    let videoInput = createCapture(VIDEO);
    videoInput.size(800, 600);
    videoInput.position(0, 0);
    videoInput.hide();
    // setup canvas
    let cnv = createCanvas(800, 600);
    cnv.position(0, 0);
    // // setup tracker
    ctracker = new clm.tracker();
    ctracker.init(pModel);
    ctracker.start(videoInput.elt);
    noStroke();

    world = createWorld(new box2d.b2Vec2(0, -10.0));
    surface = new Surface(height*0.95);
    player1 = new Dog();
    baguette1_body = new Baguette();

    dog1_idle = loadImage('\\dog1_idle.png');
    dog1_jump = loadImage('\\dog1_jump.png');
    dog1_bite = loadImage('\\dog1_bite.png');
    for(var i=0; i<8; i++){
        baguettes.push(loadImage('\\baguette'+(i+1)+'.png'));
    }
    biting1 = false;
    bites_needed1 = 8+random(5);
}

function keyReleased(){
    if(keyCode == 32){
        player1.jump(power);
    }
    return false;
}

function distance(A, B) {
	return sqrt((B[0]-A[0])*(B[0]-A[0])+(B[1]-A[1])*(B[1]-A[1]))
}

function checkMouth(A, B){
	var currentDist = distance(A, B);
	if(prevDist-currentDist<0){
		prevDist = currentDist;
		open = true;
//		console.log("OPEN!");
	}
	if(open && prevDist-currentDist>=5.0){
        open = false;
        prevDist = currentDist;
        bites1++;
		//console.log("CHOMP!");
	}
    if(!open && prevDist-currentDist>0){
        prevDist = currentDist;
    }
}

function draw() {
    background(190, 190, 230);

    if(win==0){// We must always step through time!
        var timeStep = 1.0 / 30;
        // 2nd and 3rd arguments are velocity and position iterations
        world.Step(timeStep, 10, 10);

        surface.display();
        baguette1_body.display();

        var location = baguette1_body.getPos();
        var x = location.x;
        var y = location.y;
        var angle = baguette1_body.getRot();
        // translate(320,-80);
        // rotate((angle));
        translate(-70, -20);
        image(baguettes[baguette1_level], x, y);
        resetMatrix();

        location = player1.getPos();
        x = location.x;
        y = location.y;
        if(biting1 || y<baguette1_body.getPos().y+baguette_heights[baguette1_level]){
            biting1 = true;
            y = baguette1_body.getPos().y+baguette_heights[baguette1_level];
            x = baguette1_body.getPos().x;
        }
        translate(-100,-205);

        if(biting1){
            image(dog1_bite,x, y);
            var positions = ctracker.getCurrentPosition();
            if(positions.length>=57)
                checkMouth(positions[57], positions[32]);
            if(bites1>=bites_needed1){
                bites1 = 0;
                biting1 = false;
                bites_needed1 = 8+random(5);
                if(baguette1_level<8) baguette1_level++;
                else win = 1;
            }

        }else if(keyIsDown(32)){
            if(power<100 && increase) power+=1;
            else if(!increase && power>0)power-=1;

            if(increase && power>=100) increase = false;
            if(!increase && power<=0) increase = true;
            image(dog1_jump,x, y);
        }else{
            power=0;
            image(dog1_idle,x, y);
        }
        resetMatrix();
    }

    // get array of face marker positions [x, y] format


    // for (var i=0; i<positions.length; i++) {
    //   	// set the color of the ellipse based on position on screen
    //   	fill(map(positions[i][0], width*0.33, width*0.66, 0, 255), map(positions[i][1], height*0.33, height*0.66, 0, 255), 255);
    // }
}
