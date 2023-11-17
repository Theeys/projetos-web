(function () {
    const video = document.getElementById('video')
    const textVideo = document.getElementById('text-video')
    const canvas = document.getElementById('canvas-video')
    const ctx = canvas.getContext('2d');
    const width = 220 / 2, height = 140 / 2;

    const ASCII_PALETTES = {
                            blockelement: "█",
                            solidblock: "█",
                            minimalist: "#+-.",
                            mediumset: "@%#8*+=-:,.",
                            longerset: "$@B%8&WM#*oa*+=-:,.",
                            fullset: "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft?+~i!lI;:,^`'.",
                            maxset: "\xc6\xd1\xcaŒ\xd8M\xc9\xcb\xc8\xc3\xc2WQB\xc5\xe6#N\xc1\xfeE\xc4\xc0HKRŽœXg\xd0\xeaq\xdbŠ\xd5\xd4A€\xdfpm\xe3\xe2G\xb6\xf8\xf0\xe98\xda\xdc$\xebd\xd9\xfd\xe8\xd3\xde\xd6\xe5\xff\xd2b\xa5FD\xf1\xe1ZP\xe4š\xc7\xe0h\xfb\xa7\xddkŸ\xaeS9žUTe6\xb5Oyx\xce\xbef4\xf55\xf4\xfa&a\xfc™2\xf9\xe7w\xa9Y\xa30V\xcdL\xb13\xcf\xcc\xf3C@n\xf6\xf2s\xa2u‰\xbd\xbc‡zJƒ%\xa4Itoc\xeerjv1l\xed=\xef\xec<>i7†[\xbf?\xd7}*{+()/\xbb\xab•\xac|!\xa1\xf7\xa6\xaf—^\xaa„”“~\xb3\xba\xb2–\xb0\xad\xb9‹›;:’‘‚’˜ˆ\xb8…\xb7\xa8\xb4`",
                            numerical: "0896452317",
                            extended: "@%#{}[]()<>^*+=~-:.",
                            math: "π≠\xf7√=≈∞+\xd7-",
                            arrow: "↑↗→↘↓↙←↖",
                            alphabetic: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
                            alphanumeric: "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890abcdefghijklmnopqrstuvwxyz",
                            default: "\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0++++++++########"
                        };

    const gradient = ASCII_PALETTES["maxset"].split('').reverse().join('');
    const preparedGradient = gradient.replaceAll('_', '\u00A0')
    // const gradient = "_______++++++++########";
    // const preparedGradient = gradient.replaceAll('_', '-')

    const rainbowColors = [
        '#9400D3',
        '#4B0082',
        '#0000FF',

    ]

    const randomRainbowColor = () => {
        const i = Math.floor(Math.random() * rainbowColors.length)
        return rainbowColors[i]
    }

    const init = () => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: false })
            .then(function (stream) {
                video.srcObject = stream;
                video.play();
            })
            .catch(function (err) {
                console.log("An error occurred: " + err);
            });
    }

    const clearphoto = () => {
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, width, height);
    }

    const render = (ctx) => {
        if (width && height) {
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(video, 0, 0, width, height);
        } else {
            clearphoto();
        }
    }

    const getPixelsGreyScale = (ctx) => {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        let row = 0
        const res = new Array(height).fill(0).map(() => []);
        for (let i = 0, c = 0; i < data.length; i += 4) {
            const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
            let curr = res[row]
            curr.push(avg)
            if (c < width) {
                c++
            }
            if (c === width) {
                c = 0
                row += 1
            }

        }
        return res
    }     

    const getPixelColor = (x,y) => {
        const imageData = ctx.getImageData(x, y, canvas.width, canvas.height);
        const data = imageData.data;
        let row = 0

        var red = data[0];
        var green = data[1];
        var blue = data[2];
        var alpha = data[3];

        return `${red}, ${green}, ${blue}`
    }             

    const getCharByScale = (scale) => {
        const val = Math.floor(scale / 255 * (gradient.length - 1))
        return preparedGradient[val]
    }

    const renderText = (node, textDarkScale) => {
        let txt = ``
        for (let i = 0; i < textDarkScale.length; i++) {
            txt += `<div>`
            for (let k = 0; k < textDarkScale[i].length; k++) {
                txt += `<span style='color: rgb(${getPixelColor(k,i)})'> ${getCharByScale(textDarkScale[i][k])} </span>`
            }
            txt += `</div><br>`
        }
        //txt += `</div>`
        node.innerHTML = txt
    }

    let running = true;

    init()
    const frame = () => requestAnimationFrame(() => {
        render(ctx)
        const chars = getPixelsGreyScale(ctx)
        renderText(textVideo, chars)
        randomRainbowColor()
        if (running)
            frame()
    })
    frame()

    
    document.getElementById('start').addEventListener('click', (e) => {
        running = true
        frame()
    })

    document.getElementById('stop').addEventListener('click', (e) => {
        running = false
    })

})()