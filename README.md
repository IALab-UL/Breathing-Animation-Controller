# 🫁 Breathing Animation Controller

<div align="center">

![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg)
![Lottie](https://img.shields.io/badge/Lottie-Web-blue.svg)
![License](https://img.shields.io/badge/License-MIT-green.svg)
![Status](https://img.shields.io/badge/Status-Active-brightgreen.svg)

</div>

Un sistema de control de respiración automático basado en algoritmos clínicos para aplicaciones de bienestar mental. Utiliza animaciones [Lottie](https://github.com/airbnb/lottie-web) y configura patrones respiratorios según indicadores biométricos específicos por grupo etario.

✨ **Sistema biométrico automático con umbrales clínicos específicos basados en grupo etario, RMSSD real (ms) y nivel de estrés.**

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

Este controlador carga un JSON de Lottie con dos capas (`Breathe in` y `Breathe out`) y alterna automáticamente entre las fases de inhalación y exhalación. Los patrones respiratorios se configuran automáticamente mediante un algoritmo clínico basado en umbrales de RMSSD específicos por grupo etario y nivel de estrés percibido.

### ✨ Características principales

- 🔄 **Inicio automático** al cargar la página
- 👥 **Umbrales por grupo etario** (Niños 6-12, Adultos 18-40, Mayores >60)
- 🧬 **Sistema biométrico inteligente** con valores reales de RMSSD en milisegundos
- 🎯 **Algoritmo clínico validado** basado en literatura científica
- 📊 **Configuración automática** basada en 3 indicadores (Grupo Etario, RMSSD, Estrés)
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
      <label for="ageGroupSelect">Grupo Etario:</label>
      <select id="ageGroupSelect">
        <option value="child">Niños (6-12 años)</option>
        <option value="young_adult" selected>Adultos Jóvenes (18-40 años)</option>
        <option value="older_adult">Adultos Mayores (>60 años)</option>
      </select>
    </div>
    
    <div class="biometric-group">
      <label for="rmssdInput">RMSSD (ms):</label>
      <input type="number" id="rmssdInput" min="5" max="100" step="1" value="35" placeholder="RMSSD en ms">
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

🎉 **¡La animación arranca automáticamente y se configura según los controles biométricos (grupo etario, RMSSD en ms, y nivel de estrés)!**

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
| `updateBiometrics(ageGroup, rmssdValue, stress)` | `string, number, number` | 🧬 Actualiza indicadores biométricos y aplica configuración automática | `controller.updateBiometrics('young_adult', 35, 4)` |
| `obtenerConfiguracionActual()` | - | 📊 Obtiene la configuración biométrica actual | `controller.obtenerConfiguracionActual()` |

## 🧬 Sistema Biométrico Clínico

### 📊 Indicadores Biométricos

El sistema utiliza 3 indicadores para generar automáticamente patrones clínicos específicos:

| Indicador | Valores | Descripción |
|-----------|---------|-------------|
| **Grupo Etario** | `child`, `young_adult`, `older_adult` | Niños (6-12 años), Adultos Jóvenes (18-40 años), Adultos Mayores (>60 años) |
| **RMSSD** | 5-100 ms | Valor real de variabilidad cardíaca en milisegundos |
| **Estrés** | 1-5 | Máxima Relajación, Bajo, Neutro, Alto, Muy Alto |

### 🎯 Umbrales RMSSD por Grupo Etario

| Grupo | Crítico | Tolerable | Normal |
|-------|---------|-----------|--------|
| **Niños (6-12 años)** | < 25 ms | 25-40 ms | > 40 ms |
| **Adultos Jóvenes (18-40 años)** | < 30 ms | 30-50 ms | > 50 ms |
| **Adultos Mayores (>60 años)** | < 15 ms | 15-30 ms | > 30 ms |

### 🎯 Algoritmo Clínico

El algoritmo implementa 5 tipos de acciones basadas en protocolos clínicos:

- **🔴 Activar protocolo**: Respiración guiada con 4s inhalación / 6s exhalación
- **🟠 Continuar protocolo**: Repetir protocolo hasta recuperación vagal
- **🟣 Esperar y reevaluar**: Monitorear evolución antes de intervenir
- **🔵 Monitorear**: Aumentar frecuencia de chequeos biométricos
- **🟢 No activar**: Estado óptimo sin necesidad de intervención

### 🛡️ Límites de Seguridad

- **Protocolo activado**: 4.0s inhalación / 6.0s exhalación
- **Protocolo no activado**: 4.0s inhalación / 4.0s exhalación
- **Precisión**: Valores redondeados a 1 decimal

### 💡 Ejemplos de Patrones Clínicos

| Grupo Etario | RMSSD | Estrés | Acción | Duración | Descripción |
|--------------|-------|--------|--------|----------|-------------|
| Adultos Jóvenes | 20ms (crítico) | Muy Alto | 🔴 Activar | 4.0s / 6.0s | Crisis autonómica |
| Niños | 35ms (tolerable) | Alto | 🔴 Activar | 4.0s / 6.0s | Protección parasimpática |
| Adultos Mayores | 35ms (normal) | Muy Alto | 🟣 Esperar | 4.0s / 4.0s | Perfil resiliente |
| Adultos Jóvenes | 25ms (crítico) | Bajo | 🟠 Continuar | 4.0s / 6.0s | Recuperación incompleta |
| Niños | 50ms (normal) | Neutro | 🟢 No activar | 4.0s / 4.0s | Homeostasis óptima |

### 🎨 Codificación Visual

El sistema muestra cada configuración con colores específicos según la urgencia:

- **🔴 Rojo**: Activar protocolo (crisis autonómica)
- **🟠 Naranja**: Continuar protocolo (recuperación incompleta)  
- **🟣 Púrpura**: Esperar y reevaluar (perfil resiliente)
- **🔵 Azul**: Monitorear (inconsistencia biométrica)
- **🟢 Verde**: No activar (estado óptimo)

### 🎯 Funciones de interfaz (interface.js)

```js
// 🎲 Genera configuración aleatoria para explorar patrones
generarBiometricosAleatorios()

// 🔄 Aplica configuración biométrica automáticamente
aplicarConfiguracionBiometrica()
```

**Uso:**
- Los controles se actualizan **automáticamente** al cambiar cualquier valor
- El botón "Configuración Aleatoria" permite explorar diferentes combinaciones
- El display muestra la configuración actual con codificación por colores y descripción clínica específica

## 📄 Licencia

Este proyecto está bajo la licencia definida en el archivo [LICENSE](LICENSE).

