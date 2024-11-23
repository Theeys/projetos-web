import { Entity } from "./entity.js"

export class Particle extends Entity {
    constructor(entityProps) {
        super(entityProps)
        const maxSpeed = 4
        const speedX = (Math.random() - 0.5) * maxSpeed
        const speedY = (Math.random() - 0.5) * maxSpeed
        this.speed = [speedX, speedY]
        this.life = Math.random() * 30 + 30
        const size = Math.random() * 5 + 1
        this.size = [size, size]
    }

    update(game) {
        super.update(game)
        this.life--
        if (this.life < 0) {
            game.entitys = game.entitys.filter((entity) => entity !== this)
        }
    }

    draw(ctx) {
        super.draw(ctx)
        ctx.save()
        ctx.fillStyle = this.color
        ctx.fillRect(this.pos[0], this.pos[1], this.size[0], this.size[1])
        //ctx.beginPath()
        //ctx.arc(this.pos[0], this.pos[1], this.size, 0, Math.PI * 2)
        //ctx.fill()
        ctx.restore()
    }
}
