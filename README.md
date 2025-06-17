# 🫁 Breathing Animation Controller

<div align="center">

![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg)
![Lottie](https://img.shields.io/badge/Lottie-Web-blue.svg)
![License](https://img.shields.io/badge/License-MIT-green.svg)
![Status](https://img.shields.io/badge/Status-Active-brightgreen.svg)

</div>

Un módulo independiente y personalizable para controlar animaciones de respiración (inhale/exhale) basado en [Lottie](https://github.com/airbnb/lottie-web). 

✨ **Perfecto para aplicaciones de meditación, relajación y bienestar mental.**

## 📚 Tabla de contenido

- [🎯 Descripción](#-descripción)
- [📁 Archivos principales](#-archivos-principales)
- [⚡ Instalación](#-instalación)
- [🚀 Uso](#-uso)
- [⚙️ Configuración](#️-configuración)
- [🔧 API pública](#-api-pública)
- [🎨 Personalización](#-personalización)
- [📄 Licencia](#-licencia)

## 🎯 Descripción

Este controlador carga un JSON de Lottie con dos capas (`Breathe in` y `Breathe out`) y alterna automáticamente entre las fases de inhalación y exhalación ajustando la velocidad para que cada ciclo dure el tiempo configurado.

### ✨ Características principales

- 🔄 **Ciclo automático** entre inhalación y exhalación
- ⏱️ **Duraciones configurables** para cada fase
- 🎛️ **Controles intuitivos** (iniciar, detener, pausar, reanudar)
- 🎨 **Presets predefinidos** para diferentes técnicas de respiración
- 📱 **Interfaz responsive** y moderna
- 🧩 **API simple** y fácil de integrar

## 📁 Archivos principales

| Archivo | Descripción |
|---------|-------------|
| 📄 **index.html** | Página demo con contenedor de animación y controles de duración |
| 🎨 **styles.css** | Estilos modernos con gradientes y efectos visuales |
| 🎬 **respiracion.json** | Animación Lottie exportada desde After Effects |
| 🎛️ **interface.js** | Lógica de interfaz de usuario (inputs, botones, presets) |
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

En `index.html` se inicializa el controlador automáticamente al cargar la página. La estructura relevante es:

```html
<div class="animation-container">
  <div id="lottie"></div>
</div>
<div class="controls">
  <div class="control-group">
    <label for="inhaleInput">Inhalación (s):</label>
    <input type="number" id="inhaleInput" value="2.63" min="0.1" step="0.1">
  </div>
  <div class="control-group">
    <label for="exhaleInput">Exhalación (s):</label>
    <input type="number" id="exhaleInput" value="2.37" min="0.1" step="0.1">
  </div>
  <div class="control-buttons">
    <button id="startBtn">Iniciar</button>
    <button id="stopBtn">Detener</button>
    <button id="pauseBtn">Pausar</button>
    <button id="resumeBtn">Reanudar</button>
  </div>
</div>
<div class="presets">
  <h3>Presets:</h3>
  <button onclick="setPreset(4, 4)">Relajación (4s/4s)</button>
  <button onclick="setPreset(4, 6)">Calma (4s/6s)</button>
  <button onclick="setPreset(6, 6)">Equilibrio (6s/6s)</button>
  <button onclick="setPreset(3, 3)">Energía (3s/3s)</button>
</div>
<!-- Scripts -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.10.2/lottie.min.js"></script>
<script src="script.js"></script>
<script src="interface.js"></script>
```

🎉 **¡La animación arrancará automáticamente con las duraciones por defecto!**

## ⚙️ Configuración

Puedes pasar opciones al constructor si no quieres usar los valores por defecto:

```js
const controller = new BreathingController({
  container: 'lottie',                    // 🎯 ID del div contenedor
  animationPath: 'respiracion.json',      // 🎬 Ruta del archivo Lottie
  inhaleInput: 'inhaleInput',             // 📥 ID del input de inhalación
  exhaleInput: 'exhaleInput',             // 📤 ID del input de exhalación
  defaultInhaleDuration: 3.0,             // ⏱️ Duración por defecto inhale (s)
  defaultExhaleDuration: 3.0,             // ⏱️ Duración por defecto exhale (s)
  renderer: 'svg',                        // 🎨 'svg' | 'canvas' | 'html'
  autoStart: true                         // 🚀 Inicia automáticamente tras init()
});
```

### 🎛️ Opciones de configuración

| Opción | Tipo | Por defecto | Descripción |
|--------|------|-------------|-------------|
| `container` | `string` | `'lottie'` | ID del contenedor donde se renderiza la animación |
| `animationPath` | `string` | `'respiracion.json'` | Ruta al archivo JSON de Lottie |
| `inhaleInput` | `string` | `'inhaleInput'` | ID del input para controlar duración de inhalación |
| `exhaleInput` | `string` | `'exhaleInput'` | ID del input para controlar duración de exhalación |
| `defaultInhaleDuration` | `number` | `2.63` | Duración inicial de inhalación en segundos |
| `defaultExhaleDuration` | `number` | `2.37` | Duración inicial de exhalación en segundos |
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

### 🎯 Función auxiliar (interface.js)

```js
// 🎛️ Cambia rápidamente las duraciones usando presets
setPreset(inhaleSeconds, exhaleSeconds)
```

**Ejemplos de uso:**
```js
setPreset(4, 4);  // Respiración equilibrada
setPreset(4, 6);  // Respiración calmante  
setPreset(6, 6);  // Respiración profunda
setPreset(3, 3);  // Respiración energizante
```

## 🎨 Personalización

### 🔧 Consejos para personalizar

- ✅ **Valida y controla** los valores de los inputs antes de cambiarlos
- 🎯 **Agrega callbacks** a `animation.addEventListener('complete', ...)` en tu propia lógica si necesitas eventos personalizados
- 🏷️ **Utiliza marcadores** en After Effects para definir segmentos con nombres diferentes, siempre que actualices los nombres en `extractSegments()`

### 🎭 Técnicas de respiración soportadas

| Técnica | Inhalación | Exhalación | Beneficios |
|---------|------------|------------|------------|
| 🧘 **Relajación** | 4s | 4s | Reduce estrés y ansiedad |
| 😌 **Calma** | 4s | 6s | Promueve relajación profunda |
| ⚖️ **Equilibrio** | 6s | 6s | Mejora concentración |
| ⚡ **Energía** | 3s | 3s | Aumenta la vitalidad |

### 🎨 Personalización visual

El archivo `styles.css` incluye:
- 🌈 Gradientes modernos
- 💫 Efectos de sombra
- 📱 Diseño responsive
- 🎯 Interfaz centrada y limpia

## 📄 Licencia

Este proyecto está bajo la licencia definida en el archivo [LICENSE](LICENSE).

