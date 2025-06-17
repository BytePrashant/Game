// Import the entire PixiJS library
import { Application, Graphics, Text } from 'pixi.js';

// Game constants
const GAME_WIDTH = 2000;  // Increased from 1000
const GAME_HEIGHT = 1700;  // Increased from 800
const PLAYER_SPEED = 8;   // Increased for better movement with wider board
const BLOCK_SPEED = 3;
const BLOCK_SIZE = 30;
const PLAYER_WIDTH = 120;  // New constant for player width
const PLAYER_HEIGHT = 20;  // New constant for player height
const BLOCK_SPAWN_INTERVAL = 2000; // milliseconds

// Game state
let score = 0;
let gameOver = false;

// Wait for the DOM to be ready
window.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM loaded, initializing PixiJS...');

    // Get the game container
    const gameContainer = document.getElementById('game-container');
    if (!gameContainer) {
        console.error('Game container not found!');
        return;
    }

    try {
        // Create the application
        const app = new Application();

        // Initialize with the new v8 method
        await app.init({
            width: GAME_WIDTH,
            height: GAME_HEIGHT,
            backgroundColor: 0x1099bb,
            antialias: true,
            resolution: 1
        });

        console.log('Application initialized successfully');

        // Add canvas to the game container
        gameContainer.appendChild(app.view);
        console.log('Canvas added to game container');

        // Create player (green board)
        const player = new Graphics();
        player.beginFill(0x00ff00);
        player.drawRect(0, 0, PLAYER_WIDTH, PLAYER_HEIGHT);
        player.endFill();
        player.x = GAME_WIDTH / 2 - PLAYER_WIDTH / 2;
        player.y = GAME_HEIGHT - PLAYER_HEIGHT - 20;  // Moved up a bit from bottom
        app.stage.addChild(player);
        console.log('Player created');

        // Create score text
        const scoreText = new Text('Score: 0', {
            fontFamily: 'Arial',
            fontSize: 32,  // Increased font size
            fill: 0xffffff,
        });
        scoreText.x = 20;  // Moved a bit more to the right
        scoreText.y = 20;  // Moved a bit more down
        app.stage.addChild(scoreText);

        // Array to store falling blocks
        const fallingBlocks: Graphics[] = [];

        // Keyboard state
        const keys: { [key: string]: boolean } = {};

        // Event listeners for keyboard
        window.addEventListener('keydown', (e) => {
            keys[e.key] = true;
        });

        window.addEventListener('keyup', (e) => {
            keys[e.key] = false;
        });

        // Function to create a new falling block
        function createFallingBlock() {
            if (gameOver) return;

            const block = new Graphics();
            block.beginFill(0xff0000);
            block.drawRect(0, 0, BLOCK_SIZE, BLOCK_SIZE);
            block.endFill();
            block.x = Math.random() * (GAME_WIDTH - BLOCK_SIZE);
            block.y = -BLOCK_SIZE;
            app.stage.addChild(block);
            fallingBlocks.push(block);
        }

        // Spawn blocks at intervals
        setInterval(createFallingBlock, BLOCK_SPAWN_INTERVAL);

        // Game loop
        app.ticker.add(() => {
            if (gameOver) return;

            // Move player with arrow keys
            if (keys['ArrowLeft'] && player.x > 0) {
                player.x -= PLAYER_SPEED;
            }
            if (keys['ArrowRight'] && player.x < GAME_WIDTH - PLAYER_WIDTH) {
                player.x += PLAYER_SPEED;
            }

            // Update falling blocks
            for (let i = fallingBlocks.length - 1; i >= 0; i--) {
                const block = fallingBlocks[i];
                block.y += BLOCK_SPEED;

                // Check for collision with player
                if (checkCollision(player, block)) {
                    gameOver = true;
                    const gameOverText = new Text('Game Over!', {
                        fontFamily: 'Arial',
                        fontSize: 64,  // Increased font size
                        fill: 0xff0000,
                    });
                    gameOverText.x = GAME_WIDTH / 2 - gameOverText.width / 2;
                    gameOverText.y = GAME_HEIGHT / 2 - gameOverText.height / 2;
                    app.stage.addChild(gameOverText);
                    return;
                }

                // Remove blocks that have passed the bottom of the screen
                if (block.y > GAME_HEIGHT) {
                    app.stage.removeChild(block);
                    fallingBlocks.splice(i, 1);
                    score++;
                    scoreText.text = `Score: ${score}`;
                }
            }
        });

        // Collision detection
        function checkCollision(rect1: Graphics, rect2: Graphics): boolean {
            const bounds1 = rect1.getBounds();
            const bounds2 = rect2.getBounds();

            return bounds1.x < bounds2.x + bounds2.width &&
                   bounds1.x + bounds1.width > bounds2.x &&
                   bounds1.y < bounds2.y + bounds2.height &&
                   bounds1.y + bounds1.height > bounds2.y;
        }

    } catch (error) {
        console.error('Error initializing PixiJS:', error);
    }
}); 