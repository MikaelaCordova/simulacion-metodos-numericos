/* ==========================================================================
   Module 4 — Escenario D: Integración Numérica (Costo Acumulado)
   ========================================================================== */

const Module4 = (() => {
    const PRODUCTS = {
        papa:   { name:'Papa',   basePrice:8,  data:[[1,8],[5,10],[10,13],[15,16],[20,19],[25,21],[30,22]] },
        arroz:  { name:'Arroz',  basePrice:9,  data:[[1,9],[5,9.5],[10,11],[15,13],[20,14.5],[25,16],[30,17]] },
        aceite: { name:'Aceite', basePrice:12, data:[[1,12],[5,12.5],[10,14],[15,16],[20,18],[25,21],[30,23]] },
        azucar: { name:'Azúcar', basePrice:7,  data:[[1,7],[5,7.5],[10,9],[15,10],[20,11],[25,12],[30,13]] }
    };

    function render() {
        return UI.createModuleSection({
            icon:'heroicons:calculator', iconColor:'red',
            title:'Escenario D: Integración Numérica',
            subtitle:'Costo acumulado y pérdida del poder adquisitivo familiar — Trapecio, Simpson 1/3 y 3/8',
            id:'mod4'
        });
    }

    function init() {
        const c = document.getElementById('mod4-content'); if (!c) return;
        c.innerHTML = `
        <div class="method-explanation" style="background-color:var(--bg-card);border-left:4px solid var(--red-medium);padding:1.5rem;margin-bottom:1.5rem;border-radius:var(--radius-md);box-shadow:var(--shadow-sm);">
            <h4 style="color:var(--red-deep);margin-bottom:0.75rem;display:flex;align-items:center;gap:0.5rem;">
                <iconify-icon icon="heroicons:exclamation-triangle" width="22"></iconify-icon> Planteamiento del Problema
            </h4>
            <p style="font-size:1.02rem;line-height:1.7;margin-bottom:1rem;">
                Para entender el impacto real de la inflación, no basta ver el precio de un día: hay que calcular el <strong>gasto total acumulado durante todo el mes</strong>. Matemáticamente esto equivale a calcular el <strong>área bajo la curva</strong> de precios diarios — lo que una familia gastó en total. La integración numérica aproxima esta área usando métodos sistemáticos cuando no existe una fórmula analítica exacta.
            </p>
            <div class="math-block">
                Gasto total = &nbsp;
                <span style="font-size:1.6rem;font-family:Georgia;font-style:normal;font-weight:400;">∫</span>
                <span style="font-family:Georgia;font-style:italic;">
                    <sub style="font-size:0.7rem;">a</sub><sup style="font-size:0.7rem;">b</sup>
                    &nbsp;<em>f</em>(<em>t</em>)&thinsp;<em>dt</em>
                </span>
            </div>
            <p style="font-size:0.78rem;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:var(--text-secondary);margin-bottom:0.5rem;margin-top:1.25rem;">
                <iconify-icon icon="heroicons:variable" width="14" style="vertical-align:middle;"></iconify-icon> ¿Qué significa cada símbolo?
            </p>
            ${UI.createVarGrid([
                { symbol: '<em>f</em>(<em>t</em>)', color: 'red',    name: 'Función de precio',       desc: 'Precio del producto en el día <em>t</em>, obtenido por interpolación (Splines Cúbicos) de los datos históricos.' },
                { symbol: '[<em>a</em>,<em>b</em>]', color: 'blue',  name: 'Límites de integración',  desc: 'Día de inicio y fin del análisis. El área bajo la curva entre estos dos días es el gasto acumulado.' },
                { symbol: '<em>n</em>',              color: 'yellow', name: 'Segmentos (subdivisiones)', desc: 'Cuántas rebanadas se dividen el área. Más segmentos = mayor precisión. Deben ser múltiplos de 6.' },
                { symbol: '<em>h</em>',              color: 'green',  name: 'Ancho de cada segmento', desc: '<em>h = (b − a) / n</em>. El ancho de cada "rebanada" del área bajo la curva.' }
            ])}
        </div>

        <div class="module-panel">
            <h3><iconify-icon icon="heroicons:adjustments-horizontal" width="22"></iconify-icon> Parámetros de Integración</h3>
            <div class="context-box" style="background:hsla(0,60%,97%,0.5);border-color:var(--red-pastel);margin-bottom:1rem;">
                <div class="context-box-header" style="color:var(--red-deep);">
                    <iconify-icon icon="heroicons:information-circle" width="15"></iconify-icon> Concepto visual
                </div>
                <p>Imagina la curva de precios diarios como una montaña. El área bajo esa montaña (entre el día 1 y el día elegido) representa exactamente cuánto dinero gastó una familia en ese producto durante todo ese periodo. Cuantos más <strong>segmentos</strong> uses, más preciso es el cálculo del área.</p>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label class="form-label" for="m4-segments">Segmentos <span class="math-inline"><em>n</em></span></label>
                    <input class="form-input" type="number" id="m4-segments" value="30" min="6" step="6">
                    <span class="form-hint">Subdivisiones del área (debe ser múltiplo de 6)</span>
                </div>
                <div class="form-group">
                    <label class="form-label" for="m4-days">Días a integrar <span class="math-inline"><em>b</em></span></label>
                    <input class="form-input" type="number" id="m4-days" value="30" min="1" max="60">
                    <span class="form-hint">Días del análisis (desde el día 1 hasta este día)</span>
                </div>
                <div class="form-group" style="background:hsla(0,50%,65%,0.08);padding:0.75rem;border-radius:var(--radius-sm);border:1px solid var(--red-pastel);">
                    <label class="form-label" style="color:var(--red-deep);font-weight:700;">
                        <iconify-icon icon="heroicons:cursor-arrow-rays" width="16" style="vertical-align:middle;"></iconify-icon> Método de integración
                    </label>
                    <select class="form-select" id="m4-method" style="border:2px solid var(--red-medium);font-weight:600;">
                        <option value="todos" selected>Todos (comparar)</option>
                        <option value="trap">Trapecio</option>
                        <option value="s13">Simpson 1/3</option>
                        <option value="s38">Simpson 3/8</option>
                    </select>
                </div>
            </div>
            <div class="btn-group">
                <button class="btn btn-primary" onclick="Module4.solve()"><iconify-icon icon="heroicons:play" width="18"></iconify-icon> Calcular Gasto Acumulado</button>
            </div>
        </div>
        <div id="m4-results"></div>`;
    }

    function solve() {
        const nSeg = parseInt(document.getElementById('m4-segments').value) || 30;
        const days = parseInt(document.getElementById('m4-days').value) || 30;
        const methodKey = document.getElementById('m4-method').value;
        const rd = document.getElementById('m4-results');

        let totalResults = [];
        let totalBase = 0, totalReal = { trap:0, s13:0, s38:0 };

        Object.entries(PRODUCTS).forEach(([k, p]) => {
            const xD = p.data.map(r => r[0]), yD = p.data.map(r => r[1]);
            const spl = Interpolation.cubicSplines(xD, yD);
            const priceFunc = t => spl.evaluate(t);

            const trap = Integration.trapezoidal(priceFunc, 1, days, nSeg);
            const s13  = Integration.simpson13(priceFunc, 1, days, nSeg%2===0?nSeg:nSeg+1);
            const s38  = Integration.simpson38(priceFunc, 1, days, nSeg%3===0?nSeg:nSeg+3-nSeg%3);

            const baseCost = p.basePrice * (days - 1);
            totalBase += baseCost;
            totalReal.trap += trap.result; totalReal.s13 += s13.result; totalReal.s38 += s38.result;

            totalResults.push({
                name:p.name, baseCost, basePrice:p.basePrice,
                trap:trap.result, s13:s13.result, s38:s38.result,
                loss:((trap.result - baseCost) / baseCost * 100).toFixed(1),
                priceFunc, xD, yD
            });
        });

        const allMethods = [
            { k:'trap', n:'Trapecio',    total:totalReal.trap },
            { k:'s13',  n:'Simpson 1/3', total:totalReal.s13 },
            { k:'s38',  n:'Simpson 3/8', total:totalReal.s38 }
        ];
        const activeMethods = methodKey === 'todos' ? allMethods : allMethods.filter(m => m.k === methodKey);
        const displayTotal = activeMethods[0].total;
        const lossTotal = ((displayTotal - totalBase) / totalBase * 100).toFixed(1);

        let h = `<div class="results-grid">`;
        h += UI.createResultCard(`Gasto Acumulado (${activeMethods[0].n})`, `${displayTotal.toFixed(2)} Bs`, `Dinero real gastado en ${days} días`, 'success');
        h += UI.createResultCard('Gasto Sin Inflación', `${totalBase.toFixed(2)} Bs`, 'Si los precios se mantuvieran estables desde el día 1', 'info');
        h += UI.createResultCard('Pérdida de Poder Adquisitivo', `${lossTotal}%`, `La familia gastó ${lossTotal}% más de lo que hubiera gastado sin inflación`, 'error');
        h += `</div>`;

        const headers = ['Producto', 'Precio Inicial (Bs)', ...activeMethods.map(m => `Gasto Real — ${m.n} (Bs)`), 'Gasto Sin Inflación (Bs)', 'Incremento (%)'];
        const rows = totalResults.map(r => {
            const rowData = activeMethods.map(m => {
                if (m.k === 'trap') return r.trap.toFixed(2);
                if (m.k === 's13')  return r.s13.toFixed(2);
                return r.s38.toFixed(2);
            });
            const loss = ((r[activeMethods[0].k] - r.baseCost) / r.baseCost * 100).toFixed(1);
            return [r.name, r.basePrice+' Bs', ...rowData, r.baseCost.toFixed(2), `<strong>${loss}%</strong>`];
        });
        h += `<div class="module-panel mt-3"><h3><iconify-icon icon="heroicons:table-cells" width="22"></iconify-icon> Detalle del Gasto por Producto</h3>${UI.createTable(headers, rows)}</div>`;

        if (methodKey === 'todos') {
            const ref = totalReal.s13;
            const mHeaders = ['Método', 'Gasto Total (Bs)', 'Orden de Error', 'Error Relativo vs Simpson 1/3'];
            const mRows = [
                ['Trapecio',    totalReal.trap.toFixed(2), 'O(h²) — menor precisión', `<strong>${(Math.abs(totalReal.trap-ref)/ref*100).toFixed(4)}%</strong>`],
                ['Simpson 1/3', totalReal.s13.toFixed(2),  'O(h⁴) — alta precisión',  '<em>Referencia</em>'],
                ['Simpson 3/8', totalReal.s38.toFixed(2),  'O(h⁴) — alta precisión',  `<strong>${(Math.abs(totalReal.s38-ref)/ref*100).toFixed(4)}%</strong>`]
            ];
            h += `<div class="module-panel mt-2"><h3><iconify-icon icon="heroicons:magnifying-glass" width="20"></iconify-icon> Comparación de Precisión entre Métodos</h3>${UI.createTable(mHeaders, mRows)}</div>`;
        }

        h += `<div class="two-col mt-3">
            <div>${UI.createChartContainer('m4-chart-area','Curva de Precios — El Área Sombreada es el Gasto Acumulado')}</div>
            <div>${UI.createChartContainer('m4-chart-bars','Gasto Real vs Sin Inflación por Producto')}</div>
        </div>`;

        const worst = totalResults.reduce((a, b2) => parseFloat(a.loss) > parseFloat(b2.loss) ? a : b2);
        const best2  = totalResults.reduce((a, b2) => parseFloat(a.loss) < parseFloat(b2.loss) ? a : b2);
        const trapVsS13 = Math.abs(totalReal.trap - totalReal.s13);
        const precisionQuality = trapVsS13 / totalReal.s13 * 100;

        h += UI.createRichInterpretation([
            {
                title: 'Significado del gasto acumulado calculado',
                icon: 'heroicons:currency-dollar',
                content: `<p>Durante <strong>${days} días</strong>, una familia que consume estos 4 productos de la canasta básica gastó <span class="interp-highlight">${displayTotal.toFixed(2)} Bs</span> en total. Sin la inflación, ese mismo periodo hubiera costado solo <span class="interp-highlight">${totalBase.toFixed(2)} Bs</span>.</p>
                <p style="margin-top:0.4rem;">La diferencia — <span class="interp-highlight">${(displayTotal - totalBase).toFixed(2)} Bs</span> extra (<strong>${lossTotal}%</strong>) — representa la <strong>pérdida real del poder adquisitivo familiar</strong> causada por la inflación de precios durante la crisis.</p>`
            },
            {
                title: 'Producto que más impacta al presupuesto',
                icon: 'heroicons:exclamation-triangle',
                content: `<ul>
                    <li><strong>Mayor impacto:</strong> <span class="interp-highlight">${worst.name}</span> con un incremento del <strong>${worst.loss}%</strong> — este producto debe ser prioridad para subsidios de emergencia.</li>
                    <li><strong>Menor impacto:</strong> ${best2.name} con un ${best2.loss}% de incremento.</li>
                    <li>El gasto acumulado en ${worst.name} durante el mes fue de <strong>${Math.max(worst.trap, worst.s13, worst.s38).toFixed(2)} Bs</strong> vs ${worst.baseCost.toFixed(2)} Bs sin inflación.</li>
                </ul>`
            },
            {
                title: '¿Por qué los métodos dan resultados distintos?',
                icon: 'heroicons:information-circle',
                content: `<p>Cada método aproxima el área bajo la curva con diferente geometría:</p>
                <ul>
                    <li><strong>Trapecio:</strong> conecta los puntos con líneas rectas (trapecios). Subestima el área en curvas cóncavas. Error O(h²) — menos preciso.</li>
                    <li><strong>Simpson 1/3:</strong> usa parábolas (más suaves que líneas rectas). Captura mejor la curvatura real. Error O(h⁴) — 100× más preciso que Trapecio.</li>
                    <li><strong>Simpson 3/8:</strong> similar a Simpson 1/3 usando polinomios cúbicos. Misma precisión O(h⁴).</li>
                </ul>
                <p style="margin-top:0.4rem;">La diferencia entre Trapecio y Simpson 1/3 en este caso es de <strong>${trapVsS13.toFixed(2)} Bs</strong> (${precisionQuality.toFixed(3)}%). ${precisionQuality < 0.5 ? 'Diferencia despreciable: con suficientes segmentos, todos los métodos son confiables.' : 'Diferencia apreciable: usar Simpson para mayor exactitud.'}</p>`
            },
            {
                title: 'Conclusión práctica',
                icon: 'heroicons:light-bulb',
                content: `<ul>
                    <li>El impacto total de la inflación en la canasta básica es de <strong>${(displayTotal - totalBase).toFixed(2)} Bs</strong> durante ${days} días — un dato concreto para diseñar bonos o subsidios de emergencia.</li>
                    <li>Para cálculos de política económica, usar <strong>Simpson 1/3 o 3/8</strong> con al menos 30 segmentos garantiza resultados confiables.</li>
                    <li>Aumentar el número de segmentos mejora la precisión, pero con ${nSeg} segmentos ya se obtiene una aproximación muy buena para curvas suaves de precios.</li>
                </ul>`
            }
        ]);

        h += `<div class="module-panel mt-3"><h3><iconify-icon icon="heroicons:academic-cap" width="22"></iconify-icon> ¿Qué hace cada método?</h3>`;
        h += UI.createMethodExplanation('Regla del Trapecio', 'Divide el área en trapezoides (líneas rectas entre puntos consecutivos). Error proporcional a h² — duplicar segmentos reduce el error 4 veces. Simple pero menos preciso para curvas con mucha curvatura.');
        h += UI.createMethodExplanation('Simpson 1/3', 'Usa parábolas en lugar de líneas rectas para aproximar el área. Error O(h⁴) — duplicar segmentos reduce el error 16 veces. Requiere número <strong>par</strong> de segmentos. Estándar de facto para integración numérica.');
        h += UI.createMethodExplanation('Simpson 3/8', 'Variante de Simpson que usa polinomios cúbicos por cada 3 subintervalos. Misma precisión O(h⁴) que Simpson 1/3. Requiere que <em>n</em> sea múltiplo de 3. Útil en combinación con Simpson 1/3.');
        h += `</div>`;

        rd.innerHTML = h;
        setTimeout(() => {
            const p = totalResults[0];
            const pts = []; for (let d = 1; d <= days; d += 0.5) pts.push({ x: d, y: p.priceFunc(d) });
            Charts.createLineChart('m4-chart-area', {
                labels: pts.map(p => p.x.toFixed(1)),
                datasets: [
                    { label: p.name + ' (precio con inflación)', data: pts.map(p => p.y), fill: true, pointRadius: 0 },
                    { label: 'Precio base (sin inflación)', data: new Array(pts.length).fill(p.basePrice), dashed: true, pointRadius: 0 }
                ],
                xLabel: 'Día del mes', yLabel: 'Precio (Bs)'
            });
            Charts.createBarChart('m4-chart-bars', {
                labels: totalResults.map(r => r.name),
                datasets: [
                    { label: 'Gasto Real (con inflación)', data: totalResults.map(r => r[activeMethods[0].k]), colors: totalResults.map(() => Charts.COLORS.red), borderColors: totalResults.map(() => Charts.COLORS.red) },
                    { label: 'Gasto Base (sin inflación)', data: totalResults.map(r => r.baseCost), colors: totalResults.map(() => Charts.COLORS.green), borderColors: totalResults.map(() => Charts.COLORS.green) }
                ],
                xLabel: 'Producto', yLabel: 'Gasto total (Bs)'
            });
        }, 100);
    }

    return { render, init, solve };
})();
