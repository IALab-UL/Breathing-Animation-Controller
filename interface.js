// Función para aplicar configuración biométrica
function applyBiometricConfiguration() {
    if (!window.breathingController) return;
    
    const rmssd = parseInt(document.getElementById('rmssdSelect').value);
    const stress = parseInt(document.getElementById('stressSelect').value);
    
    const success = window.breathingController.updateBiometrics(rmssd, stress);
    
    if (success) {
        console.log('Configuración clínica aplicada exitosamente');
    } else {
        console.error('Error al aplicar configuración clínica');
    }
}

// Función para generar configuración aleatoria
function generateRandomBiometrics() {
    const rmssd = Math.floor(Math.random() * 3) + 1;  // 1-3
    const stress = Math.floor(Math.random() * 5) + 1; // 1-5
    
    // Actualizar selects
    document.getElementById('rmssdSelect').value = rmssd;
    document.getElementById('stressSelect').value = stress;
    
    // Aplicar configuración
    applyBiometricConfiguration();
}

// Configurar controles biométricos
document.addEventListener('DOMContentLoaded', () => {
    const randomBiometricBtn = document.getElementById('randomBiometricBtn');
    
    // Controles biométricos
    randomBiometricBtn?.addEventListener('click', generateRandomBiometrics);
    
    // Listeners para cambios automáticos en los selects
    const biometricSelects = ['rmssdSelect', 'stressSelect'];
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
