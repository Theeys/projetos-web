export class PlataformUtil {
    static isMobileDevice() {
        return /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
        )
    }

    static isIOSDevice() {
        return /iPhone|iPad|iPod/i.test(navigator.userAgent)
    }
}
