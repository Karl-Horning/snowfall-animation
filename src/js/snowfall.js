"use strict";

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

const initializeCanvas = () => {
    snowfall.canvas = document.createElement("canvas");
    document.body.appendChild(snowfall.canvas);
    snowfall.canvasContext = snowfall.canvas.getContext("2d");
    resizeCanvas();

    for (let i = 0; i < snowfall.numOfFlakes; i++) {
        const flake = new Snowflake();
        flake.y = Math.random() * snowfall.canvasHeight;
        snowfall.flakes.push(flake);
    }

    startAnimation();
};

function resizeCanvas() {
    snowfall.canvasWidth = snowfall.canvas.width = window.innerWidth;
    snowfall.canvasHeight = snowfall.canvas.height = window.innerHeight;
}

const startAnimation = () => {
    snowfall.animationId = requestAnimationFrame(drawSnowfall);
};

const stopAnimation = () => {
    cancelAnimationFrame(snowfall.animationId);
};

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

window.addEventListener("load", initializeCanvas);
window.addEventListener("resize", resizeCanvas);
