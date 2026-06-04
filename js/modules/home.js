/* ==========================================================================
   Home Module — Landing page with context, objectives, and navigation cards
   ========================================================================== */

const HomeModule = (() => {

    function render() {
        return `
        <!-- Hero -->
        <section class="hero">
            <div class="container hero-content">
                <div class="hero-badge">
                    <iconify-icon icon="heroicons:academic-cap" width="16"></iconify-icon>
                    Métodos Numéricos — Proyecto Final
                </div>
                <h1>Simulación Numérica de Abastecimiento, Precios y Conflicto Social en Contexto de Crisis</h1>
                <p>Aplicación interactiva que modela y visualiza escenarios reales de Bolivia utilizando métodos numéricos computacionales.</p>
            </div>
        </section>

        <!-- Contexto -->
        <section class="section">
            <div class="container">
                <div class="section-header slide-up">
                    <div class="section-icon red">
                        <iconify-icon icon="heroicons:globe-americas" width="28"></iconify-icon>
                    </div>
                    <h2 class="section-title">Contexto del Problema</h2>
                    <p class="section-subtitle">Comprendiendo la situación actual del país</p>
                </div>

                <div class="two-col fade-in">
                    <div class="card">
                        <div class="card-header">
                            <div class="card-icon red">
                                <iconify-icon icon="heroicons:exclamation-triangle" width="22"></iconify-icon>
                            </div>
                            <div class="card-title">Problemática</div>
                        </div>
                        <div class="card-text">
                            <p>Bolivia enfrenta desafíos relacionados con el abastecimiento de carburantes, incremento en precios de alimentos, bloqueos, conflictos sociales y pérdida del poder adquisitivo familiar.</p>
                            <ul style="margin-top:0.75rem;padding-left:1.25rem;">
                                <li>Escasez de combustibles en estaciones de servicio</li>
                                <li>Aumento progresivo de precios de la canasta básica</li>
                                <li>Bloqueos que afectan rutas de transporte</li>
                                <li>Rumores y pánico social que amplifican la crisis</li>
                                <li>Reducción del poder adquisitivo de las familias</li>
                            </ul>
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-header">
                            <div class="card-icon green">
                                <iconify-icon icon="heroicons:light-bulb" width="22"></iconify-icon>
                            </div>
                            <div class="card-title">Objetivo de la Simulación</div>
                        </div>
                        <div class="card-text">
                            <p>Utilizar los métodos numéricos como herramientas para comprender, modelar y analizar la realidad del país a través de simulaciones computacionales.</p>
                            <ul style="margin-top:0.75rem;padding-left:1.25rem;">
                                <li>Modelar la distribución óptima de recursos</li>
                                <li>Predecir tendencias de precios mediante interpolación</li>
                                <li>Calcular costos acumulados con integración numérica</li>
                                <li>Simular el agotamiento de reservas de carburantes</li>
                                <li>Encontrar umbrales críticos en el sistema</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Módulos -->
        <section class="section section-alt">
            <div class="container">
                <div class="section-header slide-up">
                    <div class="section-icon yellow">
                        <iconify-icon icon="heroicons:squares-2x2" width="28"></iconify-icon>
                    </div>
                    <h2 class="section-title">Módulos de Simulación</h2>
                    <p class="section-subtitle">Explora cada escenario con los métodos numéricos implementados</p>
                </div>

                <div class="card-grid stagger">
                    <a href="#modulo1" class="card-link">
                        <div class="card">
                            <div class="card-header">
                                <div class="card-icon red">
                                    <b style="font-size:1.15em;">A</b>
                                </div>
                                <div>
                                    <div class="card-title">Escenario A: Sistemas de Ecuaciones</div>
                                </div>
                            </div>
                            <div class="card-text">
                                Optimización del abastecimiento y red de transporte mediante Jacobi, Gauss-Seidel, SOR, LU y Gradiente Conjugado.
                            </div>
                            <div class="mt-3">
                                <span class="btn btn-secondary" style="font-size: 0.85rem; padding: 0.4rem 1rem;">Ver Escenario &rarr;</span>
                            </div>
                        </div>
                    </a>

                    <a href="#modulo5" class="card-link">
                        <div class="card">
                            <div class="card-header">
                                <div class="card-icon yellow">
                                    <b style="font-size:1.15em;">B</b>
                                </div>
                                <div>
                                    <div class="card-title">Escenario B: Ecuaciones Diferenciales</div>
                                </div>
                            </div>
                            <div class="card-text">
                                Simulación de vaciado de reservas de carburantes con Euler, Heun y RK4.
                            </div>
                            <div class="mt-3">
                                <span class="btn btn-secondary" style="font-size: 0.85rem; padding: 0.4rem 1rem;">Ver Escenario &rarr;</span>
                            </div>
                        </div>
                    </a>

                    <a href="#modulo3" class="card-link">
                        <div class="card">
                            <div class="card-header">
                                <div class="card-icon green">
                                    <b style="font-size:1.15em;">C</b>
                                </div>
                                <div>
                                    <div class="card-title">Escenario C: Interpolación</div>
                                </div>
                            </div>
                            <div class="card-text">
                                Curvas de precios de alimentos básicos usando Lagrange, Newton y Splines Cúbicos.
                            </div>
                            <div class="mt-3">
                                <span class="btn btn-secondary" style="font-size: 0.85rem; padding: 0.4rem 1rem;">Ver Escenario &rarr;</span>
                            </div>
                        </div>
                    </a>

                    <a href="#modulo4" class="card-link">
                        <div class="card">
                            <div class="card-header">
                                <div class="card-icon red">
                                    <b style="font-size:1.15em;">D</b>
                                </div>
                                <div>
                                    <div class="card-title">Escenario D: Integración Numérica</div>
                                </div>
                            </div>
                            <div class="card-text">
                                Costo acumulado y pérdida del poder adquisitivo familiar con Trapecio, Simpson 1/3 y 3/8.
                            </div>
                            <div class="mt-3">
                                <span class="btn btn-secondary" style="font-size: 0.85rem; padding: 0.4rem 1rem;">Ver Escenario &rarr;</span>
                            </div>
                        </div>
                    </a>

                    <a href="#modulo2" class="card-link">
                        <div class="card">
                            <div class="card-header">
                                <div class="card-icon yellow">
                                    <b style="font-size:1.15em;">E</b>
                                </div>
                                <div>
                                    <div class="card-title">Escenario E: Raíces de Ecuaciones</div>
                                </div>
                            </div>
                            <div class="card-text">
                                Umbrales críticos de abastecimiento resueltos con Bisección, Newton-Raphson y Secante.
                            </div>
                            <div class="mt-3">
                                <span class="btn btn-secondary" style="font-size: 0.85rem; padding: 0.4rem 1rem;">Ver Escenario &rarr;</span>
                            </div>
                        </div>
                    </a>
                </div>

                <!-- Métodos utilizados -->
                <div class="mt-4">
                    <div class="module-panel">
                        <h3>
                            <iconify-icon icon="heroicons:cpu-chip" width="22"></iconify-icon>
                            Métodos Numéricos Implementados
                        </h3>
                        <div class="card-grid" style="grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));">
                            <div>
                                <strong style="color:var(--red-deep);">Sistemas Lineales</strong>
                                <ul style="padding-left:1.25rem;margin-top:0.35rem;color:var(--text-secondary);font-size:0.9rem;">
                                    <li>Jacobi</li>
                                    <li>Gauss-Seidel</li>
                                    <li>SOR</li>
                                    <li>Factorización LU</li>
                                    <li>Gradiente Conjugado</li>
                                </ul>
                            </div>
                            <div>
                                <strong style="color:var(--yellow-deep);">Raíces</strong>
                                <ul style="padding-left:1.25rem;margin-top:0.35rem;color:var(--text-secondary);font-size:0.9rem;">
                                    <li>Bisección</li>
                                    <li>Newton-Raphson</li>
                                    <li>Secante</li>
                                </ul>
                            </div>
                            <div>
                                <strong style="color:var(--green-deep);">Interpolación</strong>
                                <ul style="padding-left:1.25rem;margin-top:0.35rem;color:var(--text-secondary);font-size:0.9rem;">
                                    <li>Lagrange</li>
                                    <li>Newton</li>
                                    <li>Splines Cúbicos</li>
                                </ul>
                            </div>
                            <div>
                                <strong style="color:var(--red-deep);">Integración</strong>
                                <ul style="padding-left:1.25rem;margin-top:0.35rem;color:var(--text-secondary);font-size:0.9rem;">
                                    <li>Regla del Trapecio</li>
                                    <li>Simpson 1/3</li>
                                    <li>Simpson 3/8</li>
                                </ul>
                            </div>
                            <div>
                                <strong style="color:var(--yellow-deep);">EDOs</strong>
                                <ul style="padding-left:1.25rem;margin-top:0.35rem;color:var(--text-secondary);font-size:0.9rem;">
                                    <li>Euler</li>
                                    <li>Heun</li>
                                    <li>Runge-Kutta (RK4)</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>`;
    }

    return { render };
})();
