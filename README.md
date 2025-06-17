# Block Dodge Game

A simple 2D game built with PixiJS and TypeScript where you control a green block to dodge falling red blocks.

## Game Mechanics

- A green block (player) is controlled using the left and right arrow keys
- Red blocks fall from the top of the screen at regular intervals
- Score increases when red blocks pass the bottom of the screen
- Game ends when the player collides with a red block

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:3000`

## Controls

- Left Arrow Key: Move player left
- Right Arrow Key: Move player right

## Development

- Built with PixiJS and TypeScript
- Uses Vite for development and building
- Source code is in the `src` directory

## Building for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist` directory. 