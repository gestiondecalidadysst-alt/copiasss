// Ejemplos de uso del Sistema de Notificaciones de Velocidad
// Copiar y adaptar estos ejemplos en tu código

// ============================================
// EJEMPLO 1: Usar en un componente funcional
// ============================================

import { useSpeedNotificationContext } from '@/context/SpeedNotificationContext';

export const Dashboard = () => {
  const { addNotification } = useSpeedNotificationContext();

  const handleMonitorVehicle = () => {
    // Ejemplo: Monitorear un vehículo
    addNotification('ABC-1234', 95, 'Calle Principal');
  };

  return (
    <button onClick={handleMonitorVehicle}>
      Monitorear Vehículo
    </button>
  );
};

// ============================================
// EJEMPLO 2: Integración con polling de eventos
// ============================================

import { useEffect } from 'react';
import { useSpeedNotificationContext } from '@/context/SpeedNotificationContext';

export const EventoMonitor = () => {
  const { addNotification } = useSpeedNotificationContext();
  const [lastEventId, setLastEventId] = React.useState(0);

  useEffect(() => {
    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/eventos?since=${lastEventId}`);
        const newEventos = await response.json();

        newEventos.forEach((evento: any) => {
          // Solo mostrar eventos de exceso (velocidad > 80)
          if (evento.velocidad > 80) {
            addNotification(evento.placa, evento.velocidad, evento.ruta);
          }
          setLastEventId(evento.id);
        });
      } catch (error) {
        console.error('Error polling eventos:', error);
      }
    }, 5000); // Poll cada 5 segundos

    return () => clearInterval(pollInterval);
  }, [addNotification, lastEventId]);

  return <div>Monitoreando eventos...</div>;
};

// ============================================
// EJEMPLO 3: Integración con WebSocket (Tiempo Real)
// ============================================

import { useEffect } from 'react';
import { useSpeedNotificationContext } from '@/context/SpeedNotificationContext';

export const RealTimeEventMonitor = () => {
  const { addNotification } = useSpeedNotificationContext();

  useEffect(() => {
    // Conectar a WebSocket (si backend lo soporta)
    const ws = new WebSocket('ws://localhost:5000/eventos-stream');

    ws.onopen = () => {
      console.log('✅ Conectado a eventos en tiempo real');
    };

    ws.onmessage = (event) => {
      try {
        const evento = JSON.parse(event.data);
        
        // Mostrar notificación solo si es un exceso importante
        if (evento.velocidad > 80) {
          addNotification(evento.placa, evento.velocidad, evento.ruta);
        }
      } catch (error) {
        console.error('Error parsing evento:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('❌ Error WebSocket:', error);
    };

    ws.onclose = () => {
      console.log('❌ Desconectado de eventos');
    };

    return () => {
      ws.close();
    };
  }, [addNotification]);

  return <div>Monitoreando en tiempo real...</div>;
};

// ============================================
// EJEMPLO 4: Notificación en Mapa (cuando se detecta GPS)
// ============================================

import { useSpeedNotificationContext } from '@/context/SpeedNotificationContext';

export const MapaPageWithNotifications = () => {
  const { addNotification } = useSpeedNotificationContext();

  const handleMarkerClick = (evento: { placa: string; velocidad: number; ruta: string }) => {
    // Mostrar notificación al hacer click en un marcador del mapa
    addNotification(evento.placa, evento.velocidad, evento.ruta);
  };

  return (
    <div>
      {/* Mapa con marcadores */}
      {/* Al hacer click en un marcador, mostrar notificación */}
    </div>
  );
};

// ============================================
// EJEMPLO 5: Filtrar notificaciones por severidad
// ============================================

import { useSpeedNotificationContext } from '@/context/SpeedNotificationContext';

export const AlertDashboard = () => {
  const { notifications, addNotification } = useSpeedNotificationContext();

  // Filtrar solo alertas críticas
  const alertasCriticas = notifications.filter((n) => n.level === 'crítica');

  return (
    <div>
      <h2>Alertas Críticas: {alertasCriticas.length}</h2>
      {alertasCriticas.map((notif) => (
        <div key={notif.id}>
          {notif.placa} - {notif.velocidad} km/h
        </div>
      ))}
    </div>
  );
};

// ============================================
// EJEMPLO 6: Historial de notificaciones
// ============================================

import { useState, useCallback } from 'react';
import { useSpeedNotificationContext } from '@/context/SpeedNotificationContext';

export const NotificationHistory = () => {
  const { addNotification } = useSpeedNotificationContext();
  const [history, setHistory] = useState<any[]>([]);

  const addWithHistory = useCallback(
    (placa: string, velocidad: number, ruta?: string) => {
      const id = addNotification(placa, velocidad, ruta);
      setHistory((prev) => [
        ...prev,
        {
          id,
          placa,
          velocidad,
          ruta,
          timestamp: new Date(),
        },
      ]);
    },
    [addNotification]
  );

  return (
    <div>
      <h3>Historial de Notificaciones</h3>
      <ul>
        {history.map((item) => (
          <li key={item.id}>
            {item.placa} - {item.velocidad} km/h @ {item.timestamp.toLocaleTimeString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

// ============================================
// EJEMPLO 7: Sincronizar con Reportes
// ============================================

import { useEffect } from 'react';
import { useSpeedNotificationContext } from '@/context/SpeedNotificationContext';

export const Reportes = () => {
  const { addNotification } = useSpeedNotificationContext();

  useEffect(() => {
    const cargarReportes = async () => {
      const response = await fetch('http://localhost:5000/api/reportes');
      const reportes = await response.json();

      // Mostrar notificaciones para eventos en reportes guardados
      reportes.data?.forEach((reporte: any) => {
        if (reporte.velocidad_promedio > 100) {
          addNotification(
            reporte.placa,
            Math.round(reporte.velocidad_promedio),
            `Reporte: ${reporte.nombre}`
          );
        }
      });
    };

    cargarReportes();
  }, [addNotification]);

  return <div>Reportes con notificaciones</div>;
};

// ============================================
// EJEMPLO 8: Notificaciones condicionales
// ============================================

import { useSpeedNotificationContext } from '@/context/SpeedNotificationContext';

export const ConditionalNotifications = () => {
  const { addNotification } = useSpeedNotificationContext();

  const checkEventoAndNotify = (evento: any) => {
    // Solo notificar si es un exceso de velocidad importante
    if (evento.velocidad > 80) {
      addNotification(evento.placa, evento.velocidad, evento.ruta);
    }

    // O notificar solo en horarios específicos
    const hour = new Date().getHours();
    if (hour >= 6 && hour <= 22) {
      // Solo notificar entre 6am y 10pm
      addNotification(evento.placa, evento.velocidad, evento.ruta);
    }

    // O según la ruta
    if (evento.ruta?.includes('Escolar') || evento.ruta?.includes('Hospital')) {
      // Notificar si es zona con restricciones
      addNotification(evento.placa, evento.velocidad, evento.ruta);
    }
  };

  return <div>Sistema de notificaciones condicionales</div>;
};

// ============================================
// EJEMPLO 9: Batch de notificaciones
// ============================================

import { useSpeedNotificationContext } from '@/context/SpeedNotificationContext';

export const BatchNotifications = () => {
  const { addNotification, clearAll } = useSpeedNotificationContext();

  const handleMultipleEventos = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/eventos');
      const eventos = await response.json();

      // Limpiar notificaciones anteriores
      clearAll();

      // Agregar todas las nuevas
      eventos.forEach((evento: any) => {
        addNotification(evento.placa, evento.velocidad, evento.ruta);
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <button onClick={handleMultipleEventos}>
      Recargar todas las notificaciones
    </button>
  );
};

// ============================================
// EJEMPLO 10: Notificaciones con sonido
// ============================================

import { useSpeedNotificationContext } from '@/context/SpeedNotificationContext';

export const AudioNotifications = () => {
  const { addNotification } = useSpeedNotificationContext();

  const playSound = (level: string) => {
    // Reproducir sonido según nivel de severidad
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    if (level === 'crítica') {
      oscillator.frequency.value = 1000; // Frecuencia alta
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    } else if (level === 'alta') {
      oscillator.frequency.value = 800; // Frecuencia media
      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    }

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  };

  const addNotificationWithSound = (placa: string, velocidad: number, ruta?: string) => {
    const id = addNotification(placa, velocidad, ruta);
    // Aquí se podría extraer el level de la notificación y reproducir sonido
    playSound('alta');
    return id;
  };

  return <div>Sistema con notificaciones de audio</div>;
};
