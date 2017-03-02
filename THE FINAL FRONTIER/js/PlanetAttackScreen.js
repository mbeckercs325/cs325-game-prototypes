"use strict";

GameStates.makePlanetAttackScreen = function (game, shared) {
    // Create your own variables.
    var background = null;
    var spaceship = null;
    var planet = null;
    var planetHealth = 100;
    var planetHealthDecrement = 0;
    var keyboard = null;

    var pointsLabel = null;
    var difficultyLabel = null;
    var planetHealthLabel = null;
    var retreatButton = null;
    var exitButton = null;

    var gameDifficulty = 0;
    var gameScore = 0;

    var characters = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
        'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    var characterBullets = null;
    var spaceshipHit = false;
    var characterTime = 0;
    var characterTimeIncrement = 0;
    var characterSpeed = 0;
    var keyBeingPressed = false;

    function closeAttackScreen() {
        window.removeEventListener('keydown', keyPressed);
        game.state.start('Game');
    }

    function keyPressed(event) {
        if (keyBeingPressed === true) {
            return;
        }

        keyBeingPressed = true;
        var key = event.key.toUpperCase();

        if (characters.indexOf(key) > -1) {
            var charKilled = false;
            characterBullets.forEachAlive(function (char) {
                if (char.key === key && charKilled === false) {
                    char.kill();
                    charKilled = true;
                    planetHealth -= planetHealthDecrement;
                }
            });
        }
    }

    function keyReleased() {
        keyBeingPressed = false;
    }

    function spawnCharacter() {
        var randChar = game.rnd.integerInRange(0, characters.length);
        var randX = game.rnd.integerInRange(10, 1190);
        var char = characterBullets.create(randX, 10, characters[randChar]);
        game.physics.arcade.moveToObject(char, spaceship, characterSpeed);
    }

    function characterHitsSpaceship(spaceship, character) {
        characterBullets.forEachAlive(function (char) {
            char.kill();
        });
        spaceshipHit = true;

        var style = { font: "100px Arial", fill: "#ff0000", align: "center" };
        var defeatLabel = game.add.text(game.world.centerX, game.world.centerY, "DEFEAT", style);
        defeatLabel.anchor.setTo(0.5, 0.5);
        retreatButton.visible = true;

        shared.lives--;

    }

    function planetDefeated() {
        characterBullets.forEachAlive(function (char) {
            char.kill();
        });
        spaceshipHit = true;

        var style = { font: "100px Arial", fill: "#00ff00", align: "center" };
        var defeatLabel = game.add.text(game.world.centerX, game.world.centerY, "SUCCESS", style);
        defeatLabel.anchor.setTo(0.5, 0.5);
        exitButton.visible = true;

        shared.currentScore += gameScore;
    }

    return {

        create: function () {
            background = game.add.tileSprite(0, 0, 1200, 1024, 'background');

            gameDifficulty = shared.currentPlanet.info.difficulty;
            gameScore = shared.currentPlanet.info.score;
            planetHealth = 100;
            planetHealthDecrement = (gameDifficulty > 75) ? 5 : (gameDifficulty > 50) ? 7 : (gameDifficulty > 25) ? 10 : 15;
            spaceshipHit = false;

            var currentPlanet = shared.currentPlanet.key.charAt(0).toUpperCase() + shared.currentPlanet.key.slice(1);
            planet = game.add.sprite(game.world.centerX, 0, "zoomed" + currentPlanet);
            planet.x -= planet.width / 2;

            spaceship = game.add.sprite(game.world.centerX, 560, 'spaceship');
            spaceship.angle -= 90;
            spaceship.anchor.setTo(0.5, 0.5);
            game.physics.enable(spaceship, Phaser.Physics.ARCADE);

            var style = { font: "20px Arial", fill: "#ffffff", align: "center" };
            difficultyLabel = game.add.text(10, 10, "Difficulty: " + gameDifficulty + "%", style);
            pointsLabel = game.add.text(10, 10, "Final Score: " + gameScore, style);
            pointsLabel.x = 1190 - pointsLabel.width;

            style.font = "40px Arial";
            planetHealthLabel = game.add.text(game.world.centerX, 10, "Planet Health: " + planetHealth, style);
            planetHealthLabel.anchor.setTo(0.5, 0);

            retreatButton = game.add.button(10, 515, 'retreatButton', closeAttackScreen, null);
            retreatButton.visible = false;
            exitButton = game.add.button(10, 515, 'exitButton', closeAttackScreen, null);
            exitButton.visible = false;

            keyboard = game.input.keyboard;
            keyboard.addKeys({
                "A": 65, "B": 66, "C": 67, "D": 68, "E": 69, "F": 70, "G": 71, "H": 72, "I": 73, "J": 74, "K": 75, "L": 76,
                "M": 77, "N": 78, "O": 79, "P": 80, "Q": 81, "R": 82, "S": 83, "T": 84, "U": 85, "V": 86, "W": 87, "X": 88,
                "Y": 89, "Z": 90, "0": 48, "1": 49, "2": 50, "3": 51, "4": 52, "5": 53, "6": 54, "7": 55, "8": 56, "9": 57,
            });

            keyboard.addCallbacks(this, keyPressed, keyReleased);

            characterBullets = game.add.group();
            characterBullets.enableBody = true;
            characterBullets.physicsBodyType = Phaser.Physics.ARCADE;

            characterTimeIncrement = 1750 - (1500 * (gameDifficulty / 100));
            characterSpeed = 125 + (150 * (gameDifficulty / 100));

            game.physics.startSystem(Phaser.Physics.ARCADE);

            //window.addEventListener('keydown', keyPressed);
        },

        update: function () {
            if (game.time.now > characterTime && spaceshipHit === false) {
                spawnCharacter();
                characterTime = game.time.now + characterTimeIncrement;
            }

            planetHealthLabel.text = "Planet Health: " + planetHealth;
            if (planetHealth <= 0 && spaceshipHit === false) {
                planetHealthLabel.text = "Planet Health: " + 0;
                planetDefeated();
            }

            game.physics.arcade.overlap(spaceship, characterBullets, characterHitsSpaceship, null, this);
        }
    };
};
