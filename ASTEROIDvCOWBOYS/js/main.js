window.onload = function() {
    //delete require.cache['main.js'];

    "use strict";
    
    var game = new Phaser.Game(1200, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );
    
    function preload() {
        // Load an image and call it 'logo'.
        game.load.image( 'background', 'assets/background.png');
        game.load.image( 'asteroid', 'assets/asteroid.png');
        game.load.image( 'planet', 'assets/planet.png');
        game.load.image( 'cowboy1', 'assets/cowboy1.png');
        game.load.image( 'cowboy2', 'assets/cowboy2.png');
        game.load.image( 'cowboy3', 'assets/cowboy3.png');
        game.load.image( 'cowboyBullet', 'assets/cowboyBullet.png');
    }
    
    var cursors;
    var background;
    var asteroid;
    var planets;
    var cowboys;
    var cowboyTime = 0;
    var cowboyBullets;
    var bulletTime = 0;
    var livingCowboys = [];
    var welcomeText = 'WELCOME TO\nASTEROID v COWBOYS\nDestroy 5 planets to win!.'
    var welcomeLabel;
    var asteroidHealthText = 'Health: ';
    var asteroidHealthLabel;
    var asteroidHealth = 100;
    var planetsLeftText = 'Planets Left: ';
    var planetsLeftLabel;
    var planetsLeft = 5;
    var cowboysDefeated = 0;
    var stateLabel;

    function create() {        
        background = game.add.tileSprite( 0, 0, 1200, 600, 'background');

        asteroid = game.add.sprite( game.world.centerX, game.world.centerY, 'asteroid' );
        asteroid.anchor.setTo( 0.5, 0.5 );
        game.camera.follow(asteroid);
        game.physics.enable( asteroid, Phaser.Physics.ARCADE );
        asteroid.body.collideWorldBounds = true;

        planets = game.add.group();
        planets.enableBody = true;
        planets.physicsBodyType = Phaser.Physics.ARCADE;

        cowboys = game.add.group();
        cowboys.enableBody = true;
        cowboys.physicsBodyType = Phaser.Physics.ARCADE;

        cowboyBullets = game.add.group();
        cowboyBullets.enableBody = true;
        cowboyBullets.physicsBodyType = Phaser.Physics.ARCADE;
        cowboyBullets.createMultiple(60, 'cowboyBullet');
        cowboyBullets.setAll('anchor.x', 0.5);
        cowboyBullets.setAll('anchor.y', 1);
        cowboyBullets.setAll('outOfBoundsKill', true);
        cowboyBullets.setAll('checkWorldBounds', true);

        planetsLeftLabel = game.add.text(10, 10, planetsLeftText + planetsLeft, { font: '26px Arial', fill: '#fff' });
        asteroidHealthLabel = game.add.text(10, 40, asteroidHealthText + asteroidHealth, { font: '26px Arial', fill: '#fff' });
      
        welcomeLabel = game.add.text(game.world.centerX,game.world.centerY, welcomeText, { font: '50px Arial', fill: '#fff', boundsAlignH: "center", boundsAlignV: "center" });
        welcomeLabel.anchor.setTo(0.5,0.5);

        game.time.events.add(3000, function() {    
            game.add.tween(welcomeLabel).to({alpha: 0}, 1500, Phaser.Easing.Linear.None, true);
        }, this);

        stateLabel = game.add.text(game.world.centerX,game.world.centerY,' ', { font: '50px Arial', fill: '#fff' });
        stateLabel.anchor.setTo(0.5, 0.5);
        stateLabel.visible = false;

        cursors = game.input.keyboard.createCursorKeys();
    }
    
    function update() {
        asteroid.body.velocity.setTo(0, 0);
        asteroid.angle += 1;

        planets.forEachAlive(function(planet){
            planet.angle += 1;
        });

        if(cursors.left.isDown && cursors.up.isDown) {
            background.tilePosition.x += 5;   
            background.tilePosition.y += 5;

            if(game.time.now > cowboyTime) {
                createCowboys(4);
                createPlanets(4); 
                cowboyTime = game.time.now+50;    
            }

            planets.forEachAlive(function(platform){        
                platform.body.x += 5;  
                platform.body.y += 5;   
            });
            cowboys.forEachAlive(function(platform){        
                platform.body.x += 5;  
                platform.body.y += 5;   
            });
            cowboyBullets.forEachAlive(function(platform){        
                platform.body.x += 5;  
                platform.body.y += 5;   
            });
        }else if(cursors.left.isDown && cursors.down.isDown) {
            background.tilePosition.x += 5;   
            background.tilePosition.y -= 5;

            if(game.time.now > cowboyTime) {
                createCowboys(5);
                createPlanets(5);
                cowboyTime = game.time.now+50;    
            }

            planets.forEachAlive(function(platform){        
                platform.body.x += 5;  
                platform.body.y -= 5;   
            });
            cowboys.forEachAlive(function(platform){        
                platform.body.x += 5;  
                platform.body.y -= 5;   
            });
            cowboyBullets.forEachAlive(function(platform){        
                platform.body.x += 5;  
                platform.body.y -= 5;   
            });
        }else if(cursors.right.isDown && cursors.up.isDown) {
            background.tilePosition.x -= 5;   
            background.tilePosition.y += 5;
            
            if(game.time.now > cowboyTime) {
                createCowboys(6);  
                createPlanets(6); 
                cowboyTime = game.time.now+50;    
            }
            
            planets.forEachAlive(function(platform){        
                platform.body.x -= 5;  
                platform.body.y += 5;   
            });
            cowboys.forEachAlive(function(platform){        
                platform.body.x -= 5;  
                platform.body.y += 5;   
            });
            cowboyBullets.forEachAlive(function(platform){        
                platform.body.x -= 5;  
                platform.body.y += 5;   
            });
        }else if(cursors.right.isDown && cursors.down.isDown) {
            background.tilePosition.x -= 5;   
            background.tilePosition.y -= 5;
           
            if(game.time.now > cowboyTime) {
                createCowboys(7);   
                createPlanets(7);
                cowboyTime = game.time.now+50;    
            }
           
            planets.forEachAlive(function(platform){        
                platform.body.x -= 5;  
                platform.body.y -= 5;   
            });
            cowboys.forEachAlive(function(platform){        
                platform.body.x -= 5;  
                platform.body.y -= 5;   
            });
            cowboyBullets.forEachAlive(function(platform){        
                platform.body.x -= 5;  
                platform.body.y -= 5;   
            });
        }else if (cursors.left.isDown) {
            background.tilePosition.x += 5;
            
            if(game.time.now > cowboyTime) {
                createCowboys(0); 
                createPlanets(0);  
                cowboyTime = game.time.now+50;    
            }

            planets.forEachAlive(function(platform){        
                platform.body.x += 5;  
            });
            cowboys.forEachAlive(function(platform){        
                platform.body.x += 5;  
            });
            cowboyBullets.forEachAlive(function(platform){
                platform.body.x += 5;
            });
        }else if (cursors.right.isDown) {
            background.tilePosition.x -= 5;
            
            if(game.time.now > cowboyTime) {
                createCowboys(1); 
                createPlanets(1);  
                cowboyTime = game.time.now+50;    
            }

            planets.forEachAlive(function(platform){        
                platform.body.x -= 5;  
            });
            cowboys.forEachAlive(function(platform){        
                platform.body.x -= 5;  
            });
            cowboyBullets.forEachAlive(function(platform){        
                platform.body.x -= 5;  
            });
        }else if (cursors.up.isDown) {
            background.tilePosition.y += 5;

            if(game.time.now > cowboyTime) {
                createCowboys(2); 
                createPlanets(2);  
                cowboyTime = game.time.now+50;    
            }

            planets.forEachAlive(function(platform){        
                platform.body.y += 5;  
            });
            cowboys.forEachAlive(function(platform){        
                platform.body.y += 5;  
            });
            cowboyBullets.forEachAlive(function(platform){        
                platform.body.y += 5;  
            });
        }else if (cursors.down.isDown) {
            background.tilePosition.y -= 5;

            if(game.time.now > cowboyTime) {
                createCowboys(3);  
                createPlanets(3); 
                cowboyTime = game.time.now+50;    
            }

            planets.forEachAlive(function(platform){        
                platform.body.y -= 5;  
            });
            cowboys.forEachAlive(function(platform){        
                platform.body.y -= 5;  
            });
            cowboyBullets.forEachAlive(function(platform){        
                platform.body.y -= 5;  
            });
        }

        if(game.time.now > bulletTime) {
            cowboysFire();
        }

        game.physics.arcade.overlap(asteroid, cowboys, playerHitsCowboy, null, this);
        game.physics.arcade.overlap(asteroid, planets, playerHitsPlanet, null, this);
        game.physics.arcade.overlap(asteroid, cowboyBullets, bulletHitsPlayer, null, this);
    }

    function createCowboys(side){
        var rand = game.rnd.integerInRange(0,100);
        var numOfBois = game.rnd.integerInRange(3,9);

        if(rand < 15) {
            for(var i = 0; i < numOfBois; i++){
                var randShift = game.rnd.integerInRange(-100,20);
                if(side === 0) {
                    cowboys.create(0+randShift, window.innerHeight*game.rnd.frac(), 'cowboy1');
                }else if(side === 1) {
                    cowboys.create(window.innerWidth+randShift, window.innerHeight*game.rnd.frac(), 'cowboy1');
                }else if(side === 2) {
                    cowboys.create(window.innerWidth*game.rnd.frac(), 0+randShift, 'cowboy1');
                }else if(side === 3) {
                    cowboys.create(window.innerWidth*game.rnd.frac(), window.innerHeight+randShift, 'cowboy1');
                }else if(side === 4) {
                    cowboys.create(0+randShift, window.innerHeight*game.rnd.frac(), 'cowboy1');
                    cowboys.create(window.innerWidth*game.rnd.frac(), 0+randShift, 'cowboy3');
                }else if(side === 5) {
                    cowboys.create(0+randShift, window.innerHeight*game.rnd.frac(), 'cowboy1');
                    cowboys.create(window.innerWidth*game.rnd.frac(), window.innerHeight+randShift, 'cowboy2');
                }else if(side === 6) {
                    cowboys.create(window.innerWidth+randShift, window.innerHeight*game.rnd.frac(), 'cowboy2');
                    cowboys.create(window.innerWidth*game.rnd.frac(), 0+randShift, 'cowboy1');
                }else if(side === 7) {
                    cowboys.create(window.innerWidth+randShift, window.innerHeight*game.rnd.frac(), 'cowboy3');
                    cowboys.create(window.innerWidth*game.rnd.frac(), window.innerHeight+randShift, 'cowboy2');
                }
            }
        }
    }

    function createPlanets(side){
        var rand = game.rnd.integerInRange(0,150);
        var randSide = game.rnd.integerInRange(0,1);
        if(rand === 1) {
            if(side === 0) {
                planets.create(0, window.innerHeight*game.rnd.frac(), 'planet');
            }else if(side === 1) {
                planets.create(window.innerWidth, window.innerHeight*game.rnd.frac(), 'planet');
             }else if(side === 2) {
                planets.create(window.innerWidth*game.rnd.frac(), 0, 'planet');
            }else if(side === 3) {
                planets.create(window.innerWidth*game.rnd.frac(), window.innerHeight, 'planet');
            }else if(side === 4) {
                if(randSide === 0){
                    planets.create(0, window.innerHeight*game.rnd.frac(), 'planet');
                }else{
                    planets.create(window.innerWidth*game.rnd.frac(), 0, 'planet');
                }
            }else if(side === 5) {
                if(randSide === 0){
                    planets.create(0, window.innerHeight*game.rnd.frac(), 'planet');
                }else{
                    planets.create(window.innerWidth*game.rnd.frac(), window.innerHeight, 'planet');
                }
            }else if(side === 6) {
                if(randSide === 0){
                    planets.create(window.innerWidth, window.innerHeight*game.rnd.frac(), 'planet');
                }else{
                    planets.create(window.innerWidth*game.rnd.frac(), 0, 'planet');
                }
            }else if(side === 7) {
                if(randSide === 0){
                    planets.create(window.innerWidth, window.innerHeight*game.rnd.frac(), 'planet');
                }else{
                    planets.create(window.innerWidth*game.rnd.frac(), window.innerHeight, 'planet');
                }
            }
        }
    }

    function cowboysFire() {
        var cowboyBullet = cowboyBullets.getFirstExists(false);
        livingCowboys.length=0;

        cowboys.forEachAlive(function(cowboy){
            if(cowboy.inWorld()){
                livingCowboys.push(cowboy);
            }
        });

        if (cowboyBullet && livingCowboys.length > 0) {
            var numOfBullets = game.rnd.integerInRange(1, livingCowboys.length-1);
            for(var i = 0; i < numOfBullets; i++) {
                var shooter = livingCowboys[i];
                
                if(shooter !== null) {
                    cowboyBullet.reset(shooter.body.x, shooter.body.y);
                }
                
                game.physics.arcade.moveToObject(cowboyBullet,asteroid,150);
            }
        }
        bulletTime = game.time.now + 30;
    }

    function playerHitsCowboy(asteroid, cowboy) {
        cowboy.kill();
        cowboysDefeated++;
    }

    function playerHitsPlanet(asteroid, planet) {
        planet.kill();
        planetsLeft--;

        planetsLeftLabel.text = planetsLeftText + planetsLeft;

        if(planetsLeft <= 0) {
            cowboyBullets.forEach(function(bullet){
                bullet.kill();
            });
            cowboys.forEach(function(cowboy){
                cowboy.kill();
            });

            stateLabel.text = "You have defeated the cowboy invasion!\nYou eliminated "+cowboysDefeated+" cowboys!\nClick to restart";
            stateLabel.visible = true;

            game.input.onTap.addOnce(restart,this);
        }
    }

    function bulletHitsPlayer(asteroid, bullet) {
        bullet.kill();
        asteroidHealth -= 10;

        asteroidHealthLabel.text = asteroidHealthText + asteroidHealth;

        if(asteroidHealth <= 0) {
            asteroid.kill();

            stateLabel.text = "You have been defeated by the cowboy hordes!\nYou took "+cowboysDefeated+" with you!\nClick to try again";
            stateLabel.visible = true;

            game.input.onTap.addOnce(restart,this);
        }
    }

    function restart() {
        cowboyBullets.forEach(function(bullet){
            bullet.kill();
        });
        cowboys.forEach(function(cowboy){
            cowboy.kill();
        });

        asteroid.reset(game.world.centerX, game.world.centerY);

        cowboysDefeated = 0;
        planetsLeft = 5;
        asteroidHealth = 100;

        planetsLeftLabel.text = planetsLeftText + planetsLeft;
        asteroidHealthLabel.text = asteroidHealthText + asteroidHealth;

        stateLabel.visible = false;
    }
};
