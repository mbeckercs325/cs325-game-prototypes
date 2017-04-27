window.onload = function () {
    "use strict";

    var game = new Phaser.Game(1400, 750, Phaser.AUTO, 'game', { preload: preload, create: create, update: update });

    function preload() {
        game.load.image('character', 'assets/character.gif');
        game.load.image('bullet', 'assets/bullet.png');
        game.load.image('crosshair', 'assets/crosshair.png');
        game.load.image('enemy', 'assets/enemy.png');
        game.load.image('streetlamp', 'assets/streetlamp.png');
    }

    var hunter;
    var hunterHealth = 100;
    var hunterKeys;
    var nextHunterFire = 0;
    var bullets;
    var ammoLeft = 25;
    var crosshair;
    var streetlamps;
    var shadowTexture;
    var hunterLightSprite;
    var enemies;
    var enemiesLeft = 0;
    var score = 0;
    var stateLabel;
    var restartTimer = 0;

    function create() {
        game.physics.startSystem(Phaser.Physics.ARCADE);

        game.stage.backgroundColor = "#4488AA";

        //game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
        //game.scale.parentIsWindow = true;

        hunter = game.add.sprite(game.world.centerX, game.world.centerY, 'character');
        hunter.anchor.setTo(0.5, 0.5);
        game.camera.follow(hunter);
        game.physics.enable(hunter, Phaser.Physics.ARCADE);

        hunterKeys = {
            up: game.input.keyboard.addKey(Phaser.Keyboard.W),
            down: game.input.keyboard.addKey(Phaser.Keyboard.S),
            left: game.input.keyboard.addKey(Phaser.Keyboard.A),
            right: game.input.keyboard.addKey(Phaser.Keyboard.D),
        };

        bullets = game.add.group();
        bullets.enableBody = true;
        bullets.physicsBodyType = Phaser.Physics.ARCADE;
        bullets.createMultiple(50, 'bullet');
        bullets.setAll('checkWorldBounds', true);
        bullets.setAll('outOfBoundsKill', true);

        enemies = game.add.group();
        enemies.enableBody = true;
        enemies.physicsBodyType = Phaser.Physics.ARCADE;

        spawnEnemies();

        shadowTexture = game.add.bitmapData(game.stage.width, game.stage.height);
        hunterLightSprite = game.add.image(game.camera.x, game.camera.y, shadowTexture);
        hunterLightSprite.blendMode = Phaser.blendModes.MULTIPLY;

        crosshair = game.add.sprite(0, 0, 'crosshair');
        crosshair.anchor.setTo(0.5, 0.5);
        game.time.advancedTiming = true;

        stateLabel = game.add.text(game.world.centerX, game.world.centerY, ' ', { font: '50px Arial', fill: '#fff', align: 'center' });
        stateLabel.anchor.setTo(0.5, 0.5);
        stateLabel.visible = false;
    }

    function spawnEnemies() {
        enemiesLeft = game.rnd.integerInRange(15, 25);
        for (var i = 0; i < enemiesLeft; i++) {
            var enemy = enemies.create(0, 0, 'enemy');
            enemy.x = game.world.randomX;
            enemy.y = game.world.randomY;
            var minSpeed = -150;
            var maxSpeed = 150;
            var vx = (game.rnd.integerInRange(0, 1) * -1) * Math.random() * (maxSpeed - minSpeed + 1) - minSpeed;
            var vy = (game.rnd.integerInRange(0, 1) * -1) * Math.random() * (maxSpeed - minSpeed + 1) - minSpeed;
            enemy.anchor.setTo(0.5, 0.5);
            enemy.body.collideWorldBounds = true;
            enemy.body.bounce.setTo(1, 1);
            enemy.body.velocity.x = vx;
            enemy.body.velocity.y = vy;
            enemy.body.immovable = true;
        }
    }

    function update() {
        game.debug.text("Health: " + hunterHealth, game.world.width - 130, game.world.height - 10, "#fff");
        game.debug.text("Ammo Left: " + ammoLeft, game.world.width - 130, game.world.height - 30, "#fff");
        game.debug.text("Enemies Left: " + enemiesLeft, 5, game.world.height - 30, "#fff");
        game.debug.text("Score: " + score, 5, game.world.height - 10, "#fff");
        game.debug.text(game.time.fps, 2, 14, "#00ff00");

        if (enemiesLeft <= 0) {
            stateLabel.text = "You have killed all the enemies!\nYour final score was " + (score+(hunterHealth * 100)) + "\nClick to try again";
            stateLabel.visible = true;

            if(restartTimer === 0){
                restartTimer = game.time.now + 500;
            }

            if(game.time.now > restartTimer){
                game.input.onTap.addOnce(restart, this);
            }
        } else if (hunterHealth <= 0) {
            hunter.kill();

            stateLabel.text = "You have been defeated by the enemies!\nYour final score was " + (score+(hunterHealth * 100)) + "\nClick to try again";
            stateLabel.visible = true;

            if(restartTimer === 0){
                restartTimer = game.time.now + 500;
            }

            if(game.time.now > restartTimer){
                game.input.onTap.addOnce(restart, this);
            }
        } else if (ammoLeft <= 0) {
            hunter.kill();

            stateLabel.text = "You have run out of ammo!\nYour final score was " + (score+(hunterHealth * 100)) + "\nClick to try again";
            stateLabel.visible = true;

            if(restartTimer === 0){
                restartTimer = game.time.now + 500;
            }

            if(game.time.now > restartTimer){
                game.input.onTap.addOnce(restart, this);
            }
        }

        hunter.rotation = game.physics.arcade.angleToPointer(hunter);

        checkHunterKeys();

        if (game.input.activePointer.isDown) {
            hunterFire();
        }

        crosshair.x = game.input.mousePointer.x;
        crosshair.y = game.input.mousePointer.y;

        hunterLightSprite.reset(this.game.camera.x, this.game.camera.y);
        updateHunterShadowTexture();

        game.physics.arcade.overlap(hunter, enemies, enemyHitsHunter, null, this);
        game.physics.arcade.overlap(bullets, enemies, bulletHitsEnemy, null, this);
    }

    function checkHunterKeys() {
        if (hunterKeys.up.isDown && hunterKeys.left.isDown) {
            hunter.body.y -= 2;
            hunter.body.x -= 2;
        } else if (hunterKeys.up.isDown && hunterKeys.right.isDown) {
            hunter.body.y -= 2;
            hunter.body.x += 2;
        } else if (hunterKeys.down.isDown && hunterKeys.left.isDown) {
            hunter.body.y += 2;
            hunter.body.x -= 2;
        } else if (hunterKeys.down.isDown && hunterKeys.right.isDown) {
            hunter.body.y += 2;
            hunter.body.x += 2;
        } else if (hunterKeys.up.isDown) {
            hunter.body.y -= 2;
        } else if (hunterKeys.down.isDown) {
            hunter.body.y += 2;
        } else if (hunterKeys.left.isDown) {
            hunter.body.x -= 2;
        } else if (hunterKeys.right.isDown) {
            hunter.body.x += 2;
        }
    }

    function hunterFire() {
        if (game.time.now > nextHunterFire && bullets.countDead() > 0 && ammoLeft > 0) {
            nextHunterFire = game.time.now + 750;

            var bullet = bullets.getFirstDead();

            bullet.reset(hunter.x, hunter.y);

            game.physics.arcade.moveToPointer(bullet, 750);

            ammoLeft -= 1;
        }
    }

    function updateHunterShadowTexture() {
        shadowTexture.context.fillStyle = 'rgb(10, 10, 10)';
        shadowTexture.context.fillRect(0, 0, game.world.width, game.world.height);
        var radius = 100 + game.rnd.integerInRange(1, 10);
        var hunterX = (hunter.body.x + hunter.body.width / 2) - game.camera.x;
        var hunterY = (hunter.body.y + hunter.body.height / 2) - game.camera.y;
        var gradient = shadowTexture.context.createRadialGradient(hunterX, hunterY, 100 * 0.75, hunterX, hunterY, radius);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0.0)');
        shadowTexture.context.beginPath();
        shadowTexture.context.fillStyle = gradient;
        shadowTexture.context.arc(hunterX, hunterY, radius, 0, Math.PI * 2, false);
        shadowTexture.context.fill();
        shadowTexture.dirty = true;
    }

    function enemyHitsHunter(hunter, enemy) {
        if (hunterHealth > 0) {
            hunterHealth -= 1;
        }
    }

    function bulletHitsEnemy(bullet, enemy) {
        enemy.kill();
        bullet.kill();
        enemiesLeft -= 1;
        score += 100;
    }

    function restart() {
        bullets.forEach(function (bullet) {
            bullet.kill();
        });
        enemies.forEach(function (enemy) {
            enemy.kill();
        });

        hunter.reset(game.world.centerX, game.world.centerY);

        spawnEnemies();
        ammoLeft = 25;
        hunterHealth = 100;
        score = 0;

        stateLabel.visible = false;
    }
};
