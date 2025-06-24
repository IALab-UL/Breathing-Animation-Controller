/**
 * Módulo de control de respiración - Editable e independiente
 */
class BreathingController {
    constructor(config = {}) {
        // Configuración por defecto
        this.config = {
            container: config.container || 'lottie',
            animationPath: config.animationPath || 'respiracion.json',
            inhaleInput: config.inhaleInput || 'inhaleInput',
            exhaleInput: config.exhaleInput || 'exhaleInput',
            defaultInhaleDuration: config.defaultInhaleDuration || 2.63,
            defaultExhaleDuration: config.defaultExhaleDuration || 2.37,
            renderer: config.renderer || 'svg',
            autoStart: config.autoStart !== false
        };

        this.animation = null;
        this.segments = {};
        this.currentPhase = 'exhale';
        this.isRunning = false;
        this.frameRate = 30;

        // Sistema de configuración automática basado en indicadores biométricos
        this.biometricConfig = this.initializeBiometricConfig();
        this.currentBiometrics = {
            rh: 2,      // Ritmo Cardíaco (1-3)
            ibi: 2,     // Intervalo Entre Latidos (1-3)
            hrv: 2,     // Variabilidad del Ritmo Cardíaco (1-3)
            stress: 3   // Estrés (1-5)
        };

        if (this.config.autoStart) {
            this.init();
        }
    }

    async init() {
        try {
            const response = await fetch(this.config.animationPath);
            const animationData = await response.json();

            this.frameRate = animationData.fr || 30;
            this.extractSegments(animationData);
            this.setupAnimation(animationData);
            this.setupControls();

            if (this.config.autoStart) {
                this.start();
            }
        } catch (error) {
            console.error('Error inicializando módulo de respiración:', error);
        }
    }

    extractSegments(data) {
        const inhaleLayer = data.layers.find(l => l.nm === 'Breathe in');
        const exhaleLayer = data.layers.find(l => l.nm === 'Breathe out');

        if (!inhaleLayer || !exhaleLayer) {
            throw new Error('No se encontraron las capas de respiración en la animación');
        }

        this.segments = {
            inhale: [inhaleLayer.ip, inhaleLayer.op],
            exhale: [exhaleLayer.ip, exhaleLayer.op]
        };
    }

    setupAnimation(animationData) {
        const container = document.getElementById(this.config.container);

        if (!container) {
            throw new Error(`Contenedor '${this.config.container}' no encontrado`);
        }

        this.animation = lottie.loadAnimation({
            container: container,
            renderer: this.config.renderer,
            loop: false,
            autoplay: false,
            animationData: animationData
        });

        this.animation.addEventListener('complete', () => {
            this.onPhaseComplete();
        });
    }

    setupControls() {
        const inhaleInput = document.getElementById(this.config.inhaleInput);
        const exhaleInput = document.getElementById(this.config.exhaleInput);

        if (inhaleInput) {
            inhaleInput.value = this.config.defaultInhaleDuration;
            inhaleInput.addEventListener('change', () => this.updateTiming());
        }

        if (exhaleInput) {
            exhaleInput.value = this.config.defaultExhaleDuration;
            exhaleInput.addEventListener('change', () => this.updateTiming());
        }
    }

    playPhase(phase) {
        if (!this.animation || !this.segments[phase]) {
            return;
        }

        const duration = this.getPhaseDuration(phase);
        const segment = this.segments[phase];
        const frames = segment[1] - segment[0];
        const speed = frames / (duration * this.frameRate);

        this.animation.setSpeed(speed);
        this.animation.playSegments(segment, true);

        this.currentPhase = phase;
    }

    getPhaseDuration(phase) {
        const inhaleInput = document.getElementById(this.config.inhaleInput);
        const exhaleInput = document.getElementById(this.config.exhaleInput);

        if (phase === 'inhale') {
            return inhaleInput
                ? parseFloat(inhaleInput.value)
                : this.config.defaultInhaleDuration;
        } else {
            return exhaleInput
                ? parseFloat(exhaleInput.value)
                : this.config.defaultExhaleDuration;
        }
    }

    onPhaseComplete() {
        if (!this.isRunning) {
            return;
        }

        const nextPhase = this.currentPhase === 'inhale' ? 'exhale' : 'inhale';
        this.playPhase(nextPhase);
    }

    updateTiming() {
        // Método para actualizar los tiempos en tiempo real si es necesario
        console.log('Tiempos actualizados');
    }

    start() {
        this.isRunning = true;
        this.playPhase('inhale');
    }

    stop() {
        this.isRunning = false;

        if (this.animation) {
            this.animation.stop();
        }
    }

    pause() {
        if (this.animation) {
            this.animation.pause();
        }
    }

    resume() {
        if (this.animation) {
            this.animation.play();
        }
    }

    destroy() {
        this.stop();

        if (this.animation) {
            this.animation.destroy();
        }
    }

    // Métodos públicos para configuración dinámica
    setInhaleDuration(seconds) {
        const input = document.getElementById(this.config.inhaleInput);

        if (input) {
            input.value = seconds;
        }
    }

    setExhaleDuration(seconds) {
        const input = document.getElementById(this.config.exhaleInput);

        if (input) {
            input.value = seconds;
        }
    }

    /**
     * Inicializa la configuración automática basada en indicadores biométricos
     * RH: 1=Bajo, 2=Normal, 3=Alto
     * IBI: 1=Corto, 2=Normal, 3=Largo
     * HRV: 1=Baja, 2=Normal, 3=Alta
     * Estrés: 1=Muy Bajo, 2=Bajo, 3=Normal, 4=Alto, 5=Muy Alto
     */
    initializeBiometricConfig() {
        const config = {};
        
        // Recorremos todas las combinaciones posibles (3×3×3×5 = 135)
        for (let rh = 1; rh <= 3; rh++) {
            for (let ibi = 1; ibi <= 3; ibi++) {
                for (let hrv = 1; hrv <= 3; hrv++) {
                    for (let stress = 1; stress <= 5; stress++) {
                        const key = `${rh}-${ibi}-${hrv}-${stress}`;
                        config[key] = this.calculateBreathingPattern(rh, ibi, hrv, stress);
                    }
                }
            }
        }
        
        return config;
    }

    /**
     * Calcula el patrón de respiración óptimo basado en los indicadores
     */
    calculateBreathingPattern(rh, ibi, hrv, stress) {
        // Algoritmo de cálculo basado en principios de respiración terapéutica
        let inhale = 4.0; // Base de inhalación
        let exhale = 4.0; // Base de exhalación
        
        // Ajuste basado en Ritmo Cardíaco
        switch (rh) {
            case 1: // Bajo - necesita activación
                inhale += 0.5;
                exhale -= 0.3;
                break;
            case 2: // Normal - mantener equilibrio
                // Sin cambios
                break;
            case 3: // Alto - necesita calma
                inhale -= 0.3;
                exhale += 0.8;
                break;
        }
        
        // Ajuste basado en IBI (Intervalo Entre Latidos)
        switch (ibi) {
            case 1: // Corto - ritmo acelerado
                inhale -= 0.2;
                exhale += 0.5;
                break;
            case 2: // Normal
                // Sin cambios
                break;
            case 3: // Largo - ritmo lento
                inhale += 0.3;
                exhale -= 0.2;
                break;
        }
        
        // Ajuste basado en HRV (Variabilidad del Ritmo Cardíaco)
        switch (hrv) {
            case 1: // Baja - necesita regulación
                const ratio = Math.random() > 0.5 ? 1.2 : 0.8;
                inhale *= ratio;
                exhale *= (2 - ratio);
                break;
            case 2: // Normal
                // Sin cambios
                break;
            case 3: // Alta - mantener variabilidad
                inhale += 0.2;
                exhale += 0.2;
                break;
        }
        
        // Ajuste basado en Nivel de Estrés (factor más importante)
        switch (stress) {
            case 1: // Muy Bajo - respiración energizante
                inhale += 0.3;
                exhale -= 0.5;
                break;
            case 2: // Bajo - respiración ligeramente activadora
                inhale += 0.1;
                exhale -= 0.2;
                break;
            case 3: // Normal - respiración equilibrada
                // Sin cambios
                break;
            case 4: // Alto - respiración calmante
                inhale -= 0.5;
                exhale += 1.0;
                break;
            case 5: // Muy Alto - respiración muy calmante
                inhale -= 0.8;
                exhale += 1.5;
                break;
        }
        
        // Asegurar valores mínimos y máximos seguros
        inhale = Math.max(1.5, Math.min(8.0, inhale));
        exhale = Math.max(1.5, Math.min(10.0, exhale));
        
        // Redondear a un decimal
        return {
            inhale: Math.round(inhale * 10) / 10,
            exhale: Math.round(exhale * 10) / 10,
            description: this.getPatternDescription(rh, ibi, hrv, stress)
        };
    }

    /**
     * Genera descripción del patrón de respiración
     */
    getPatternDescription(rh, ibi, hrv, stress) {
        const rhLabels = ['', 'Bajo', 'Normal', 'Alto'];
        const ibiLabels = ['', 'Corto', 'Normal', 'Largo'];
        const hrvLabels = ['', 'Baja', 'Normal', 'Alta'];
        const stressLabels = ['', 'Muy Bajo', 'Bajo', 'Normal', 'Alto', 'Muy Alto'];
        
        return `RH:${rhLabels[rh]} | IBI:${ibiLabels[ibi]} | HRV:${hrvLabels[hrv]} | Estrés:${stressLabels[stress]}`;
    }

    /**
     * Actualiza los indicadores biométricos y reconfigura la respiración
     */
    updateBiometrics(rh, ibi, hrv, stress) {
        // Validar rangos
        if (rh < 1 || rh > 3 || ibi < 1 || ibi > 3 || hrv < 1 || hrv > 3 || stress < 1 || stress > 5) {
            console.error('Valores de indicadores fuera de rango');
            return false;
        }
        
        this.currentBiometrics = { rh, ibi, hrv, stress };
        
        // Obtener configuración automática
        const key = `${rh}-${ibi}-${hrv}-${stress}`;
        const pattern = this.biometricConfig[key];
        
        if (pattern) {
            // Aplicar nueva configuración
            this.setInhaleDuration(pattern.inhale);
            this.setExhaleDuration(pattern.exhale);
            
            console.log(`Patrón aplicado: ${pattern.description}`);
            console.log(`Inhalación: ${pattern.inhale}s | Exhalación: ${pattern.exhale}s`);
            
            // Actualizar display si existe
            this.updateBiometricDisplay(pattern);
            
            return true;
        }
        
        return false;
    }

    /**
     * Actualiza el display de información biométrica
     */
    updateBiometricDisplay(pattern) {
        const display = document.getElementById('biometricDisplay');
        if (display) {
            display.innerHTML = `
                <div class="biometric-info">
                    <p><strong>Patrón:</strong> ${pattern.description}</p>
                    <p><strong>Configuración:</strong> ${pattern.inhale}s inhalación / ${pattern.exhale}s exhalación</p>
                </div>
            `;
        }
    }

    /**
     * Obtiene todas las configuraciones disponibles (para debugging)
     */
    getAllConfigurations() {
        return this.biometricConfig;
    }

    /**
     * Obtiene la configuración actual
     */
    getCurrentConfiguration() {
        const { rh, ibi, hrv, stress } = this.currentBiometrics;
        const key = `${rh}-${ibi}-${hrv}-${stress}`;
        return this.biometricConfig[key];
    }
}

// Inicialización automática con configuración por defecto
document.addEventListener('DOMContentLoaded', () => {
    window.breathingController = new BreathingController();
});
