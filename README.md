# Controlador de Animación de Respiración

Aplicación React que muestra una animación Lottie de respiración con controles personalizables para las duraciones de inhalación y exhalación.

## 📋 Descripción

Este proyecto implementa un componente de React que reproduce una animación de respiración sincronizada, permitiendo al usuario ajustar las duraciones de las fases de inhalación y exhalación en tiempo real.

## ✨ Características

- **Animación Lottie**: Utiliza animaciones vectoriales de alta calidad
- **Control de duración**: Ajuste independiente de tiempos de inhalación y exhalación (1-10 segundos)
- **Componente reutilizable**: Completamente independiente y configurable mediante props
- **Interfaz intuitiva**: Controles numéricos para configurar las duraciones
- **Ciclo automático**: La animación se repite automáticamente con las duraciones especificadas
- **Sincronización precisa**: Control de velocidad de fotogramas para ajustar el timing
- **Estado reactivo**: Los cambios en las duraciones actualizan inmediatamente la animación

## 🛠️ Tecnologías

- **React 19.1.0** con TypeScript
- **Vite 7.0.0** como bundler y servidor de desarrollo
- **lottie-react 2.4.1** para renderizar animaciones Lottie
- **ESLint** para linting del código
- **TypeScript 5.8.3** para tipado estático

## 🚀 Instalación y uso

1. **Clonar el repositorio**:
```bash
git clone <url-del-repositorio>
cd Breathing-Animation-Controller
```

2. **Instalar dependencias**:
```bash
npm install
```

3. **Ejecutar en modo desarrollo**:
```bash
npm run dev
```

4. **Compilar para producción**:
```bash
npm run build
```

## 📦 Componente AnimacionRespiracion

### Props

| Prop | Tipo | Por defecto | Descripción |
|------|------|-------------|-------------|
| `datosAnimacion` | `any` | - | Datos de la animación Lottie (requerido) |
| `duracionInhalacion` | `number` | `4` | Duración de la inhalación en segundos |
| `duracionExhalacion` | `number` | `4` | Duración de la exhalación en segundos |

### Ejemplo de uso

```tsx
import AnimacionRespiracion from './components/AnimacionRespiracion';
import animationData from './assets/Animation.json';

function App() {
  return (
    <AnimacionRespiracion 
      datosAnimacion={animationData}
      duracionInhalacion={5}
      duracionExhalacion={8}
    />
  );
}
```

## 🎯 Funcionamiento

1. **Fases de la animación**:
   - **Inhalación**: Fotogramas 0-180 de la animación Lottie
   - **Exhalación**: Fotogramas 181-360 de la animación Lottie

2. **Control de velocidad**: La velocidad de reproducción se ajusta automáticamente según las duraciones configuradas

3. **Ciclo continuo**: Después de completar una fase de exhalación, la animación reinicia automáticamente

## 📁 Estructura del proyecto

```
src/
├── components/
│   └── AnimacionRespiracion.tsx  # Componente principal de animación
├── assets/
│   ├── Animation.json            # Datos de la animación Lottie
│   └── react.svg                 # Logo de React
├── App.tsx                       # Componente raíz de la aplicación
├── App.css                       # Estilos de la aplicación
├── index.css                     # Estilos globales
├── main.tsx                      # Punto de entrada de la aplicación
└── vite-env.d.ts                 # Definiciones de tipos para Vite
```

## 🔧 Configuración de desarrollo

El proyecto utiliza:
- **TypeScript** para tipado estático
- **ESLint** con configuración para React y TypeScript
- **Vite** para desarrollo rápido y hot module replacement
