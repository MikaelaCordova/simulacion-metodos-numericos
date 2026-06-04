/* ==========================================================================
   Module 5 — Escenario B: Ecuaciones Diferenciales (EDOs)
   ========================================================================== */

const Module5 = (() => {

    function render() {
        return UI.createModuleSection({
            icon:'heroicons:arrow-trending-down', iconColor:'yellow',
            title:'Escenario B: Ecuaciones Diferenciales',
            subtitle:'Vaciado crítico de reservas en plantas de carburantes — Euler, Heun y RK4',
            id:'mod5'
        });
    }

    function init() {
        const c = document.getElementById('mod5-content'); if (!c) return;
        c.innerHTML = `
        <div class="method-explanation" style="background-color:var(--bg-card);border-left:4px solid var(--yellow-medium);padding:1.5rem;margin-bottom:1.5rem;border-radius:var(--radius-md);box-shadow:var(--shadow-sm);">
            <h4 style="color:var(--yellow-deep);margin-bottom:0.75rem;display:flex;align-items:center;gap:0.5rem;">
                <iconify-icon icon="heroicons:exclamation-triangle" width="22"></iconify-icon> Planteamiento del Problema
            </h4>
            <p style="font-size:1.02rem;line-height:1.7;margin-bottom:1rem;">
                Los bloqueos de carreteras cortan el suministro a las plantas de carburante mientras el pánico hace que el consumo aumente cada día más. Esta situación dinámica se modela con una <strong>ecuación diferencial ordinaria (EDO)</strong>: una ecuación que describe <em>cómo cambia</em> el nivel de reservas día a día. Resolverla numéricamente permite proyectar el día exacto del colapso total.
            </p>
            <div class="math-block">
                <span style="display:inline-flex;flex-direction:column;align-items:center;font-family:Georgia;font-style:italic;font-size:1rem;vertical-align:middle;margin-right:0.25rem;">
                    <span style="border-bottom:1.5px solid currentColor;padding-bottom:2px;">d<em>R</em></span>
                    <span style="padding-top:2px;">d<em>t</em></span>
                </span>
                &nbsp;= &nbsp;<em>Entrada</em> &minus; <em>Salida</em>(<em>t</em>)
            </div>
            <p style="font-size:0.78rem;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:var(--text-secondary);margin-bottom:0.5rem;margin-top:1.25rem;">
                <iconify-icon icon="heroicons:variable" width="14" style="vertical-align:middle;"></iconify-icon> ¿Qué significa cada parámetro?
            </p>
            ${UI.createVarGrid([
                { symbol: '<em>R</em>(<em>t</em>)', color: 'yellow', name: 'Reserva en el día t', desc: 'Litros de carburante disponibles en la planta durante el día <em>t</em>. Empieza en <em>R(0)</em> y decrece conforme avanza la crisis.' },
                { symbol: '<span style="font-family:Georgia;font-style:italic">dR/dt</span>', color: 'red', name: 'Tasa de cambio', desc: 'Cuántos litros se pierden (o ganan) por día. Negativo = la planta se está vaciando. Este es el corazón de la EDO.' },
                { symbol: '<em>h</em>', color: 'blue',   name: 'Paso de integración', desc: 'El "salto" de tiempo entre cada cálculo. Un paso menor (<em>h</em> = 0.1) da más precisión que un paso mayor (<em>h</em> = 1).' },
                { symbol: '<em>α</em>', color: 'green',  name: 'Factor de pánico', desc: 'El porcentaje en que aumenta el consumo diario por el pánico social. Si α = 5%, el día 2 se consume 5% más que el día 1.' }
            ])}
        </div>

        <div class="module-panel">
            <h3><iconify-icon icon="heroicons:adjustments-horizontal" width="22"></iconify-icon> Parámetros de la Simulación</h3>
            <div class="context-box" style="background:hsla(45,80%,97%,0.6);border-color:var(--yellow-pastel);margin-bottom:1rem;">
                <div class="context-box-header" style="color:var(--yellow-deep);">
                    <iconify-icon icon="heroicons:information-circle" width="15"></iconify-icon> Cómo interpretar los parámetros
                </div>
                <p>Imagina una cisterna: cada día entra agua (<strong>Abastecimiento</strong>) y sale agua (<strong>Consumo</strong>). Si sale más de lo que entra, el nivel baja. El <strong>Factor de Pánico</strong> hace que la demanda crezca cada día (la gente consume más acelerado por miedo a quedarse sin carburante). La simulación calcula cuándo la cisterna llega a cero.</p>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label class="form-label" for="m5-r0">Reserva Inicial <span class="math-inline"><em>R</em>(0)</span></label>
                    <input class="form-input" type="number" id="m5-r0" value="100000" step="1000">
                    <span class="form-hint">Litros disponibles al inicio de la crisis (día 0)</span>
                </div>
                <div class="form-group">
                    <label class="form-label" for="m5-in">Abastecimiento diario (Entrada)</label>
                    <input class="form-input" type="number" id="m5-in" value="15000" step="1000">
                    <span class="form-hint">Litros que ingresan por día (cisternas que llegan)</span>
                </div>
                <div class="form-group">
                    <label class="form-label" for="m5-out">Consumo base diario (Salida)</label>
                    <input class="form-input" type="number" id="m5-out" value="20000" step="1000">
                    <span class="form-hint">Litros consumidos el día 0 (sin efecto pánico)</span>
                </div>
            </div>
            <div class="form-row mt-2">
                <div class="form-group" style="grid-column:1/-1">
                    <label class="form-label" for="m5-panic">Factor de Pánico <span class="math-inline"><em>α</em></span> — Incremento diario del consumo (%)</label>
                    <input type="range" id="m5-panic" min="0" max="20" value="5" step="1" style="width:100%" oninput="document.getElementById('m5-panic-val').textContent=this.value+'%'">
                    <div style="text-align:right;font-size:0.85rem;color:var(--yellow-deep);font-weight:800;" id="m5-panic-val">5%</div>
                    <span class="form-hint" style="display:block;margin-top:-8px;">0% = consumo constante | 20% = crisis de pánico extrema. Cada día el consumo aumenta este porcentaje adicional.</span>
                </div>
            </div>
            <div class="form-row mt-2">
                <div class="form-group">
                    <label class="form-label" for="m5-h">Paso de Integración <span class="math-inline"><em>h</em></span></label>
                    <input class="form-input" type="number" id="m5-h" value="1" step="0.1" max="5">
                    <span class="form-hint">Precisión temporal: 1 = por días, 0.1 = por décimas de día</span>
                </div>
                <div class="form-group">
                    <label class="form-label" for="m5-days">Días a simular</label>
                    <input class="form-input" type="number" id="m5-days" value="30" step="1">
                    <span class="form-hint">Cuántos días proyectar hacia adelante</span>
                </div>
                <div class="form-group">
                    <label class="form-label" for="m5-crit">Nivel Crítico de Alerta</label>
                    <input class="form-input" type="number" id="m5-crit" value="10000" step="1000">
                    <span class="form-hint">Litros mínimos de reserva antes de declarar emergencia</span>
                </div>
                <div class="form-group" style="background:hsla(45,80%,90%,0.4);padding:0.75rem;border-radius:var(--radius-sm);border:1px solid var(--yellow-pastel);">
                    <label class="form-label" style="color:var(--yellow-deep);font-weight:700;">
                        <iconify-icon icon="heroicons:cursor-arrow-rays" width="16" style="vertical-align:middle;"></iconify-icon> Método numérico
                    </label>
                    <select class="form-select" id="m5-method" style="border:2px solid var(--yellow-medium);font-weight:600;">
                        <option value="todos" selected>Todos (comparar)</option>
                        <option value="euler">Euler</option>
                        <option value="heun">Heun (Euler Mejorado)</option>
                        <option value="rk4">Runge-Kutta 4 (RK4)</option>
                    </select>
                </div>
            </div>
            <div class="btn-group">
                <button class="btn btn-primary" onclick="Module5.solve()"><iconify-icon icon="heroicons:play" width="18"></iconify-icon> Simular Vaciado de Reservas</button>
            </div>
        </div>
        <div id="m5-results"></div>`;
    }

    function solve() {
        const R0 = parseFloat(document.getElementById('m5-r0').value);
        const inputRate = parseFloat(document.getElementById('m5-in').value);
        const outBase = parseFloat(document.getElementById('m5-out').value);
        const panicFactor = parseFloat(document.getElementById('m5-panic').value) / 100;
        const h = parseFloat(document.getElementById('m5-h').value);
        const days = parseInt(document.getElementById('m5-days').value);
        const crit = parseFloat(document.getElementById('m5-crit').value);
        const steps = Math.ceil(days / h);
        const methodKey = document.getElementById('m5-method').value;
        const rd = document.getElementById('m5-results');

        // EDO: dR/dt = entrada - salida(t), donde salida crece por pánico
        const dRdt = (t, R) => inputRate - (outBase * (1 + panicFactor * t));

        const euler = ODE.euler(dRdt, 0, R0, h, steps);
        const heun  = ODE.heun(dRdt, 0, R0, h, steps);
        const rk4   = ODE.rk4(dRdt, 0, R0, h, steps);

        const activeResult = methodKey === 'euler' ? euler : (methodKey === 'heun' ? heun : rk4);
        const crossActive = ODE.findThresholdCrossing(activeResult.tValues, activeResult.yValues, crit);
        const zeroActive  = ODE.findThresholdCrossing(activeResult.tValues, activeResult.yValues, 0);

        // Mismas detecciones para todos los métodos (para comparar)
        const crossEuler = ODE.findThresholdCrossing(euler.tValues, euler.yValues, crit);
        const crossRk4   = ODE.findThresholdCrossing(rk4.tValues, rk4.yValues, crit);
        const zeroRk4    = ODE.findThresholdCrossing(rk4.tValues, rk4.yValues, 0);

        let html = `<div class="results-grid">`;
        if (crossActive) {
            html += UI.createResultCard('Alerta Crítica Activada', `Día ${crossActive.time.toFixed(1)}`, `Las reservas caen de ${crit.toLocaleString()} L — se debe declarar emergencia`, 'warning');
        } else {
            html += UI.createResultCard('Sistema Estable', `> ${days} días`, 'Las reservas no alcanzan el nivel crítico en el periodo simulado', 'success');
        }
        if (zeroActive) {
            html += UI.createResultCard('Desabastecimiento Total', `Día ${zeroActive.time.toFixed(1)}`, 'Las reservas llegan a CERO — colapso energético total', 'error');
        } else {
            html += UI.createResultCard('Sin Colapso Total', `> ${days} días`, 'No se vacía completamente en el periodo simulado', 'success');
        }
        const finalR = activeResult.yValues[activeResult.yValues.length - 1];
        html += UI.createResultCard('Reserva Final', `${Math.max(0, finalR).toFixed(0)} L`, `Al finalizar el día ${days} (método: ${activeResult.method})`, finalR > crit ? 'success' : 'error');
        html += `</div>`;

        // Tabla
        const tRows = [];
        for (let t = 0; t <= days; t += 1) {
            const i = Math.round(t / h);
            if (i < rk4.yValues.length) {
                const cons = outBase * (1 + panicFactor * t);
                if (methodKey === 'todos') {
                    const rE = Math.max(0, euler.yValues[i]), rH = Math.max(0, heun.yValues[i]), rR = Math.max(0, rk4.yValues[i]);
                    tRows.push([t, cons.toFixed(0) + ' L', rE.toFixed(0) + ' L', rH.toFixed(0) + ' L', rR.toFixed(0) + ' L']);
                } else {
                    const rA = Math.max(0, activeResult.yValues[i]);
                    tRows.push([t, cons.toFixed(0) + ' L', rA.toFixed(0) + ' L']);
                }
            }
        }
        const headers = methodKey === 'todos'
            ? ['Día', 'Consumo Diario (con pánico)', 'Reserva — Euler', 'Reserva — Heun', 'Reserva — RK4']
            : ['Día', 'Consumo Diario (con pánico)', `Reserva — ${activeResult.method}`];
        html += `<div class="module-panel mt-3"><h3><iconify-icon icon="heroicons:table-cells" width="22"></iconify-icon> Evolución Diaria de Reservas</h3>${UI.createTable(headers, tRows)}</div>`;

        html += `${UI.createChartContainer('m5-chart','Reservas de Carburante vs Tiempo — La línea roja es el nivel crítico de alerta')}`;

        // --- INTERPRETACIÓN RICA ---
        const netDaily = inputRate - outBase;
        const isDeficit = netDaily < 0;
        const eulerVsRk4diff = crossEuler && crossRk4 ? Math.abs(crossEuler.time - crossRk4.time) : null;
        const panicDay10 = outBase * (1 + panicFactor * 10);
        const panicDay30 = outBase * (1 + panicFactor * 30);

        html += UI.createRichInterpretation([
            {
                title: 'Diagnóstico del sistema energético',
                icon: 'heroicons:exclamation-triangle',
                content: `<p>El sistema tiene un <strong>${isDeficit ? `déficit base de ${Math.abs(netDaily).toFixed(0)} L/día` : `superávit base de ${netDaily.toFixed(0)} L/día`}</strong> antes de considerar el factor de pánico (α = ${panicFactor*100}%).</p>
                ${panicFactor > 0 ? `<p style="margin-top:0.4rem;">Con el factor de pánico, el consumo <strong>escala progresivamente</strong>: el día 10 se consumen <span class="interp-highlight">${panicDay10.toFixed(0)} L</span>, y el día 30 llega a <span class="interp-highlight">${panicDay30.toFixed(0)} L</span> — ${(panicDay30/outBase).toFixed(1)}× el consumo original. Este efecto acelerado es la principal causa del vaciado.</p>` : ''}
                ${crossActive ? `<p style="margin-top:0.4rem;">⚠ <strong>Acción urgente requerida antes del día ${crossActive.time.toFixed(1)}</strong> para evitar declarar emergencia energética.</p>` : `<p style="margin-top:0.4rem;">✅ Con los parámetros actuales, las reservas son suficientes para el periodo simulado.</p>`}`
            },
            {
                title: '¿Qué significa resolver la EDO numéricamente?',
                icon: 'heroicons:information-circle',
                content: `<p>La EDO <span class="math-inline">dR/dt = ${inputRate.toFixed(0)} − ${outBase.toFixed(0)}·(1 + ${panicFactor}·t)</span> no tiene solución analítica práctica para planeación en tiempo real. Los métodos numéricos la "resuelven" <strong>paso a paso</strong>: parten del valor actual R(t) y usan la ecuación para estimar R(t+h).</p>
                <p style="margin-top:0.4rem;">Cada método difiere en <em>cuántos puntos dentro del intervalo h evalúa</em> para hacer esa estimación — lo que determina su precisión.</p>`
            },
            {
                title: 'Diferencia entre Euler, Heun y RK4',
                icon: 'heroicons:chart-bar',
                content: `<ul>
                    <li><strong>Euler:</strong> usa solo la pendiente al inicio del intervalo. Acumula error rápidamente con pasos grandes (h > 1). <span class="interp-badge warn">Orden 1 — Menos preciso</span></li>
                    <li><strong>Heun:</strong> promedia la pendiente al inicio y al final (predice con Euler, luego corrige). Error mucho menor. <span class="interp-badge info">Orden 2</span></li>
                    <li><strong>RK4:</strong> evalúa la pendiente en 4 puntos del intervalo y las pondera. Estándar de ingeniería. <span class="interp-badge good">Orden 4 — El más preciso</span></li>
                </ul>
                ${eulerVsRk4diff !== null ? `<p style="margin-top:0.4rem;">En este escenario, Euler y RK4 predicen el nivel crítico con una diferencia de <strong>${eulerVsRk4diff.toFixed(1)} días</strong>. ${eulerVsRk4diff > 0.5 ? 'Esta diferencia es significativa para la planificación de emergencias — usar RK4 para decisiones reales.' : 'La diferencia es pequeña; ambos métodos son confiables aquí.'}</p>` : ''}`
            },
            {
                title: 'Impacto del paso de integración h',
                icon: 'heroicons:beaker',
                content: `<p>Actualmente usas <span class="math-inline">h = ${h}</span> día(s). ${h <= 0.5 ? '✅ Paso pequeño → alta precisión. RK4, Heun y Euler darán resultados muy similares.' : h <= 1 ? '✔ Paso razonable. RK4 y Heun son confiables; Euler puede acumular pequeñas discrepancias.' : '⚠ Paso grande. Euler divergirá de la solución real. Usar RK4 para compensar.'}</p>
                <p style="margin-top:0.35rem;">Reducir h mejora la precisión, pero aumenta el número de cálculos proporcional a 1/h. Para simulaciones de emergencia, h = 0.5 o h = 1 con RK4 es el estándar recomendado.</p>`
            },
            {
                title: 'Conclusión práctica y recomendaciones',
                icon: 'heroicons:light-bulb',
                content: `<ul>
                    ${crossActive ? `<li><iconify-icon icon="heroicons:exclamation-triangle" width="18" style="vertical-align: middle; color: var(--red-deep); margin-right: 4px;"></iconify-icon> <strong>Declarar alerta energética antes del día ${crossActive.time.toFixed(1)}</strong> para activar protocolos de racionamiento y habilitar rutas alternativas de abastecimiento.</li>` : '<li><iconify-icon icon="heroicons:check-circle" width="18" style="vertical-align: middle; color: var(--green-deep); margin-right: 4px;"></iconify-icon> El sistema puede mantenerse estable durante el periodo simulado con el abastecimiento actual.</li>'}
                    ${zeroRk4 ? `<li><iconify-icon icon="heroicons:no-symbol" width="18" style="vertical-align: middle; color: var(--red-deep); margin-right: 4px;"></iconify-icon> Si no hay intervención, el colapso total ocurre el <strong>día ${zeroRk4.time.toFixed(1)}</strong>. Se requiere aumentar la entrada de cisternas a más de ${outBase * (1 + panicFactor * zeroRk4.time / 2) / 1000 | 0} mil L/día.</li>` : ''}
                    <li>Para reducir el riesgo: ${panicFactor > 0.05 ? 'controlar el pánico social (comunicación de crisis) para reducir el factor α es tan importante como aumentar el suministro.' : 'mantener el suministro estable y monitorear diariamente el nivel de reservas.'}</li>
                    <li>Para tomar decisiones de emergencia, usar siempre <strong>RK4 con h ≤ 1</strong> para garantizar la confiabilidad de las proyecciones.</li>
                </ul>`
            }
        ]);

        html += `<div class="module-panel mt-3"><h3><iconify-icon icon="heroicons:academic-cap" width="22"></iconify-icon> ¿Qué hace cada método?</h3>`;
        html += UI.createMethodExplanation('Euler (Orden 1)', 'Método más simple: <em>R(t+h) = R(t) + h·f(t, R)</em>. Usa solo la pendiente en el punto actual. Acumula error linealmente — con pasos grandes se "aleja" de la solución real. Bueno para estimar rápido, no para decisiones de precisión.');
        html += UI.createMethodExplanation('Heun — Euler Mejorado (Orden 2)', 'Predictor-corrector: primero estima con Euler, luego promedia la pendiente del inicio y del fin del intervalo (regla del trapecio). El doble de cálculos que Euler pero error O(h²) — mucho más estable.');
        html += UI.createMethodExplanation('Runge-Kutta 4 — RK4 (Orden 4)', 'Estándar de ingeniería para EDOs. Evalúa la pendiente en 4 puntos del intervalo (inicio, dos puntos medios, final) y los promedia con pesos 1/6, 1/3, 1/3, 1/6. Error O(h⁴) — extremadamente preciso incluso con pasos moderados.');
        html += `</div>`;

        rd.innerHTML = html;

        setTimeout(() => {
            const labels = activeResult.tValues.map(t => t.toFixed(1));
            const datasets = [];
            if (methodKey === 'todos' || methodKey === 'euler') datasets.push({ label:'Euler', data:euler.yValues.map(y => Math.max(0,y)), dashed:true });
            if (methodKey === 'todos' || methodKey === 'heun')  datasets.push({ label:'Heun',  data:heun.yValues.map(y => Math.max(0,y)), dashed:true });
            if (methodKey === 'todos' || methodKey === 'rk4')   datasets.push({ label:'RK4',   data:rk4.yValues.map(y => Math.max(0,y)) });
            datasets.push({ label:'Nivel Crítico de Alerta', data:new Array(labels.length).fill(crit), color:'rgba(220,53,69,0.6)', borderWidth:2, pointRadius:0 });
            Charts.createLineChart('m5-chart', { labels, datasets, xLabel:'Tiempo (Días)', yLabel:'Reserva de Carburante (Litros)' });
        }, 100);
    }

    return { render, init, solve };
})();
