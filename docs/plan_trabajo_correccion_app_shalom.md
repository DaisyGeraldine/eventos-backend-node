# Plan de trabajo de corrección y mejora de la app Shalom

## 1. Objetivo y alcance

### Objetivo general
- Corregir los fallos de mayor impacto reportados por usuarios para recuperar estabilidad, confianza y conversión en los flujos críticos de la app.

### Alcance
- Diagnóstico técnico y línea base de métricas.
- Correcciones críticas de acceso, rastreo y verificación OTP.
- Correcciones de alta fricción en experiencia y continuidad de uso.
- Mejoras UX solicitadas de forma recurrente en reseñas.
- Cierre con QA, despliegue gradual y monitoreo post-release.

## 2. Enfoque por fases

### Fase 0: Diagnóstico y línea base
- **Meta:** Tener visibilidad completa de fallas y métricas iniciales antes de corregir.

### Fase 1: Correcciones críticas (P0)
- **Meta:** Eliminar errores que bloquean uso de la app (acceso, rastreo, OTP).

### Fase 2: Correcciones de alta fricción (P1)
- **Meta:** Reducir abandono y fricción en flujos frecuentes.

### Fase 3: Mejoras UX priorizadas (P2)
- **Meta:** Mejorar conveniencia y percepción de calidad en funciones solicitadas.

### Fase 4: QA, release y estabilización
- **Meta:** Asegurar salida controlada a producción con monitoreo y capacidad de reacción.

## 3. Desglose de tareas por fase

## Fase 0 — Diagnóstico

### Tarea 0.1: Instrumentación de errores y eventos
- **Objetivo:** Identificar dónde y por qué fallan login, rastreo y OTP.
- **Actividades:**
  - Registrar eventos clave: `login_start`, `login_fail`, `tracking_search`, `tracking_fail`, `otp_send`, `otp_verify_fail`.
  - Activar trazas de error con contexto de versión/dispositivo.
  - Crear tablero inicial por flujo y endpoint.
- **Entregables:**
  - Dashboard de top errores por pantalla y versión.
- **Criterios de aceptación:**
  - Top 10 fallas identificadas con causa probable y frecuencia.

### Tarea 0.2: Línea base de KPIs
- **Objetivo:** Establecer punto de partida medible.
- **Actividades:**
  - Medir éxito de login/registro.
  - Medir éxito de rastreo.
  - Medir tiempo p95 de rastreo.
  - Medir entrega OTP < 60s.
  - Medir tasa de crash/ANR por versión.
- **Entregables:**
  - Documento baseline con métricas iniciales.
- **Criterios de aceptación:**
  - KPIs iniciales publicados y aprobados por equipo técnico/producto.

## Fase 1 — Correcciones críticas (P0)

### Tarea 1.1: Corrección de “pantalla blanca” y carga infinita en rastreo
- **Objetivo:** Evitar bloqueos del flujo de rastreo.
- **Actividades:**
  - Implementar timeout y retry controlado.
  - Definir estados UI obligatorios: cargando, sin resultados, error, éxito.
  - Guardar última consulta válida como fallback.
  - Corregir congelamiento en búsquedas consecutivas.
- **Entregables:**
  - Flujo de rastreo robusto sin estado en blanco.
- **Criterios de aceptación:**
  - Nunca se muestra pantalla blanca.
  - Existe acción de reintento ante falla.
  - 20 búsquedas consecutivas sin freeze.

### Tarea 1.2: Unificación de login/registro/recuperación
- **Objetivo:** Eliminar contradicciones de identidad y bloqueo de acceso.
- **Actividades:**
  - Unificar reglas por DNI/correo/teléfono en backend y app.
  - Habilitar flujo único de recuperación de cuenta.
  - Corregir mensajes de error para que sean accionables.
- **Entregables:**
  - Flujo consistente de alta, ingreso y recuperación.
- **Criterios de aceptación:**
  - Si existe cuenta, recuperación disponible siempre.
  - Si no existe, registro disponible siempre.
  - Cero mensajes contradictorios en pruebas funcionales.

### Tarea 1.3: Estabilización OTP (SMS/correo)
- **Objetivo:** Asegurar entrega y validación oportuna del código.
- **Actividades:**
  - Ajustar TTL de OTP y sincronización servidor-cliente.
  - Habilitar reenvío con cooldown visible.
  - Definir canal alterno (SMS/correo) ante falla del principal.
  - Manejar límite de intentos con ruta de desbloqueo.
- **Entregables:**
  - Flujo OTP confiable con contingencia.
- **Criterios de aceptación:**
  - OTP entregado en < 60s en 95% de casos.
  - No hay bloqueos sin salida para el usuario.

## Fase 2 — Correcciones de alta fricción (P1)

### Tarea 2.1: Rastreo como invitado
- **Objetivo:** Permitir rastreo rápido sin crear cuenta.
- **Actividades:**
  - Habilitar ingreso por número de orden + código/QR.
  - Exponer acceso directo desde inicio.
- **Entregables:**
  - Flujo “Rastrear sin cuenta” operativo.
- **Criterios de aceptación:**
  - Usuario nuevo logra rastrear en menos de 30 segundos.

### Tarea 2.2: Corrección de actualización forzada defectuosa
- **Objetivo:** Evitar bloqueo falso por versión.
- **Actividades:**
  - Corregir validación de versión mínima.
  - Considerar rollout gradual de tiendas.
  - Mostrar versión detectada y opción de reintento.
- **Entregables:**
  - Lógica de actualización consistente y tolerante.
- **Criterios de aceptación:**
  - No hay loop de “actualiza app” cuando versión es válida.

### Tarea 2.3: Persistencia real de sesión
- **Objetivo:** Reducir relogin repetitivo.
- **Actividades:**
  - Corregir refresh token y expiración.
  - Implementar “Recordarme” estable (hasta 30 días).
- **Entregables:**
  - Sesión persistente entre aperturas.
- **Criterios de aceptación:**
  - Sesión se mantiene salvo logout o expiración real.

## Fase 3 — Mejoras UX (P2)

### Tarea 3.1: Lectura de QR desde galería
- **Objetivo:** Permitir rastreo sin uso obligatorio de cámara.
- **Actividades:**
  - Añadir selector de imagen y parseo QR.
- **Entregables:**
  - Opción “Subir QR desde galería”.
- **Criterios de aceptación:**
  - QR válido desde imagen genera rastreo correcto.

### Tarea 3.2: Búsqueda por DNI
- **Objetivo:** Simplificar consulta de envíos asociados al usuario.
- **Actividades:**
  - Habilitar endpoint/consulta por DNI con validaciones.
- **Entregables:**
  - Flujo de búsqueda por DNI.
- **Criterios de aceptación:**
  - Resultados correctos y autorizados por identidad.

### Tarea 3.3: Módulo “Mis envíos”
- **Objetivo:** Evitar reingreso manual de datos de rastreo.
- **Actividades:**
  - Guardar histórico reciente y estado por envío.
- **Entregables:**
  - Lista de envíos recientes vinculados al usuario.
- **Criterios de aceptación:**
  - Usuario visualiza y reabre envíos sin volver a digitar.

### Tarea 3.4: Notificaciones de estado
- **Objetivo:** Disminuir consultas manuales y mejorar visibilidad.
- **Actividades:**
  - Emitir push en cambios de estado relevantes.
- **Entregables:**
  - Sistema de notificaciones por evento de envío.
- **Criterios de aceptación:**
  - Se reciben notificaciones en eventos definidos de negocio.

## Fase 4 — QA y release

### Tarea 4.1: QA funcional y regresión
- **Objetivo:** Validar que correcciones no rompen flujos previos.
- **Actividades:**
  - Ejecutar pruebas de login/registro/recuperación, rastreo, OTP, sesión y actualización.
- **Entregables:**
  - Informe QA con evidencias y severidad.
- **Criterios de aceptación:**
  - 0 defectos críticos abiertos al cierre de fase.

### Tarea 4.2: Beta controlada
- **Objetivo:** Mitigar riesgo antes de despliegue masivo.
- **Actividades:**
  - Publicar release parcial, monitorear 24-48h y preparar rollback.
- **Entregables:**
  - Informe de estabilidad en beta.
- **Criterios de aceptación:**
  - KPIs dentro de umbrales de salida.

### Tarea 4.3: Producción y monitoreo intensivo
- **Objetivo:** Asegurar estabilización post-lanzamiento.
- **Actividades:**
  - Despliegue gradual y revisión diaria de métricas por 7 días.
  - Hotfix inmediato ante picos de error.
- **Entregables:**
  - Reporte de impacto de release.
- **Criterios de aceptación:**
  - Sin incidentes críticos sostenidos en producción.

## 4. Priorización recomendada

1. **P0-01:** Pantalla blanca/carga infinita en rastreo.
2. **P0-02:** Login/registro/recuperación inconsistente.
3. **P0-03:** Entrega y validez OTP.
4. **P1-01:** Rastreo como invitado.
5. **P1-02:** Actualización forzada defectuosa.
6. **P1-03:** Persistencia de sesión.
7. **P2-01:** QR desde galería.
8. **P2-02:** Búsqueda por DNI.
9. **P2-03:** Mis envíos.
10. **P2-04:** Notificaciones de estado.
11. **P4-01 a P4-03:** QA, beta y release gradual.

## 5. KPIs de éxito

### KPIs operativos
- Éxito login/registro: **> 95%**.
- Error rate de rastreo: **< 2%**.
- Tiempo de respuesta rastreo p95: **< 2.5s**.
- Entrega OTP < 60s: **> 95%**.
- Crash/ANR por versión: reducción sostenida semanal.

### KPIs de negocio y percepción
- Tickets “no puedo entrar”: **-70%**.
- Conversión de registro: **+30%**.
- Reducción de reseñas 1★ asociadas a acceso/rastreo: **-60% a -70%**.
- Incremento de calificación promedio en tienda: tendencia positiva posterior al release.
