"use strict";

GameStates.makePlanetDetailScreen = function (game, shared) {
    // Create your own variables.
    var background = null;
    var spaceship = null;
    var planet = null;
    var planetNameLabel = null;
    var planetDifficultyLabel = null;
    var pointsLabel = null;
    var attackButton = null;
    var retreatButton = null;
    var cursors = null;

    function closeDetailScreen() {
        game.state.start('Game');
    }
    
    function startAttack() {
        game.state.start('PlanetAttackScreen');
    }

    function calculateScore(difficulty) {
        var lowerScore = 0;
        var upperScore = 0;

        if (difficulty <= 25) {
            baseScore = 0;
            lowerScore = 250;
        } else if (difficulty <= 50) {
            baseScore = 250;
            lowerScore = 500;
        } else if (difficulty <= 75) {
            baseScore = 500;
            lowerScore = 750; 
        } else if (difficulty <= 100) {
            baseScore = 750;
            lowerScore = 1000;
        }

        var baseScore = game.rnd.integerInRange(lowerScore, upperScore);

        shared.currentPlanet.info.score = game.math.floorTo(baseScore * (difficulty/100));
        return shared.currentPlanet.info.score;
    }

    return {

        create: function () {
            background = game.add.tileSprite(0, 0, 1200, 1024, 'background');

            planet = game.add.sprite(game.world.centerX, game.world.centerY, shared.currentPlanet.key);
            planet.anchor.setTo(0.5, 0.5);

            var style = { font: "50px Arial", fill: "#ffffff", align: "center" };
            planetNameLabel = game.add.text(game.world.centerX, 75, shared.currentPlanet.info.name, style);
            planetNameLabel.anchor.set(0.5, 0.5);

            style.font = "40px Arial";
            planetDifficultyLabel = game.add.text(game.world.centerX, 130, "Difficulty: " + shared.currentPlanet.info.difficulty + "%", style);
            planetDifficultyLabel.anchor.set(0.5, 0.5);
            pointsLabel = game.add.text(game.world.centerX, 175, "Points for defeating the planet: " + calculateScore(shared.currentPlanet.info.difficulty), style);
            pointsLabel.anchor.set(0.5, 0.5);

            attackButton = game.add.button( game.world.centerX-125, 500, 'attackButton', startAttack, null);
            attackButton.anchor.setTo( 0.5, 0.5 );
            retreatButton = game.add.button( game.world.centerX+125, 500, 'retreatButton', closeDetailScreen, null);
            retreatButton.anchor.setTo( 0.5, 0.5 );

            //game.physics.startSystem(Phaser.Physics.ARCADE);
        },

        update: function () {

        }
    };
};
