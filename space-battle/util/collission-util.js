export class CollisionUtil {
    static isRectsCollided(rectA, rectB) {
        return (
            rectA.pos[0] < rectB.pos[0] + rectB.size[0] &&
            rectA.pos[0] + rectA.size[0] > rectB.pos[0] &&
            rectA.pos[1] < rectB.pos[1] + rectB.size[1] &&
            rectA.pos[1] + rectA.size[1] > rectB.pos[1]
        )
    }

    static isBallsCollided(ballA, ballB) {
        // const xAxisDistance = ballA.pos[0] - ballB.pos[0]
        // const yAxisDistance = ballA.pos[1] - ballB.pos[1]
        // const distance = (xAxisDistance ** 2 + yAxisDistance ** 2) ** 0.5
        // return distance < ballA.size + ballB.size

        // Ao pesquisar em sites e forúns sobre técnicas de detecção de colisão entre circulos em planos 2D,
        // foi afirmado em muitos deles que o calculo de raiz quadrada tem um certo custo computacional,
        // como alternativa o código abaixo pode oferecer o mesmo resultado porém com um custo computacional menor:
        const distanceSquared = xAxisDistance ** 2 + yAxisDistance ** 2
        const radiusSum = ballA.size + ballB.size
        return distanceSquared < radiusSum ** 2
    }
}
