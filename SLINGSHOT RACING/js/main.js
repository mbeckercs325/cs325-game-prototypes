window.onload = function() {
    "use strict";
    
    var game = new Phaser.Game( 1200, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );
    
    function preload() {
        game.load.image( 'grassbackground', 'assets/grassbackground.png');
        game.load.image( 'racetrack1', 'assets/racetrack1.png');
        game.load.image( 'startfinishline', 'assets/startfinishline.png');
        game.load.image( 'checkpoint', 'assets/checkpoint.png');
        game.load.image( 'powermeter', 'assets/powermeter.png');
        game.load.image( 'powermetercover', 'assets/powermetercover.png');
        game.load.image( 'medalsheet', 'assets/medalsheet.png');
        game.load.image( 'resetbutton', 'assets/resetbutton.png');
    }
        
    var grassbackground;
    var racetrack1;
    var racetrack1Start = {x:282,y:79};
    var startfinishline;
    var checkpoint;
    var playercar;
    var playercarSelected = false;
    var playerHasCrossedStart = false;
    var playerHasCrossedCheckpoint = false;
    var playercarPosition = {};
    var powermeter;
    var powermetercover;
    var mouseClickPosition;
    var mousePosition = {};
    var startTime;
    var raceTimer;
    var raceTimerLabel;
    var welcomeText = 'WELCOME TO\nSLINGSHOT RACING\nClick and drag anywhere to launch your car!'
    var welcomeLabel;
    var stateLabel;
    var medalsheet;
    var resetbutton;

    function create() {
        game.physics.startSystem(Phaser.Physics.ARCADE);

        grassbackground = game.add.tileSprite( 0, 0, 1200, 600, 'grassbackground');
        racetrack1 = game.add.sprite( game.width/2, game.height/2, 'racetrack1');
        racetrack1.anchor.setTo(0.5,0.5);
        game.physics.enable(racetrack1, Phaser.Physics.ARCADE);

        startfinishline = game.add.sprite( 302, 36, 'startfinishline');
        game.physics.enable(startfinishline, Phaser.Physics.ARCADE);
	    startfinishline.body.checkCollision.up = false;
	    startfinishline.body.checkCollision.down = false;
        startfinishline.body.checkCollision.left = false;
	    startfinishline.body.immovable = true;

        checkpoint = game.add.sprite( 126, 36, 'checkpoint');
        game.physics.enable(checkpoint, Phaser.Physics.ARCADE);
	    checkpoint.body.checkCollision.up = false;
	    checkpoint.body.checkCollision.down = false;
        checkpoint.body.checkCollision.left = false;
	    checkpoint.body.immovable = true;

        raceTimerLabel = game.add.text(310, 150, "00.000", {font: "50px Arial", fill: "#fff"}); 
        raceTimerLabel.anchor.setTo(0.5, 0);
        raceTimerLabel.align = 'center';

        raceTimer = game.time.create(game);

        medalsheet = game.add.sprite( 133, 202, 'medalsheet');

        welcomeLabel = game.add.text(game.world.centerX,game.world.centerY, welcomeText, { font: '50px Arial', fill: '#fff', boundsAlignH: "center", boundsAlignV: "center" });
        welcomeLabel.anchor.setTo(0.5,0.5);
        welcomeLabel.align = 'center';

        game.time.events.add(2000, function() {    
            game.add.tween(welcomeLabel).to({alpha: 0}, 1500, Phaser.Easing.Linear.None, true);
        }, this);

        stateLabel = game.add.text(game.world.centerX,game.world.centerY,' ', { font: '50px Arial', fill: '#fff' });
        stateLabel.anchor.setTo(0.5, 0.5);
        stateLabel.align = 'center';
        stateLabel.visible = false;

        resetbutton = game.add.button(1110, 567, 'resetbutton', restart, this);

        createPlayerCar();
        createPowerMeter();
    }
    
    function update() { 
        if(game.physics.arcade.collide(playercar, startfinishline)){
            console.log("collide start");
        }else if(game.physics.arcade.collide(playercar, checkpoint)) {
            console.log("collide checkpoint");
        }else if(checkOverlap(playercar, startfinishline)) {    
            console.log("crossed start");
            playerCrossedStart();
        }else if(checkOverlap(playercar, checkpoint)) {
            console.log("crossed checkpoint");
            playerHasCrossedCheckpoint = true;
        }

        if (playercarSelected === true) {
            playercar.rotation = game.physics.arcade.angleBetween(game.input.activePointer, mouseClickPosition);
            mousePosition.x = game.input.activePointer.x;
            mousePosition.y = game.input.activePointer.y;

            var width = 200-game.physics.arcade.distanceToPointer(mouseClickPosition)/2;
            if(width > 0) {
                powermetercover.width = width;
            }else {
                powermetercover.width = 0;
            }
        }

        if(!isPositionInBounds(playercar.x, playercar.y)) {
            console.log("out of bounds");
            playercar.x = playercarPosition.x;
            playercar.y = playercarPosition.y;
            playercar.body.velocity.setTo(0, 0);
        }
    }

    function createPlayerCar() {
        var graphics = game.add.graphics(15,15);
        graphics.beginFill(Phaser.Color.getRandomColor(100,255,1));
        graphics.lineStyle(5, Phaser.Color.getRandomColor(100,255,1), 1);
        graphics.moveTo(15,8);
        graphics.lineTo(0,15);
        graphics.lineTo(0,0);
        graphics.lineTo(15,8);
        graphics.endFill();

        playercar = game.add.sprite(racetrack1Start.x, racetrack1Start.y, graphics.generateTexture());
        graphics.destroy();

        game.physics.enable(playercar, Phaser.Physics.ARCADE);
        playercar.anchor.setTo(0.5, 0.5);
        playercar.body.collideWorldBounds = true;
        playercar.body.bounce.setTo(0.9, 0.9);
        playercar.body.allowGravity = false;

        game.input.onDown.add(mouseDragStart, this);
        game.input.onUp.add(mouseDragEnd, this);
    }

    function createPowerMeter() {
        powermeter = game.add.sprite(0, game.height-50, 'powermeter');
        powermetercover = game.add.sprite(200,game.height-50, 'powermetercover');
        powermetercover.anchor.set(1,0);
    }

    function mouseDragStart() {
        //playercar.body.moves = false;
        //playercar.rotation = playercarPosition.rotation;
        playercar.body.velocity.setTo(playercar.body.velocity.x/7, playercar.body.velocity.y/7);
        playercarSelected = true;

        mouseClickPosition = game.add.sprite(game.input.activePointer.x, game.input.activePointer.y);
        playercarPosition.x = playercar.x;
        playercarPosition.y = playercar.y;
        playercarPosition.rotation = playercar.rotation;
    }

    function mouseDragEnd() {
        playercarSelected = false;

        playercar.body.moves = true;
        var Xvector = (mouseClickPosition.x - mousePosition.x)*(200 - powermetercover.width)/75;
        var Yvector = (mouseClickPosition.y - mousePosition.y);
        playercar.body.velocity.setTo(Xvector, Yvector);

        powermetercover.width = 200;
        mousePosition = {};
        mouseClickPosition = null;
    }

    function isPositionInBounds(xPos, yPos) {
        if(xPos > 128 && xPos < 1070 && yPos > 34 && yPos < 124) {
            return true;
        }else if(xPos > 1070 && xPos < 1158 && yPos > 34 && yPos < 366) {
            return true;
        }else if(xPos > 856 && xPos < 1070 && yPos > 279 && yPos < 366) {
            return true;
        }else if(xPos > 856 && xPos < 945 && yPos > 279 && yPos < 558) {
            return true;
        }else if(xPos > 664 && xPos < 945 && yPos > 468 && yPos < 558) {
            return true;
        }else if(xPos > 664 && xPos < 752 && yPos > 200 && yPos < 558) {
            return true;
        }else if(xPos > 486 && xPos < 752 && yPos > 200 && yPos < 288) {
            return true;
        }else if(xPos > 486 && xPos < 574 && yPos > 200 && yPos < 476) {
            return true;
        }else if(xPos > 40 && xPos < 574 && yPos > 386 && yPos < 476) {
            return true;
        }else if(xPos > 40 && xPos < 128 && yPos > 34 && yPos < 476) {
            return true;
        }

        return false;
    }

    function checkOverlap(spriteA, spriteB) {
        var boundsA = new Phaser.Rectangle();
        var boundsB = new Phaser.Rectangle();

        boundsA.x = spriteA.x-spriteA.width/2;
        boundsA.y = spriteA.y;
        boundsA.width = spriteA.width;
        boundsA.height = spriteA.height;

        boundsB.x = spriteB.x+1;
        boundsB.y = spriteB.y;
        boundsB.width = spriteB.width-2;
        boundsB.height = spriteB.height;

        return Phaser.Rectangle.intersects(boundsA, boundsB);
    }

    function playerCrossedStart() {
        if(playerHasCrossedStart === false && playerHasCrossedCheckpoint === false) {
            playerHasCrossedStart = true;
            startTime = new Date();
            raceTimer = game.time.events.loop(10, function(){
                updateTimer();
            });
        }else if(playerHasCrossedStart === true && playerHasCrossedCheckpoint === true) {
            playerHasCrossedStart = false;
            playercar.body.velocity.setTo(playercar.body.velocity.x/20, playercar.body.velocity.y/20);
            
            var currentTime = new Date();
            var timeDifference = startTime.getTime() - currentTime.getTime();
            var timeElapsed = Math.abs(timeDifference/1000);

            var stateLabelText;

            if(timeElapsed < 12) {
                stateLabelText = "Congratulations, you won the gold medal!\nClick to restart";
            }else if(timeElapsed < 17) {
                stateLabelText = "Congratulations, you won the silver medal!\nClick to restart";
            }else if(timeElapsed < 25) {
                stateLabelText = "Congratulations, you won the bronze medal!\nClick to restart";
            }else {
                stateLabelText = "You were not fast enough to win any medals.\nClick to try again";
            }

            stateLabel.text = stateLabelText;
            stateLabel.visible = true;

            game.input.onTap.addOnce(restart,this);
        }
    }

    function updateTimer() {
        if(playerHasCrossedStart === false) {
            return;
        }
  
        var currentTime = new Date();
        var timeDifference = startTime.getTime() - currentTime.getTime();
 
        //Time elapsed in seconds
        var timeElapsed = Math.abs(timeDifference);
 
        //Convert seconds into minutes and seconds
        var seconds = Math.floor(timeElapsed / 1000);
        var milliseconds = Math.floor(timeElapsed) - (1000 * seconds);
 
        //Display minutes, add a 0 to the start if less than 10
        var result = (seconds < 10) ? "0" + seconds : seconds;
 
        //Display seconds, add a 0 to the start if less than 10
        result += (milliseconds < 100) ? ".0" + milliseconds : (milliseconds < 10) ? ".00" + milliseconds : "." + milliseconds; 
 
        raceTimerLabel.text = result;
    }

    function restart() {
        playerHasCrossedStart = false;
        playerHasCrossedCheckpoint = false;
        
        raceTimerLabel.text = "00.000";

        playercar.x = racetrack1Start.x;
        playercar.y = racetrack1Start.y;
        playercar.rotation = 0;

        stateLabel.visible = false;
    }
    
};
