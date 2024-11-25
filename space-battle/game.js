import { SpaceShip } from "./entitys/spaceship.js"
import { Asteroid } from "./entitys/asteroid.js"
import { Star } from "./entitys/star.js"
import { Projetil } from "./entitys/projetil.js"
import { EntityWithBoxCollision } from "./entitys/entity-with-collision.js"
import { Particle } from "./entitys/particle.js"
import { fireHandler } from "./script.js"

export class Game {
    constructor(canvas) {
        this.canvas = canvas
        this.ctx = canvas.getContext("2d")
        this.entitys = []
        this.start = false
        this.over = false
        this.debug = false

        this.music = new Audio("./assets/audio/8-bit-loop.mp3")
        this.music.loop = true
        this.music.volume = 0.4

        this.startSound = new Audio("./assets/audio/8-bit-game-start.mp3")
        this.startSound.volume = 0.8

        this.gameOverSound = new Audio("./assets/audio/8-bit-game-over.mp3")
        this.gameOverSound.volume = 0.8

        for (let i = 0; i < 20; i++) {
            this.entitys.push(
                this.createStar(
                    Math.random() * canvas.width,
                    Math.random() * canvas.height
                )
            )
        }
    }

    startGame() {
        this.startSound.play()
        this.start = true
        this.over = false
        this.entitys.push(
            this.createSpaceShip(this.canvas.width / 2, this.canvas.height - 10)
        )
        this.entitys = this.entitys.filter(
            (entity) => !(entity instanceof Asteroid)
        )
        setTimeout(() => {
            this.music.play()
        }, 1000)
    }

    gameOver() {
        this.music.pause()
        this.start = false
        this.over = true
        const spaceShip = this.getSpaceShips()[0]
        for (let i = 0; i < 20; i++) {
            this.entitys.push(new Particle({ pos: [...spaceShip.pos] }))
        }
        this.entitys = this.entitys.filter(
            (entity) => !(entity instanceof SpaceShip)
        )
        this.gameOverSound.play()
        this.canvas.removeEventListener("click", fireHandler)
        this.canvas.removeEventListener("touchstart", fireHandler)

        setTimeout(() => {
            this.canvas.addEventListener("click", fireHandler)
            this.canvas.addEventListener("touchstart", fireHandler)
        }, 5500)
    }

    switchDebug() {
        this.debug = !this.debug
        this.entitys
            .filter((entity) => entity instanceof EntityWithBoxCollision)
            .forEach((entity) => (entity.debug = this.debug))
    }

    getSpaceShips() {
        return this.entitys.filter((entity) => entity instanceof SpaceShip)
    }

    createProjetil(x, y) {
        const projetil = new Projetil({
            pos: [x, y],
            color: "orange",
            speed: [0, -10],
            debug: this.debug,
        })
        this.entitys.push(projetil)
        const fireSound = new Audio("./assets/audio/8-bit-laser.mp3")
        fireSound.volume = 0.8
        fireSound.play()
    }

    createSpaceShip(x, y) {
        return new SpaceShip({
            pos: [x, y],
            color: "teal",
            debug: this.debug,
        })
    }

    createStar(x, y) {
        const maxSpeed = 5
        const minSpeed = 2
        return new Star({
            pos: [x, y],
            speed: [0, Math.random() * maxSpeed + minSpeed],
            size: 2,
            color: "white",
        })
    }

    createAsteroidChilds(asteroid) {
        const amountMax = 3
        const amountAsteroids = Math.ceil((asteroid.size * amountMax) / 46)
        const maxSize = asteroid.size * 0.37
        const asteroids = []
        for (let i = 0; i < amountAsteroids; i++) {
            const asteroidChild = new Asteroid({
                pos: [...asteroid.pos],
                speed: [Math.random() - 0.5, Math.random() * 5 + 2],
                size: maxSize * Math.random() + 10,
                color: "white",
                debug: this.debug,
            })
            asteroids.push(asteroidChild)
        }
        return asteroids
    }

    createAsteroid(x, y) {
        const asteroid = new Asteroid({
            pos: [x, y],
            speed: [Math.random() - 0.5, Math.random() * 5 + 2],
            size: 36 * Math.random() + 10,
            color: "white",
            debug: this.debug,
        })
        asteroid.pos[1] = y - asteroid.size
        return asteroid
    }

    updateAndDraw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

        this.entitys.forEach((entity) => {
            entity.update(this)
        })

        this.entitys.forEach((entity) => {
            entity.draw(this.ctx)
        })

        const asteroids = this.entitys.filter(
            (entity) => entity instanceof Asteroid
        )

        if (Math.random() > 0.98 && asteroids.length < 8) {
            this.entitys.push(
                this.createAsteroid(Math.random() * this.canvas.width, 0)
            )
        }

        if (!this.start) {
            const amplitude = 10
            const frequency = 0.002
            const bounceOffset = Math.sin(Date.now() * frequency) * amplitude

            this.ctx.fillStyle = "white"
            this.ctx.font = "bold 50px Arial"
            this.ctx.textAlign = "center"
            this.ctx.fillText(
                this.over ? "Game Over" : "Iniciar jogo",
                this.canvas.width / 2 + bounceOffset,
                this.canvas.height / 2 + bounceOffset
            )
        }
    }
}
