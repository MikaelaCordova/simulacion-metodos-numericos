/* ==========================================================================
   Conclusions Module
   ========================================================================== */

const ConclusionsModule = (() => {

    function render() {
        return `
        <section class="hero" style="padding: 4rem 0 3rem; background: var(--bg-card); border-bottom: 1px solid var(--gray-200);">
            <div class="container hero-content">
                <div class="hero-badge">
                    <iconify-icon icon="heroicons:flag" width="16"></iconify-icon>
                    Cierre del Proyecto
                </div>
                <h1>Conclusiones Finales</h1>
                <p>Síntesis de los aprendizajes y análisis comparativo de los métodos numéricos aplicados a la simulación de crisis.</p>
            </div>
        </section>

        <section class="section" id="conclusiones-content">
            <div class="container">
                <div class="module-panel fade-in">
                    <h3><iconify-icon icon="heroicons:academic-cap" width="22"></iconify-icon> Qué se aprendió con las simulaciones</h3>
                    <div class="interpretation" style="background: var(--bg-card); border: 1px solid var(--gray-200); margin-top: 1rem;">
                        <ul style="padding-left:1.5rem; margin-top:0.5rem; line-height:1.8;">
                            <li><strong>Modelado de la realidad:</strong> Los métodos numéricos no son solo algoritmos abstractos, sino herramientas poderosas para modelar problemas reales complejos (abastecimiento, logística, precios, dinámicas sociales).</li>
                            <li><strong>Identificación de puntos críticos:</strong> Las simulaciones nos permitieron encontrar umbrales exactos de quiebre en el sistema (ej. día de desabastecimiento, punto donde el costo supera al ingreso), facilitando la toma de decisiones preventiva.</li>
                            <li><strong>Impacto en variables interconectadas:</strong> Se observó cómo un cambio inicial (ej. un bloqueo que reduce la capacidad de una ruta) afecta a toda la red de distribución de forma no lineal, resaltando la importancia del análisis sistémico.</li>
                        </ul>
                    </div>
                </div>

                <div class="module-panel mt-3 slide-up" style="animation-delay: 0.1s;">
                    <h3><iconify-icon icon="heroicons:scale" width="22"></iconify-icon> Comparación General de Métodos Numéricos</h3>
                    
                    <!-- Sistemas Lineales -->
                    <div class="mt-3">
                        <h4 style="color:var(--red-deep); display:flex; align-items:center; gap:0.5rem; margin-bottom:0.5rem;">
                            <iconify-icon icon="heroicons:table-cells" width="18"></iconify-icon> Sistemas de Ecuaciones
                        </h4>
                        <div class="table-wrapper">
                            <table class="data-table">
                                <thead>
                                    <tr><th>Método</th><th>Ventajas</th><th>Desventajas</th><th>Uso Ideal</th></tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td><strong>Jacobi</strong></td>
                                        <td>Muy simple, paralelizable.</td>
                                        <td>Convergencia lenta, requiere matriz diagonalmente dominante.</td>
                                        <td>Sistemas pequeños o didácticos.</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Gauss-Seidel</strong></td>
                                        <td>Convergencia más rápida que Jacobi.</td>
                                        <td>Difícil de paralelizar, aún requiere dominancia diagonal.</td>
                                        <td>Uso general iterativo estándar.</td>
                                    </tr>
                                    <tr>
                                        <td><strong>SOR</strong></td>
                                        <td>Convergencia muy rápida con el ω adecuado.</td>
                                        <td>Encontrar el ω óptimo puede ser difícil.</td>
                                        <td>Sistemas grandes donde el rendimiento es crítico.</td>
                                    </tr>
                                    <tr>
                                        <td><strong>LU</strong></td>
                                        <td>Directo, no iterativo, exacto. Reutilizable para distintos vectores 'b'.</td>
                                        <td>Alto costo computacional inicial O(n³).</td>
                                        <td>Múltiples simulaciones con la misma red (matriz A fija).</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Gradiente C.</strong></td>
                                        <td>Converge en pasos finitos, no usa derivadas.</td>
                                        <td>Exige matriz simétrica positiva definida.</td>
                                        <td>Grandes sistemas físicos y logísticos.</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- Raíces -->
                    <div class="mt-4">
                        <h4 style="color:var(--yellow-deep); display:flex; align-items:center; gap:0.5rem; margin-bottom:0.5rem;">
                            <iconify-icon icon="heroicons:magnifying-glass" width="18"></iconify-icon> Raíces de Ecuaciones
                        </h4>
                        <div class="table-wrapper">
                            <table class="data-table">
                                <thead>
                                    <tr><th>Método</th><th>Convergencia</th><th>Ventajas</th><th>Desventajas</th></tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td><strong>Bisección</strong></td>
                                        <td>Lineal (Lenta)</td>
                                        <td>Siempre converge si f(a)·f(b) < 0.</td>
                                        <td>Muy lento para alta precisión.</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Newton-R.</strong></td>
                                        <td>Cuadrática (Rápida)</td>
                                        <td>Excelente velocidad cerca de la raíz.</td>
                                        <td>Requiere la derivada exacta y buen punto inicial.</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Secante</strong></td>
                                        <td>Super-lineal (Media)</td>
                                        <td>No requiere derivadas explícitas.</td>
                                        <td>Requiere dos puntos iniciales, puede divergir.</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- EDOs -->
                    <div class="mt-4">
                        <h4 style="color:var(--green-deep); display:flex; align-items:center; gap:0.5rem; margin-bottom:0.5rem;">
                            <iconify-icon icon="heroicons:arrow-trending-down" width="18"></iconify-icon> Ecuaciones Diferenciales Ordinarias (EDOs)
                        </h4>
                        <div class="table-wrapper">
                            <table class="data-table">
                                <thead>
                                    <tr><th>Método</th><th>Orden de Error</th><th>Conclusión del Modelo de Vaciado</th></tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td><strong>Euler</strong></td>
                                        <td>O(h) - Primer orden</td>
                                        <td>Se separa rápido de la solución real si la demanda crece de forma no lineal. Útil solo para aproximaciones rápidas.</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Heun</strong></td>
                                        <td>O(h²) - Segundo orden</td>
                                        <td>Corrige el exceso de subestimación de Euler. Un balance decente entre costo y precisión para simulaciones diarias.</td>
                                    </tr>
                                    <tr>
                                        <td><strong>RK4</strong></td>
                                        <td>O(h⁴) - Cuarto orden</td>
                                        <td><strong>El más útil y preciso.</strong> Permitió calcular el día exacto de desabastecimiento con alto grado de confianza.</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div class="two-col mt-3 slide-up" style="animation-delay: 0.2s;">
                    <div class="module-panel">
                        <h3><iconify-icon icon="heroicons:shield-exclamation" width="22"></iconify-icon> Limitaciones de los Modelos</h3>
                        <ul style="padding-left:1.5rem; margin-top:0.75rem; color:var(--text-secondary); line-height:1.7;">
                            <li>Los modelos matemáticos simplifican la realidad; no consideran factores caóticos imprevistos como decisiones políticas repentinas o clima extremo.</li>
                            <li>La interpolación polinómica (Newton/Lagrange) tiende a oscilar si los datos de precios tienen picos abruptos (ruido en los datos).</li>
                            <li>La simulación de sistemas logísticos (Módulo 1) asume un comportamiento lineal y costos fijos, cuando en la vida real los costos aumentan exponencialmente bajo presión.</li>
                        </ul>
                    </div>
                    
                    <div class="module-panel">
                        <h3><iconify-icon icon="heroicons:arrow-path" width="22"></iconify-icon> Mejoras Futuras</h3>
                        <ul style="padding-left:1.5rem; margin-top:0.75rem; color:var(--text-secondary); line-height:1.7;">
                            <li>Implementar EDOs acopladas (sistemas de Ecuaciones Diferenciales) para vincular el desabastecimiento directamente con el incremento de precios en tiempo real.</li>
                            <li>Conectar la aplicación a una API de datos abiertos para alimentar los modelos numéricos con precios y reportes de reservas reales actualizados diariamente.</li>
                            <li>Añadir modelos de regresión por mínimos cuadrados para tendencias a largo plazo (además de la interpolación exacta).</li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>`;
    }

    return { render };
})();
