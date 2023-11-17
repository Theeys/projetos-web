(function () {
    const video = document.querySelector('video')
    const canvasTxtVideo = document.querySelector('.canvas-text-video')
    const canvas = document.querySelector('.canvas-video')
    const ctx = canvas.getContext('2d');
    const ctxTxtVideo = canvasTxtVideo.getContext('2d');
    const btnSwitchColor = document.querySelector('.btn-switch-color-video')
    const btnSwitchTextVideo = document.querySelector('.btn-switch-video')        
    const btnSwitchWebcam = document.querySelector('.btn-switch-webcam')   
    const btnSwitchPaleta = document.querySelector('.btn-switch-paleta')

    function calcularTamanhoCanvas() {
        if(screen.width < 572){
            canvas.width = 35
            canvasTxtVideo.width = 350
        } else if(screen.width < 800){
            canvas.width = 50
            canvasTxtVideo.width = 500
        } else {
            canvas.width = 80
            canvasTxtVideo.width = 800        
        }
    }

    window.addEventListener('resize', calcularTamanhoCanvas)
    calcularTamanhoCanvas()

    ctxTxtVideo.font = `12px monospace`
    ctxTxtVideo.imageSmoothingEnabled = !0
    ctxTxtVideo.fontKerning = "none"
    ctxTxtVideo.textAlign = "start"
    ctxTxtVideo.textBaseline = "top"
    ctxTxtVideo.textRendering = "optimizeSpeed"
    ctxTxtVideo.fillStyle = "white"

    const ASCII_PALETTES = {
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
    let optionGradient = "mediumset"
    let gradient = ASCII_PALETTES[optionGradient].split('').reverse().join('');

    const init = () => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: false })
            .then(function (stream) {
                video.srcObject = stream;
                video.play();
            })
            .catch(function (err) {
                console.log("Nao foi possivel obter acesso a camera: " + err);
            });
    }

    const getPixelsGreyScale = (ctx) => {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        let row = 0
        const res = new Array(canvas.height).fill(0).map(() => []);
        for (let i = 0, c = 0; i < data.length; i += 4) {
            const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
            let curr = res[row]
            curr.push(avg)
            if (c < canvas.width) {
                c++
            }
            if (c === canvas.width) {
                c = 0
                row += 1
            }

        }
        return res
    }     

    const getPixelColor = (x,y) => {
        const imageData = ctx.getImageData(x, y, canvas.width, canvas.height);
        const data = imageData.data;

        var red = data[0];
        var green = data[1];
        var blue = data[2];
        var alpha = data[3];

        return `${red}, ${green}, ${blue}, ${alpha}`
    }             

    const getCharByScale = (scale) => {
        const val = Math.floor(scale / 255 * (gradient.length - 1))
        return gradient[val]
    }

    const renderText = () => {
        ctxTxtVideo.clearRect(0, 0, canvasTxtVideo.width, canvasTxtVideo.height);
        const chars = getPixelsGreyScale(ctx)
        for (let i = 0; i < chars.length; i++) {
            for (let k = 0; k < chars[i].length; k++) {
                if(color) ctxTxtVideo.fillStyle = `rgba(${getPixelColor(k,i)})`
                ctxTxtVideo.fillText(getCharByScale(chars[i][k]), k*10, i*10)
            }
        }
    }

    const frame = () => requestAnimationFrame(() => {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        renderText()
        if (running)
            frame()
    })

    let running = true;
    let color = true;
    let webcam = true;
    init()
    frame()

    btnSwitchWebcam.addEventListener('click', (e) => {
        webcam = !webcam
        if(webcam){
            btnSwitchWebcam.innerHTML = '<i class="fas fa-video"></i>'
            video.removeAttribute('hidden')
        } else {
            btnSwitchWebcam.innerHTML = '<i class="fa-solid fa-video-slash"></i>'
            video.setAttribute('hidden', true)
        }    
    })
    
    btnSwitchTextVideo.addEventListener('click', (e) => {
        running = !running
        if(running){
            btnSwitchTextVideo.innerHTML = '<i class="fas fa-pause"></i>'
            frame()
        } else {
            btnSwitchTextVideo.innerHTML = '<i class="fas fa-play"></i>'
        }
    })

    btnSwitchColor.addEventListener('click', (e) => {
        color = !color
        if(color){
            btnSwitchColor.innerHTML = '<i class="fas fa-tint"></i>'
        } else {
            btnSwitchColor.innerHTML = '<i class="fas fa-tint-slash"></i>'
            ctxTxtVideo.fillStyle = "white"
        }            
    })

    btnSwitchPaleta.addEventListener('click', (e) => {
        const chaves = Object.keys(ASCII_PALETTES);
        let index = chaves.indexOf(optionGradient)
        index = index < (chaves.length-1)? index+1 : 0
        optionGradient = chaves[index]
        gradient = ASCII_PALETTES[optionGradient].split('').reverse().join('');        
    })
})()

