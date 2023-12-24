"use strict";

/**
 * @typedef {Object} Snowfall
 * @property {number | null} animationId - The ID of the animation frame.
 * @property {string} backgroundColor - The background colour of the snowfall.
 * @property {HTMLCanvasElement | null} canvas - The HTML canvas element.
 * @property {CanvasRenderingContext2D | null} canvasContext - The 2D rendering context of the canvas.
 * @property {number} canvasHeight - The height of the canvas.
 * @property {number} canvasWidth - The width of the canvas.
 * @property {number} DOUBLE_PI - Double the value of Math.PI.
 * @property {Snowflake[]} flakes - An array containing snowflake objects.
 * @property {number} maxSnowflakeHeight - The maximum height of a snowflake.
 * @property {number} numOfFlakes - The number of snowflakes.
 * @property {number} snowFallSpeed - The speed at which snowflakes fall.
 */
const snowfall = {
    animationId: null,
    backgroundColor: "hsl(0, 0%, 100%)", // Customize snow colour
    canvas: null,
    canvasContext: null,
    canvasHeight: 0,
    canvasWidth: 0,
    DOUBLE_PI: Math.PI * 2,
    flakes: [],
    maxSnowflakeHeight: 5.5,
    numOfFlakes: 300,
    snowFallSpeed: 4,
};

/**
 * Initializes the canvas and starts the animation.
 */
const initializeCanvas = () => {
    snowfall.canvas = document.createElement("canvas");
    document.body.appendChild(snowfall.canvas);
    snowfall.canvasContext = snowfall.canvas.getContext("2d");
    resizeCanvas();

    for (let i = 0; i < snowfall.numOfFlakes; i++) {
        const flake = new Snowflake();
        flake.y = -Math.random() * snowfall.canvasHeight; // Use minus to start above the canvas when page loads or plus to start mid animation
        snowfall.flakes.push(flake);
    }

    startAnimation();
};

/**
 * Resizes the canvas based on the window's dimensions.
 */
function resizeCanvas() {
    snowfall.canvasWidth = snowfall.canvas.width = window.innerWidth;
    snowfall.canvasHeight = snowfall.canvas.height = window.innerHeight;
}

/**
 * Starts the snowfall animation.
 */
const startAnimation = () => {
    snowfall.animationId = requestAnimationFrame(drawSnowfall);
};

/**
 * Stops the snowfall animation.
 */
const stopAnimation = () => {
    cancelAnimationFrame(snowfall.animationId);
};

/**
 * Draws the snowfall on the canvas.
 */
const drawSnowfall = () => {
    const flakesLength = snowfall.flakes.length;
    snowfall.animationId = requestAnimationFrame(drawSnowfall);
    snowfall.canvasContext.clearRect(
        0,
        0,
        snowfall.canvasWidth,
        snowfall.canvasHeight
    );
    snowfall.canvasContext.fillStyle = snowfall.backgroundColor;
    snowfall.canvasContext.beginPath();
    for (let i = 0; i < flakesLength; i++) {
        snowfall.flakes[i].update().draw();
    }
    snowfall.canvasContext.fill();
};

/**
 * Represents a snowflake.
 */
class Snowflake {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = 0;
        this._x = Math.random() * snowfall.canvasWidth;
        this.y = -5;
        this.z = Math.random() * 0.8 + 0.2;
        this.o = Math.random() * Math.PI;
    }

    update() {
        const factorA = 0.05;
        const factorB = 20;
        const resetThreshold = snowfall.canvasHeight + 5;

        this.x =
            Math.cos(this.o + this.y * (1 - this.z) * factorA) *
                this.z *
                factorB +
            this._x;
        this.y += this.z * snowfall.snowFallSpeed;
        if (this.y > resetThreshold) {
            this.reset();
        }
        return this;
    }

    draw() {
        const radius = this.z * snowfall.maxSnowflakeHeight + 0.5;
        snowfall.canvasContext.moveTo(this.x + radius, this.y);
        snowfall.canvasContext.arc(
            this.x,
            this.y,
            radius,
            0,
            snowfall.DOUBLE_PI
        );
    }
}

// Event listeners
/**
 * Initializes the canvas and starts the animation when the window is loaded.
 */
window.addEventListener("load", initializeCanvas);

/**
 * Resizes the canvas when the window is resized.
 */
window.addEventListener("resize", resizeCanvas);
