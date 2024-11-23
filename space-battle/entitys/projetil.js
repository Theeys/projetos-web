import { Asteroid } from "./asteroid.js"
import { EntityWithBoxCollision } from "./entity-with-collision.js"

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
        const onOutLimits = () => {
            game.entitys = game.entitys.filter((projetil) => projetil !== this)
        }
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
            const smallExplosionSound = new Audio("./assets/audio/8-bit-explode1.mp3")
            smallExplosionSound.volume = 0.8
            
            const bigExplosionSound = new Audio("./assets/audio/8-bit-explode2.mp3")
            bigExplosionSound.volume = 0.8

            console.log(asteroid.size)
            asteroid.size > 30 ? bigExplosionSound.play() : smallExplosionSound.play()
        })
    }
}
