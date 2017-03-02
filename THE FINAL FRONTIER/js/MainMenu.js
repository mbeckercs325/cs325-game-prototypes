"use strict";

GameStates.makeMainMenu = function( game, shared ) {

	var startButton = null;
    var logo = null;
    var background = null;
    var highScoreLabel = null;
    
    function startGame(pointer) {

        //	And start the actual game
        game.state.start('Game');

    }
    
    return {
    
        create: function () {
    
            background = game.add.tileSprite( 0, 0, 1200, 1024, 'background');
    
            logo = game.add.sprite(game.world.centerX, 200, 'mainMenuLogo');
            logo.anchor.setTo( 0.5, 0.5 );
            
            startButton = game.add.button( game.world.centerX, 500, 'startbutton', startGame, null);
            startButton.anchor.setTo( 0.5, 0.5 );

            shared.lives = 3;
            shared.currentScore = 0;

            var style = { font: "30px Arial", fill: "#ffffff", align: "center" };
            highScoreLabel = game.add.text(10, 10, "High Score: "+shared.highScore, style);
    
        },
    
        update: function () {
    
            //	Do some nice funky main menu effect here
    
        }
        
    };
};
