import { Star } from "./entitys/star.js"
import { Game } from "./game.js"

const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

const btnFullscreen = document.getElementById("fullscreen")
const btnDebug = document.getElementById("debug")

export { canvas, ctx }

function animate() {
    game.updateAndDraw()
    requestAnimationFrame(animate)
}

function handlerResizeWindow() {
    if (!isFullscreen()) {
        const percent = 0.8
        canvas.width = window.innerWidth * percent
        canvas.height = window.innerHeight * percent
    } else {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
    }

    game.entitys
        .filter((entity) => entity instanceof Star)
        .forEach((entity) => {
            entity.pos[0] = Math.random() * canvas.width
            entity.pos[1] = Math.random() * canvas.height
        })
}

function isFullscreen() {
    return document.fullscreenElement === canvas
}

const game = new Game(canvas)

window.addEventListener("resize", handlerResizeWindow)
handlerResizeWindow()

export const fireHandler = () => {
    const spaceShip = game.getSpaceShips()[0]
    if (spaceShip) {
        game.createProjetil(spaceShip.pos[0], spaceShip.pos[1])
        return
    }
    if (game.start) return
    game.startGame()
}

btnFullscreen.addEventListener("click", () => {
    if (canvas.requestFullscreen) {
        canvas.requestFullscreen()
    } else if (canvas.webkitRequestFullscreen) {
        canvas.webkitRequestFullscreen()
    } else if (canvas.msRequestFullscreen) {
        canvas.msRequestFullscreen()
    }
})

btnDebug.addEventListener("click", () => {
    game.switchDebug()
})

canvas.addEventListener("click", fireHandler)
canvas.addEventListener("touchstart", fireHandler)

canvas.addEventListener("touchmove", (e) => {
    const spaceShip = game.getSpaceShips()[0]
    if (!spaceShip) return
    let x = e.touches[0].clientX
    let y = e.touches[0].clientY
    if (!isFullscreen()) {
        const rect = canvas.getBoundingClientRect()
        x -= rect.left
        y -= rect.top
    }
    spaceShip.pos[0] = x - 75
    spaceShip.pos[1] = y - 75
})

canvas.addEventListener("mousemove", (e) => {
    const spaceShip = game.getSpaceShips()[0]
    if (!spaceShip) return
    let x = e.clientX
    let y = e.clientY
    if (!isFullscreen()) {
        const rect = canvas.getBoundingClientRect()
        x -= rect.left
        y -= rect.top
    }
    spaceShip.pos[0] = x
    spaceShip.pos[1] = y
})

animate()
