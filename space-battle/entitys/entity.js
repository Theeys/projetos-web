export class Entity {
    constructor(entityProps) {
        this.pos = entityProps.pos ?? [0, 0]
        this.speed = entityProps.speed ?? [0, 0]
        this.color = entityProps.color ?? "white"
    }

    checkIsOutLimits(onAfterLimits, onBeforeLimits) {
        onBeforeLimits = onBeforeLimits ?? onAfterLimits
        const limits = [canvas.width, canvas.height]
        for (let i = 0; i < this.pos.length; i++) {
            if (this.isAfterMapLimits(limits, i)) {
                onAfterLimits(i)
            } else if (this.isBeforeMapLimits(i)) {
                onBeforeLimits(i)
            }
        }
    }

    isAfterMapLimits(limits, i) {
        return this.pos[i] - this.size > limits[i]
    }

    isBeforeMapLimits(i) {
        return this.pos[i] + this.size < 0
    }

    draw(ctx) {}
    update(game) {
        for (let i = 0; i < this.pos.length; i++) {
            this.pos[i] += this.speed[i]
        }
    }
}
