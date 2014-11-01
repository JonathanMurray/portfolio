//sides
var LEFT = 1;
var RIGHT = 2;

//directions
var UP = 3;
var DOWN = 4;
var STILL = 5;
var validDirections = [UP, DOWN, STILL];


var stage;
var padL;
var padR;
var pads;
var ball;
var useAI;

function Pad(x, y, w, h, color, side, stage, speed){
	this.w = w;
	this.h = h; 
	this.color = color;
	this.side = side;
	this.shape = new createjs.Shape();
	this.shape.x = x;
	this.shape.y = y;
	this.stage = stage;
	this.stage.addChild(this.shape);
	this.direction = STILL;
	this.speed = speed;
	
	this.draw = function(){
		this.shape.graphics.clear();
		this.shape.graphics.beginFill(color).drawRect(0,0, this.w, this.h);
	}

	this.moveY = function(dy){
		this.shape.y += dy;
		if(this.shape.y < 0){
			this.shape.y = 0;
		}
		if(this.shape.y > this.stage.canvas.height - this.h){
			this.shape.y = this.stage.canvas.height - this.h;
		}
	}

	this.update = function(){
		switch(this.direction){
			case UP:
				this.moveY( - this.speed);
				break;
			case DOWN:
				this.moveY(this.speed);
				break;
			case STILL:
				break;
			default:
				alert("Pad update, bad direction");
				break;	
		}
	}
}

function Ball(x, y, radius, color, stage, speed){
	this.radius = radius;
	this.color = color;
	this.shape = new createjs.Shape();
	this.shape.x = x;
	this.shape.y = y;
	this.stage = stage;
	this.stage.addChild(this.shape);
	this.radians = 0.3;
	this.speed = speed;
	
	this.draw = function(){
		this.shape.graphics.clear();
		this.shape.graphics.beginFill(color).drawCircle(0,0, this.radius);
	}

	this.update = function(){
		var dx = Math.cos(this.radians) * speed;
		var dy = Math.sin(this.radians) * speed;

		var nextX = this.shape.x + dx;
		var nextY = this.shape.y + dy;

		if(nextX > this.stage.canvas.width - padR.w - this.radius){
			this.collisionCheckPad(padR);
		}else if(nextX < padL.w + this.radius){
			this.collisionCheckPad(padL);
		}else if(nextY < this.radius || nextY > this.stage.canvas.height - this.radius){
			this.bounceWall();
		}else{
			this.shape.x = nextX;
			this.shape.y = nextY;
		}
	}

	this.collisionCheckPad = function(pad){
		if(this.shape.y > pad.shape.y - this.radius && this.shape.y < pad.shape.y + pad.h + this.radius){
			this.bouncePad(pad);
		}else{
			this.shape.x = this.stage.canvas.width/2;
			this.radians = 0;
		}
	}

	this.bouncePad = function(pad){
		this.radians = Math.PI - this.radians;
		var radianCoefficient = 0.003;
		var mult = this.shape.y - (pad.shape.y + pad.h/2);
		if(pad.side == LEFT){
			this.radians += radianCoefficient * mult;
			this.shape.x = pad.shape.x + pad.w + this.radius 
		}else if(pad.side == RIGHT){
			this.radians -= radianCoefficient * mult;
			this.shape.x = pad.shape.x - this.radius;
		}else{
			alert("bad side: " + side);
		}
	}

	this.bounceWall = function(){
		this.radians = 2* Math.PI - this.radians;
	}
}


function tick(event) {
	//Don't waste CPU on running pong if that tab is not open
	if(getActiveTabFromUrl() == "pong"){
		updateGame(event);
	}
}

function updateGame(event){
	if(useAI){
		updateAI();	
	}
	pads.forEach(function(pad){
		pad.update();
		pad.draw();
	});
	ball.update();
	ball.draw();
	stage.update(event);
}

function updateAI(){
	var thresh = padR.h / 4;
	if(padR.shape.y + padR.h/2 < ball.shape.y - thresh){
		padR.direction = DOWN;
	}else if(padR.shape.y + padR.h/2 > ball.shape.y + thresh){
		padR.direction = UP;
	}else{
		padR.direction = STILL;
	}
}

function setupPong(){
	$("#ai-checkbox").click(aiCheckboxClicked);
	useAI = $("#ai-checkbox").get(0).checked;

	var padWidth = 15;
	var padHeight = 100;
	var padY = 100;
	var padSpeed = 10;
	var ballRadius = 8;
	var ballSpeed = 22;

	createjs.Ticker.addEventListener("tick", tick);
	stage = new createjs.Stage("pong-canvas");
	padL = new Pad(0, padY, padWidth, padHeight, "white", LEFT, stage, padSpeed);
	padR = new Pad(stage.canvas.width - padWidth, padY, padWidth, padHeight, "white", RIGHT, stage, padSpeed);
	pads = [padL, padR];
	ball = new Ball(stage.canvas.width/2, padY + 20, ballRadius, "white", stage, ballSpeed);
}

function aiCheckboxClicked(event){
	useAI = event.target.checked;
}

function pongKeyHandler(event){
	handlePadKeys(padL, event.keyCode.toString());
	if(! useAI){
		handlePadKeys(padR, event.keyCode.toString());
	}



	// event.keyCode.toString()
}	

function handlePadKeys(pad, keyCode){
	
	var wKey = "87";
	var sKey = "83";
	var oKey = "79";
	var lKey = "76";

	var dirs;
	if(pad.side == LEFT){
		dirs = {
			"87": UP, //W
			"83": DOWN	//S
		}
	}else{
		dirs = {
			"79": UP, //O
			"76": DOWN	//L
		}
	}
	console.log(dirs);
	direction = dirs[keyCode];
	console.log(direction);
	if(validDirections.indexOf(direction) > -1){
		if(event.type == "keydown"){
			console.log(direction);
			pad.direction = direction;
		}else if(event.type == "keyup" && pad.direction == direction){
			console.log("BLAHH");
			pad.direction = STILL;
		}	
	}
}
