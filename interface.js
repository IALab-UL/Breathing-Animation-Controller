// Función para aplicar configuración biométrica
function aplicarConfiguracionBiometrica() {
    if (!window.breathingController) return;
    
    const grupoEtario = document.getElementById('ageGroupSelect').value;
    const valorRMSSD = parseInt(document.getElementById('rmssdInput').value);
    const estres = parseInt(document.getElementById('stressSelect').value);
    
    const exito = window.breathingController.updateBiometrics(grupoEtario, valorRMSSD, estres);
    
    if (exito) {
        console.log('Configuración clínica aplicada exitosamente');
    } else {
        console.error('Error al aplicar configuración clínica');
    }
}

// Función para generar configuración aleatoria
function generarBiometricosAleatorios() {
    const gruposEtarios = ['child', 'young_adult', 'older_adult'];
    const grupoEtario = gruposEtarios[Math.floor(Math.random() * gruposEtarios.length)];
    const valorRMSSD = Math.floor(Math.random() * 70) + 10; // 10-80 ms
    const estres = Math.floor(Math.random() * 5) + 1; // 1-5
    
    // Actualizar controles
    document.getElementById('ageGroupSelect').value = grupoEtario;
    document.getElementById('rmssdInput').value = valorRMSSD;
    document.getElementById('stressSelect').value = estres;
    
    // Aplicar configuración
    aplicarConfiguracionBiometrica();
}

// Configurar controles biométricos
document.addEventListener('DOMContentLoaded', () => {
    const botonAleatorio = document.getElementById('randomBiometricBtn');
    
    // Controles biométricos
    botonAleatorio?.addEventListener('click', generarBiometricosAleatorios);
    
    // Listeners para cambios automáticos en los controles
    const controlesBiometricos = ['ageGroupSelect', 'rmssdInput', 'stressSelect'];
    controlesBiometricos.forEach(controlId => {
        const control = document.getElementById(controlId);
        if (control) {
            const tipoEvento = control.tagName === 'INPUT' ? 'input' : 'change';
            control.addEventListener(tipoEvento, () => {
                // Aplicar automáticamente cuando cambie cualquier control
                setTimeout(aplicarConfiguracionBiometrica, 100);
            });
        }
    });
    
    // Aplicar configuración inicial después de que se cargue el controlador
    setTimeout(() => {
        if (window.breathingController) {
            aplicarConfiguracionBiometrica();
        }
    }, 1000);
});
