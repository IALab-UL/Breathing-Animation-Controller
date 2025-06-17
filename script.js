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
}

// Inicialización automática con configuración por defecto
document.addEventListener('DOMContentLoaded', () => {
    window.breathingController = new BreathingController();
});
