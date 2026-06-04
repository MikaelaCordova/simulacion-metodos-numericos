/* ==========================================================================
   Module 3 — Escenario C: Interpolación (Precios de alimentos)
   ========================================================================== */

const Module3 = (() => {
    const PRODUCTS = {
        papa:   { name:'Papa (arroba)',  data:[[1,8],[5,10],[10,13],[15,16],[20,19],[30,22]], unit:'Bs' },
        arroz:  { name:'Arroz (kg)',     data:[[1,9],[5,9.5],[10,11],[15,13],[20,14.5],[30,17]], unit:'Bs' },
        aceite: { name:'Aceite (litro)', data:[[1,12],[5,12.5],[10,14],[15,16],[20,18],[30,23]], unit:'Bs' },
        azucar: { name:'Azúcar (kg)',    data:[[1,7],[5,7.5],[10,9],[15,10],[20,11],[30,13]], unit:'Bs' }
    };

    function render() {
        return UI.createModuleSection({
            icon:'heroicons:chart-bar', iconColor:'green',
            title:'Escenario C: Interpolación',
            subtitle:'Desabastecimiento de alimentos y curva continua de precios — Lagrange, Newton y Splines Cúbicos',
            id:'mod3'
        });
    }

    function init() {
        const c = document.getElementById('mod3-content'); if (!c) return;
        const prodOpts = Object.entries(PRODUCTS).map(([k,v]) => `<option value="${k}">${v.name}</option>`).join('');
        c.innerHTML = `
        <div class="method-explanation" style="background-color:var(--bg-card);border-left:4px solid var(--green-medium);padding:1.5rem;margin-bottom:1.5rem;border-radius:var(--radius-md);box-shadow:var(--shadow-sm);">
            <h4 style="color:var(--green-deep);margin-bottom:0.75rem;display:flex;align-items:center;gap:0.5rem;">
                <iconify-icon icon="heroicons:exclamation-triangle" width="22"></iconify-icon> Planteamiento del Problema
            </h4>
            <p style="font-size:1.02rem;line-height:1.7;margin-bottom:1rem;">
                La especulación y la escasez provocan fluctuaciones diarias en los precios de alimentos. Como no es posible registrar precios en todos los mercados todos los días, se dispone de datos en fechas dispersas. La <strong>interpolación polinomial</strong> construye una curva matemática continua que pasa exactamente por todos los datos conocidos, permitiendo estimar el precio en cualquier día sin medición directa.
            </p>
            <div class="math-block"><em>P</em>(<em>x</em>) ≈ precio en el día <em>x</em> &nbsp;(estimado por el polinomio)</div>
            <p style="font-size:0.78rem;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:var(--text-secondary);margin-bottom:0.5rem;margin-top:1.25rem;">
                <iconify-icon icon="heroicons:variable" width="14" style="vertical-align:middle;"></iconify-icon> ¿Qué significa cada símbolo?
            </p>
            ${UI.createVarGrid([
                { symbol: '<em>x</em>',               color: 'green',  name: 'Día del mes',         desc: 'El día para el que se quiere conocer el precio, aunque no haya registro directo de mercado ese día.' },
                { symbol: '<em>P</em>(<em>x</em>)',   color: 'blue',   name: 'Precio estimado',     desc: 'El precio del alimento (en Bs) que el polinomio predice para el día <em>x</em>.' },
                { symbol: '(<em>x<sub>i</sub>, y<sub>i</sub></em>)', color: 'yellow', name: 'Nodos (datos reales)', desc: 'Los pares de datos históricos reales que anclan la curva: día <em>x<sub>i</sub></em> con precio <em>y<sub>i</sub></em>.' },
                { symbol: '<em>n</em>',               color: 'red',    name: 'Grado del polinomio', desc: 'Si hay <em>n</em> puntos de datos, el polinomio tiene grado ≤ n−1. Más puntos = curva más detallada.' }
            ])}
        </div>

        <div class="module-panel">
            <h3><iconify-icon icon="heroicons:adjustments-horizontal" width="22"></iconify-icon> Datos de Precios</h3>
            <div class="context-box" style="background:hsla(140,45%,97%,0.6);border-color:var(--green-pastel);margin-bottom:1rem;">
                <div class="context-box-header" style="color:var(--green-deep);">
                    <iconify-icon icon="heroicons:information-circle" width="15"></iconify-icon> Cómo usar esta sección
                </div>
                <p>La <strong>tabla de abajo</strong> muestra precios registrados en días específicos del mes (como si fueran reportes de mercado reales). Puedes editarla, agregar o quitar filas. El sistema construirá una curva continua y estimará el precio en el día que elijas, incluso si no tienes medición ese día.</p>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">Producto de la canasta básica</label>
                    <select class="form-select" id="m3-product" onchange="Module3.loadProduct()">${prodOpts}</select>
                    <span class="form-hint">Alimento cuyo precio se quiere interpolar</span>
                </div>
                <div class="form-group">
                    <label class="form-label" for="m3-day">Día a estimar <span class="math-inline"><em>x</em></span></label>
                    <input class="form-input" type="number" id="m3-day" value="12" min="1" max="30" step="0.5">
                    <span class="form-hint">Día del mes sin dato real (ej. 12 → "¿cuánto costó el día 12?")</span>
                </div>
                <div class="form-group" style="background:hsla(140,45%,88%,0.3);padding:0.75rem;border-radius:var(--radius-sm);border:1px solid var(--green-pastel);">
                    <label class="form-label" style="color:var(--green-deep);font-weight:700;">
                        <iconify-icon icon="heroicons:cursor-arrow-rays" width="16" style="vertical-align:middle;"></iconify-icon> Método de interpolación
                    </label>
                    <select class="form-select" id="m3-method" style="border:2px solid var(--green-medium);font-weight:600;">
                        <option value="todos" selected>Todos (comparar)</option>
                        <option value="lagrange">Lagrange</option>
                        <option value="newton">Newton</option>
                        <option value="splines">Splines Cúbicos</option>
                    </select>
                </div>
            </div>
            <p style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:0.5rem;font-weight:600;">
                <iconify-icon icon="heroicons:table-cells" width="14" style="vertical-align:middle;"></iconify-icon>
                Precios históricos registrados — puedes editarlos directamente:
            </p>
            <div id="m3-table-container"></div>
            <div class="btn-group mt-2">
                <button class="btn btn-primary" onclick="Module3.solve()"><iconify-icon icon="heroicons:play" width="18"></iconify-icon> Interpolar Precio</button>
                <button class="btn btn-success" onclick="Module3.compareAll()"><iconify-icon icon="heroicons:arrow-path" width="18"></iconify-icon> Comparar Todos los Productos</button>
            </div>
        </div>
        <div id="m3-results"></div>`;
        loadProduct();
    }

    function loadProduct() {
        const pk = document.getElementById('m3-product').value;
        const p = PRODUCTS[pk];
        document.getElementById('m3-table-container').innerHTML = UI.createEditableTable('m3-data', [`Día del mes`, `Precio (${p.unit})`], p.data);
    }

    function solve() {
        const data = UI.readTableData('m3-data');
        if (data.length < 3) { document.getElementById('m3-results').innerHTML = UI.createErrorMessage('Se necesitan al menos 3 puntos de datos para interpolar. Agrega más filas a la tabla.'); return; }
        const xData = data.map(r => r[0]), yData = data.map(r => r[1]);
        const day = parseFloat(document.getElementById('m3-day').value);
        const pk = document.getElementById('m3-product').value;
        const pName = PRODUCTS[pk].name;
        const methodKey = document.getElementById('m3-method').value;

        const lag = Interpolation.lagrange(xData, yData);
        const newt = Interpolation.newton(xData, yData);
        const spl = Interpolation.cubicSplines(xData, yData);

        const vLag = lag.evaluate(day), vNewt = newt.evaluate(day), vSpl = spl.evaluate(day);
        const xMin = Math.min(...xData)-1, xMax = Math.max(...xData)+1;
        const curveLag = Interpolation.generateCurve(lag.evaluate, xMin, xMax, 200);
        const curveNewt = Interpolation.generateCurve(newt.evaluate, xMin, xMax, 200);
        const curveSpl = Interpolation.generateCurve(spl.evaluate, xMin, xMax, 200);

        const allResults = [
            { k:'lagrange', n:'Lagrange',       val:vLag,  curve:curveLag,  type:'success' },
            { k:'newton',   n:'Newton',          val:vNewt, curve:curveNewt, type:'info' },
            { k:'splines',  n:'Splines Cúbicos', val:vSpl,  curve:curveSpl,  type:'success' }
        ];
        const activeResults = methodKey === 'todos' ? allResults : allResults.filter(r => r.k === methodKey);

        let h = `<div class="results-grid">`;
        activeResults.forEach(r => {
            h += UI.createResultCard(r.n, `${r.val.toFixed(4)} Bs`, `Precio estimado para el día ${day}`, r.type);
        });
        h += `</div>`;

        // Comparison table
        const headers = ['Día', ...activeResults.map(r => r.n), 'Precio Real'];
        const rows = [];
        for (let d = 1; d <= 30; d++) {
            const real = xData.includes(d) ? yData[xData.indexOf(d)].toFixed(2) : '—';
            const rowData = activeResults.map(r => {
                if (r.k === 'lagrange') return lag.evaluate(d).toFixed(2);
                if (r.k === 'newton')   return newt.evaluate(d).toFixed(2);
                return spl.evaluate(d).toFixed(2);
            });
            rows.push([d, ...rowData, real]);
        }
        h += `<div class="module-panel mt-3"><h3><iconify-icon icon="heroicons:table-cells" width="22"></iconify-icon> Precios Estimados por Día (comparado con datos reales)</h3>${UI.createTable(headers, rows)}</div>`;

        h += `${UI.createChartContainer('m3-chart-interp','Curvas de Interpolación — ' + pName + ' (los puntos rojos son datos reales)')}`;
        h += `${UI.createChartContainer('m3-chart-compare','Precio Estimado en el Día ' + day + ' — Comparación por Método')}`;

        if (newt.coefficients && (methodKey === 'todos' || methodKey === 'newton')) {
            h += `<div class="module-panel mt-3"><h3>Coeficientes del Polinomio de Newton (Diferencias Divididas)</h3>`;
            h += `<p style="font-size:0.88rem;color:var(--text-secondary);margin-bottom:0.75rem;">Los coeficientes <em>c<sub>0</sub>, c<sub>1</sub>, …</em> construyen el polinomio: <span class="math-inline"><em>P(x) = c<sub>0</sub> + c<sub>1</sub>(x−x<sub>0</sub>) + c<sub>2</sub>(x−x<sub>0</sub>)(x−x<sub>1</sub>) + …</em></span></p>`;
            h += UI.createTable(['Orden <em>i</em>','Coeficiente <em>c<sub>i</sub></em>'], newt.coefficients.map((c,i) => [`c<sub>${i}</sub>`, c.toFixed(6)]));
            h += `</div>`;
        }

        const increase = ((yData[yData.length-1] - yData[0]) / yData[0] * 100).toFixed(1);
        const maxDiff = Math.max(...activeResults.map(r => r.val)) - Math.min(...activeResults.map(r => r.val));
        const avgVal = activeResults.reduce((s, r) => s + r.val, 0) / activeResults.length;
        const diffPct = (maxDiff / avgVal * 100).toFixed(2);
        const dayInRange = day >= Math.min(...xData) && day <= Math.max(...xData);

        h += UI.createRichInterpretation([
            {
                title: 'Precio estimado y significado económico',
                icon: 'heroicons:currency-dollar',
                content: `<p>Para el día <strong>${day}</strong>, el precio estimado de <strong>${pName}</strong> es:</p>
                <ul>${activeResults.map(r => `<li><strong>${r.n}:</strong> <span class="interp-highlight">${r.val.toFixed(2)} Bs</span></li>`).join('')}</ul>
                <p style="margin-top:0.4rem;">Durante el periodo analizado, el precio aumentó <span class="interp-highlight">${increase}%</span> — desde ${yData[0].toFixed(2)} Bs hasta ${yData[yData.length-1].toFixed(2)} Bs al final del mes.</p>`
            },
            {
                title: '¿Por qué los métodos dan valores ligeramente distintos?',
                icon: 'heroicons:information-circle',
                content: `<p>La diferencia máxima entre métodos para el día ${day} es de <span class="math-inline">${maxDiff.toFixed(4)} Bs</span> (${diffPct}% de variación). ${parseFloat(diffPct) < 1 ? 'Esta diferencia es <strong>insignificante</strong> en términos prácticos.' : 'Esta diferencia puede ser relevante según el contexto.'}</p>
                <ul>
                    <li><strong>Lagrange y Newton</strong> producen exactamente el <em>mismo</em> polinomio matemático (solo difieren en la forma de calcularlo) — diferencias visibles son solo errores de redondeo numérico.</li>
                    <li><strong>Splines Cúbicos</strong> usa polinomios distintos por tramos, lo que produce curvas más suaves y evita las oscilaciones artificiosas que pueden aparecer con polinomios de grado alto.</li>
                </ul>`
            },
            {
                title: 'Confiabilidad de la estimación',
                icon: 'heroicons:shield-check',
                content: dayInRange
                    ? `<p>El día ${day} está <span class="interp-badge good">dentro</span> del rango de datos [${Math.min(...xData)}, ${Math.max(...xData)}] → la estimación es <strong>interpolación real</strong> y es confiable.</p>
                    <p style="margin-top:0.35rem;">Los tres métodos deberían dar resultados muy similares y todos son confiables para planificación de precios.</p>`
                    : `<p>El día ${day} está <span class="interp-badge bad">fuera</span> del rango de datos → es <strong>extrapolación</strong>, lo que aumenta el error. Los resultados pueden diferir significativamente de la realidad si la tendencia cambia.</p>`
            },
            {
                title: 'Conclusión práctica',
                icon: 'heroicons:light-bulb',
                content: `<ul>
                    <li>Para <strong>estimar precios intermedios</strong> con datos dispersos de mercado, los <strong>Splines Cúbicos</strong> son la opción más robusta porque producen curvas suaves sin oscilaciones, más parecidas al comportamiento real de precios.</li>
                    <li>El incremento del ${increase}% en el precio de ${pName} durante el mes representa una pérdida real del poder adquisitivo familiar que debe considerarse en políticas de subsidio o control de precios.</li>
                    <li>Para reportes de inflación, promediar los valores de los tres métodos reduce el error sistemático.</li>
                </ul>`
            }
        ]);

        h += `<div class="module-panel mt-3"><h3><iconify-icon icon="heroicons:academic-cap" width="22"></iconify-icon> ¿Qué hace cada método?</h3>`;
        h += UI.createMethodExplanation('Lagrange', 'Construye el polinomio único de grado n−1 usando bases de Lagrange <em>L<sub>i</sub>(x)</em>. Fórmula directa, no requiere resolver ningún sistema. Puede oscilar fuertemente con muchos puntos (fenómeno de Runge).');
        h += UI.createMethodExplanation('Newton (Diferencias Divididas)', 'Construye el mismo polinomio de Lagrange pero de forma incremental usando diferencias divididas. Permite agregar nuevos puntos de datos sin recalcular todo el polinomio desde cero.');
        h += UI.createMethodExplanation('Splines Cúbicos', 'En lugar de un único polinomio de grado alto, ajusta polinomios cúbicos <em>por tramos</em> con continuidad C² (la curva, su pendiente y su curvatura son continuas). Evita oscilaciones y produce curvas naturales y suaves.');
        h += `</div>`;

        document.getElementById('m3-results').innerHTML = h;
        setTimeout(() => {
            const labels = curveLag.map(p => p.x.toFixed(1));
            const datasets = [];
            if (methodKey === 'todos' || methodKey === 'lagrange') datasets.push({ label:'Lagrange', data:curveLag.map(p => p.y), pointRadius:0 });
            if (methodKey === 'todos' || methodKey === 'newton')   datasets.push({ label:'Newton',   data:curveNewt.map(p => p.y), pointRadius:0, dashed:true });
            if (methodKey === 'todos' || methodKey === 'splines')  datasets.push({ label:'Splines',  data:curveSpl.map(p => p.y), pointRadius:0 });
            datasets.push({ label:'Datos reales', data:labels.map(l => { const i = xData.indexOf(parseFloat(l)); return i >= 0 ? yData[i] : null; }), pointRadius:6, borderWidth:0, extra:{ type:'scatter' } });
            Charts.createLineChart('m3-chart-interp', { labels, datasets, xLabel:'Día del mes', yLabel:'Precio (Bs)' });
            Charts.createBarChart('m3-chart-compare', { labels:activeResults.map(r => r.n), datasets:[{ label:`Precio estimado día ${day} (Bs)`, data:activeResults.map(r => r.val) }], xLabel:'Método', yLabel:'Precio (Bs)' });
        }, 100);
    }

    function compareAll() {
        const day = parseFloat(document.getElementById('m3-day').value);
        const rd = document.getElementById('m3-results');
        let h = `<div class="module-panel"><h3><iconify-icon icon="heroicons:chart-bar" width="22"></iconify-icon> Comparación de Todos los Productos — Día ${day}</h3>`;
        h += `<p style="font-size:0.88rem;color:var(--text-secondary);margin-bottom:0.75rem;">Esta tabla muestra el precio estimado de cada alimento de la canasta básica para el día ${day} usando los tres métodos de interpolación, junto con el porcentaje de incremento total del mes.</p>`;
        const headers = ['Producto','Precio día '+day+' — Lagrange','Newton','Splines','Incremento total (%)'];
        const rows = [];
        Object.entries(PRODUCTS).forEach(([k, p]) => {
            const xD = p.data.map(r => r[0]), yD = p.data.map(r => r[1]);
            const lag = Interpolation.lagrange(xD, yD).evaluate(day);
            const newt = Interpolation.newton(xD, yD).evaluate(day);
            const spl = Interpolation.cubicSplines(xD, yD).evaluate(day);
            const inc = ((yD[yD.length-1] - yD[0]) / yD[0] * 100).toFixed(1);
            rows.push([p.name, lag.toFixed(2)+' Bs', newt.toFixed(2)+' Bs', spl.toFixed(2)+' Bs', `<strong>${inc}%</strong>`]);
        });
        h += UI.createTable(headers, rows);
        const maxInc = rows.reduce((a, r) => parseFloat(r[4]) > parseFloat(a[4]) ? r : a);
        h += UI.createRichInterpretation([
            {
                title: 'Impacto en la canasta básica familiar',
                icon: 'heroicons:shopping-cart',
                content: `<p>El producto con mayor incremento de precio durante el mes es <strong>${maxInc[0]}</strong> con un aumento de <strong>${maxInc[4]}</strong>. Esto representa el mayor impacto en el presupuesto familiar.</p>
                <p style="margin-top:0.4rem;">Para el día ${day}, el gasto acumulado estimado en todos los productos sería: <span class="interp-highlight">${rows.reduce((s, r) => s + parseFloat(r[1]), 0).toFixed(2)} Bs</span> (usando Lagrange) — comparado con los precios del día 1.</p>`
            }
        ]);
        h += `</div>`;
        rd.innerHTML += h;
    }

    return { render, init, solve, loadProduct, compareAll };
})();
