"use strict";

GameStates.makeGame = function (game, shared) {
    // Create your own variables.
    var background = null;
    var spaceship;
    var spaceshipDefeated = false;
    var spaceshipSound = null;
    var spaceshipRotation = 300;
    var spaceshipSpeed = 150;
    var planets;
    var planetImages = ['planet1', 'planet2', 'planet3', 'planet4'];
    var planetTime = 0;
    var livesLabel = null;
    var pointsLabel = null;
    var exitButton = null;
    var cursors = null;

    var planetNames = ['Pepleawei', 'Tuchoirilia', 'Dashillon', 'Bufrilles', 'Nuarilia', 'Aebos', 'Crezalara',
        'Slugetune', 'Glion ZH', 'Brorth I2Q', 'Hetrierus', 'Iasceavis', 'Qesmosie', 'Tabryke', 'Soiter', 'Faoter',
        'Slaxocury', 'Prelephus', 'Thillon AA', 'Thao NXQN', 'Ostoybos', 'Kaslonides', 'Bodrippe', 'Guscypso', 'Uiclite',
        'Siolara', 'Scerazuno', 'Slozewei', 'Chillon 45V3', 'Frars N78B', 'Uskianides', 'Efluypra', 'Vuspiuq', 'Saslao',
        'Diolia', 'Yayzuno', 'Glehopra', 'Spagepra', 'Shonoe U6P', 'Flosie 3SB', 'Fotruihiri', 'Jeswoeclite', 'Luspyke',
        'Loskerth', 'Iunides', 'Oemia', 'Whevecarro', 'Plukacarro', 'Drippe H5', 'Blilles M5N', 'Kuclanerth', 'Jestregawa',
        'Oglurn', 'Xaskeron', 'Keliv', 'Moyrilia', 'Brexovis', 'Flaxeter', 'Dragua 6P5', 'Skao CQ', 'Gubruonia', 'Rastaria',
        'Posnarvis', 'Becheon', 'Voenus', 'Uorus', 'Smootis', 'Glopunides', 'Cliea KN1', 'Clagua H36', 'Iusluolea',
        'Teslealara', 'Yagladus', 'Masniea', 'Duophus', 'Woucury', 'Shoranides', 'Sneohiri', 'Snyria W', 'Bliuq 9FU9',
        'Vefroiliv', 'Yetreycarro', 'Meglara', 'Bescora', 'Hoylara', 'Fayclite', 'Froaliv', 'Strobarus', 'Briri 8905',
        'Scone ZK', 'Mespoastea', 'Towhoiphus', 'Guskarvis', 'Iafrara', 'Voylia', 'Venope', 'Whumocury', 'Steheturn',
        'Frippe T8HR', 'Cryke G0', 'Ablaoclite', 'Debreunov', 'Jadrore', 'Seprilles', 'Vunus', 'Xaonov', 'Druvemia',
        'Strarophus', 'Plora MJ', 'Plora 40Y2', 'Owhuyyama', 'Guproizuno', 'Yotheon', 'Mospippe', 'Puynov', 'Faywei',
        'Chanurus', 'Blowuclite', 'Stagua 9', 'Shion VAK7', 'Xecleatania', 'Gashoyphus', 'Yuflinda', 'Uskolla', 'Aicury',
        'Iuiruta', 'Sneiuria', 'Scusoyama', 'Briuq 21MI', 'Sweshan 8IZ', 'Efloatera', 'Mupleruta', 'Pespora', 'Uplarth',
        'Keter', 'Joigawa', 'Plefamia', 'Sperastea', 'Speon L026', 'Grion ZP5Z', 'Muchuylia', 'Faspoahiri', 'Yasnara',
        'Yoclurn', 'Hainov', 'Suibos', 'Straratera', 'Slomewei', 'Glagua 1KOY', 'Blarvis 4IQ5', 'Gestruenerth', 'Sastruenerth',
        'Zuprides', 'Dobreron', 'Qiocarro', 'Wuiwei', 'Troqecury', 'Browunerth', 'Crov JXZZ', 'Blonoe WC7', 'Keplueruta',
        'Nestuecury', 'Cothion', 'Meplides', 'Ieyclite', 'Vieria', 'Spumuphus', 'Skujotis', 'Thilles 56S', 'Brarth 2667'];

    function quitGame() {

        //  Here you should destroy anything you no longer need.
        //  Stop music, delete sprites, purge caches, free resources, all that good stuff.

        //  Then let's go back to the main menu.
        game.state.start('MainMenu');

    }

    function spawnPlanet(side) {
        var rand = game.rnd.integerInRange(0, 150);
        var randSide = game.rnd.integerInRange(0, 1);
        var randPlanet = game.rnd.integerInRange(0, 3);

        if (rand <= 2) {
            var planet;
            if (side === 1) { //Top Right
                if (randSide === 0) {
                    planet = planets.create(window.innerWidth, window.innerHeight * game.rnd.frac(), planetImages[randPlanet]);
                } else {
                    planet = planets.create(window.innerWidth * game.rnd.frac(), 0, planetImages[randPlanet]);
                }
            } else if (side === 2) { //Bottom Right
                if (randSide === 0) {
                    planet = planets.create(window.innerWidth, window.innerHeight * game.rnd.frac(), planetImages[randPlanet]);
                } else {
                    planet = planets.create(window.innerWidth * game.rnd.frac(), window.innerHeight, planetImages[randPlanet]);
                }
            } else if (side === 3) { //Bottom Left
                if (randSide === 0) {
                    planet = planets.create(0, window.innerHeight * game.rnd.frac(), planetImages[randPlanet]);
                } else {
                    planet = planets.create(window.innerWidth * game.rnd.frac(), window.innerHeight, planetImages[randPlanet]);
                }
            } else if (side === 4) { //Top Left
                if (randSide === 0) {
                    planet = planets.create(0, window.innerHeight * game.rnd.frac(), planetImages[randPlanet]);
                } else {
                    planet = planets.create(window.innerWidth * game.rnd.frac(), 0, planetImages[randPlanet]);
                }
            }
        }
    }

    function spaceshipHitsPlanet(spaceship, planet) {
        // shared.saveData = {};
        // shared.saveData.planets = planets.children;
        // shared.saveData.spaceship = spaceship;

        if (planet.info === undefined || planet.info === null) {
            createPlanetInfo(planet);
        }

        shared.currentPlanet = planet;
        game.state.start('PlanetDetailScreen');
    }

    function createPlanetInfo(planet) {
        planet.info = {};
        planet.info.difficulty = game.rnd.integerInRange(1, 100);
        planet.info.name = planetNames[game.rnd.integerInRange(0, planetNames.length - 1)];
    }

    return {

        create: function () {
            background = game.add.tileSprite(0, 0, 1200, 1024, 'background');

            game.physics.startSystem(Phaser.Physics.ARCADE);

            spaceshipSound = game.add.audio('spaceshipSound');
            spaceshipSound.loop = true;
            spaceshipSound.volume = 0.2;

            //if (!(shared.saveData === undefined) && !(shared.saveData === null)) {
            //spaceship = game.add.sprite(game.world.centerX, game.world.centerY, 'spaceship');
            //spaceship = shared.saveData.spaceship;
            //} else {
            spaceship = game.add.sprite(game.world.centerX, game.world.centerY, 'spaceship');
            spaceship.anchor.setTo(0.5, 0.5);
            game.physics.enable(spaceship, Phaser.Physics.ARCADE);
            spaceship.body.drag.set(100);
            spaceship.body.maxVelocity.set(spaceshipSpeed);

            // When you click on the sprite, you go back to the MainMenu.
            spaceship.inputEnabled = true;
            spaceship.events.onInputDown.add(function () { quitGame(); }, this);
            //}

            // if (!(shared.saveData === undefined) && !(shared.saveData === null)) {
            //     planets = game.add.group();
            //     planets.children = shared.saveData.planets;
            // } else {
            planets = game.add.group();
            planets.enableBody = true;
            planets.physicsBodyType = Phaser.Physics.ARCADE;
            // }

            var style = { font: "20px Arial", fill: "#ffffff", align: "center" };
            livesLabel = game.add.text(10, 10, "Lives: " + shared.lives, style);
            pointsLabel = game.add.text(10, 10, "Score: " + shared.currentScore, style);
            pointsLabel.x = 1190 - pointsLabel.width;

            exitButton = game.add.button(10, 515, 'exitButton', quitGame, null);

            cursors = game.input.keyboard.createCursorKeys();
            game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);

            if (shared.lives <= 0) {
                spaceshipDefeated = true;
                spaceship.visible = false;
                var style = { font: "100px Arial", fill: "#ff0000", align: "center" };
                var defeatLabel = game.add.text(game.world.centerX, game.world.centerY, "DEFEAT", style);
                defeatLabel.anchor.setTo(0.5, 0.5);
            }
            if (shared.currentScore > shared.highScore) {
                shared.highScore = shared.currentScore;
            }
        },

        update: function () {
            spaceship.x = game.world.centerX;
            spaceship.y = game.world.centerY;

            if (cursors.up.isDown && spaceshipDefeated === false) {
                game.physics.arcade.accelerationFromRotation(spaceship.rotation, spaceshipSpeed, spaceship.body.acceleration);
                if (game.cache.isSoundDecoded('spaceshipSound')) {
                    if (!spaceshipSound.isPlaying) {
                        spaceshipSound.play();
                    }
                }
            } else {
                spaceship.body.acceleration.set(0);
                spaceshipSound.stop();
            }

            if (cursors.left.isDown && spaceshipDefeated === false) {
                spaceship.body.angularVelocity = -spaceshipRotation;
            } else if (cursors.right.isDown && spaceshipDefeated === false) {
                spaceship.body.angularVelocity = spaceshipRotation;
            } else {
                spaceship.body.angularVelocity = 0;
            }

            background.tilePosition.x -= spaceship.body.velocity.x / 20;
            background.tilePosition.y -= spaceship.body.velocity.y / 20;

            planets.forEachAlive(function (planet) {
                planet.body.x -= spaceship.body.velocity.x / 20;
                planet.body.y -= spaceship.body.velocity.y / 20;
            });

            if (game.time.now > planetTime) {
                if (spaceship.body.velocity.x === 0 && spaceship.body.velocity.y === 0) {
                    console.log("not moving");
                } else if (spaceship.body.velocity.x <= 0 && spaceship.body.velocity.y <= 0) {
                    console.log("top left");
                    spawnPlanet(4);
                } else if (spaceship.body.velocity.x <= 0 && spaceship.body.velocity.y >= 0) {
                    console.log("bottom left");
                    spawnPlanet(3);
                } else if (spaceship.body.velocity.x >= 0 && spaceship.body.velocity.y >= 0) {
                    console.log("bottom right");
                    spawnPlanet(2);
                } else if (spaceship.body.velocity.x >= 0 && spaceship.body.velocity.y <= 0) {
                    console.log("top right");
                    spawnPlanet(1);
                }

                planetTime = game.time.now + 50;
            }

            game.physics.arcade.overlap(spaceship, planets, spaceshipHitsPlanet, null, this);
        }
    };
};
