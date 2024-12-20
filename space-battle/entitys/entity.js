export class Entity {
    constructor(entityProps) {
        this.pos = entityProps.pos ?? [0, 0]
        this.speed = entityProps.speed ?? [0, 0]
        this.color = entityProps.color ?? "white"
        this.debug = entityProps.debug ?? false
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
        const size = Array.isArray(this.size) ? this.size[i] : this.size
        return this.pos[i] - size > limits[i]
    }

    isBeforeMapLimits(i) {
        const size = Array.isArray(this.size) ? this.size[i] : this.size
        return this.pos[i] + size < 0
    }

    draw(ctx) {}
    update(game) {
        for (let i = 0; i < this.pos.length; i++) {
            this.pos[i] += this.speed[i]
        }
    }
}
