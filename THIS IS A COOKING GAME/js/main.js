window.onload = function() {
    "use strict";
    
    var game = new Phaser.Game( 480, 480, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );
    
    function preload() {
        game.load.tilemap('tilemap', 'assets/kitchentilemap.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('tiles1', 'assets/tileset1.png');
        game.load.image('tiles2', 'assets/tileset2.png');
        game.load.image('tiles3', 'assets/tileset3.png');
        game.load.image('player1', 'assets/player1.png');
        game.load.image('player2', 'assets/player2.png');
        game.load.image('lettuce', 'assets/lettuce.png');
        game.load.image('tomato', 'assets/tomato.png');
        game.load.image('meat', 'assets/meat.png');
        game.load.image('bun', 'assets/bun.png');
        game.load.image('plate', 'assets/plate.png');
    }
    
    var map;
    var backgroundLayer;
    var wallsLayer;
    var conveyorLayer;
    var shelvesLayer;
    var deliveryLayer;
    var plateLayer;
    var stoveLayer;
    var cuttingboardLayer;
    var lettuceLayer;
    var tomatoLayer;
    var meatLayer;
    var bunLayer;
    var player1;
    var player1HoldTimer = 0;
    var player1Holding = false;
    var player2;
    var player2HoldTimer = 0;
    var player2Holding = false;
    var player1Keys;
    var player2Keys;
    var noticeRange = 18;
    var lettuces;
    var lettuceAvailable = false;
    var tomatoes;
    var tomatoAvailable = false;
    var meats;
    var meatAvailable = false;
    var buns;
    var bunAvailable = false;
    var plates;
    var plateAvailable = false;
    var typeHolding;
    
    function create() {
        game.physics.startSystem(Phaser.Physics.ARCADE);
 
        map = game.add.tilemap('tilemap');
        map.addTilesetImage('tileset1', 'tiles1');
        map.addTilesetImage('tileset2', 'tiles2');
        map.addTilesetImage('tileset3', 'tiles3');
 
        backgroundLayer = map.createLayer('Background');
        wallsLayer = map.createLayer('Walls');
        conveyorLayer = map.createLayer('Conveyor');
        shelvesLayer = map.createLayer('Shelves');
        deliveryLayer = map.createLayer('Delivery');
        plateLayer = map.createLayer('Plates');
        stoveLayer = map.createLayer('Stoves');
        cuttingboardLayer = map.createLayer('Cuttingboards');
        lettuceLayer = map.createLayer('Lettuce');
        tomatoLayer = map.createLayer('Tomato');
        meatLayer = map.createLayer('Meat');
        bunLayer = map.createLayer('Buns');
 
        map.setCollisionBetween(0, 10000, true, shelvesLayer);
        map.setCollisionBetween(1, 10000, true, conveyorLayer);

        backgroundLayer.resizeWorld();

        player1 = game.add.sprite(128,240,'player1');
        player1.anchor.setTo( 0.5, 0.5 );
        game.physics.enable( player1, Phaser.Physics.ARCADE );

        player2 = game.add.sprite(352,240,'player2');
        player2.anchor.setTo( 0.5, 0.5 );
        game.physics.enable( player2, Phaser.Physics.ARCADE );
 
        player1Keys = {
            up: game.input.keyboard.addKey(Phaser.Keyboard.W),
            down: game.input.keyboard.addKey(Phaser.Keyboard.S),
            left: game.input.keyboard.addKey(Phaser.Keyboard.A),
            right: game.input.keyboard.addKey(Phaser.Keyboard.D),
            select: game.input.keyboard.addKey(Phaser.Keyboard.E),
        };

        player2Keys = {
            up: game.input.keyboard.addKey(Phaser.Keyboard.UP),
            down: game.input.keyboard.addKey(Phaser.Keyboard.DOWN),
            left: game.input.keyboard.addKey(Phaser.Keyboard.LEFT),
            right: game.input.keyboard.addKey(Phaser.Keyboard.RIGHT),
            select: game.input.keyboard.addKey(Phaser.Keyboard.QUESTION_MARK),
        };

        lettuces = game.add.group();
        lettuces.enableBody = true;
        lettuces.physicsBodyType = Phaser.Physics.ARCADE;

        tomatoes = game.add.group();
        tomatoes.enableBody = true;
        tomatoes.physicsBodyType = Phaser.Physics.ARCADE;

        meats = game.add.group();
        meats.enableBody = true;
        meats.physicsBodyType = Phaser.Physics.ARCADE;

        buns = game.add.group();
        buns.enableBody = true;
        buns.physicsBodyType = Phaser.Physics.ARCADE;

        plates = game.add.group();
        plates.enableBody = true;
        plates.physicsBodyType = Phaser.Physics.ARCADE;
    }
    
    function update() {
        spawnLettuce();
        spawnTomato();
        spawnMeat();
        spawnBun();
        spawnPlate();

        if(player1Keys.up.isDown){
            player1.body.y -= 1;
            if(player1.children.length > 0){
                game.physics.enable( player1.getChildAt(0), Phaser.Physics.ARCADE );
                player1.getChildAt(0).body.x = player1.body.x;
                player1.getChildAt(0).body.y = player1.body.y-12;
            }
        }else if(player1Keys.down.isDown){
            player1.body.y += 1;
            if(player1.children.length > 0){
                game.physics.enable( player1.getChildAt(0), Phaser.Physics.ARCADE );
                player1.getChildAt(0).body.x = player1.body.x;
                player1.getChildAt(0).body.y = player1.body.y+12;
            }
        }else if(player1Keys.right.isDown){
            player1.body.x += 1;
            if(player1.children.length > 0){
                game.physics.enable( player1.getChildAt(0), Phaser.Physics.ARCADE );
                player1.getChildAt(0).body.x = player1.body.x+12;
                player1.getChildAt(0).body.y = player1.body.y;
            }
        }else if(player1Keys.left.isDown){
            player1.body.x -= 1;
            if(player1.children.length > 0){
                game.physics.enable( player1.getChildAt(0), Phaser.Physics.ARCADE );
                player1.getChildAt(0).body.x = player1.body.x-12;
                player1.getChildAt(0).body.y = player1.body.y;
            }
        }else if(player1Keys.select.isDown && player1Holding === true){
            if(player1HoldTimer < game.time.now){
                player1.removeChildAt(0);

                var droppedItem;
                if(typeHolding === 'lettuce'){
                    droppedItem = lettuces.create(player1.body.x+8, player1.body.y+8, typeHolding);
                }else if(typeHolding === 'tomato'){
                    droppedItem = tomatoes.create(player1.body.x+8, player1.body.y+8, typeHolding);
                }else if(typeHolding === 'meat'){
                    droppedItem = meats.create(player1.body.x+8, player1.body.y+8, typeHolding);
                }else if(typeHolding === 'bun'){
                    droppedItem = buns.create(player1.body.x+8, player1.body.y+8, typeHolding);
                }else if(typeHolding === 'plate'){
                    droppedItem = plates.create(player1.body.x+8, player1.body.y+8, typeHolding);
                }
                droppedItem.anchor.setTo(0.5, 0.5);

                player1Holding = false;
                player1HoldTimer = game.time.now+350;
            }
        }

        if(player2Keys.up.isDown){
            player2.body.y -= 1;
            if(player2.children.length > 0){
                game.physics.enable( player2.getChildAt(0), Phaser.Physics.ARCADE );
                player2.getChildAt(0).body.x = player2.body.x;
                player2.getChildAt(0).body.y = player2.body.y-12;
            }
        }else if(player2Keys.down.isDown){
            player2.body.y += 1;
            if(player2.children.length > 0){
                game.physics.enable( player2.getChildAt(0), Phaser.Physics.ARCADE );
                player2.getChildAt(0).body.x = player2.body.x;
                player2.getChildAt(0).body.y = player2.body.y+12;
            }
        }else if(player2Keys.right.isDown){
            player2.body.x += 1;
            if(player2.children.length > 0){
                game.physics.enable( player2.getChildAt(0), Phaser.Physics.ARCADE );
                player2.getChildAt(0).body.x = player2.body.x+12;
                player2.getChildAt(0).body.y = player2.body.y;
            }
        }else if(player2Keys.left.isDown){
            player2.body.x -= 1;
            if(player2.children.length > 0){
                game.physics.enable( player2.getChildAt(0), Phaser.Physics.ARCADE );
                player2.getChildAt(0).body.x = player2.body.x-12;
                player2.getChildAt(0).body.y = player2.body.y;
            }
        }else if(player2Keys.select.isDown && player2Holding){
            if(player2HoldTimer < game.time.now){
                player2.removeChildAt(0);

                var droppedItem;
                if(typeHolding === 'lettuce'){
                    droppedItem = lettuces.create(player2.body.x+8, player2.body.y+8, typeHolding);
                }else if(typeHolding === 'tomato'){
                    droppedItem = tomatoes.create(player2.body.x+8, player2.body.y+8, typeHolding);
                }else if(typeHolding === 'meat'){
                    droppedItem = meats.create(player2.body.x+8, player2.body.y+8, typeHolding);
                }else if(typeHolding === 'bun'){
                    droppedItem = buns.create(player2.body.x+8, player2.body.y+8, typeHolding);
                }else if(typeHolding === 'plate'){
                    droppedItem = plates.create(player2.body.x+8, player2.body.y+8, typeHolding);
                }
                droppedItem.anchor.setTo(0.5, 0.5);

                player2Holding = false;
                player2HoldTimer = game.time.now+350;
            }
        }

        checkAllIngredientPositions();

        game.physics.arcade.collide(player1, conveyorLayer);
        game.physics.arcade.collide(player2, conveyorLayer);
        game.physics.arcade.collide(player1, shelvesLayer);
        game.physics.arcade.collide(player2, shelvesLayer);
    }

    function spawnLettuce() {
        if(lettuceAvailable === false) {
            var newLettuce = lettuces.create(40, 280, 'lettuce');
            newLettuce.anchor.setTo(0.5, 0.5);

            lettuceAvailable = true;
        }
    }

    function spawnTomato() {
        if(tomatoAvailable === false) {
            var newTomato = tomatoes.create(40, 264, 'tomato');
            newTomato.anchor.setTo(0.5, 0.5);

            tomatoAvailable = true;
        }
    }

    function spawnMeat() {
        if(meatAvailable === false) {
            var newMeat = meats.create(40, 248, 'meat');
            newMeat.anchor.setTo(0.5, 0.5);

            meatAvailable = true;
        }
    }

    function spawnBun() {
        if(bunAvailable === false) {
            var newBun = buns.create(40, 216, 'bun');
            newBun.anchor.setTo(0.5, 0.5);

            bunAvailable = true;
        }
    }

    function spawnPlate() {
        if(plateAvailable === false) {
            var newPlate = plates.create(441, 104, 'plate');
            newPlate.anchor.setTo(0.5, 0.5);

            plateAvailable = true;
        }
    }

    function checkAllIngredientPositions() {
        lettuces.forEach(function(lettuce){
            if (game.physics.arcade.distanceBetween(player1, lettuce) < noticeRange) {
                if(player1Keys.select.isDown && player1Holding === false){
                    if(player1HoldTimer < game.time.now){
                        player1.addChild(game.make.sprite(-20, -8,'lettuce'));

                        lettuce.destroy();
                        typeHolding = 'lettuce';
                        player1Holding = true;
                        lettuceAvailable = false;
                        player1HoldTimer = game.time.now+350;
                    }
                }
            }

            if (game.physics.arcade.distanceBetween(player2, lettuce) < noticeRange) {
                if(player2Keys.select.isDown && player2Holding === false){
                    if(player2HoldTimer < game.time.now){
                        player2.addChild(game.make.sprite(-20, -8,'lettuce'));

                        lettuce.destroy();
                        typeHolding = 'lettuce';
                        player2Holding = true;
                        lettuceAvailable = false;
                        player2HoldTimer = game.time.now+350;
                    }
                }
            }
        });

        tomatoes.forEach(function(tomato){
            if (game.physics.arcade.distanceBetween(player1, tomato) < noticeRange) {
                 if(player1Keys.select.isDown && player1Holding === false){
                     if(player1HoldTimer < game.time.now){
                        player1.addChild(game.make.sprite(-20, -8,'tomato'));

                        tomato.destroy();
                        typeHolding = 'lettuce';
                        player1Holding = true;
                        tomatoAvailable = false;
                        player1HoldTimer = game.time.now+350;
                     }
                 }
            }

            if (game.physics.arcade.distanceBetween(player2, tomato) < noticeRange) {
                 if(player2Keys.select.isDown && player2Holding === false){
                     if(player2HoldTimer < game.time.now){
                        player2.addChild(game.make.sprite(-20, -8,'tomato'));

                        tomato.destroy();
                        typeHolding = 'lettuce';
                        player2Holding = true;
                        tomatoAvailable = false;
                        player2HoldTimer = game.time.now+350;
                     }
                 }
            }
        });

        meats.forEach(function(meat){
            if (game.physics.arcade.distanceBetween(player1, meat) < noticeRange) {
                 if(player1Keys.select.isDown && player1Holding === false){
                     if(player1HoldTimer < game.time.now){
                        player1.addChild(game.make.sprite(-20, -8,'meat'));

                        meat.destroy();
                        typeHolding = 'meat';
                        player1Holding = true;
                        meatAvailable = false;
                        player1HoldTimer = game.time.now+350;
                     }
                 }
            }

            if (game.physics.arcade.distanceBetween(player2, meat) < noticeRange) {
                 if(player2Keys.select.isDown && player2Holding === false){
                     if(player2HoldTimer < game.time.now){
                        player2.addChild(game.make.sprite(-20, -8,'meat'));

                        meat.destroy();
                        typeHolding = 'meat';
                        player2Holding = true;
                        meatAvailable = false;
                        player2HoldTimer = game.time.now+350;
                     }
                 }
            }
        });

        buns.forEach(function(bun){
            if (game.physics.arcade.distanceBetween(player1, bun) < noticeRange) {
                 if(player1Keys.select.isDown && player1Holding === false){
                     if(player1HoldTimer < game.time.now){
                        player1.addChild(game.make.sprite(-20, -8,'bun'));

                        bun.destroy();
                        typeHolding = 'bun';
                        player1Holding = true;
                        bunAvailable = false;
                        player1HoldTimer = game.time.now+350;
                     }
                 }
            }

            if (game.physics.arcade.distanceBetween(player2, bun) < noticeRange) {
                 if(player2Keys.select.isDown && player2Holding === false){
                     if(player2HoldTimer < game.time.now){
                        player2.addChild(game.make.sprite(-20, -8,'bun'));

                        bun.destroy();
                        typeHolding = 'bun';
                        player2Holding = true;
                        bunAvailable = false;
                        player2HoldTimer = game.time.now+350;
                     }
                 }
            }
        });

        plates.forEach(function(plate){
            if (game.physics.arcade.distanceBetween(player1, plate) < noticeRange) {
                 if(player1Keys.select.isDown && player1Holding === false){
                     if(player1HoldTimer < game.time.now){
                        player1.addChild(game.make.sprite(-20, -8,'plate'));

                        plate.destroy();
                        typeHolding = 'plate';
                        player1Holding = true;
                        plateAvailable = false;
                        player1HoldTimer = game.time.now+350;
                     }
                 }
            }

            if (game.physics.arcade.distanceBetween(player2, plate) < noticeRange) {
                 if(player2Keys.select.isDown && player2Holding === false){
                     if(player2HoldTimer < game.time.now){
                        player2.addChild(game.make.sprite(-20, -8,'plate'));

                        plate.destroy();
                        typeHolding = 'plate';
                        player2Holding = true;
                        plateAvailable = false;
                        player2HoldTimer = game.time.now+350;
                     }
                 }
            }
        });
    }
};
