# Simulación numérica de abastecimiento, precios y conflicto social en contexto de crisis

Esta es una plataforma web interactiva diseñada para modelar, simular y analizar escenarios de crisis socioeconómicas en Bolivia (como desabastecimiento, variaciones de precios y conflictos sociales) mediante la aplicación de métodos numéricos.

## modulos y Metodos Numericos Implementados

La plataforma se organiza en cinco módulos funcionales, cada uno enfocado en una problemática específica y en un conjunto de herramientas matemáticas del análisis numérico:

### Modulo A: Sistemas de Ecuaciones Lineales (Sistemas)
Modela la interdependencia económica y de distribución entre diferentes sectores y regiones en situaciones de bloqueo o desabastecimiento.
*   **Metodos incluidos:**
    *   Método Iterativo de Jacobi
    *   Método Iterativo de Gauss-Seidel
    *   Método de Sobrerrelajación Sucesiva (SOR)
    *   Factorización LU 
    *   Método de Gradiente Conjugado 
    *   Verificación de dominancia diagonal estricta

### Modulo B: Ecuaciones Diferenciales Ordinarias (EDOs)
Simula la evolución temporal de variables dinámicas continuas, tales como la tasa de desabastecimiento de alimentos y su relación directa con el índice de malestar o conflicto social.
*   **Metodos incluidos:**
    *   Método de Euler
    *   Método de Heun 
    *   Método de Runge-Kutta de Cuarto Orden (RK4)
    *   Detección de cruce de umbrales críticos de conflicto mediante interpolación lineal de eventos

### Modulo C: Interpolacion de Datos (Interpolacion)
Permite construir funciones continuas a partir de datos discretos históricos de precios, inflación y canasta básica familiar para realizar estimaciones en fechas intermedias.
*   **Metodos incluidos:**
    *   Interpolación polinómica de Lagrange
    *   Polinomio interpolador de Newton mediante Diferencias Divididas
    *   Trazadores Splines Cúbicos Naturales 

### Modulo D: Integracion Numerica (Integracion)
Calcula el acumulado total de pérdidas económicas, consumo o volumen de importación afectado a lo largo de un intervalo temporal específico de crisis.
*   **Metodos incluidos:**
    *   Regla del Trapecio 
    *   Regla de Simpson 1/3 
    *   Regla de Simpson 3/8 
    *   Integración directa sobre vectores de datos tabulados discretos

### Modulo E: Busqueda de Raices de Ecuaciones (Raices)
Determina los puntos exactos de equilibrio de mercado o los instantes límite donde una variable de crisis alcanza un valor de alarma predefinido (raíces de funciones no lineales).
*   **Metodos incluidos:**
    *   Método de Bisección
    *   Método de Newton-Raphson
    *   Método de la Secante
    *   Estimación empírica del orden de convergencia a partir del historial de errores
---
## Características de la plataforma

La plataforma fue desarrollada como una herramienta interactiva de simulación y análisis. Cada módulo permite al usuario ingresar parámetros personalizados y observar el comportamiento de los modelos numéricos en distintos escenarios de crisis.

La aplicación incluye:

- Formularios interactivos para el ingreso de datos.
- Ejecución de métodos numéricos directamente en el navegador.
- Visualización de resultados mediante tablas.
- Gráficos dinámicos para analizar tendencias y comportamientos.
- Comparación entre diferentes métodos numéricos.
- Interpretación automática de resultados.
- Análisis de sensibilidad y estabilidad en determinados escenarios.
---
## Interpretación y análisis de resultados

Además de calcular soluciones numéricas, cada módulo proporciona una interpretación de los resultados obtenidos.

Dependiendo del escenario seleccionado, la plataforma permite analizar:

- Impacto del aumento de demanda sobre el abastecimiento.
- Comportamiento de reservas críticas en el tiempo.
- Evolución de precios en períodos de incertidumbre.
- Pérdida del poder adquisitivo familiar.
- Estabilidad y sensibilidad de sistemas económicos.
- Comparación de precisión y convergencia entre métodos numéricos.

El objetivo es obtener resultados matemáticos y comprender su significado dentro del contexto económico y social planteado.