//special thanks to Golan Levin for the chunks of code I took from his etch-a-sketch
//and to this code https://editor.p5js.org/Char/sketches/HkzbwITc7
var ctracker;
var prevDist = 0;
var open = false;

function preload(){

}

function setup() {
    // setup camera capture
    var videoInput = createCapture();
    videoInput.size(400, 300);
    videoInput.position(0, 0);
    videoInput.hide();
    // setup canvas
    var cnv = createCanvas(400, 300);
    cnv.position(0, 0);
    // setup tracker
    ctracker = new clm.tracker();
    ctracker.init(pModel);
    ctracker.start(videoInput.elt);//, [0,0,1000,1000]);
    noStroke();
}
function keyPressed(){
 
}


function parseResult() {

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
	if(open && prevDist-currentDist>=2.0){
        open = false;
        prevDist = currentDist;
		console.log("CHOMP!");
	}
    if(!open && prevDist-currentDist>0){
        prevDist = currentDist;
    }

}

function draw() {
	clear();
    // get array of face marker positions [x, y] format
    var positions = ctracker.getCurrentPosition();
    if(positions.length>=57)
    	checkMouth(positions[57], positions[32]);
    for (var i=0; i<positions.length; i++) {
      	// set the color of the ellipse based on position on screen
      	fill(map(positions[i][0], width*0.33, width*0.66, 0, 255), map(positions[i][1], height*0.33, height*0.66, 0, 255), 255);
      	// draw ellipse at each position point
      	//ellipse(positions[i][0], positions[i][1], 8, 8);
    }
}
