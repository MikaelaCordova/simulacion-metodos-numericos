/* ==========================================================================
   Module 2 — Escenario E: Raíces de Ecuaciones (Umbrales Críticos)
   ========================================================================== */

const Module2 = (() => {
    const SCENARIOS = {
        cost: {
            name: 'Costo vs Ingreso Familiar',
            desc: 'Modela el momento en que el costo acumulado de vida supera el ingreso familiar disponible.',
            equation: '<em>f</em>(<em>t</em>) = 1500·(1 + 0.03<em>t</em>)<sup>2</sup> − 3000',
            meaning: 'La raíz <em>t*</em> es el día exacto en que el gasto diario iguala al ingreso: a partir de ese día la familia entra en déficit.',
            xLabel: 'Tiempo (días)', yLabel: 'f(t) = Costo − Ingreso (Bs)',
            f: t => 1500*Math.pow(1+0.03*t,2) - 3000,
            df: t => 90*Math.pow(1+0.03*t,1),
            a: 0, b: 30, x0: 15, x1: 20
        },
        fuel: {
            name: 'Tasa de Reposición de Carburante',
            desc: 'Determina la tasa mínima de reposición para que la planta de carburante no entre en déficit.',
            equation: '<em>f</em>(<em>r</em>) = 500·e<sup>−0.1<em>r</em></sup> − 50<em>r</em> + 200',
            meaning: 'La raíz <em>r*</em> es la tasa de reposición exacta donde los ingresos de carburante igualan al consumo. Por encima de r*, hay superávit; por debajo, la planta se vacía.',
            xLabel: 'Tasa de reposición (r)', yLabel: 'f(r) = Reposición − Consumo',
            f: r => 500*Math.exp(-0.1*r) - 50*r + 200,
            df: r => -50*Math.exp(-0.1*r) - 50,
            a: 0, b: 20, x0: 5, x1: 10
        },
        social: {
            name: 'Umbral Social de Masificación',
            desc: 'Encuentra el porcentaje de opinión pública a partir del cual un movimiento social se vuelve masivo.',
            equation: '<em>f</em>(<em>p</em>) = 1/(1 + e<sup>−0.5(<em>p</em>−50)</sup>) − 0.8',
            meaning: 'La raíz <em>p*</em> es el porcentaje de adhesión donde la curva logística de opinión pública cruza el umbral de masificación (80%). Superar este punto genera cambio social irreversible.',
            xLabel: 'Porcentaje de opinión pública (%)', yLabel: 'f(p) = Adhesión − Umbral',
            f: p => 1/(1+Math.exp(-0.5*(p-50))) - 0.8,
            df: p => { const e=Math.exp(-0.5*(p-50)); return 0.5*e/Math.pow(1+e,2); },
            a: 40, b: 80, x0: 55, x1: 60
        }
    };

    function render() {
        return UI.createModuleSection({
            icon: 'heroicons:magnifying-glass', iconColor: 'yellow',
            title: 'Escenario E: Raíces de Ecuaciones',
            subtitle: 'Umbrales críticos de abastecimiento — Bisección, Newton-Raphson y Secante',
            id: 'mod2'
        });
    }

    function init() {
        const c = document.getElementById('mod2-content');
        if (!c) return;
        const opts = Object.entries(SCENARIOS).map(([k,v]) => `<option value="${k}">${v.name}</option>`).join('');
        c.innerHTML = `
        <div class="method-explanation" style="background-color:var(--bg-card);border-left:4px solid var(--yellow-medium);padding:1.5rem;margin-bottom:1.5rem;border-radius:var(--radius-md);box-shadow:var(--shadow-sm);">
            <h4 style="color:var(--yellow-deep);margin-bottom:0.75rem;display:flex;align-items:center;gap:0.5rem;">
                <iconify-icon icon="heroicons:exclamation-triangle" width="22"></iconify-icon> Planteamiento del Problema
            </h4>
            <p style="font-size:1.02rem;line-height:1.7;margin-bottom:1rem;">
                Durante una crisis prolongada, ciertos indicadores alcanzan <strong>"puntos de quiebre"</strong> donde la situación se vuelve insostenible — por ejemplo, el día en que el costo de vida iguala al ingreso familiar. Estos puntos de equilibrio son matemáticamente las <strong>raíces</strong> de funciones no lineales: los valores de <em>x</em> donde <span class="math-inline"><em>f</em>(<em>x</em>) = 0</span>, es decir, donde dos fuerzas opuestas se igualan.
            </p>
            <div class="math-block"><em>f</em>(<em>x</em>) = 0 &nbsp;→&nbsp; hallar <em>x*</em> (el umbral crítico)</div>
            <p style="font-size:0.78rem;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:var(--text-secondary);margin-bottom:0.5rem;margin-top:1.25rem;">
                <iconify-icon icon="heroicons:variable" width="14" style="vertical-align:middle;"></iconify-icon> ¿Qué significa cada parámetro?
            </p>
            ${UI.createVarGrid([
                { symbol: '<em>f</em>(<em>x</em>)', color: 'yellow', name: 'Función a analizar', desc: 'Diferencia entre dos magnitudes en conflicto. Cuando <em>f(x) = 0</em>, las dos fuerzas se equilibran — ese es el umbral.' },
                { symbol: '[<em>a</em>,<em>b</em>]', color: 'red',    name: 'Intervalo de búsqueda', desc: 'Rango donde se busca la raíz. Debe cumplir que <em>f(a)</em> y <em>f(b)</em> tengan signos opuestos (cambio de signo).' },
                { symbol: '<em>x</em><sub>0</sub>',  color: 'blue',   name: 'Punto inicial (Newton)', desc: 'Estimación inicial de dónde está la raíz. Newton-Raphson parte desde este punto y usa la pendiente para acercarse.' },
                { symbol: 'ε',                        color: 'green',  name: 'Tolerancia',            desc: 'El método para cuando la raíz no cambia más de ε entre dos pasos consecutivos.' }
            ])}
        </div>

        <div class="module-panel">
            <h3><iconify-icon icon="heroicons:adjustments-horizontal" width="22"></iconify-icon> Parámetros de Simulación</h3>
            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">Escenario de crisis</label>
                    <select class="form-select" id="m2-scenario" onchange="Module2.updateScenario()">${opts}</select>
                    <span class="form-hint">Define qué umbral crítico se está buscando</span>
                </div>
                <div class="form-group" style="background:hsla(45,80%,90%,0.4);padding:0.75rem;border-radius:var(--radius-sm);border:1px solid var(--yellow-pastel);">
                    <label class="form-label" style="color:var(--yellow-deep);font-weight:700;">
                        <iconify-icon icon="heroicons:cursor-arrow-rays" width="16" style="vertical-align:middle;"></iconify-icon> Método de búsqueda
                    </label>
                    <select class="form-select" id="m2-method" style="border:2px solid var(--yellow-medium);font-weight:600;">
                        <option value="todos" selected>Todos (comparar)</option>
                        <option value="bisec">Bisección</option>
                        <option value="newton">Newton-Raphson</option>
                        <option value="secant">Secante</option>
                    </select>
                </div>
            </div>

            <!-- Ecuación activa -->
            <div id="m2-eq-display" class="context-box" style="background:hsla(45,80%,97%,0.7);border-color:var(--yellow-pastel);margin-bottom:1rem;">
                <div class="context-box-header" style="color:var(--yellow-deep);">
                    <iconify-icon icon="heroicons:calculator" width="15"></iconify-icon> Ecuación del escenario activo
                </div>
                <div class="math-block" id="m2-eq-formula" style="font-size:1.1rem;justify-content:flex-start;">${SCENARIOS.cost.equation} = 0</div>
                <p id="m2-eq-meaning" style="margin-top:0.5rem;">${SCENARIOS.cost.meaning}</p>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label class="form-label" for="m2-a">Límite inferior <span class="math-inline"><em>a</em></span></label>
                    <input class="form-input" type="number" id="m2-a" value="0" step="any">
                    <span class="form-hint">Inicio del intervalo de búsqueda</span>
                </div>
                <div class="form-group">
                    <label class="form-label" for="m2-b">Límite superior <span class="math-inline"><em>b</em></span></label>
                    <input class="form-input" type="number" id="m2-b" value="30" step="any">
                    <span class="form-hint">Fin del intervalo. f(a) y f(b) deben tener signos opuestos</span>
                </div>
                <div class="form-group">
                    <label class="form-label" for="m2-x0">Punto inicial <span class="math-inline"><em>x</em><sub>0</sub></span></label>
                    <input class="form-input" type="number" id="m2-x0" value="15" step="any">
                    <span class="form-hint">Estimación inicial para Newton-Raphson</span>
                </div>
                <div class="form-group">
                    <label class="form-label" for="m2-x1">Segundo punto <span class="math-inline"><em>x</em><sub>1</sub></span></label>
                    <input class="form-input" type="number" id="m2-x1" value="20" step="any">
                    <span class="form-hint">Segunda estimación para el método Secante</span>
                </div>
            </div>
            <div class="form-row mt-2">
                <div class="form-group">
                    <label class="form-label" for="m2-tol">Tolerancia <span class="math-inline">ε</span></label>
                    <input class="form-input" type="number" id="m2-tol" value="0.00001" step="any">
                    <span class="form-hint">Precisión requerida (ej: 0.00001 = 5 decimales)</span>
                </div>
                <div class="form-group">
                    <label class="form-label" for="m2-maxiter">Máx. Iteraciones</label>
                    <input class="form-input" type="number" id="m2-maxiter" value="100" step="1">
                    <span class="form-hint">Límite de cálculos antes de rendirse</span>
                </div>
            </div>
            <div class="btn-group">
                <button class="btn btn-primary" onclick="Module2.solve()"><iconify-icon icon="heroicons:play" width="18"></iconify-icon> Encontrar Umbral Crítico</button>
            </div>
        </div>
        <div id="m2-results"></div>`;
    }

    function updateScenario() {
        const sk = document.getElementById('m2-scenario').value;
        const s = SCENARIOS[sk];
        document.getElementById('m2-a').value = s.a;
        document.getElementById('m2-b').value = s.b;
        document.getElementById('m2-x0').value = s.x0;
        document.getElementById('m2-x1').value = s.x1;
        document.getElementById('m2-eq-formula').innerHTML = `${s.equation} = 0`;
        document.getElementById('m2-eq-meaning').textContent = s.meaning;
    }

    function solve() {
        const sk = document.getElementById('m2-scenario').value;
        const s = SCENARIOS[sk];
        const a = parseFloat(document.getElementById('m2-a').value);
        const b = parseFloat(document.getElementById('m2-b').value);
        const x0 = parseFloat(document.getElementById('m2-x0').value);
        const x1 = parseFloat(document.getElementById('m2-x1').value);
        const tol = parseFloat(document.getElementById('m2-tol').value) || 1e-5;
        const maxIter = parseInt(document.getElementById('m2-maxiter').value) || 100;
        const methodKey = document.getElementById('m2-method').value;
        const rd = document.getElementById('m2-results');

        const R = {};
        if (methodKey === 'todos' || methodKey === 'bisec')  { try { R.bisec  = Roots.bisection(s.f, a, b, {tol, maxIter}) } catch(e) { R.bisec  = { error: e.message } } }
        if (methodKey === 'todos' || methodKey === 'newton') { try { R.newton = Roots.newtonRaphson(s.f, s.df, x0, {tol, maxIter}) } catch(e) { R.newton = { error: e.message } } }
        if (methodKey === 'todos' || methodKey === 'secant') { try { R.secant = Roots.secant(s.f, x0, x1, {tol, maxIter}) } catch(e) { R.secant = { error: e.message } } }

        const allMs = [{k:'bisec',n:'Bisección'},{k:'newton',n:'Newton-Raphson'},{k:'secant',n:'Secante'}];
        const ms = allMs.filter(m => R[m.k]);

        let h = `<div class="results-grid">`;
        ms.forEach(m => {
            const r = R[m.k];
            if (r.error) { h += UI.createResultCard(m.n, 'Error', r.error, 'error'); return; }
            h += UI.createResultCard(
                m.n,
                r.root !== null ? r.root.toFixed(6) : '—',
                `${r.iterations} iteraciones — ${r.converged ? '✓ Convergió' : '✗ No convergió'}`,
                r.converged ? 'success' : 'warning'
            );
        });
        h += `</div>`;

        ms.forEach(m => {
            const r = R[m.k]; if (r.error || !r.history.length) return;
            let hdr, rows;
            if (m.k === 'bisec') {
                hdr = ['Iter','<em>a</em>','<em>b</em>','<em>c</em> (punto medio)','<em>f(c)</em>','Error'];
                rows = r.history.map(h => [h.iteration, h.a.toFixed(6), h.b.toFixed(6), h.c.toFixed(6), h.fc.toExponential(4), h.error.toExponential(4)]);
            } else if (m.k === 'newton') {
                hdr = ['Iter','<em>x<sub>n</sub></em>','<em>f(x<sub>n</sub>)</em>',"<em>f'(x<sub>n</sub>)</em>",'<em>x<sub>n+1</sub></em>','Error'];
                rows = r.history.map(h => [h.iteration, h.x.toFixed(6), h.fx.toExponential(4), h.dfx.toFixed(4), h.xNew.toFixed(6), h.error.toExponential(4)]);
            } else {
                hdr = ['Iter','<em>x<sub>n-1</sub></em>','<em>x<sub>n</sub></em>','<em>x<sub>n+1</sub></em>','<em>f(x<sub>n</sub>)</em>','Error'];
                rows = r.history.map(h => [h.iteration, h.xPrev.toFixed(6), h.xCurr.toFixed(6), h.xNew.toFixed(6), h.fCurr.toExponential(4), h.error.toExponential(4)]);
            }
            const order = Roots.estimateConvergenceOrder(r.history);
            h += `<div class="module-panel mt-2"><h3>${m.n}</h3>`;
            h += UI.createConvergenceIndicator(r.converged, r.iterations, r.history[r.history.length-1]?.error);
            if (order) h += `<span class="convergence-indicator slow" style="margin-left:0.5rem">Orden ≈ ${order.toFixed(2)}</span>`;
            h += UI.createTable(hdr, rows, { highlightLast: true });
            h += `</div>`;
        });

        h += `<div class="two-col mt-3"><div>${UI.createChartContainer('m2-chart-func','Función — La raíz es donde f(x) = 0 (cruza el eje)')}</div><div>${UI.createChartContainer('m2-chart-err','Velocidad de Convergencia del Error')}</div></div>`;

        const allRoots = ms.filter(m => R[m.k].root !== null && R[m.k].converged).map(m => ({ name: m.n, root: R[m.k].root, iter: R[m.k].iterations }));
        const fastest = allRoots.length ? allRoots.reduce((a, b2) => a.iter <= b2.iter ? a : b2) : null;
        const orders = { bisec: 1, newton: 2, secant: 1.618 };

        const rootMeaning = sk === 'cost'
            ? (allRoots[0] ? `El día <strong>${allRoots[0].root.toFixed(1)}</strong> es el "punto de quiebre económico": a partir de ese momento, el gasto diario supera el ingreso familiar y la familia entra en déficit. Cada día adicional profundiza la deuda.` : '')
            : sk === 'fuel'
            ? (allRoots[0] ? `La tasa de reposición de equilibrio es <strong>r* ≈ ${allRoots[0].root.toFixed(4)}</strong> unidades/día. Por debajo de este valor, el consumo supera la reposición y las reservas se agotan progresivamente.` : '')
            : (allRoots[0] ? `El umbral de masificación social se alcanza con <strong>p* ≈ ${allRoots[0].root.toFixed(2)}%</strong> de adhesión. Superar este porcentaje desencadena un efecto de "bola de nieve" que hace irreversible el movimiento social.` : '');

        const anyConverged = ms.some(m => R[m.k].converged && !R[m.k].error);
        const anyFailed = ms.some(m => (!R[m.k].converged || R[m.k].error));

        let convergenceContent = '';
        if (anyConverged && !anyFailed) {
            convergenceContent = `<p><strong>¡La simulación convergió!</strong> Logramos identificar con certeza el momento o punto exacto de la crisis (el umbral crítico). El cálculo se refinó hasta que la incertidumbre sobre este punto fue menor a <span class="math-inline">ε = ${tol}</span>.</p>`;
        } else if (anyConverged && anyFailed) {
            convergenceContent = `<p><strong>Algunos métodos convergieron y otros no.</strong> Los métodos exitosos lograron identificar con certeza el momento exacto de la crisis. Los que fallaron se despistaron probablemente debido a estimaciones iniciales poco precisas o porque la función cambia de forma abrupta en esas zonas.</p>`;
        } else {
            convergenceContent = `<p><strong>La simulación NO convergió.</strong> Esto indica que no pudimos encontrar el punto de crisis con los datos ingresados: tal vez el umbral no ocurre dentro del rango analizado (no hay cruce de umbral), o la situación inicial asumida estaba demasiado lejos de la realidad y despistó a los algoritmos.</p>`;
        }

        if (allRoots.length) {
            h += UI.createRichInterpretation([
                {
                    title: 'Significado de la raíz encontrada',
                    icon: 'heroicons:map-pin',
                    content: `<p>${rootMeaning}</p>
                    <ul>${allRoots.map(r => `<li><strong>${r.name}:</strong> umbral = <span class="interp-highlight">${r.root.toFixed(6)}</span> en ${r.iter} iteraciones</li>`).join('')}</ul>`
                },
                {
                    title: 'Estado de la simulación (Convergencia)',
                    icon: 'heroicons:information-circle',
                    content: convergenceContent
                },
                {
                    title: 'Velocidad de convergencia comparada',
                    icon: 'heroicons:chart-bar',
                    content: `<ul>
                        ${ms.filter(m => R[m.k].converged && !R[m.k].error).map(m => {
                            const r = R[m.k]; const ord = orders[m.k];
                            const badge = ord >= 2 ? '<span class="interp-badge good">Cuadrática (rápida)</span>' : ord > 1 ? '<span class="interp-badge warn">Superlineal</span>' : '<span class="interp-badge info">Lineal (lenta)</span>';
                            return `<li><strong>${m.n}:</strong> ${r.iter} iteraciones, orden ${ord} ${badge} — ${
                                m.k === 'bisec' ? 'garantiza convergencia pero requiere muchas iteraciones' :
                                m.k === 'newton' ? 'muy rápido pero requiere calcular la derivada f\'(x)' :
                                'similar a Newton pero sin necesitar la derivada explícita'
                            }</li>`;
                        }).join('')}
                    </ul>
                    ${fastest ? `<p style="margin-top:0.4rem;"><strong>${fastest.name}</strong> fue el más eficiente para este escenario (${fastest.iter} iteraciones).</p>` : ''}`
                },
                {
                    title: 'Conclusión práctica',
                    icon: 'heroicons:light-bulb',
                    content: `<p>Conocer el umbral crítico permite <strong>anticipar</strong> la crisis antes de que ocurra y tomar medidas preventivas:</p>
                    <ul>
                        <li>${sk === 'cost' ? 'Subsidios o bonos de emergencia deben activarse antes del día umbral calculado para evitar que las familias entren en déficit.' : sk === 'fuel' ? 'Las autoridades deben garantizar una tasa de reposición mayor a r* para evitar el vaciado de las plantas.' : 'Las acciones de contención social deben intensificarse antes de alcanzar el umbral p* para evitar la masificación irreversible.'}</li>
                        <li>Para tomar decisiones de política urgente, <strong>Newton-Raphson</strong> es el método recomendado por su velocidad, siempre que se tenga una buena estimación inicial.</li>
                        <li>Si hay incertidumbre en el punto de partida, <strong>Bisección</strong> es más seguro (garantiza encontrar la raíz si existe en [a,b]).</li>
                    </ul>`
                }
            ]);
        }

        h += `<div class="module-panel mt-3"><h3><iconify-icon icon="heroicons:academic-cap" width="22"></iconify-icon> ¿Qué hace cada método?</h3>`;
        h += UI.createMethodExplanation('Bisección', 'Divide el intervalo [a,b] a la mitad repetidamente. <strong>Garantiza</strong> encontrar la raíz si existe en el intervalo (convergencia lineal, orden 1). Lento pero infalible.');
        h += UI.createMethodExplanation('Newton-Raphson', 'Usa la tangente: <em>x<sub>n+1</sub> = x<sub>n</sub> − f(x<sub>n</sub>) / f\'(x<sub>n</sub>)</em>. <strong>Convergencia cuadrática</strong> (orden 2): cada iteración duplica los dígitos correctos. Requiere conocer la derivada.');
        h += UI.createMethodExplanation('Secante', 'Aproxima la derivada usando dos puntos anteriores. <strong>Convergencia superlineal</strong> (orden ≈ 1.618). Casi tan rápido como Newton pero sin derivada explícita.');
        h += `</div>`;

        rd.innerHTML = h;
        setTimeout(() => { _drawFunctionChart(s, R, ms); _drawErrorChart(R, ms); }, 100);
    }

    function _drawFunctionChart(s, R, ms) {
        const xMin = parseFloat(document.getElementById('m2-a').value) - 2;
        const xMax = parseFloat(document.getElementById('m2-b').value) + 2;
        const pts = []; for (let x = xMin; x <= xMax; x += (xMax-xMin)/200) pts.push({ x, y: s.f(x) });
        Charts.createLineChart('m2-chart-func', { labels: pts.map(p => p.x.toFixed(1)), datasets: [{ label: 'f(x)', data: pts.map(p => p.y), pointRadius: 0, borderWidth: 2.5 }], xLabel: s.xLabel, yLabel: s.yLabel });
    }

    function _drawErrorChart(R, ms) {
        const datasets = [];
        ms.forEach(m => { const r = R[m.k]; if (r.error || !r.history.length) return; datasets.push({ label: m.n, data: r.history.map(h => h.error) }); });
        if (!datasets.length) return;
        const ml = Math.max(...datasets.map(d => d.data.length));
        Charts.createLineChart('m2-chart-err', { labels: Array.from({ length: ml }, (_, i) => i+1), datasets, xLabel: 'Iteración', yLabel: 'Error' });
    }

    return { render, init, solve, updateScenario };
})();
