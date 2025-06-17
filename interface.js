// Funciones auxiliares para demostrar la flexibilidad del módulo
function setPreset(inhale, exhale) {
    if (window.breathingController) {
        window.breathingController.setInhaleDuration(inhale);
        window.breathingController.setExhaleDuration(exhale);
    }
}

// Configurar botones de control
document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('startBtn');
    const stopBtn = document.getElementById('stopBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const resumeBtn = document.getElementById('resumeBtn');
    
    startBtn?.addEventListener('click', () => {
        if (window.breathingController) {
            window.breathingController.start();
        }
    });
    
    stopBtn?.addEventListener('click', () => {
        if (window.breathingController) {
            window.breathingController.stop();
        }
    });
    
    pauseBtn?.addEventListener('click', () => {
        if (window.breathingController) {
            window.breathingController.pause();
        }
    });
    
    resumeBtn?.addEventListener('click', () => {
        if (window.breathingController) {
            window.breathingController.resume();
        }
    });
});
