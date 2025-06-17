// Import specific components from PixiJS
import { Application, Graphics, Text } from 'pixi.js';

console.log('Starting game initialization...');

// Game constants
const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
const PLAYER_SPEED = 5;
const BLOCK_SPEED = 3;
const BLOCK_SPAWN_INTERVAL = 2000; // milliseconds
const BLOCK_SIZE = 30;

// Game state
let score = 0;
let gameOver = false;

try {
    console.log('Creating PIXI Application...');
    // Create the application
    const app = new Application({
        width: GAME_WIDTH,
        height: GAME_HEIGHT,
        backgroundColor: 0x1099bb, // Light blue background to verify rendering
        antialias: true,
        resolution: window.devicePixelRatio || 1,
    });

    console.log('PIXI Application created successfully');

    // Add the canvas to the game container
    const gameContainer = document.getElementById('game-container');
    if (!gameContainer) {
        throw new Error('Game container element not found!');
    }
    console.log('Found game container element');

    const canvas = app.view as HTMLCanvasElement;
    canvas.style.border = '2px solid #333';
    gameContainer.appendChild(canvas);
    console.log('Canvas added to game container');

    // Create player (green block)
    console.log('Creating player...');
    const player = new Graphics();
    player.beginFill(0x00ff00);
    player.drawRect(0, 0, BLOCK_SIZE, BLOCK_SIZE);
    player.endFill();
    player.x = GAME_WIDTH / 2 - BLOCK_SIZE / 2;
    player.y = GAME_HEIGHT - BLOCK_SIZE - 10;
    app.stage.addChild(player);
    console.log('Player created and added to stage');

    // Create score text
    console.log('Creating score text...');
    const scoreText = new Text('Score: 0', {
        fontFamily: 'Arial',
        fontSize: 24,
        fill: 0xffffff,
    });
    scoreText.x = 10;
    scoreText.y = 10;
    app.stage.addChild(scoreText);
    console.log('Score text added to stage');

    // Array to store falling blocks
    const fallingBlocks: Graphics[] = [];

    // Keyboard state
    const keys: { [key: string]: boolean } = {};

    // Event listeners
    window.addEventListener('keydown', (e) => {
        keys[e.key] = true;
    });

    window.addEventListener('keyup', (e) => {
        keys[e.key] = false;
    });

    // Create a new falling block
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
    console.log('Block spawn interval set');

    // Game loop
    app.ticker.add(() => {
        if (gameOver) return;

        // Move player
        if (keys['ArrowLeft'] && player.x > 0) {
            player.x -= PLAYER_SPEED;
        }
        if (keys['ArrowRight'] && player.x < GAME_WIDTH - BLOCK_SIZE) {
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
                    fontSize: 48,
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
    console.log('Game loop started');

    // Create a simple red rectangle
    const rectangle = new Graphics();
    rectangle.beginFill(0xff0000);
    rectangle.drawRect(0, 0, 100, 100);
    rectangle.endFill();
    rectangle.x = 50;
    rectangle.y = 50;

    // Add it to the stage
    app.stage.addChild(rectangle);

    // Add some text
    const text = new Text('Hello PixiJS!', {
        fontFamily: 'Arial',
        fontSize: 24,
        fill: 0xffffff,
    });
    text.x = 50;
    text.y = 200;
    app.stage.addChild(text);

    console.log('Test scene created');
    console.log('Canvas dimensions:', app.view.width, 'x', app.view.height);
    console.log('Stage children count:', app.stage.children.length);

} catch (error) {
    console.error('Error during game initialization:', error);
}

// Collision detection
function checkCollision(rect1: Graphics, rect2: Graphics): boolean {
    const bounds1 = rect1.getBounds();
    const bounds2 = rect2.getBounds();

    return bounds1.x < bounds2.x + bounds2.width &&
           bounds1.x + bounds1.width > bounds2.x &&
           bounds1.y < bounds2.y + bounds2.height &&
           bounds1.y + bounds1.height > bounds2.y;
} 