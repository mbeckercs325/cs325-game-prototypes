window.onload = function () {

    "use strict";

    var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update });

    function preload() {
        game.load.image('barend', 'assets/barend.png');
        game.load.image('barend1', 'assets/barend1.png');
        game.load.image('ball', 'assets/ball.png');
        game.load.image('ball1', 'assets/ball1.png');
    }

    var barEnd1;
    var barEnd1Keys;
    var barEnd2;
    var barEnd2Keys;
    var graphicsLine;
    var blackBalls;
    var bbTimer = 0;
    var greenBalls;
    var gbTimer = 0;
    var health = 100;
    var score = 0;
    var stateLabel;
    var restartTimer = 0;

    function create() {
        game.physics.startSystem(Phaser.Physics.ARCADE);

        game.stage.backgroundColor = "#4488AA";

        barEnd1 = game.add.sprite(200, 300, 'barend');
        game.physics.enable(barEnd1, Phaser.Physics.ARCADE);
        barEnd1.anchor.setTo(0.5, 0.5);
        barEnd1.body.collideWorldBounds = true;

        barEnd1Keys = {
            up: game.input.keyboard.addKey(Phaser.Keyboard.W),
            down: game.input.keyboard.addKey(Phaser.Keyboard.S),
            left: game.input.keyboard.addKey(Phaser.Keyboard.A),
            right: game.input.keyboard.addKey(Phaser.Keyboard.D),
        };

        barEnd2 = game.add.sprite(600, 300, 'barend1');
        game.physics.enable(barEnd2, Phaser.Physics.ARCADE);
        barEnd2.anchor.setTo(0.5, 0.5);
        barEnd2.body.collideWorldBounds = true;

        barEnd2Keys = {
            up: game.input.keyboard.addKey(Phaser.Keyboard.UP),
            down: game.input.keyboard.addKey(Phaser.Keyboard.DOWN),
            left: game.input.keyboard.addKey(Phaser.Keyboard.LEFT),
            right: game.input.keyboard.addKey(Phaser.Keyboard.RIGHT),
        };

        blackBalls = game.add.group();
        blackBalls.enableBody = true;
        blackBalls.physicsBodyType = Phaser.Physics.ARCADE;

        greenBalls = game.add.group();
        greenBalls.enableBody = true;
        greenBalls.physicsBodyType = Phaser.Physics.ARCADE;

        graphicsLine = new Phaser.Line(barEnd1.body.x, barEnd1.body.y, barEnd2.body.x, barEnd2.body.y);

        stateLabel = game.add.text(game.world.centerX, game.world.centerY, ' ', { font: '50px Arial', fill: '#fff', align: 'center' });
        stateLabel.anchor.setTo(0.5, 0.5);
        stateLabel.visible = false;
    }

    function update() {
        game.debug.text("Health: " + health, 5, 15, "#fff");
        game.debug.text("Score: " + score, 5, 30, "#fff");

        checkPlayerHealth();

        checkBallCollision();

        spawnBlackBall();
        spawnGreenBall();

        graphicsLine.fromSprite(barEnd1, barEnd2, false);
        game.debug.geom(graphicsLine);

        checkKeys(barEnd1, barEnd1Keys);
        checkKeys(barEnd2, barEnd2Keys);
    }

    function checkKeys(barEnd, barEndKeys) {
        if (barEndKeys.up.isDown && barEndKeys.left.isDown) {
            barEnd.body.y -= 2;
            barEnd.body.x -= 2;
        } else if (barEndKeys.up.isDown && barEndKeys.right.isDown) {
            barEnd.body.y -= 2;
            barEnd.body.x += 2;
        } else if (barEndKeys.down.isDown && barEndKeys.left.isDown) {
            barEnd.body.y += 2;
            barEnd.body.x -= 2;
        } else if (barEndKeys.down.isDown && barEndKeys.right.isDown) {
            barEnd.body.y += 2;
            barEnd.body.x += 2;
        } else if (barEndKeys.up.isDown) {
            barEnd.body.y -= 2;
        } else if (barEndKeys.down.isDown) {
            barEnd.body.y += 2;
        } else if (barEndKeys.left.isDown) {
            barEnd.body.x -= 2;
        } else if (barEndKeys.right.isDown) {
            barEnd.body.x += 2;
        }
    }

    function spawnBlackBall() {
        if (bbTimer < game.time.now) {
            var chance = game.rnd.integerInRange(0, 100);
            if (chance < 10) {
                var blackBall = blackBalls.create(game.world.randomX, game.world.randomY, 'ball');
                game.physics.enable(blackBall, Phaser.Physics.ARCADE);
                blackBall.body.outOfBoundsKill = true;

                var rect = new Phaser.Rectangle(((graphicsLine.start.x > graphicsLine.end.x) ? graphicsLine.end.x : graphicsLine.start.x) + graphicsLine.width / 2, ((graphicsLine.start.y > graphicsLine.end.y) ? graphicsLine.end.y : graphicsLine.start.y) + graphicsLine.height / 2, 10, 10)
                game.physics.arcade.moveToObject(blackBall, rect, 100);

            }
            bbTimer = game.time.now + 200;
        }
    }

    function spawnGreenBall() {
        if (gbTimer < game.time.now) {
            var chance = game.rnd.integerInRange(0, 100);
            if (chance < 7) {
                var greenBall = greenBalls.create(game.world.randomX, game.world.randomY, 'ball1');
                game.physics.enable(greenBall, Phaser.Physics.ARCADE);
                greenBall.body.outOfBoundsKill = true;

                var rect = new Phaser.Rectangle(game.world.randomX, game.world.randomY, 10, 10)
                game.physics.arcade.moveToObject(greenBall, rect, 100);

            }
            gbTimer = game.time.now + 200;
        }
    }

    function checkBallCollision() {
        blackBalls.forEachAlive(function (blackBall) {
            var ball = new Phaser.Rectangle(blackBall.body.x, blackBall.body.y, blackBall.body.width, blackBall.body.height);
            var coords = graphicsLine.coordinatesOnLine(10);

            for (var i = 0; i < coords.length; i++) {
                var coord = coords[i];
                if (Phaser.Rectangle.containsPoint(ball, new Phaser.Point(coord[0], coord[1]))) {
                    blackBall.kill();
                    health -= 10;
                    break;
                }
            }
        });

        greenBalls.forEachAlive(function (greenBall) {
            var ball = new Phaser.Rectangle(greenBall.body.x, greenBall.body.y, greenBall.body.width, greenBall.body.height);
            var coords = graphicsLine.coordinatesOnLine(10);

            for (var i = 0; i < coords.length; i++) {
                var coord = coords[i];
                if (Phaser.Rectangle.containsPoint(ball, new Phaser.Point(coord[0], coord[1]))) {
                    greenBall.kill();
                    score += 20;
                    break;
                }
            }
        });
    }

    function checkPlayerHealth() {
        if (health <= 0) {
            greenBalls.forEach(function (gb) {
                gb.kill();
            });
            blackBalls.forEach(function (bb) {
                bb.kill();
            });

            bbTimer = game.time.now + 50000000;
            gbTimer = game.time.now + 50000000;

            barEnd1.kill();
            barEnd2.kill();

            stateLabel.text = "You have been defeated!\nYour final score was " + score + "\nClick to try again";
            stateLabel.visible = true;

            if (restartTimer === 0) {
                restartTimer = game.time.now + 500;
            }

            if (game.time.now > restartTimer) {
                game.input.onTap.addOnce(restart, this);
            }
        }
    }

    function restart() {
        greenBalls.forEach(function (gb) {
            gb.kill();
        });
        blackBalls.forEach(function (bb) {
            bb.kill();
        });

        bbTimer = 0;
        gbTimer = 0;

        barEnd1.reset(200, 300);
        barEnd2.reset(600, 300);

        health = 100;
        score = 0;

        stateLabel.visible = false;
    }
};
