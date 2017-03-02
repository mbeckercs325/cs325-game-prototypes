"use strict";

GameStates.makePreloader = function (game) {

    var background = null;
    var preloadBar = null;

    var characters = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
        'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

    var ready = false;

    return {

        preload: function () {

            //	These are the assets we loaded in Boot.js
            //	A nice sparkly background and a loading progress bar
            background = game.add.tileSprite(0, 0, 1200, 600, 'background');
            preloadBar = game.add.sprite(game.world.centerX, 400, 'preloaderBar');
            preloadBar.anchor.setTo(0.5, 0.5);

            //	This sets the preloadBar sprite as a loader sprite.
            //	What that does is automatically crop the sprite from 0 to full-width
            //	as the files below are loaded in.
            game.load.setPreloadSprite(preloadBar);

            //	Here we load the rest of the assets our game needs.
            //	As this is just a Project Template I've not provided these assets, swap them for your own.
            game.load.image('startbutton', 'assets/startbutton.png');
            game.load.image('mainMenuLogo', 'assets/mainMenuLogo.png');
            game.load.image('spaceship', 'assets/spaceship.png');
            game.load.audio('spaceshipSound', 'assets/sounds/spaceship_engine_sound.mp3');
            game.load.image('planet1', 'assets/planets/Planet1.png');
            game.load.image('zoomedPlanet1', 'assets/planets/zoomedPlanet1.png');
            game.load.image('planet2', 'assets/planets/Planet2.png');
            game.load.image('zoomedPlanet2', 'assets/planets/zoomedPlanet2.png');
            game.load.image('planet3', 'assets/planets/Planet3.png');
            game.load.image('zoomedPlanet3', 'assets/planets/zoomedPlanet3.png');
            game.load.image('planet4', 'assets/planets/Planet4.png');
            game.load.image('zoomedPlanet4', 'assets/planets/zoomedPlanet4.png');
            game.load.image('attackButton', 'assets/attackButton.png');
            game.load.image('retreatButton', 'assets/retreatButton.png');
            game.load.image('exitButton', 'assets/exitButton.png');

            for (var i = 0, len = characters.length; i < len; i++) {
                game.load.image(characters[i], 'assets/characters/' + characters[i] + '.png');
            }
        },

        create: function () {

            //	Once the load has finished we disable the crop because we're going to sit in the update loop for a short while as the music decodes
            preloadBar.cropEnabled = false;
        },

        update: function () {

            //	You don't actually need to do this, but I find it gives a much smoother game experience.
            //	Basically it will wait for our audio file to be decoded before proceeding to the MainMenu.
            //	You can jump right into the menu if you want and still play the music, but you'll have a few
            //	seconds of delay while the mp3 decodes - so if you need your music to be in-sync with your menu
            //	it's best to wait for it to decode here first, then carry on.

            //	If you don't have any music in your game then put the game.state.start line into the create function and delete
            //	the update function completely.

            // if (game.cache.isSoundDecoded('titleMusic') && ready == false)
            // {
            //     ready = true;
            //     game.state.start('MainMenu');
            // }
            game.state.start('MainMenu');

        }

    };
};
