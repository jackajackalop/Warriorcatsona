//special thanks to Golan Levin for the chunks of code I took from his etch-a-sketch
//and to this code https://editor.p5js.org/Char/sketches/HkzbwITc7

var socket;
var ctracker;
var prevDist = 0;
var open = false;
var world;
var surface;
var playerNum;
var baguette1_body;
var player1;
var dog1_idle;
var dog1_jump;
var dog1_bite;
var biting1;
var bites_needed1;
var bites1 = 0;
var baguette1_level = 2;
var power1 = 0;
var increase1 = true;
var baguette2_body;
var player2;
var dog2_idle;
var dog2_jump;
var dog2_bite;
var biting2;
var bites_needed2;
var bites2 = 0;
var baguette2_level = 0;
var power2 = 0;
var increase2 = true;
var baguettes=[];
var baguette_heights = [470, 410, 370, 320, 290, 250, 200, 170];
var gameState = 0;
var bg, fg, win, lose;

function setup() {
    //socket setup
    socket = io.connect('http://localhost:8000');
    // setup camera capture
    var videoInput = createCapture(VIDEO);
    videoInput.size(800, 600);
    videoInput.position(0, 0);
    videoInput.hide();
    // setup canvas
    var cnv = createCanvas(800, 600);
    cnv.position(0, 0);
    // // setup tracker
    ctracker = new clm.tracker();
    ctracker.init(pModel);
    ctracker.start(videoInput.elt);
    noStroke();

    world = createWorld(new box2d.b2Vec2(0, -10.0));
    surface = new Surface(height*0.95);
    player1 = new Dog(width/3);
    baguette1_body = new Baguette(width/3);
    player2 = new Dog(width*2/3);
    baguette2_body = new Baguette(width*2/3);

    dog1_idle = loadImage('\\dog1_idle.png');
    dog1_jump = loadImage('\\dog1_jump.png');
    dog1_bite = loadImage('\\dog1_bite.png');
    dog2_idle = loadImage('\\dog2_idle.png');
    dog2_jump = loadImage('\\dog2_jump.png');
    dog2_bite = loadImage('\\dog2_bite.png');
    for(var i=0; i<8; i++){
        baguettes.push(loadImage('\\baguette'+(i+1)+'.png'));
    }
    bg = loadImage('\\bg.png');
    fg = loadImage('\\fg.png');
    win = loadImage('\\win.png');
    lose = loadImage('\\lose.png');
    biting1 = false;
    bites_needed1 = 8+random(5);
    biting2 = false;
    bites_needed2 = 8+random(5);
    gameState = 0;

    socket.on("player", setPlayer);
    socket.on("status", processStatus);
    socket.on("power", processPower);
}

function processStatus(status){
    if(status == "yeet"){
        if(playerNum==1){
            biting2 = false;
            power2 = 0;
            baguette2_level++;
        }else{
            biting1 = false;
            power1 = 0;
            baguette1_level++;
        }
    }else if(status == "win"){
        if(playerNum==1) gameState = 2;
        else gameState = 1;
    }else if(status == "biting1"){
        biting1 = true;
    }else if(status == "biting2"){
        biting2 = true;
    }else if(status == "jump"){
        if(playerNum==1) player2.jump(power2);
        else player1.jump(power1);
    }
}

function processPower(power){
    if(playerNum==1) power2 = power;
    else power1 = power;
}

function setPlayer(data){
    playerNum = data;
    console.log("player "+playerNum+" ready!");
}

function keyReleased(){
    if(keyCode == 32){
        if(playerNum==1){
            player1.jump(power1);
            socket.emit("status", "jump");
            //send jump +power1
        }
        else{
            player2.jump(power2);
            socket.emit("status", "jump");
            //send jump+power2
        }
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
        if(playerNum==1) bites1++;
        if(playerNum==2) bites2++;
		//console.log("CHOMP!");
	}
    if(!open && prevDist-currentDist>0){
        prevDist = currentDist;
    }
}

function draw() {
    image(bg, 0, 0);
    console.log(gameState);
    if(gameState==0) drawGame();
    else if(gameState==1){
        if(playerNum==1){
            image(win, 0, 0);
            translate(-100,-205);
            image(dog1_idle, width/2, height*0.95);
            resetMatrix();
        }else{
            image(lose, 0, 0);
            translate(-100,-205);
            image(dog2_idle, width/2, height*0.95);
            resetMatrix();
        }
    }else if(gameState==2){
        if(playerNum==2){
            image(win, 0, 0);            
            translate(-100,-205);
            image(dog2_idle, width/2, height*0.95);
            resetMatrix();
        }else{
            image(lose, 0, 0);            
            translate(-100,-205);
            image(dog1_idle, width/2, height*0.95);
            resetMatrix();
        }
    }
    scale(1, 0.5);
    translate(0, height);
    image(fg, 0, 0);
    resetMatrix();
}

function drawGame(){
    // We must always step through time!
    var timeStep = 1.0 / 30;
    // 2nd and 3rd arguments are velocity and position iterations
    world.Step(timeStep, 10, 10);
    surface.display();
    drawOne();
    drawTwo();
}

function drawOne(){
    baguette1_body.display();

    var location = baguette1_body.getPos();
    var x = location.x;
    var y = location.y;
    translate(-70, -20);
    image(baguettes[baguette1_level], x, y);
    resetMatrix();

    location = player1.getPos();
    x = location.x;
    y = location.y;
    if(biting1 || (playerNum==1 && y<baguette1_body.getPos().y+baguette_heights[baguette1_level])){
        biting1 = true;
        if(playerNum==1) socket.emit("status", "biting1");
        y = baguette1_body.getPos().y+baguette_heights[baguette1_level];
        x = baguette1_body.getPos().x;
    }
    translate(-100,-205);

    if(biting1){
        image(dog1_bite,x, y);
        if(playerNum==1){
            var positions = ctracker.getCurrentPosition();
            if(positions.length>=57)
                checkMouth(positions[57], positions[32]);
            if(bites1>=bites_needed1){
                bites1 = 0;
                bites_needed1 = 8+random(5);
                if(baguette1_level<7){
                    baguette1_level++;
                    socket.emit("status", "yeet");
                    biting1 = false;
                }else{
                    socket.emit("status", "win");
                    gameState = 1;
                }
            }
        }
    }else if((playerNum==1 && keyIsDown(32))
        ||(playerNum==2 && power1>0)){
        if(playerNum==1){
            if(power1<100) power1+=1;
        }

        socket.emit("power", power1);
        image(dog1_jump,x, y);
    }else{
        power1=0;
        image(dog1_idle,x, y);
    }
    resetMatrix();
}

function drawTwo(){
    baguette2_body.display();

    var location = baguette2_body.getPos();
    var x = location.x;
    var y = location.y;
    translate(-70, -20);
    image(baguettes[baguette2_level], x, y);
    resetMatrix();

    location = player2.getPos();
    x = location.x;
    y = location.y;
    if(biting2 || (playerNum==2&&y<baguette2_body.getPos().y+baguette_heights[baguette2_level])){
        biting2 = true;
        if(playerNum==2) socket.emit("status", "biting2");
        y = baguette2_body.getPos().y+baguette_heights[baguette2_level];
        x = baguette2_body.getPos().x;
    }
    translate(-100,-205);

    if(biting2){
        image(dog2_bite,x, y);
        if(playerNum==2){
            var positions = ctracker.getCurrentPosition();
            if(positions.length>=57)
                checkMouth(positions[57], positions[32]);
            if(bites2>=bites_needed2){
                bites2 = 0;
                bites_needed2 = 8+random(5);
                if(baguette2_level<7){
                    baguette2_level++;
                    socket.emit("status", "yeet");
                    biting2 = false;
                }else{
                    socket.emit("status", "win");
                    gameState = 2;
                }
            }
        }
    }else if((playerNum==2 && keyIsDown(32))
        ||(playerNum==1 && power2>0)){
        if(playerNum==2){
            if(power2<100) power2+=1;
        }
        socket.emit("power", power2);
        image(dog2_jump,x, y);
    }else{
        power2=0;
        image(dog2_idle,x, y);
    }
    resetMatrix();
}