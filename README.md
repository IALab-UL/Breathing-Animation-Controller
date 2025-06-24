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
- 🧬 **Sistema biométrico inteligente** con 135 patrones únicos de respiración
- 🎲 **Configuración automática** basada en 4 indicadores (RH, IBI, HRV, Estrés)
- 📱 **Interfaz responsive** y moderna
- 🧩 **API simple** y fácil de integrar

## 📁 Archivos principales

| Archivo | Descripción |
|---------|-------------|
| 📄 **index.html** | Página demo con contenedor de animación y controles de duración |
| 🎨 **styles.css** | Estilos modernos con gradientes y efectos visuales |
| 🎬 **respiracion.json** | Animación Lottie exportada desde After Effects |
| 🎛️ **interface.js** | Lógica de interfaz de usuario (controles básicos + biométricos) |
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
<div class="biometric-controls">
  <h3>Configuración Biométrica Automática</h3>
  <div class="biometric-grid">
    <div class="biometric-group">
      <label for="rhSelect">Ritmo Cardíaco:</label>
      <select id="rhSelect">
        <option value="1">Bajo</option>
        <option value="2" selected>Normal</option>
        <option value="3">Alto</option>
      </select>
    </div>
    <div class="biometric-group">
      <label for="ibiSelect">Intervalo Entre Latidos:</label>
      <select id="ibiSelect">
        <option value="1">Corto</option>
        <option value="2" selected>Normal</option>
        <option value="3">Largo</option>
      </select>
    </div>
    <div class="biometric-group">
      <label for="hrvSelect">Variabilidad (HRV):</label>
      <select id="hrvSelect">
        <option value="1">Baja</option>
        <option value="2" selected>Normal</option>
        <option value="3">Alta</option>
      </select>
    </div>
    <div class="biometric-group">
      <label for="stressSelect">Nivel de Estrés:</label>
      <select id="stressSelect">
        <option value="1">Muy Bajo</option>
        <option value="2">Bajo</option>
        <option value="3" selected>Normal</option>
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
| `updateBiometrics(rh, ibi, hrv, stress)` | `number, number, number, number` | 🧬 Actualiza indicadores biométricos y aplica configuración automática | `controller.updateBiometrics(2, 1, 3, 4)` |
| `getCurrentConfiguration()` | - | 📊 Obtiene la configuración biométrica actual | `controller.getCurrentConfiguration()` |
| `getAllConfigurations()` | - | 📋 Obtiene todas las 135 configuraciones posibles | `controller.getAllConfigurations()` |

## 🧬 Sistema Biométrico Inteligente

### 📊 Indicadores Biométricos

El sistema utiliza 4 indicadores para generar automáticamente **135 patrones únicos** de respiración:

| Indicador | Niveles | Descripción |
|-----------|---------|-------------|
| **RH** (Ritmo Cardíaco) | 1-3 | Bajo, Normal, Alto |
| **IBI** (Intervalo Entre Latidos) | 1-3 | Corto, Normal, Largo |
| **HRV** (Variabilidad del Ritmo Cardíaco) | 1-3 | Baja, Normal, Alta |
| **Estrés** | 1-5 | Muy Bajo, Bajo, Normal, Alto, Muy Alto |

### 🎯 Algoritmo de Cálculo

El algoritmo comienza con un patrón base de 4.0s inhalación / 4.0s exhalación y aplica modificaciones según cada indicador:

#### Ritmo Cardíaco (RH):
- **Bajo (1)**: Necesita activación → Inhalación +0.5s, Exhalación -0.3s
- **Normal (2)**: Mantener equilibrio → Sin cambios
- **Alto (3)**: Necesita calma → Inhalación -0.3s, Exhalación +0.8s

#### Intervalo Entre Latidos (IBI):
- **Corto (1)**: Ritmo acelerado → Inhalación -0.2s, Exhalación +0.5s
- **Normal (2)**: Sin cambios
- **Largo (3)**: Ritmo lento → Inhalación +0.3s, Exhalación -0.2s

#### Variabilidad HRV:
- **Baja (1)**: Necesita regulación → Variación aleatoria para estimular
- **Normal (2)**: Sin cambios
- **Alta (3)**: Mantener variabilidad → Ambos +0.2s

#### Nivel de Estrés (Factor más importante):
- **Muy Bajo (1)**: Respiración energizante → Inhalación +0.3s, Exhalación -0.5s
- **Bajo (2)**: Ligeramente activadora → Inhalación +0.1s, Exhalación -0.2s
- **Normal (3)**: Respiración equilibrada → Sin cambios
- **Alto (4)**: Respiración calmante → Inhalación -0.5s, Exhalación +1.0s
- **Muy Alto (5)**: Muy calmante → Inhalación -0.8s, Exhalación +1.5s

### 🛡️ Límites de Seguridad

- **Inhalación**: Entre 1.5s y 8.0s
- **Exhalación**: Entre 1.5s y 10.0s
- **Precisión**: Valores redondeados a 1 decimal

### 💡 Ejemplos de Patrones

| Configuración | Resultado | Tipo de Respiración |
|---------------|-----------|-------------------|
| RH:Alto, IBI:Corto, HRV:Normal, Estrés:Muy Alto | 2.7s / 6.8s | Ultra-calmante |
| RH:Bajo, IBI:Largo, HRV:Alta, Estrés:Muy Bajo | 5.3s / 3.2s | Energizante |
| RH:Normal, IBI:Normal, HRV:Normal, Estrés:Normal | 4.0s / 4.0s | Equilibrada |

### 🎯 Función auxiliar (interface.js)

```js
// 🎲 Genera configuración aleatoria para explorar patrones
generateRandomBiometrics()
```

**Uso:**
- Los selectores se actualizan **automáticamente** al cambiar cualquier valor
- El botón "Configuración Aleatoria" permite explorar diferentes combinaciones
- El display muestra la configuración actual aplicada

## 🎨 Personalización

### 🔧 Consejos para personalizar

- ✅ **Valida y controla** los valores de los inputs antes de cambiarlos
- 🎯 **Agrega callbacks** a `animation.addEventListener('complete', ...)` en tu propia lógica si necesitas eventos personalizados
- 🏷️ **Utiliza marcadores** en After Effects para definir segmentos con nombres diferentes, siempre que actualices los nombres en `extractSegments()`
- 🧬 **Personaliza el algoritmo biométrico** modificando `calculateBreathingPattern()` para agregar nuevos indicadores o lógicas

### 🎭 Principios de Respiración Terapéutica

| Patrón | Efecto | Aplicación |
|--------|--------|------------|
| 🔋 **Inhalación larga + Exhalación corta** | Activación | Energizar, estimular sistema simpático |
| 😌 **Inhalación corta + Exhalación larga** | Relajación | Calmar, activar sistema parasimpático |
| ⚖️ **Duración equilibrada** | Balance | Concentración y estabilidad |

### 🎨 Personalización visual

El archivo `styles.css` incluye:
- 🌈 Gradientes modernos
- 💫 Efectos de sombra  
- 📱 Diseño responsive
- 🎯 Interfaz centrada y limpia
- 🧬 Controles biométricos con grid layout
- 🎲 Botones con efectos hover y transiciones

## 📄 Licencia

Este proyecto está bajo la licencia definida en el archivo [LICENSE](LICENSE).

