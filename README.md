# Simulador de PBQs — CompTIA Security+ SY0-701

Simulador de Performance-Based Questions con 61 PBQs que cubren los cinco dominios del SY0-701.

```bash
npm install
npm run dev      # http://localhost:3000
npm run lint     # chequeo de tipos
npm run build
```

## Modos

- **Práctica libre**: todas las PBQs, calificación inmediata con explicación por ítem. Las **pistas** (medidores de cumplimiento, explicación de cada opción, simulador de paquetes, tip táctico) vienen **apagadas** por defecto: se activan desde el botón "Pistas" del header.
- **Simulacro con tiempo**: elige 3–12 PBQs al azar respetando el peso oficial de cada dominio (opcionalmente priorizando las que nunca hiciste o fallaste). Sin pistas, sin cheat sheet, sin pausa y sin corrección hasta finalizar o hasta que se acabe el tiempo.

El progreso (respuestas, notas, marcas e historial de intentos) se guarda en `localStorage`. El orden de las opciones cambia en cada simulacro.

## Estructura

| Archivo | Rol |
| --- | --- |
| `src/pbqRegistry.tsx` | Para cada PBQ: estado inicial, evaluador y simulador. |
| `src/data/pbqsData.ts` | Catálogo de las PBQs 1–50 y sus datos iniciales. |
| `src/data/matrixPbqs.ts` | PBQs de clasificación 51–59 y 61 (formato arrastrar-y-soltar). |
| `src/data/linuxPermissionsPbq.ts` | PBQ 60: permisos Linux (rwx, octal, chown, umask, SUID/SGID/sticky). |
| `src/data/sy0701Objectives.ts` | Objetivos y pesos oficiales del SY0-701. |
| `src/utils/evaluator.ts` | Evaluadores con crédito parcial de las PBQs 1–50. |

## Añadir una PBQ de clasificación

Agrega una entrada a `MATRIX_PBQS` en `src/data/matrixPbqs.ts` (filas, columnas con opciones, respuesta correcta y explicación por fila). Se registra, evalúa y renderiza sola. Si cambias la forma del estado de una PBQ existente, incrementa `STORAGE_VERSION` en `src/utils/storage.ts`.
