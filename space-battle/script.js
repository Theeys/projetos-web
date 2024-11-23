import { SpaceShip } from "./entitys/spaceship.js"
import { Game } from "./game.js"

const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

export { canvas, ctx }

function animate() {
    game.updateAndDraw()
    requestAnimationFrame(animate)
}

function handlerResizeWindow() {
    const percent = 0.8
    canvas.width = window.innerWidth * percent
    canvas.height = window.innerHeight * percent

    game.entitys.forEach((entity) => {
        entity.pos[0] = Math.random() * canvas.width
        entity.pos[1] = Math.random() * canvas.height
    })
}

let game = new Game(canvas)

window.addEventListener("resize", handlerResizeWindow)
handlerResizeWindow()

const fireHandler = () => {
    const spaceShip = game.getSpaceShips()[0]
    game.createProjetil(spaceShip.pos[0], spaceShip.pos[1])
    if (game.over) game = new Game(canvas)
}

canvas.addEventListener("click", fireHandler)
canvas.addEventListener("touchstart", fireHandler)

canvas.addEventListener("touchmove", (e) => {
    const spaceShip = game.getSpaceShips()[0]
    const rect = canvas.getBoundingClientRect()
    const x = e.touches[0].clientX - rect.left
    const y = e.touches[0].clientY - rect.top
    spaceShip.pos[0] = x
    spaceShip.pos[1] = y
})

canvas.addEventListener("mousemove", (e) => {
    const spaceShip = game.getSpaceShips()[0]
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    spaceShip.pos[0] = x
    spaceShip.pos[1] = y
})

animate()
