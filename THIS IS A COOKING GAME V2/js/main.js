window.onload = function() {
    "use strict";
    
    var game = new Phaser.Game( 480, 480, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );
    
    function preload() {
        game.load.tilemap('tilemap', 'assets/tilemap/kitchentilemap.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('tiles1', 'assets/tilemap/tileset1.png');
        game.load.image('tiles2', 'assets/tilemap/tileset2.png');
        game.load.image('tiles3', 'assets/tilemap/tileset3.png');
        game.load.image('conveyorTL', 'assets/tilemap/conveyorTL.png');
        game.load.image('conveyorTR', 'assets/tilemap/conveyorTR.png');
        game.load.image('conveyorBL', 'assets/tilemap/conveyorBL.png');
        game.load.image('conveyorBR', 'assets/tilemap/conveyorBR.png');
        game.load.image('conveyorUD', 'assets/tilemap/conveyorUD.png');
        game.load.image('conveyorLR', 'assets/tilemap/conveyorLR.png');
        game.load.image('stove', 'assets/tilemap/stove.png');
        game.load.image('cuttingboard', 'assets/tilemap/cuttingboard.png');
        game.load.image('delivery1', 'assets/tilemap/delivery1.png');
        game.load.image('delivery2', 'assets/tilemap/delivery2.png');
        game.load.image('delivery3', 'assets/tilemap/delivery3.png');
        game.load.image('player1', 'assets/player1.png');
        game.load.image('player2', 'assets/player2.png');
        game.load.image('burger', 'assets/burger.png');
        game.load.image('lettuce', 'assets/lettuce.png');
        game.load.image('lettuce3', 'assets/lettuce3.png');
        game.load.image('lettuce2', 'assets/lettuce2.png');
        game.load.image('lettuce1', 'assets/lettuce1.png');
        game.load.image('lettuceC', 'assets/lettuceC.png');
        game.load.image('tomato', 'assets/tomato.png');
        game.load.image('tomato3', 'assets/tomato3.png');
        game.load.image('tomato2', 'assets/tomato2.png');
        game.load.image('tomato1', 'assets/tomato1.png');
        game.load.image('tomatoC', 'assets/tomatoC.png');
        game.load.image('meat', 'assets/meat.png');
        game.load.image('meat3', 'assets/meat3.png');
        game.load.image('meat2', 'assets/meat2.png');
        game.load.image('meat1', 'assets/meat1.png');
        game.load.image('meatC', 'assets/meatC.png');
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
    var player1Details = {
        holdTimer: 0,
        isHolding: false,
        typeHolding: "",
    };
    var player1Keys;
    var player2;
    var player2Details = {
        holdTimer: 0,
        isHolding: false,
        typeHolding: "",
    };
    var player2Keys;
    var noticeRange = 18;
    var lettuces;
    var tomatoes;
    var meats;
    var buns;
    var plates;
    var conveyorGroup;
    var stoveGroup;
    var cuttingboardGroup;
    var deliveryGroup;
    var timer;
    var timerEvent;
    var burgersDelivered = 0;
    var stoveTimer = 0;
    var cuttingboardTimer = 0;
    var burgersGroup;
    var deliveryTimer = 0;
    
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

        //[221,222,223,231,233,241,242,243]
        conveyorGroup = game.add.group();
        conveyorGroup.enableBody = true;
        map.createFromTiles(221, null, 'conveyorTL', conveyorLayer, conveyorGroup, {dir: 'rightup'});
        map.createFromTiles(222, null, 'conveyorLR', conveyorLayer, conveyorGroup, {dir: 'right'});
        map.createFromTiles(242, null, 'conveyorLR', conveyorLayer, conveyorGroup, {dir: 'left'});
        map.createFromTiles(223, null, 'conveyorTR', conveyorLayer, conveyorGroup, {dir: 'rightdown'});
        map.createFromTiles(231, null, 'conveyorUD', conveyorLayer, conveyorGroup, {dir: 'up'});
        map.createFromTiles(233, null, 'conveyorUD', conveyorLayer, conveyorGroup, {dir: 'down'});
        map.createFromTiles(241, null, 'conveyorBL', conveyorLayer, conveyorGroup, {dir: 'leftup'});
        map.createFromTiles(243, null, 'conveyorBR', conveyorLayer, conveyorGroup, {dir: 'leftdown'});

        stoveGroup = game.add.group();
        stoveGroup.enableBody = true;
        map.createFromTiles(220, null, 'stove', stoveLayer, stoveGroup);

        cuttingboardGroup = game.add.group();
        cuttingboardGroup.enableBody = true;
        map.createFromTiles(229, null, 'cuttingboard', cuttingboardLayer, cuttingboardGroup);

        deliveryGroup = game.add.group();
        deliveryGroup.enableBody = true;
        map.createFromTiles(158, null, 'delivery1', deliveryLayer, deliveryGroup);
        map.createFromTiles([169,180], null, 'delivery2', deliveryLayer, deliveryGroup);
        map.createFromTiles(191, null, 'delivery3', deliveryLayer, deliveryGroup);

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
        lettuces.isAvailable = false;

        tomatoes = game.add.group();
        tomatoes.enableBody = true;
        tomatoes.physicsBodyType = Phaser.Physics.ARCADE;
        tomatoes.isAvailable = false;

        meats = game.add.group();
        meats.enableBody = true;
        meats.physicsBodyType = Phaser.Physics.ARCADE;
        meats.isAvailable = false;

        buns = game.add.group();
        buns.enableBody = true;
        buns.physicsBodyType = Phaser.Physics.ARCADE;
        buns.isAvailable = false;

        plates = game.add.group();
        plates.enableBody = true;
        plates.physicsBodyType = Phaser.Physics.ARCADE;
        plates.isAvailable = false;

        burgersGroup = game.add.group();
        burgersGroup.enableBody = true;
        burgersGroup.physicsBodyType = Phaser.Physics.ARCADE;

        timer = game.time.create();
        timerEvent = timer.add(Phaser.Timer.MINUTE * 5, endTimer, this);
        timer.start();
    }

    function endTimer(){
        timer.stop();
    }

    function formatTime(time){
        var minutes = "0" + Math.floor(time / 60);
        var seconds = "0" + (time - minutes * 60);
        return minutes.substr(-2) + ":" + seconds.substr(-2); 
    }
    
    function update() {
        if (timer.running) {
            game.debug.text(formatTime(Math.round((timerEvent.delay - timer.ms) / 1000)), 2, 14, "#f0f");
        }else {
            game.debug.text("Done!", 2, 14, "#0ff");
            return;
        }
        game.debug.text("Delivered: "+burgersDelivered, 60, 14, "#f0f");

        spawnLettuce();
        spawnTomato();
        spawnMeat();
        spawnBun();
        spawnPlate();

        checkPlayerKeys(player1, player1Keys, player1Details);
        checkPlayerKeys(player2, player2Keys, player2Details);

        checkAllIngredientPositions();

        game.physics.arcade.collide(player1, conveyorLayer);
        game.physics.arcade.collide(player2, conveyorLayer);
        game.physics.arcade.collide(player1, shelvesLayer);
        game.physics.arcade.collide(player2, shelvesLayer);

        var conveyorIngredients = [lettuces, tomatoes, meats, buns, plates];
        for (var i = 0, len = conveyorIngredients.length; i < len; i++) {
            game.physics.arcade.overlap(conveyorIngredients[i], conveyorGroup, ingredientOnConveyor);
        }

        var cuttingboardIngredients = [lettuces, tomatoes];
        for (var i = 0, len = cuttingboardIngredients.length; i < len; i++) {
            game.physics.arcade.overlap(cuttingboardIngredients[i], cuttingboardGroup, ingredientOnCuttingboard);
        }

        game.physics.arcade.overlap(meats, stoveGroup, ingredientOnStove);

        game.physics.arcade.overlap(plates, buns, bunOnPlate);

        if(deliveryTimer < game.time.now){
            game.physics.arcade.overlap(burgersGroup, deliveryGroup, burgerOnDelivery);
            deliveryTimer = game.time.now + 500;
        }
    }

    function spawnLettuce() {
        if(lettuces.isAvailable === false) {
            var newLettuce = lettuces.create(40, 296, 'lettuce');
            newLettuce.anchor.setTo(0.5, 0.5);

            lettuces.isAvailable = true;
        }
    }

    function spawnTomato() {
        if(tomatoes.isAvailable === false) {
            var newTomato = tomatoes.create(40, 280, 'tomato');
            newTomato.anchor.setTo(0.5, 0.5);

            tomatoes.isAvailable = true;
        }
    }

    function spawnMeat() {
        if(meats.isAvailable === false) {
            var newMeat = meats.create(40, 264, 'meat');
            newMeat.anchor.setTo(0.5, 0.5);

            meats.isAvailable = true;
        }
    }

    function spawnBun() {
        if(buns.isAvailable === false) {
            var newBun = buns.create(40, 216, 'bun');
            newBun.anchor.setTo(0.5, 0.5);

            buns.isAvailable = true;
        }
    }

    function spawnPlate() {
        if(plates.isAvailable === false) {
            var newPlate = plates.create(440, 104, 'plate');
            newPlate.anchor.setTo(0.5, 0.5);

            // var newPlate1 = burgersGroup.create(440, 120, 'burger');
            // newPlate1.anchor.setTo(0.5, 0.5);

            plates.isAvailable = true;
        }
    }

    function checkAllIngredientPositions() {
        checkSpecificIngredient(lettuces, 'lettuce', player1, player1Details, player1Keys);
        checkSpecificIngredient(lettuces, 'lettuce', player2, player2Details, player2Keys);
        checkSpecificIngredient(tomatoes, 'tomato', player1, player1Details, player1Keys);
        checkSpecificIngredient(tomatoes, 'tomato', player2, player2Details, player2Keys);
        checkSpecificIngredient(meats, 'meat', player1, player1Details, player1Keys);
        checkSpecificIngredient(meats, 'meat', player2, player2Details, player2Keys);
        checkSpecificIngredient(buns, 'bun', player1, player1Details, player1Keys);
        checkSpecificIngredient(buns, 'bun', player2, player2Details, player2Keys);
        checkSpecificIngredient(plates, 'plate', player1, player1Details, player1Keys);
        checkSpecificIngredient(plates, 'plate', player2, player2Details, player2Keys);
        checkSpecificIngredient(burgersGroup, 'burger', player1, player1Details, player1Keys);
        checkSpecificIngredient(burgersGroup, 'burger', player2, player2Details, player2Keys);
    }

    function checkSpecificIngredient(ingredientGroup, ingredientType, player, playerDetails, playerKeys){
        ingredientGroup.forEach(function(ingredient){
            if (game.physics.arcade.distanceBetween(player, ingredient) < noticeRange) {
                if(playerKeys.select.isDown && playerDetails.isHolding === false){
                    if(playerDetails.holdTimer < game.time.now){
                        if(ingredient.cooked === true){
                            player.addChild(game.make.sprite(-20, -8, ingredientType+'C'));
                        }else{
                            player.addChild(game.make.sprite(-20, -8, ingredientType));
                        }

                        ingredient.destroy();
                        playerDetails.typeHolding = ingredientType;
                        playerDetails.isHolding = true;
                        ingredientGroup.isAvailable = false;
                        playerDetails.holdTimer = game.time.now+350;
                    }
                }
            }
        });
    }

    function checkPlayerKeys(player, playerKeys, playerDetails){
        if(playerKeys.up.isDown){
            player.body.y -= 1.5;
            if(player.children.length > 0){
                game.physics.enable( player.getChildAt(0), Phaser.Physics.ARCADE );
                player.getChildAt(0).body.x = player.body.x;
                player.getChildAt(0).body.y = player.body.y-12;
            }
        }else if(playerKeys.down.isDown){
            player.body.y += 1.5;
            if(player.children.length > 0){
                game.physics.enable( player.getChildAt(0), Phaser.Physics.ARCADE );
                player.getChildAt(0).body.x = player.body.x;
                player.getChildAt(0).body.y = player.body.y+12;
            }
        }else if(playerKeys.right.isDown){
            player.body.x += 1.5;
            if(player.children.length > 0){
                game.physics.enable( player.getChildAt(0), Phaser.Physics.ARCADE );
                player.getChildAt(0).body.x = player.body.x+12;
                player.getChildAt(0).body.y = player.body.y;
            }
        }else if(playerKeys.left.isDown){
            player.body.x -= 1.5;
            if(player.children.length > 0){
                game.physics.enable( player.getChildAt(0), Phaser.Physics.ARCADE );
                player.getChildAt(0).body.x = player.body.x-12;
                player.getChildAt(0).body.y = player.body.y;
            }
        }else if(playerKeys.select.isDown && playerDetails.isHolding === true){
            if(playerDetails.holdTimer < game.time.now){
                
                var droppedItem;
                if(playerDetails.typeHolding === 'lettuce'){
                    droppedItem = dropItem(player, playerDetails, lettuces);
                }else if(playerDetails.typeHolding === 'tomato'){
                    droppedItem = dropItem(player, playerDetails, tomatoes);
                }else if(playerDetails.typeHolding === 'meat'){
                    droppedItem = dropItem(player, playerDetails, meats);
                }else if(playerDetails.typeHolding === 'bun'){
                    droppedItem = dropItem(player, playerDetails, buns);
                }else if(playerDetails.typeHolding === 'plate'){
                    droppedItem = dropItem(player, playerDetails, plates);
                }else if(playerDetails.typeHolding === 'burger'){
                    droppedItem = dropItem(player, playerDetails, burgersGroup);
                }
                droppedItem.anchor.setTo(0.5, 0.5);

                playerDetails.isHolding = false;
                playerDetails.holdTimer = game.time.now+350;
            }
        }
    }

    function dropItem(player, playerDetails, ingredientGroup){
        var droppedItem;
        var ingredient = player.getChildAt(0);
        var isCooked = (ingredient.key === 'meatC' || ingredient.key === 'tomatoC' || ingredient.key === 'lettuceC')?true:false;
        var typeHolding = playerDetails.typeHolding;
        if(isCooked === true){
            typeHolding = playerDetails.typeHolding+'C';
        }
        if(player.getChildAt(0).body.y < player.body.y){
            droppedItem = ingredientGroup.create(player.body.x+8, player.body.y-8, typeHolding);
        }else if(player.getChildAt(0).body.y > player.body.y){
            droppedItem = ingredientGroup.create(player.body.x+8, player.body.y+24, typeHolding);
        }else if(player.getChildAt(0).body.x < player.body.x){
            droppedItem = ingredientGroup.create(player.body.x-8, player.body.y+8, typeHolding);
        }else if(player.getChildAt(0).body.x > player.body.x){
            droppedItem = ingredientGroup.create(player.body.x+24, player.body.y+8, typeHolding);
        }

        if(isCooked === true){
            droppedItem.cooked = true;
        }

        player.removeChildAt(0);
        return droppedItem;
    }

    function ingredientOnConveyor(ingredient, conveyor){
        if(conveyor.dir === 'up'){
            ingredient.body.y -= .5;
        }else if(conveyor.dir === 'down'){
            ingredient.body.y += .5;
        }else if(conveyor.dir === 'right'){
            ingredient.body.x += .5;
        }else if(conveyor.dir === 'left'){
            ingredient.body.x -= .5;
        }else if(conveyor.dir === 'rightup'){
            ingredient.body.x += .5;
            ingredient.body.y -= .5;
        }else if(conveyor.dir === 'rightdown'){
            ingredient.body.x += .5;
            ingredient.body.y += .5;
        }else if(conveyor.dir === 'leftup'){
            ingredient.body.x -= .5;
            ingredient.body.y -= .5;
        }else if(conveyor.dir === 'leftdown'){
            ingredient.body.x -= .5;
            ingredient.body.y += .5;
        }
    }

    function ingredientOnCuttingboard(ingredient, cuttingboard){
        if(ingredient.texture.baseTexture.source.name === 'tomatoC' || ingredient.texture.baseTexture.source.name === 'lettuceC'){
            return;
        }
        if(cuttingboardTimer < game.time.now){
            cuttingboardTimer = game.time.now + 1000;
            if(ingredient.texture.baseTexture.source.name === 'tomato'){
                ingredient.loadTexture('tomato3', 0);
            }else if(ingredient.texture.baseTexture.source.name === 'tomato3'){
                ingredient.loadTexture('tomato2', 0);
            }else if(ingredient.texture.baseTexture.source.name === 'tomato2'){
                ingredient.loadTexture('tomato1', 0);
            }else if(ingredient.texture.baseTexture.source.name === 'tomato1'){
                ingredient.loadTexture('tomatoC', 0);
                ingredient.cooked = true;
            }else if(ingredient.texture.baseTexture.source.name === 'lettuce'){
                ingredient.loadTexture('lettuce3', 0);
            }else if(ingredient.texture.baseTexture.source.name === 'lettuce3'){
                ingredient.loadTexture('lettuce2', 0);
            }else if(ingredient.texture.baseTexture.source.name === 'lettuce2'){
                ingredient.loadTexture('lettuce1', 0);
            }else if(ingredient.texture.baseTexture.source.name === 'lettuce1'){
                ingredient.loadTexture('lettuceC', 0);
                ingredient.cooked = true;
            }
        }
    }

    function ingredientOnStove(ingredient, stove){
        if(ingredient.texture.baseTexture.source.name === 'meatC'){
            return;
        }
        if(stoveTimer < game.time.now){
            stoveTimer = game.time.now + 1000;
            if(ingredient.texture.baseTexture.source.name === 'meat'){
                ingredient.loadTexture('meat3', 0);
            }else if(ingredient.texture.baseTexture.source.name === 'meat3'){
                ingredient.loadTexture('meat2', 0);
            }else if(ingredient.texture.baseTexture.source.name === 'meat2'){
                ingredient.loadTexture('meat1', 0);
            }else if(ingredient.texture.baseTexture.source.name === 'meat1'){
                ingredient.loadTexture('meatC', 0);
                ingredient.cooked = true;
            }
        }
    }

    function bunOnPlate(plate, bun){
        game.physics.arcade.overlap(bun, meats, function(bun, meat){
            if(meat.key === 'meatC'){
                game.physics.arcade.overlap(meat, lettuces, function(meat, lettuce){
                    if(lettuce.key === 'lettuceC'){
                        game.physics.arcade.overlap(lettuce, tomatoes, function(lettuce, tomato){
                            if(tomato.key === 'tomatoC'){
                                var burger = burgersGroup.create(plate.body.x+8, plate.body.y, 'burger');
                                burger.anchor.setTo(0.5, 0.5);

                                plate.destroy();
                                bun.destroy();
                                meat.destroy();
                                lettuce.destroy();
                                tomato.destroy();
                            }
                        });
                    }       
                });
            }
        });
    }

    function burgerOnDelivery(burger, delivery){
        burgersDelivered += 1;
        burger.destroy();
    }

};
