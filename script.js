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
        this.currentBiometrics = {
            grupoEtario: 'adultos_jovenes',  // ninos, adultos_jovenes, adultos_mayores
            valorRMSSD: 35,                  // Valor real de RMSSD en ms
            estres: 3                        // Estrés (1-5: Muy Bajo, Bajo, Normal, Alto, Muy Alto)
        };

        // Definir umbrales de RMSSD por grupo etario según especificaciones clínicas
        this.umbralesRMSSD = {
            ninos: {
                critico: 25,     // < 25 ms
                tolerable: 40,   // 25-40 ms
                normal: Infinity // > 40 ms
            },
            adultos_jovenes: {
                critico: 30,     // < 30 ms
                tolerable: 50,   // 30-50 ms  
                normal: Infinity // > 50 ms
            },
            adultos_mayores: {
                critico: 15,     // < 15 ms
                tolerable: 30,   // 15-30 ms
                normal: Infinity // > 30 ms
            }
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
     * Determina la categoría de RMSSD basada en el grupo etario y valor específico
     */
    obtenerCategoriaRMSSD(valorRMSSD, grupoEtario) {
        const umbrales = this.umbralesRMSSD[grupoEtario];
        
        if (valorRMSSD < umbrales.critico) {
            return 'critico';
        } else if (valorRMSSD < umbrales.tolerable) {
            return 'tolerable';
        } else {
            return 'normal';
        }
    }

    /**
     * Calcula el patrón de respiración óptimo basado en los indicadores
     * Implementa el protocolo clínico específico por grupo etario
     */
    calcularPatronRespiracion(grupoEtario, valorRMSSD, estres) {
        const categoriaRMSSD = this.obtenerCategoriaRMSSD(valorRMSSD, grupoEtario);
        
        // Variables de resultado
        let inhalar = 4.0;
        let exhalar = 4.0;
        let debeActivar = false;
        let accion = 'monitorear';
        let descripcion = '';

        // Obtener etiquetas de umbrales para el grupo etario
        const umbrales = this.umbralesRMSSD[grupoEtario];
        const etiquetasEdad = {
            ninos: 'Niños (6-12 años)',
            adultos_jovenes: 'Adultos Jóvenes (18-40 años)',
            adultos_mayores: 'Adultos Mayores (>60 años)'
        };

        switch (estres) {
            case 5: // Estrés muy alto
                if (categoriaRMSSD === 'critico') {
                    // ACTIVAR PROTOCOLO - Crisis simpática
                    debeActivar = true;
                    accion = 'activar_protocolo';
                    inhalar = 4.0;
                    exhalar = 6.0;
                    descripcion = `Crisis autonómica: Sistema simpático hiperactivado con disfunción parasimpática severa`;
                } else if (categoriaRMSSD === 'tolerable') {
                    // ACTIVAR PROTOCOLO - Prevenir colapso
                    debeActivar = true;
                    accion = 'activar_protocolo';
                    inhalar = 4.0;
                    exhalar = 6.0;
                    descripcion = `Intervención preventiva: Reserva vagal limitada bajo estrés extremo, riesgo de colapso`;
                } else {
                    // ESPERAR Y REEVALUAR - Perfil resiliente
                    debeActivar = false;
                    accion = 'esperar_reevaluar';
                    inhalar = 4.0;
                    exhalar = 4.0;
                    descripcion = `Perfil resiliente: Variabilidad cardíaca preservada pese a estrés alto, monitorear evolución`;
                }
                break;

            case 4: // Estrés alto
                if (categoriaRMSSD === 'critico') {
                    // ACTIVAR PROTOCOLO - Disfunción vagal
                    debeActivar = true;
                    accion = 'activar_protocolo';
                    inhalar = 4.0;
                    exhalar = 6.0;
                    descripcion = `Desregulación autonómica: Actividad vagal insuficiente para contrarrestar el estrés`;
                } else if (categoriaRMSSD === 'tolerable') {
                    // ACTIVAR PROTOCOLO - Proteger reserva
                    debeActivar = true;
                    accion = 'activar_protocolo';
                    inhalar = 4.0;
                    exhalar = 6.0;
                    descripcion = `Protección parasimpática: Fortalecer reserva vagal antes de deterioro crítico`;
                } else {
                    // MONITOREAR - Capacidad de afrontamiento
                    debeActivar = false;
                    accion = 'monitorear';
                    inhalar = 4.0;
                    exhalar = 4.0;
                    descripcion = `Afrontamiento competente: Sistema nervioso autónomo gestionando adecuadamente el estrés`;
                }
                break;

            case 3: // Estrés neutro
                if (categoriaRMSSD === 'critico') {
                    // ACTIVAR PROTOCOLO - Disfunción autonómica
                    debeActivar = true;
                    accion = 'activar_protocolo';
                    inhalar = 4.0;
                    exhalar = 6.0;
                    descripcion = `Disfunción autonómica latente: Variabilidad cardíaca comprometida sin estrés aparente`;
                } else if (categoriaRMSSD === 'tolerable') {
                    // ESPERAR Y REEVALUAR
                    debeActivar = false;
                    accion = 'esperar_reevaluar';
                    inhalar = 4.0;
                    exhalar = 4.0;
                    descripcion = `Estado de transición: Función autonómica intermedia, evaluar tendencia`;
                } else {
                    // NO ACTIVAR - Equilibrio
                    debeActivar = false;
                    accion = 'no_activar';
                    inhalar = 4.0;
                    exhalar = 4.0;
                    descripcion = `Homeostasis óptima: Balance perfecto entre percepción y función autonómica`;
                }
                break;

            case 2: // Estrés bajo
                if (categoriaRMSSD === 'critico') {
                    // CONTINUAR PROTOCOLO - Recuperación incompleta
                    debeActivar = true;
                    accion = 'continuar_protocolo';
                    inhalar = 4.0;
                    exhalar = 6.0;
                    descripcion = `Recuperación incompleta: Persiste disfunción vagal pese a reducción del estrés`;
                } else if (categoriaRMSSD === 'tolerable') {
                    // MONITOREAR - Vigilar recuperación
                    debeActivar = false;
                    accion = 'monitorear';
                    inhalar = 4.0;
                    exhalar = 4.0;
                    descripcion = `Proceso de recuperación: Función autonómica estabilizándose progresivamente`;
                } else {
                    // NO ACTIVAR - Homeostasis óptima
                    debeActivar = false;
                    accion = 'no_activar';
                    inhalar = 4.0;
                    exhalar = 4.0;
                    descripcion = `Recuperación exitosa: Sistema nervioso autónomo en estado fisiológico saludable`;
                }
                break;

            case 1: // Máxima relajación
                if (categoriaRMSSD === 'critico') {
                    // MONITOREAR - Posibles artefactos, no activar
                    debeActivar = false;
                    accion = 'monitorear';
                    inhalar = 4.0;
                    exhalar = 4.0;
                    descripcion = `Inconsistencia biométrica: Percepción relajada con disfunción autonómica subyacente`;
                } else {
                    // NO ACTIVAR - Perfil saludable
                    debeActivar = false;
                    accion = 'no_activar';
                    inhalar = 4.0;
                    exhalar = 4.0;
                    descripcion = `Estado óptimo de bienestar: Concordancia perfecta entre percepción y función autonómica`;
                }
                break;
        }

        return {
            inhalar: Math.round(inhalar * 10) / 10,
            exhalar: Math.round(exhalar * 10) / 10,
            descripcion: descripcion,
            debeActivar: debeActivar,
            accion: accion,
            grupoEtario: grupoEtario,
            valorRMSSD: valorRMSSD,
            categoriaRMSSD: categoriaRMSSD,
            umbrales: umbrales
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
    actualizarBiometricos(grupoEtario, valorRMSSD, estres) {
        // Validar rangos
        if (!this.umbralesRMSSD[grupoEtario]) {
            console.error('Grupo etario no válido');
            return false;
        }
        
        if (valorRMSSD < 5 || valorRMSSD > 100 || estres < 1 || estres > 5) {
            console.error('Valores de indicadores fuera de rango');
            return false;
        }
        
        this.currentBiometrics = { grupoEtario, valorRMSSD, estres };
        
        // Obtener configuración automática
        const patron = this.calcularPatronRespiracion(grupoEtario, valorRMSSD, estres);
        
        if (patron) {
            // Aplicar nueva configuración
            this.setInhaleDuration(patron.inhalar);
            this.setExhaleDuration(patron.exhalar);
            
            console.log(`Patrón aplicado: ${patron.descripcion}`);
            console.log(`Inhalación: ${patron.inhalar}s | Exhalación: ${patron.exhalar}s`);
            
            // Actualizar display si existe
            this.actualizarDisplayBiometrico(patron);
            
            return true;
        }
        
        return false;
    }

    /**
     * Actualiza el display de información biométrica
     */
    actualizarDisplayBiometrico(patron) {
        const display = document.getElementById('biometricDisplay');
        if (display) {
            const coloresAccion = {
                'activar_protocolo': '#dc3545',    // Rojo - Activar protocolo
                'continuar_protocolo': '#fd7e14',  // Naranja - Continuar protocolo  
                'esperar_reevaluar': '#6f42c1',    // Púrpura - Esperar y reevaluar
                'monitorear': '#17a2b8',           // Azul - Monitorear
                'no_activar': '#28a745'            // Verde - No activar
            };

            const colorAccion = coloresAccion[patron.accion] || '#6c757d';

            // Crear descripción de umbrales para el grupo actual
            const textoUmbrales = `Crítico: <${patron.umbrales.critico}ms | Tolerable: ${patron.umbrales.critico}-${patron.umbrales.tolerable}ms | Normal: >${patron.umbrales.tolerable}ms`;
            
            // Obtener etiqueta del grupo etario
            const etiquetasEdad = {
                ninos: 'Niños (6-12 años)',
                adultos_jovenes: 'Adultos Jóvenes (18-40 años)',
                adultos_mayores: 'Adultos Mayores (>60 años)'
            };

            display.innerHTML = `
                <div class="biometric-info">
                    <div class="clinical-header" style="border-left: 4px solid ${colorAccion}; padding-left: 10px; margin-bottom: 10px;">
                        <p style="margin: 0; font-weight: bold; color: ${colorAccion};">${patron.descripcion}</p>
                    </div>
                    <div class="biometric-details">
                        <p><strong>Grupo Etario:</strong> ${etiquetasEdad[patron.grupoEtario]}</p>
                        <p><strong>RMSSD:</strong> ${patron.valorRMSSD}ms (${patron.categoriaRMSSD})</p>
                        <p><strong>Umbrales:</strong> ${textoUmbrales}</p>
                        <p><strong>Protocolo:</strong> ${patron.inhalar}s inhalación / ${patron.exhalar}s exhalación</p>
                        <p><strong>Acción:</strong> ${this.obtenerEtiquetaAccion(patron.accion)}</p>
                    </div>
                </div>
            `;
        }
    }

    /**
     * Obtiene etiqueta legible para la acción
     */
    obtenerEtiquetaAccion(accion) {
        const etiquetas = {
            'activar_protocolo': '🔴 Activar protocolo inmediatamente',
            'continuar_protocolo': '🟠 Continuar protocolo hasta recuperación',
            'esperar_reevaluar': '🟣 Esperar y reevaluar en 3 minutos',
            'monitorear': '🔵 Monitorear (aumentar frecuencia chequeo)',
            'no_activar': '🟢 No activar (estado óptimo)'
        };
        return etiquetas[accion] || 'Acción no definida';
    }

    /**
     * Método de compatibilidad para la interfaz (mantiene nombres en inglés en HTML)
     */
    updateBiometrics(ageGroup, rmssdValue, stress) {
        // Mapear valores de interfaz a nombres internos en español
        const mapeoGrupos = {
            'child': 'ninos',
            'young_adult': 'adultos_jovenes', 
            'older_adult': 'adultos_mayores'
        };
        
        const grupoEtarioEspanol = mapeoGrupos[ageGroup];
        return this.actualizarBiometricos(grupoEtarioEspanol, rmssdValue, stress);
    }

    /**
     * Obtiene la configuración actual
     */
    obtenerConfiguracionActual() {
        const { grupoEtario, valorRMSSD, estres } = this.currentBiometrics;
        return this.calcularPatronRespiracion(grupoEtario, valorRMSSD, estres);
    }
}

// Inicialización automática con configuración por defecto
document.addEventListener('DOMContentLoaded', () => {
    window.breathingController = new BreathingController();
});
