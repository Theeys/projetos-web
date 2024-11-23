import { SpaceShip } from "./entitys/spaceship.js"
import { Asteroid } from "./entitys/asteroid.js"
import { Star } from "./entitys/star.js"
import { Projetil } from "./entitys/projetil.js"
import { EntityWithBoxCollision } from "./entitys/entity-with-collision.js"
import { Particle } from "./entitys/particle.js"

export class Game {
    constructor(canvas) {
        this.canvas = canvas
        this.ctx = canvas.getContext("2d")
        this.entitys = []
        this.start = false
        this.debug = false
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
        this.start = true
        this.entitys.push(
            this.createSpaceShip(this.canvas.width / 2, this.canvas.height - 10)
        )
        this.entitys = this.entitys.filter(
            (entity) => !(entity instanceof Asteroid)
        )
    }

    gameOver() {
        this.start = false
        const spaceShip = this.getSpaceShips()[0]
        for (let i = 0; i < 20; i++) {
            this.entitys.push(new Particle({ pos: [...spaceShip.pos] }))
        }
        this.entitys = this.entitys.filter(
            (entity) => !(entity instanceof SpaceShip)
        )
    }

    switchDebug() {
        this.debug = !this.debug
        this.entitys
            .filter((entity) => entity instanceof EntityWithBoxCollision)
            .forEach((entity) => {
                entity.boxCollision.show = this.debug
            })
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

    createAsteroid(x, y) {
        const asteroid = new Asteroid({
            pos: [x, y],
            speed: [
                Math.random() * (Math.random() > 0.5 ? 1 : -1),
                Math.random() * 5 + 2,
            ],
            size: [20, 10],
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
                "Iniciar jogo",
                this.canvas.width / 2 + bounceOffset,
                this.canvas.height / 2 + bounceOffset
            )
        }
    }
}
