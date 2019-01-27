//special thanks to Golan Levin for the chunks of code I took from his etch-a-sketch
//and to this code https://editor.p5js.org/Char/sketches/HkzbwITc7

var ctracker;
var open_mouth = false;
var chomp = false;
var wide_eyes = false;
var prevDist_mouth;
var eyeDist;
var headDist;
var tilt = false;
var earR;
var earL;
var eyeR;
var eyeL;
var muzzle;

function setup() {
    // setup camera capture
    var videoInput = createCapture(VIDEO);
    videoInput.size(800, 600);
    videoInput.position(0, 0);
    // setup canvas
    var cnv = createCanvas(800, 600);//, WEBGL);
    cnv.position(0, 0);
    // // setup tracker
    ctracker = new clm.tracker();
    ctracker.init(pModel);
    ctracker.start(videoInput.elt);
    noStroke();

    muzzle = loadModel('\\muzzle.obj');
}

function distance(A, B) {
	return sqrt((B[0]-A[0])*(B[0]-A[0])+(B[1]-A[1])*(B[1]-A[1]))
}

function checkMouth(A, B){
    var prevDist = prevDist_mouth;
	var currentDist = distance(A, B);
    // console.log(currentDist)
    if(prevDist==undefined) prevDist = currentDist;
	if(prevDist-currentDist<0){
		prevDist = currentDist;
		open_mouth = true;
	}
	if(open_mouth && prevDist-currentDist>=5.0){
        chomp = true;
        console.log("CHOMP!");

	}
    if(!open_mouth && prevDist-currentDist>0){
        prevDist = currentDist;
    }
    prevDist_mouth = prevDist;
}

function checkEyes(eyeR1, eyeR2, eyeL1, eyeL2){ 
//change to check for wider eyes instead
    var distR = distance(eyeR1, eyeR2);
    // var distL = distance(eyeL1, eyeL2);
    if(eyeDist == undefined) eyeDist = distR;
    else{
        if(distR-eyeDist>2) wide_eyes = true;
        if(wide_eyes)console.log("STARE!");        
    }
}

function checkTilt(chin){
    var dist = distance([0,0], chin);
    if(headDist == undefined) headDist = dist;
    else{
        if(headDist-dist>10) tilt = true;
        // console.log(dist);
        if(tilt)console.log("TILT!");        
    }
}

function draw() {
    clear();
    // get array of face marker positions [x, y] format
    var positions = ctracker.getCurrentPosition();
    if(!chomp && positions.length>=57)
        checkMouth(positions[57], positions[32]);
    if(!wide_eyes && positions.length>=31) 
        checkEyes(positions[24], positions[26], positions[29], positions[31]);
    if(!tilt && positions.length>=7) 
        checkTilt(positions[7]);
    for (var i=0; i<positions.length; i++) {
      	// set the color of the ellipse based on position on screen
      	fill(map(positions[i][0], width*0.33, width*0.66, 0, 255), map(positions[i][1], height*0.33, height*0.66, 0, 255), 255);
      	// draw ellipse at each position point
      	ellipse(positions[i][0], positions[i][1], 8, 8);
    }

    // if(chomp) drawChomp();
}

function drawChomp(){
    rotateX(180);
    scale(15);
    model(muzzle);
}
