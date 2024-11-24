import { EntityWithBoxCollision } from "./entity-with-collision.js"
import { Asteroid } from "./asteroid.js"
import { Projetil } from "./projetil.js"
import { CollisionUtil } from "../util/collission-util.js"

export class SpaceShip extends EntityWithBoxCollision {
    constructor(entityProps) {
        super(entityProps)
        this.size = entityProps.size ?? [10, 10]
        this.projetils = []

        this.explosionSound = new Audio("./assets/audio/8-bit-explode3.mp3")
        this.explosionSound.volume = 0.8
    }

    updateCollisionBox() {
        super.updateCollisionBox()
        const size = Array.isArray(this.size)
            ? this.size
            : [this.size, this.size]

        for (let i = 0; i < this.boxCollision.size.length; i++) {
            this.boxCollision.size[i] = size[i] * 3
        }
    }

    draw(ctx) {
        super.draw(ctx)
        ctx.save()
        ctx.fillStyle = this.color
        for (let i = 0; i < this.spaceShipShape.length; i++) {
            ctx.fillRect(
                this.spaceShipShape[i][0],
                this.spaceShipShape[i][1],
                10,
                10
            )
        }
        ctx.restore()
        this.drawFire(ctx)
    }

    drawFire(ctx) {
        const firePosY = this.pos[1] + Math.random() * 8 + 10
        const fireShape = [
            [this.pos[0] + 10, firePosY],
            [this.pos[0] - 10, firePosY],
        ]

        ctx.save()
        ctx.fillStyle = "orange"
        fireShape.forEach((point) => {
            ctx.fillRect(point[0], point[1], 10, 10)
        })
        ctx.restore()
    }

    update(game) {
        super.update(game)
        const canvas = game.canvas
        const limits = [canvas.width, canvas.height]
        const onAfterLimits = (i) => (this.pos[i] = limits[i] - this.size[i])
        const onBeforeLimits = (i) => (this.pos[i] = 0 + this.size[i])
        this.checkIsOutLimits(onAfterLimits, onBeforeLimits)
        const asteroids = game.entitys.filter(
            (entity) => entity instanceof Asteroid
        )

        asteroids.forEach((asteroid) => {
            const isCollided = this.isCollided(asteroid.boxCollision)
            if (!isCollided) return
            this.explosionSound.play()
            game.gameOver()
        })

        this.spaceShipShape = [
            // Parte superior
            [this.pos[0], this.pos[1] - 10],
            // Parte esquerda
            [this.pos[0] - 10, this.pos[1]],
            [this.pos[0] - 5, this.pos[1] - 5],
            // Parte direita
            [this.pos[0] + 10, this.pos[1]],
            [this.pos[0] + 5, this.pos[1] - 5],
        ]
    }
}
