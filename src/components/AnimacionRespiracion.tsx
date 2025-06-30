import { useState, useEffect } from 'react';
import { useLottie } from 'lottie-react';

/**
 * Propiedades del componente AnimacionRespiracion
 */
interface AnimacionRespiracionProps {
  /** Datos de la animación Lottie */
  datosAnimacion: any;
  /** Duración de la inhalación en segundos (por defecto: 4) */
  duracionInhalacion?: number;
  /** Duración de la exhalación en segundos (por defecto: 4) */
  duracionExhalacion?: number;
}

/**
 * Componente de animación de respiración que muestra una animación Lottie
 * sincronizada con duraciones personalizables de inhalación y exhalación.
 * 
 * @param datosAnimacion - Datos de la animación Lottie a renderizar
 * @param duracionInhalacion - Duración de la fase de inhalación en segundos
 * @param duracionExhalacion - Duración de la fase de exhalación en segundos
 */
const AnimacionRespiracion = ({ datosAnimacion, duracionInhalacion: inicialDuracionInhalacion = 4, duracionExhalacion: inicialDuracionExhalacion = 4 }: AnimacionRespiracionProps) => {
  // Estados para manejar las duraciones actuales de inhalación y exhalación
  const [duracionInhalacion, setDuracionInhalacion] = useState(inicialDuracionInhalacion);
  const [duracionExhalacion, setDuracionExhalacion] = useState(inicialDuracionExhalacion);
  // Clave para forzar re-renderizado cuando cambian las duraciones
  const [claveAnimacion, setClaveAnimacion] = useState(0);

  // Efecto para actualizar duración de inhalación cuando cambia la prop
  useEffect(() => {
    setDuracionInhalacion(inicialDuracionInhalacion);
  }, [inicialDuracionInhalacion]);

  // Efecto para actualizar duración de exhalación cuando cambia la prop
  useEffect(() => {
    setDuracionExhalacion(inicialDuracionExhalacion);
  }, [inicialDuracionExhalacion]);

  // Configuración de fotogramas para la fase de inhalación
  const fotogramasInhalacion = {
    inicio: 0,
    fin: 180,
  };

  // Configuración de fotogramas para la fase de exhalación
  const fotogramasExhalacion = {
    inicio: 181,
    fin: 360,
  };

  // Opciones de configuración para la animación Lottie
  const opciones = {
    animationData: datosAnimacion,
    loop: false, // No repetir automáticamente
    autoplay: false, // No reproducir automáticamente
  };

  // Configurar la instancia de Lottie con las opciones definidas
  const { View, playSegments, setSpeed } = useLottie(opciones);

  useEffect(() => {
    // Función para reproducir la secuencia completa de respiración
    const reproducirAnimacion = () => {
      // Fase de inhalación
      setSpeed(180 / (duracionInhalacion * 60));
      playSegments([fotogramasInhalacion.inicio, fotogramasInhalacion.fin], true);

      setTimeout(() => {
        // Fase de exhalación
        setSpeed(180 / (duracionExhalacion * 60));
        playSegments([fotogramasExhalacion.inicio, fotogramasExhalacion.fin], true);
      }, duracionInhalacion * 1000);
    };

    // Configurar intervalo para repetir la animación
    const intervalo = setInterval(() => {
      reproducirAnimacion();
    }, (duracionInhalacion + duracionExhalacion) * 1000);

    // Iniciar la primera reproducción
    reproducirAnimacion();

    // Limpiar el intervalo cuando el componente se desmonte o cambien las dependencias
    return () => clearInterval(intervalo);
  }, [duracionInhalacion, duracionExhalacion, claveAnimacion]);

  /**
   * Maneja el cambio en la duración de inhalación
   * @param e - Evento de cambio del input
   */
  const manejarCambioInhalacion = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDuracionInhalacion(Number(e.target.value));
    setClaveAnimacion(prev => prev + 1);
  };

  /**
   * Maneja el cambio en la duración de exhalación
   * @param e - Evento de cambio del input
   */
  const manejarCambioExhalacion = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDuracionExhalacion(Number(e.target.value));
    setClaveAnimacion(prev => prev + 1);
  };

  return (
    <div>
      {/* Renderizar la animación Lottie */}
      {View}
      
      {/* Control para duración de inhalación */}
      <div>
        <label>
          Duración Inhalación:
          <input
            type="number"
            min="1"
            max="10"
            value={duracionInhalacion}
            onChange={manejarCambioInhalacion}
          /> s
        </label>
      </div>
      
      {/* Control para duración de exhalación */}
      <div>
        <label>
          Duración Exhalación:
          <input
            type="number"
            min="1"
            max="10"
            value={duracionExhalacion}
            onChange={manejarCambioExhalacion}
          /> s
        </label>
      </div>
    </div>
  );
};

export default AnimacionRespiracion;
