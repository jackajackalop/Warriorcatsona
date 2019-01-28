//special thanks to Golan Levin for the chunks of code I took from his etch-a-sketch
//and to this code https://editor.p5js.org/Char/sketches/HkzbwITc7

var ctracker;
var open_mouth = false;
var chomp = false;
var wide_eyes = false;
var prevDist_mouth;
var eyeDist;
var headDist;
var noseDist;
var tilt = false;
var ears;
var eyes;
var muzzle;
var full;
var face;
var search = true;

function setup() {
    // setup camera capture
    var videoInput = createCapture(VIDEO);
    videoInput.size(800, 600);
    videoInput.position(0, 0);
    // setup canvas
    var cnv = createCanvas(800, 600, WEBGL);
    cnv.position(0, 0);
    // // setup tracker
    ctracker = new clm.tracker();
    ctracker.init(pModel);
    ctracker.start(videoInput.elt);
    noStroke();

    muzzle = loadModel('\\muzzle.obj');
    eyes = loadModel('\\eyes.obj');
    ears = loadModel('\\ears.obj');
    face = loadModel('\\face.obj');
}

function keyPressed(){
    if(keyCode == 32){
        open_mouth = false;
        chomp = false;
        wide_eyes = false;
        prevDist_mouth = undefined;
        eyeDist = undefined;
        headDist = undefined;
        noseDist = undefined;
        tilt = false;
        search = true;
    }
}

function distance(A, B) {
	return sqrt((B[0]-A[0])*(B[0]-A[0])+(B[1]-A[1])*(B[1]-A[1]))
}

function findMidpoint(A, B){
    return [(A[0]+B[0])/2,(A[1]+B[1])/2];
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
        search = false;
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
        if(distR-eyeDist>2){
            wide_eyes = true;
            search = false;
            console.log("STARE!");   
        }     
    }
}

function checkTilt(head){
    var dist = distance([0,0], head);
    if(headDist == undefined) headDist = dist;
    else{
        if(abs(headDist-dist)>10){
            tilt = true;
            search = false;
            console.log("TILT!"); 
        }
        // console.log(dist);       
    }
}

function checkFace(nose){
    var dist = distance([0,0], nose);
    if(noseDist == undefined) noseDist = dist;
    else{
        if(abs(noseDist-dist)>10){
            full = true;
            search = false;
            console.log("FACE!"); 
        }
        // console.log(dist);       
    }
}

function draw() {
    clear();
    // get array of face marker positions [x, y] format
    var positions = ctracker.getCurrentPosition();
    if(positions.length>=57){
        if(search){
            checkMouth(positions[57], positions[32]);
            checkEyes(positions[24], positions[26], positions[29], positions[31]);
            checkTilt(positions[0]);
            checkFace(positions[62]);
        }
    // for (var i=0; i<positions.length; i++) {
    //   	fill(map(positions[i][0], width*0.33, width*0.66, 0, 255), map(positions[i][1], height*0.33, height*0.66, 0, 255), 255);
    //   	ellipse(positions[i][0], positions[i][1], 8, 8);
    // }
        angleMode(DEGREES);

        ambientMaterial(200);
        ambientLight(200);
        pointLight(250, 250, 250, -200, -200, 200);
        if(chomp) drawChomp(positions[57]);
        else if(wide_eyes) drawEyes(positions[24], positions[29]);
        else if(tilt) drawEars(positions[0], positions[14]);
        else if(full) drawFace(positions[62]);
    }
}

function drawChomp(mouth){
    rotateX(180);
    rotateY(180);
    scale(30);
    translate(-(mouth[0]-405)/10, -(mouth[1]-350)/10, -20);
    model(muzzle);
    resetMatrix();
}

function drawEyes(r, l){
    scale(25);
    rotateX(180);
    rotateY(180);
    translate(-(l[0]-455)/10, -(l[1]-230)/10, -20);
    model(eyes);
    resetMatrix();
}

function drawEars(r, l){
    scale(30);
    rotateX(180);
    rotateY(180);
    pt = findMidpoint(r, l);
    translate(-(pt[0]-400)/10, -(pt[1]-280)/10, -20);
    model(ears);
    resetMatrix();
}

function drawFace(nose){
    scale(40);
    rotateX(180);
    rotateY(180);
    translate(-(nose[0]-400)/10, -(nose[1]-280)/10, -30);
    model(face);
    resetMatrix();
}
