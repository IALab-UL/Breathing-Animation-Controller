# 🫁 Breathing Animation Controller

<div align="center">

![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg)
![Lottie](https://img.shields.io/badge/Lottie-Web-blue.svg)
![License](https://img.shields.io/badge/License-MIT-green.svg)
![Status](https://img.shields.io/badge/Status-Active-brightgreen.svg)

</div>

Un sistema de control de respiración automático basado en algoritmos clínicos para aplicaciones de bienestar mental. Utiliza animaciones [Lottie](https://github.com/airbnb/lottie-web) y configura patrones respiratorios según indicadores biométricos.

✨ **Sistema biométrico automático con 15 patrones clínicos específicos basados en RMSSD y nivel de estrés.**

## 📚 Tabla de contenido

- [🎯 Descripción](#-descripción)
- [📁 Archivos principales](#-archivos-principales)
- [⚡ Instalación](#-instalación)
- [🚀 Uso](#-uso)
- [⚙️ Configuración](#️-configuración)
- [🔧 API pública](#-api-pública)
- [🧬 Sistema Biométrico Clínico](#-sistema-biométrico-clínico)
- [📄 Licencia](#-licencia)

## 🎯 Descripción

Este controlador carga un JSON de Lottie con dos capas (`Breathe in` y `Breathe out`) y alterna automáticamente entre las fases de inhalación y exhalación. Los patrones respiratorios se configuran automáticamente mediante un algoritmo clínico basado en RMSSD (variabilidad cardíaca) y nivel de estrés percibido.

### ✨ Características principales

- 🔄 **Inicio automático** al cargar la página
- 🧬 **Sistema biométrico inteligente** con 15 patrones clínicos específicos
- 🎯 **Algoritmo clínico validado** basado en literatura científica
- 📊 **Configuración automática** basada en 2 indicadores (RMSSD y Estrés)
- 🎨 **Codificación visual por colores** según urgencia clínica
- 🧩 **API simple** y completamente automática

## 📁 Archivos principales

| Archivo | Descripción |
|---------|-------------|
| 📄 **index.html** | Página demo con contenedor de animación y selectores biométricos |
| 🎨 **styles.css** | Estilos modernos con gradientes y efectos visuales |
| 🎬 **respiracion.json** | Animación Lottie exportada desde After Effects |
| 🎛️ **interface.js** | Lógica de interfaz de usuario (solo controles biométricos) |
| ⚙️ **script.js** | Implementación principal del módulo `BreathingController` |

## ⚡ Instalación

### 1️⃣ Clonar el repositorio
```powershell
https://github.com/IALab-UL/Breathing-Animation-Controller.git
```

### 2️⃣ Abrir la demo
Abre `index.html` en un servidor local o directamente en el navegador.

### 3️⃣ Dependencias
Asegúrate de tener conexión a Internet para cargar la librería Lottie desde CDN:
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.10.2/lottie.min.js"></script>
```

> 💡 **Tip**: Para desarrollo local, puedes usar herramientas como [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) en VS Code.

## 🚀 Uso

En `index.html` se inicializa el controlador automáticamente al cargar la página. La estructura es:

```html
<div class="animation-container">
  <div id="lottie"></div>
</div>
<div class="biometric-controls">
  <h3>Configuración Clínica Automática</h3>
  <div class="biometric-grid">
    <div class="biometric-group">
      <label for="rmssdSelect">RMSSD (Variabilidad Cardíaca):</label>
      <select id="rmssdSelect">
        <option value="1">Crítico (&lt; 30 ms)</option>
        <option value="2" selected>Tolerable (30-50 ms)</option>
        <option value="3">Normal (&gt; 50 ms)</option>
      </select>
    </div>
    <div class="biometric-group">
      <label for="stressSelect">Nivel de Estrés Percibido:</label>
      <select id="stressSelect">
        <option value="1">Máxima Relajación</option>
        <option value="2">Bajo</option>
        <option value="3" selected>Neutro</option>
        <option value="4">Alto</option>
        <option value="5">Muy Alto</option>
      </select>
    </div>
  </div>
  <div class="biometric-actions">
    <button id="randomBiometricBtn">Configuración Aleatoria</button>
  </div>
  <div id="biometricDisplay" class="biometric-display"></div>
</div>
<!-- Scripts -->
<script src="script.js"></script>
<script src="interface.js"></script>
```

🎉 **¡La animación arranca automáticamente y se configura según los selectores biométricos!**

## ⚙️ Configuración

Puedes pasar opciones al constructor si no quieres usar los valores por defecto:

```js
const controller = new BreathingController({
  container: 'lottie',                    // 🎯 ID del div contenedor
  animationPath: 'respiracion.json',      // 🎬 Ruta del archivo Lottie
  defaultInhaleDuration: 4.0,             // ⏱️ Duración por defecto inhale (s)
  defaultExhaleDuration: 4.0,             // ⏱️ Duración por defecto exhale (s)
  renderer: 'svg',                        // 🎨 'svg' | 'canvas' | 'html'
  autoStart: true                         // 🚀 Inicia automáticamente tras init()
});
```

### 🎛️ Opciones de configuración

| Opción | Tipo | Por defecto | Descripción |
|--------|------|-------------|-------------|
| `container` | `string` | `'lottie'` | ID del contenedor donde se renderiza la animación |
| `animationPath` | `string` | `'respiracion.json'` | Ruta al archivo JSON de Lottie |
| `defaultInhaleDuration` | `number` | `4.0` | Duración inicial de inhalación en segundos |
| `defaultExhaleDuration` | `number` | `4.0` | Duración inicial de exhalación en segundos |
| `renderer` | `string` | `'svg'` | Tipo de renderizado de Lottie |
| `autoStart` | `boolean` | `true` | Si debe iniciar automáticamente |

## 🔧 API pública

### 🎮 Métodos de control

| Método | Descripción | Ejemplo |
|--------|-------------|---------|
| `start()` | ▶️ Inicia el ciclo de respiración | `controller.start()` |
| `stop()` | ⏹️ Detiene la animación y reinicia el estado | `controller.stop()` |
| `pause()` | ⏸️ Pausa la animación en el frame actual | `controller.pause()` |
| `resume()` | ⏯️ Reanuda la animación | `controller.resume()` |
| `destroy()` | 🗑️ Destruye la instancia y limpia recursos | `controller.destroy()` |

### ⚙️ Métodos de configuración

| Método | Parámetros | Descripción | Ejemplo |
|--------|------------|-------------|---------|
| `setInhaleDuration(seconds)` | `number` | 📥 Asigna duración de inhalación | `controller.setInhaleDuration(4.0)` |
| `setExhaleDuration(seconds)` | `number` | 📤 Asigna duración de exhalación | `controller.setExhaleDuration(6.0)` |
| `updateBiometrics(rmssd, stress)` | `number, number` | 🧬 Actualiza indicadores biométricos y aplica configuración automática | `controller.updateBiometrics(2, 4)` |
| `getCurrentConfiguration()` | - | 📊 Obtiene la configuración biométrica actual | `controller.getCurrentConfiguration()` |
| `getAllConfigurations()` | - | 📋 Obtiene todas las 15 configuraciones posibles | `controller.getAllConfigurations()` |

## 🧬 Sistema Biométrico Clínico

### 📊 Indicadores Biométricos

El sistema utiliza 2 indicadores para generar automáticamente **15 patrones clínicos específicos**:

| Indicador | Niveles | Descripción |
|-----------|---------|-------------|
| **RMSSD** (Variabilidad Cardíaca) | 1-3 | Crítico (<30ms), Tolerable (30-50ms), Normal (>50ms) |
| **Estrés** (Percepción Subjetiva) | 1-5 | Máxima Relajación, Bajo, Neutro, Alto, Muy Alto |

### 🎯 Algoritmo Clínico

El algoritmo implementa 5 tipos de acciones basadas en protocolos clínicos:

- **🔴 Activar protocolo**: El avatar inicia respiración guiada (4-6 segundos) por 3 minutos
- **🟠 Continuar protocolo**: Se repite el bloque de respiración porque la recuperación aún no es completa
- **🟣 Esperar y reevaluar**: Se vuelve a revisar en 3 minutos antes de intervenir
- **🔵 Monitorear**: No se activa protocolo, pero el sistema puede aumentar frecuencia de chequeo
- **🟢 No activar**: No se hace nada en esta revisión

### 🛡️ Límites de Seguridad

- **Cuando se activa el protocolo**: Duración entre 4.0s y 6.0s para ambas fases
- **Cuando no se activa**: Duración fija de 4.0s para ambas fases
- **Precisión**: Valores redondeados a 1 decimal

### 💡 Ejemplos de Patrones Clínicos

| RMSSD | Estrés | Acción | Duración | Descripción |
|-------|--------|--------|----------|-------------|
| Crítico | Muy Alto | 🔴 Activar | 4.0s / 6.0s | Crisis simpática - Activación inmediata |
| Tolerable | Alto | 🔴 Activar | 4.5s / 5.0s | Prevenir colapso - Proteger reserva |
| Normal | Muy Alto | 🟣 Esperar | 4.0s / 4.0s | Perfil resiliente - Reevaluar en 3 min |
| Crítico | Bajo | 🟠 Continuar | 4.5s / 5.0s | Recuperación incompleta - Repetir bloque |
| Normal | Neutro | 🟢 No activar | 4.0s / 4.0s | Estado equilibrado - Sin intervención |

### 🎨 Codificación Visual

El sistema muestra cada configuración con colores específicos según la urgencia:

- **🔴 Rojo**: Activar protocolo (urgente)
- **🟠 Naranja**: Continuar protocolo (importante)  
- **🟣 Púrpura**: Esperar y reevaluar (precaución)
- **🔵 Azul**: Monitorear (atención)
- **🟢 Verde**: No activar (normal)

### 🎯 Función auxiliar (interface.js)

```js
// 🎲 Genera configuración aleatoria para explorar patrones
generateRandomBiometrics()

// 🔄 Aplica configuración biométrica automáticamente
applyBiometricConfiguration()
```

**Uso:**
- Los selectores se actualizan **automáticamente** al cambiar cualquier valor
- El botón "Configuración Aleatoria" permite explorar las 15 combinaciones
- El display muestra la configuración actual con codificación por colores

## 📄 Licencia

Este proyecto está bajo la licencia definida en el archivo [LICENSE](LICENSE).

