//special thanks to Golan Levin for the chunks of code I took from his etch-a-sketch
//and to this code https://editor.p5js.org/Char/sketches/HkzbwITc7
let ctracker;
let prevDist = 0;
let open = false;
let world;
let surface;
let baguette1;
let player1;
let power = 0;
let increase = true;

function setup() {
    // setup camera capture
    // let videoInput = createCapture(VIDEO);
    // videoInput.size(800, 600);
    // videoInput.position(0, 0);
    // videoInput.hide();
    // setup canvas
    let cnv = createCanvas(800, 600);
    cnv.position(0, 0);
    // // setup tracker
    // ctracker = new clm.tracker();
    // ctracker.init(pModel);
    // ctracker.start(videoInput.elt);
    // noStroke();

    world = createWorld(new box2d.b2Vec2(0, -10.0));
    surface = new Surface(height*0.9);
    player1 = new Dog();
    baguette1 = new Baguette();
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
		//console.log("CHOMP!");
	}
    if(!open && prevDist-currentDist>0){
        prevDist = currentDist;
    }
}

function draw() {
    background(190, 190, 230);
    
    // We must always step through time!
    var timeStep = 1.0 / 30;
    // 2nd and 3rd arguments are velocity and position iterations
    world.Step(timeStep, 10, 10);

    if(keyIsDown(32)){
        if(power<100 && increase) power+=1;
        else if(!increase && power>0)power-=1;

        if(increase && power>=100) increase = false;
        if(!increase && power<=0) increase = true;
    }else
        power=0;
    
    surface.display();
    player1.display();
    baguette1.display();
    // get array of face marker positions [x, y] format
    // var positions = ctracker.getCurrentPosition();
    // if(positions.length>=57)
    // 	checkMouth(positions[57], positions[32]);
    
    // for (var i=0; i<positions.length; i++) {
    //   	// set the color of the ellipse based on position on screen
    //   	fill(map(positions[i][0], width*0.33, width*0.66, 0, 255), map(positions[i][1], height*0.33, height*0.66, 0, 255), 255);
    // }
}