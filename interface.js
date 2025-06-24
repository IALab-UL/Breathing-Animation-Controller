// Función para aplicar configuración biométrica
function applyBiometricConfiguration() {
    if (!window.breathingController) return;
    
    const rh = parseInt(document.getElementById('rhSelect').value);
    const ibi = parseInt(document.getElementById('ibiSelect').value);
    const hrv = parseInt(document.getElementById('hrvSelect').value);
    const stress = parseInt(document.getElementById('stressSelect').value);
    
    const success = window.breathingController.updateBiometrics(rh, ibi, hrv, stress);
    
    if (success) {
        console.log('Configuración biométrica aplicada exitosamente');
    } else {
        console.error('Error al aplicar configuración biométrica');
    }
}

// Función para generar configuración aleatoria
function generateRandomBiometrics() {
    const rh = Math.floor(Math.random() * 3) + 1;     // 1-3
    const ibi = Math.floor(Math.random() * 3) + 1;    // 1-3
    const hrv = Math.floor(Math.random() * 3) + 1;    // 1-3
    const stress = Math.floor(Math.random() * 5) + 1; // 1-5
    
    // Actualizar selects
    document.getElementById('rhSelect').value = rh;
    document.getElementById('ibiSelect').value = ibi;
    document.getElementById('hrvSelect').value = hrv;
    document.getElementById('stressSelect').value = stress;
    
    // Aplicar configuración
    applyBiometricConfiguration();
}

// Configurar botones de control
document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('startBtn');
    const stopBtn = document.getElementById('stopBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const resumeBtn = document.getElementById('resumeBtn');
    const randomBiometricBtn = document.getElementById('randomBiometricBtn');
    
    // Controles básicos
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
    
    // Controles biométricos
    randomBiometricBtn?.addEventListener('click', generateRandomBiometrics);
    
    // Listeners para cambios automáticos en los selects
    const biometricSelects = ['rhSelect', 'ibiSelect', 'hrvSelect', 'stressSelect'];
    biometricSelects.forEach(selectId => {
        const select = document.getElementById(selectId);
        if (select) {
            select.addEventListener('change', () => {
                // Aplicar automáticamente cuando cambie cualquier selector
                setTimeout(applyBiometricConfiguration, 100);
            });
        }
    });
    
    // Aplicar configuración inicial después de que se cargue el controlador
    setTimeout(() => {
        if (window.breathingController) {
            applyBiometricConfiguration();
        }
    }, 1000);
});
