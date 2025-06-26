/**
 * Módulo de control de respiración - Editable e independiente
 */
class BreathingController {
    constructor(config = {}) {
        // Configuración por defecto
        this.config = {
            container: config.container || 'lottie',
            animationPath: config.animationPath || 'respiracion.json',
            defaultInhaleDuration: config.defaultInhaleDuration || 4.0,
            defaultExhaleDuration: config.defaultExhaleDuration || 4.0,
            renderer: config.renderer || 'svg',
            autoStart: config.autoStart !== false
        };

        // Duraciones internas controladas por el sistema biométrico
        this.currentInhaleDuration = this.config.defaultInhaleDuration;
        this.currentExhaleDuration = this.config.defaultExhaleDuration;

        this.animation = null;
        this.segments = {};
        this.currentPhase = 'exhale';
        this.isRunning = false;
        this.frameRate = 30;

        // Sistema de configuración automática basado en indicadores biométricos
        this.biometricConfig = this.initializeBiometricConfig();
        this.currentBiometrics = {
            rmssd: 2,   // RMSSD (1-3: Bajo, Normal, Alto)
            stress: 3   // Estrés (1-5: Muy Bajo, Bajo, Normal, Alto, Muy Alto)
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
        // Ya no hay controles HTML - el sistema es completamente automático
        // Los valores se controlan internamente via updateBiometrics()
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
        // Usar valores internos en lugar de inputs HTML
        if (phase === 'inhale') {
            return this.currentInhaleDuration;
        } else {
            return this.currentExhaleDuration;
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
        this.currentInhaleDuration = parseFloat(seconds);
    }

    setExhaleDuration(seconds) {
        this.currentExhaleDuration = parseFloat(seconds);
    }

    /**
     * Inicializa la configuración automática basada en indicadores biométricos
     * RMSSD: 1=Bajo, 2=Normal, 3=Alto
     * Estrés: 1=Muy Bajo, 2=Bajo, 3=Normal, 4=Alto, 5=Muy Alto
     */
    initializeBiometricConfig() {
        const config = {};
        
        // Recorremos todas las combinaciones posibles (3×5 = 15)
        for (let rmssd = 1; rmssd <= 3; rmssd++) {
            for (let stress = 1; stress <= 5; stress++) {
                const key = `${rmssd}-${stress}`;
                config[key] = this.calculateBreathingPattern(rmssd, stress);
            }
        }
        
        return config;
    }

    /**
     * Calcula el patrón de respiración óptimo basado en los indicadores
     * Basado en protocolos clínicos para estrés y RMSSD
     * 
     * 📌 Notas clave sobre las acciones del protocolo:
     * - Activar protocolo: El avatar inicia respiración guiada (4-6 segundos) por 3 minutos
     * - Continuar protocolo: Se repite el bloque de respiración porque la recuperación aún no es completa
     * - No activar: No se hace nada en esta revisión
     * - Esperar y reevaluar: Se vuelve a revisar en 3 minutos antes de intervenir
     * - Monitorear: No se activa protocolo, pero el sistema puede aumentar frecuencia de chequeo
     */
    calculateBreathingPattern(rmssd, stress) {
        // Clasificación RMSSD según literatura clínica
        const getRMSSDCategory = (rmssd) => {
            if (rmssd === 1) return 'critical'; // < 30 ms
            if (rmssd === 2) return 'tolerable'; // 30-50 ms  
            return 'normal'; // > 50 ms
        };

        const rmssdCategory = getRMSSDCategory(rmssd);
        
        // Variables de resultado
        let inhale = 4.0;
        let exhale = 4.0;
        let shouldActivate = false;
        let action = 'monitor';
        let description = '';

        switch (stress) {
            case 5: // Estrés muy alto
                if (rmssdCategory === 'critical') {
                    // ACTIVAR PROTOCOLO - Crisis simpática
                    shouldActivate = true;
                    action = 'activate_protocol';
                    inhale = 4.0;
                    exhale = 6.0;
                    description = 'CRÍTICO: Estrés muy alto + RMSSD crítico - Activar protocolo respiración 3 min';
                } else if (rmssdCategory === 'tolerable') {
                    // ACTIVAR PROTOCOLO - Prevenir colapso
                    shouldActivate = true;
                    action = 'activate_protocol';
                    inhale = 4.5;
                    exhale = 5.5;
                    description = 'PREVENTIVO: Estrés muy alto + RMSSD tolerable - Activar protocolo respiración 3 min';
                } else {
                    // ESPERAR Y REEVALUAR - Perfil resiliente
                    shouldActivate = false;
                    action = 'wait_reevaluate';
                    inhale = 4.0;
                    exhale = 4.0;
                    description = 'ESPERAR: Estrés muy alto + RMSSD normal - Reevaluar en 3 min';
                }
                break;

            case 4: // Estrés alto
                if (rmssdCategory === 'critical') {
                    // ACTIVAR PROTOCOLO - Disfunción vagal
                    shouldActivate = true;
                    action = 'activate_protocol';
                    inhale = 4.0;
                    exhale = 6.0;
                    description = 'ACTIVAR: Estrés alto + RMSSD crítico - Activar protocolo respiración 3 min';
                } else if (rmssdCategory === 'tolerable') {
                    // ACTIVAR PROTOCOLO - Proteger reserva
                    shouldActivate = true;
                    action = 'activate_protocol';
                    inhale = 4.5;
                    exhale = 5.0;
                    description = 'PREVENTIVO: Estrés alto + RMSSD tolerable - Activar protocolo respiración 3 min';
                } else {
                    // MONITOREAR - Capacidad de afrontamiento
                    shouldActivate = false;
                    action = 'monitor';
                    inhale = 4.0;
                    exhale = 4.0;
                    description = 'MONITOREAR: Estrés alto + RMSSD normal - Aumentar frecuencia chequeo';
                }
                break;

            case 3: // Estrés neutro
                if (rmssdCategory === 'critical') {
                    // ACTIVAR PROTOCOLO - Disfunción autonómica
                    shouldActivate = true;
                    action = 'activate_protocol';
                    inhale = 4.5;
                    exhale = 5.5;
                    description = 'ACTIVAR: Estrés neutro + RMSSD crítico - Activar protocolo respiración 3 min';
                } else if (rmssdCategory === 'tolerable') {
                    // ESPERAR Y REEVALUAR
                    shouldActivate = false;
                    action = 'wait_reevaluate';
                    inhale = 4.0;
                    exhale = 4.0;
                    description = 'ESPERAR: Estrés neutro + RMSSD tolerable - Reevaluar en 3 min';
                } else {
                    // NO ACTIVAR - Equilibrio
                    shouldActivate = false;
                    action = 'no_action';
                    inhale = 4.0;
                    exhale = 4.0;
                    description = 'EQUILIBRIO: Estrés neutro + RMSSD normal - No hacer nada';
                }
                break;

            case 2: // Estrés bajo
                if (rmssdCategory === 'critical') {
                    // CONTINUAR PROTOCOLO - Recuperación incompleta
                    shouldActivate = true;
                    action = 'continue_protocol';
                    inhale = 4.5;
                    exhale = 5.0;
                    description = 'CONTINUAR: Estrés bajo + RMSSD crítico - Repetir bloque respiración';
                } else if (rmssdCategory === 'tolerable') {
                    // MONITOREAR - Vigilar recuperación
                    shouldActivate = false;
                    action = 'monitor';
                    inhale = 4.0;
                    exhale = 4.0;
                    description = 'MONITOREAR: Estrés bajo + RMSSD tolerable - Aumentar frecuencia chequeo';
                } else {
                    // NO ACTIVAR - Homeostasis óptima
                    shouldActivate = false;
                    action = 'no_action';
                    inhale = 4.0;
                    exhale = 4.0;
                    description = 'ÓPTIMO: Estrés bajo + RMSSD normal - No hacer nada';
                }
                break;

            case 1: // Máxima relajación
                if (rmssdCategory === 'critical') {
                    // MONITOREAR - Posibles artefactos, no activar
                    shouldActivate = false;
                    action = 'monitor';
                    inhale = 4.0;
                    exhale = 4.0;
                    description = 'VERIFICAR: Máxima relajación + RMSSD crítico - Monitorear artefactos';
                } else {
                    // NO ACTIVAR - Perfil saludable
                    shouldActivate = false;
                    action = 'no_action';
                    inhale = 4.0;
                    exhale = 4.0;
                    description = 'SALUDABLE: Máxima relajación + RMSSD bueno - No hacer nada';
                }
                break;
        }

        // Asegurar que los valores de activación respeten el rango 4-6 segundos
        if (shouldActivate) {
            inhale = Math.max(4.0, Math.min(6.0, inhale));
            exhale = Math.max(4.0, Math.min(6.0, exhale));
        }

        return {
            inhale: Math.round(inhale * 10) / 10,
            exhale: Math.round(exhale * 10) / 10,
            description: description,
            shouldActivate: shouldActivate,
            action: action
        };
    }

    /**
     * Genera descripción del patrón de respiración
     */
    getPatternDescription(rmssd, stress) {
        const rmssdLabels = ['', 'Crítico (<30ms)', 'Tolerable (30-50ms)', 'Normal (>50ms)'];
        const stressLabels = ['', 'Máxima Relajación', 'Bajo', 'Neutro', 'Alto', 'Muy Alto'];
        
        return `RMSSD: ${rmssdLabels[rmssd]} | Estrés: ${stressLabels[stress]}`;
    }

    /**
     * Actualiza los indicadores biométricos y reconfigura la respiración
     */
    updateBiometrics(rmssd, stress) {
        // Validar rangos
        if (rmssd < 1 || rmssd > 3 || stress < 1 || stress > 5) {
            console.error('Valores de indicadores fuera de rango');
            return false;
        }
        
        this.currentBiometrics = { rmssd, stress };
        
        // Obtener configuración automática
        const key = `${rmssd}-${stress}`;
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
            const actionColors = {
                'activate_protocol': '#dc3545',    // Rojo - Activar protocolo
                'continue_protocol': '#fd7e14',    // Naranja - Continuar protocolo  
                'wait_reevaluate': '#6f42c1',      // Púrpura - Esperar y reevaluar
                'monitor': '#17a2b8',              // Azul - Monitorear
                'no_action': '#28a745'             // Verde - No activar
            };

            const actionColor = actionColors[pattern.action] || '#6c757d';

            display.innerHTML = `
                <div class="biometric-info">
                    <div class="clinical-header" style="border-left: 4px solid ${actionColor}; padding-left: 10px; margin-bottom: 10px;">
                        <p style="margin: 0; font-weight: bold; color: ${actionColor};">${pattern.description}</p>
                    </div>
                    <p><strong>Configuración:</strong> ${pattern.inhale}s inhalación / ${pattern.exhale}s exhalación</p>
                    <p><strong>Acción recomendada:</strong> ${pattern.shouldActivate ? 'Activar protocolo' : 'Monitorear/Esperar'}</p>
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
        const { rmssd, stress } = this.currentBiometrics;
        const key = `${rmssd}-${stress}`;
        return this.biometricConfig[key];
    }
}

// Inicialización automática con configuración por defecto
document.addEventListener('DOMContentLoaded', () => {
    window.breathingController = new BreathingController();
});
