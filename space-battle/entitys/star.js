import { Entity } from "./entity.js"
import { canvas, ctx } from "../script.js"

export class Star extends Entity {
    constructor(entityProps) {
        super(entityProps)
        this.size = entityProps.size ?? 2
    }

    draw(ctx) {
        super.draw(ctx)
        ctx.save()
        ctx.beginPath()
        ctx.fillStyle = this.color
        ctx.arc(this.pos[0], this.pos[1], this.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
    }

    update(game) {
        super.update(game)
        const canvas = game.canvas
        const limits = [canvas.width, canvas.height]
        const onAfterLimits = (i) => (this.pos[i] = 0 + this.size)
        const onBeforeLimits = (i) => (this.pos[i] = limits[i] - this.size)
        this.checkIsOutLimits(onAfterLimits, onBeforeLimits)
    }
}
