import { EntityWithBoxCollision } from "./entity-with-collision.js"

export class Asteroid extends EntityWithBoxCollision {
    constructor(entityProps) {
        super(entityProps)
        this.size = 30 * Math.random() + 10
    }

    draw(ctx) {
        super.draw(ctx)
        ctx.save()
        // ctx.strokeStyle = this.color;
        // ctx.lineWidth = 2;
        // ctx.rect(this.pos[0], this.pos[1], this.size[0], this.size[1]);
        // ctx.stroke();
        ctx.beginPath()
        const points = 5
        const irregularity = 0.4
        for (let i = 0; i < points; i++) {
            // Ângulo para cada ponto
            const angle = (i / points) * Math.PI * 2
            // Coordenadas do ponto
            const px = this.pos[0] + Math.cos(angle) * this.size
            const py = this.pos[1] + Math.sin(angle) * this.size
            if (i === 0) {
                ctx.moveTo(px, py)
            } else {
                ctx.lineTo(px, py)
            }
        }
        ctx.closePath()
        ctx.fillStyle = "black"
        ctx.fill()
        ctx.strokeStyle = "white"
        ctx.lineWidth = 2
        ctx.stroke()

        ctx.restore()
    }

    update(game) {
        super.update(game)
        const onOutLimits = () => {
            game.entitys = game.entitys.filter((entity) => entity !== this)
        }
        this.checkIsOutLimits(onOutLimits)
    }
}
