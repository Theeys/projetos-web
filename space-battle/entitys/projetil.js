import { Asteroid } from "./asteroid.js"
import { EntityWithBoxCollision } from "./entity-with-collision.js"
import { Particle } from "./particle.js"

export class Projetil extends EntityWithBoxCollision {
    constructor(entityProps) {
        super(entityProps)
        this.size = entityProps.size ?? [5, 20]
    }

    draw(ctx) {
        super.draw(ctx)
        ctx.save()
        ctx.fillStyle = this.color
        ctx.fillRect(this.pos[0], this.pos[1], this.size[0], this.size[1])
        ctx.restore()
    }

    updateCollisionBox() {
        for (let i = 0; i < this.pos.length; i++) {
            this.boxCollision.pos[i] = this.pos[i]
        }

        for (let i = 0; i < this.boxCollision.size.length; i++) {
            this.boxCollision.size[i] = this.size[i]
        }
    }

    update(game) {
        super.update(game)
        const onOutLimits = () =>
            (game.entitys = game.entitys.filter((entity) => entity !== this))
        this.checkIsOutLimits(onOutLimits)
        const asteroids = game.entitys.filter(
            (entity) => entity instanceof Asteroid
        )
        asteroids.forEach((asteroid) => {
            const collided = this.isCollided(asteroid.boxCollision)
            if (!collided) return
            game.entitys = game.entitys.filter(
                (entity) => entity !== this && entity !== asteroid
            )

            const isBigAsteroid = asteroid.size > 26

            for (let i = 0; i < 30; i++) {
                game.entitys.push(new Particle({ pos: [...this.pos] }))
            }

            const pathAudio = isBigAsteroid
                ? "./assets/audio/8-bit-explode2.mp3"
                : "./assets/audio/8-bit-explode1.mp3"
            const explosionSound = new Audio(pathAudio)
            explosionSound.volume = 0.8
            explosionSound.play()

            if (!isBigAsteroid) return

            const asteroidsChilds = game.createAsteroidChilds(asteroid)
            game.entitys.push(...asteroidsChilds)
        })
    }
}
