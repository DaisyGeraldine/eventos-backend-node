# Resumen ejecutivo para gerencia — Plan de mejora app Shalom

## 1. Problema actual
- La app presenta fallas recurrentes en tres frentes críticos: **acceso de usuarios**, **rastreo de envíos** y **verificación OTP**.
- Estos problemas generan abandono, aumento de tickets y reseñas negativas, impactando reputación y conversión.
- Existe además fricción alta en funcionalidades clave (actualización forzada, sesión no persistente, rastreo obligatorio con cuenta).

## 2. Top 3 riesgos críticos

1. **Riesgo de bloqueo operativo al usuario final (P0):**
   - Login/registro inconsistente y OTP inestable impiden uso básico de la app.
2. **Riesgo reputacional y comercial:**
   - Pantalla blanca/carga infinita en rastreo dispara reseñas 1★ y pérdida de confianza.
3. **Riesgo de incremento de costos de soporte:**
   - Mayor volumen de reclamos por acceso, rastreo y recuperación de cuenta.

## 3. Plan propuesto por fases

- **Fase 0 (Diagnóstico):** instrumentación y línea base de KPIs.
- **Fase 1 (Crítico P0):** corrección de rastreo en blanco, unificación login/registro/recuperación, estabilización OTP.
- **Fase 2 (Alta fricción P1):** rastreo como invitado, fix de actualización forzada, persistencia de sesión.
- **Fase 3 (Mejoras P2):** QR desde galería, búsqueda por DNI, “mis envíos”, notificaciones de estado.
- **Fase 4 (QA/Release):** regresión completa, beta controlada y despliegue gradual con monitoreo.

## 4. Timeline de alto nivel

- **Semana 1:** Fase 0 + inicio Fase 1 (rastreo crítico y observabilidad).
- **Semana 2:** cierre Fase 1 (login/registro + OTP).
- **Semana 3:** Fase 2 (fricción alta de uso).
- **Semana 4:** Fase 3 + Fase 4 (mejoras UX, QA, beta y salida gradual).

## 5. KPIs objetivo e impacto esperado

### Objetivos KPI
- Éxito login/registro: **> 95%**.
- Error de rastreo: **< 2%**.
- Rastreo p95: **< 2.5 segundos**.
- OTP entregado en < 60s: **> 95%**.
- Tickets por “no puedo entrar”: **-70%**.

### Impacto esperado
- Reducción acelerada de fricción en flujos críticos.
- Menor carga en soporte y reclamos operativos.
- Recuperación progresiva de reputación de la app en tiendas.
- Mejor conversión y retención por estabilidad de acceso y rastreo.

## 6. Decisiones y soporte requeridos de gerencia
- **Priorización formal del plan P0→P2** para evitar desvíos de foco.
- **Asignación de responsables dedicados** (backend, mobile, QA, soporte).
- **Ventana de despliegue controlado** con aprobación de rollback rápido.
- **Alineación con atención al cliente/comercial** para comunicar mejoras durante el rollout.
- **Seguimiento semanal de KPIs** en comité corto hasta estabilización.
