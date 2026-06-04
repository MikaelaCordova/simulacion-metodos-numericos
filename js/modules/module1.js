/* ==========================================================================
   Module 1 — Escenario A: Sistemas de Ecuaciones Lineales
   ========================================================================== */

const Module1 = (() => {
    const DEFAULT_A = [[10, -1, 2], [-1, 11, -1], [2, -1, 10]];
    const DEFAULT_B = [600, 2500, 1800];

    const ZONE_LABELS = {
        3: ['Zona Norte', 'Zona Centro', 'Zona Sur'],
        4: ['Zona Norte', 'Zona Centro', 'Zona Sur', 'Zona Este'],
        5: ['Zona Norte', 'Zona Centro', 'Zona Sur', 'Zona Este', 'Zona Oeste']
    };

    function render() {
        return UI.createModuleSection({
            icon: 'heroicons:table-cells', iconColor: 'red',
            title: 'Escenario A: Sistemas de Ecuaciones Lineales',
            subtitle: 'Optimización del abastecimiento y red de transporte — Distribución de recursos entre zonas',
            id: 'mod1'
        });
    }

    function init() {
        const c = document.getElementById('mod1-content');
        if (!c) return;
        c.innerHTML = `
        <div class="method-explanation" style="background-color:var(--bg-card);border-left:4px solid var(--red-medium);padding:1.5rem;margin-bottom:1.5rem;border-radius:var(--radius-md);box-shadow:var(--shadow-sm);">
            <h4 style="color:var(--red-deep);margin-bottom:0.75rem;display:flex;align-items:center;gap:0.5rem;">
                <iconify-icon icon="heroicons:exclamation-triangle" width="22"></iconify-icon> Planteamiento del Problema
            </h4>
            <p style="font-size:1.02rem;line-height:1.7;margin-bottom:1rem;">
                En una crisis de desabastecimiento, tres plantas de distribución deben abastecer urgentemente a las zonas de la ciudad. El reto es encontrar <strong>exactamente cuántas toneladas envía cada planta a cada zona</strong> sin exceder su capacidad ni dejar zonas sin cubrir. Esto se modela como el sistema <span class="math-inline"><em>A</em>·<em>x</em> = <em>b</em></span>, donde la solución <em>x</em> es la distribución óptima.
            </p>
            <div class="math-block"><em>A</em> &nbsp;·&nbsp; <em>x</em> &nbsp;=&nbsp; <em>b</em></div>
            <p style="font-size:0.78rem;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:var(--text-secondary);margin-bottom:0.5rem;margin-top:1.25rem;">
                <iconify-icon icon="heroicons:variable" width="14" style="vertical-align:middle;"></iconify-icon> ¿Qué significa cada símbolo?
            </p>
            ${UI.createVarGrid([
                { symbol: 'A', color: 'red',    name: 'Matriz de coeficientes', desc: 'Cada celda <em>a<sub>ij</sub></em> = costo/capacidad de la Planta <em>i</em> hacia la Zona <em>j</em>.' },
                { symbol: 'x', color: 'blue',   name: 'Vector solución (incógnita)', desc: 'Lo que buscamos: <em>x<sub>1</sub>, x<sub>2</sub>, x<sub>3</sub></em> son las toneladas a enviar a cada zona.' },
                { symbol: 'b', color: 'green',  name: 'Vector de demanda', desc: 'Toneladas que necesita recibir cada zona para cubrir la crisis.' },
                { symbol: 'ε', color: 'yellow', name: 'Tolerancia (error)', desc: 'Si la diferencia entre dos iteraciones es menor que ε, el método para (es suficientemente preciso).' }
            ])}
        </div>

        <div class="module-panel">
            <h3><iconify-icon icon="heroicons:adjustments-horizontal" width="22"></iconify-icon> Ingresa los Datos del Sistema</h3>
            <div class="context-box" style="background:hsla(0,60%,97%,0.6);border-color:var(--red-pastel);margin-bottom:1.25rem;">
                <div class="context-box-header" style="color:var(--red-deep);">
                    <iconify-icon icon="heroicons:information-circle" width="15"></iconify-icon> Cómo llenar la tabla
                </div>
                <p><strong>Matriz A</strong>: cada <em>fila</em> = planta de distribución; cada <em>columna</em> = zona destino. El valor es el costo/eficiencia de ese trayecto.<br>
                <strong>Vector b</strong>: demanda en toneladas de cada zona.<br>
                Los valores cargados representan un escenario real de bloqueo moderado. Puedes editarlos o usar los botones de escenario.</p>
            </div>
            <div class="form-group">
                <label class="form-label">Número de zonas / plantas</label>
                <select class="form-select" id="m1-size" style="width:160px" onchange="Module1.updateMatrixSize()">
                    <option value="3" selected>3 zonas (3×3)</option>
                    <option value="4">4 zonas (4×4)</option>
                    <option value="5">5 zonas (5×5)</option>
                </select>
            </div>
            <div class="form-group" style="background:hsla(0,50%,65%,0.08);padding:0.75rem;border-radius:var(--radius-sm);border:1px solid var(--red-pastel);">
                <label class="form-label" style="color:var(--red-deep);font-weight:700;">
                    <iconify-icon icon="heroicons:cursor-arrow-rays" width="16" style="vertical-align:middle;"></iconify-icon> Método de resolución
                </label>
                <select class="form-select" id="m1-method" style="width:230px;border:2px solid var(--red-medium);font-weight:600;">
                    <option value="todos" selected>Todos los métodos (comparar)</option>
                    <option value="jacobi">Jacobi</option>
                    <option value="gs">Gauss-Seidel</option>
                    <option value="sor">SOR (con relajación ω)</option>
                    <option value="lu">Factorización LU (exacto)</option>
                    <option value="cg">Gradiente Conjugado</option>
                </select>
            </div>
            <div id="m1-matrix-container" style="width:100%;margin-top:1rem;overflow-x:auto;"></div>
            <div class="form-row mt-2">
                <div class="form-group">
                    <label class="form-label" for="m1-tol">Tolerancia <span class="math-inline">ε</span></label>
                    <input class="form-input" type="number" id="m1-tol" value="0.0001" step="any">
                    <span class="form-hint">Ej: 0.0001 = precisión de 4 decimales</span>
                </div>
                <div class="form-group">
                    <label class="form-label" for="m1-maxiter">Máx. Iteraciones</label>
                    <input class="form-input" type="number" id="m1-maxiter" value="100" step="1">
                    <span class="form-hint">Cuántas veces intenta calcular antes de parar</span>
                </div>
                <div class="form-group">
                    <label class="form-label" for="m1-omega">Factor <span class="math-inline">ω</span> (SOR)</label>
                    <input class="form-input" type="number" id="m1-omega" value="1.25" step="0.05" min="0" max="2">
                    <span class="form-hint">Entre 1 y 2 acelera convergencia. Típico: 1.25</span>
                </div>
            </div>
            <div class="btn-group">
                <button class="btn btn-primary" onclick="Module1.solve()"><iconify-icon icon="heroicons:play" width="18"></iconify-icon> Resolver Sistema</button>
                <button class="btn btn-secondary" onclick="Module1.loadBlocked()"><iconify-icon icon="heroicons:no-symbol" width="18"></iconify-icon> Escenario: Bloqueo</button>
                <button class="btn btn-secondary" onclick="Module1.loadHighDemand()"><iconify-icon icon="heroicons:arrow-trending-up" width="18"></iconify-icon> Escenario: Alta Demanda</button>
            </div>
        </div>
        <div id="m1-results"></div>`;

        _renderMatrix(3, DEFAULT_A, DEFAULT_B);
    }

    function _renderMatrix(n, A, b) {
        const labels = ZONE_LABELS[n] || ZONE_LABELS[3];
        document.getElementById('m1-matrix-container').innerHTML =
            UI.createLabeledMatrixInput('m1-matrix', n, n, A, b, labels.slice(0, n), labels.slice(0, n), 'Matriz A — Capacidades de Transporte', 'Vector b — Demanda');
    }

    function updateMatrixSize() {
        const n = parseInt(document.getElementById('m1-size').value);
        const A = Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => i === j ? 10 : 0));
        _renderMatrix(n, A, new Array(n).fill(0));
    }

    function loadBlocked()    { _load(3, [[2, 10, 3], [8, 3, 5], [4, 6, 1]], [400, 2500, 1800]); }
    function loadHighDemand() { _load(3, [[15, 2, 1], [3, 12, 2], [1, 4, 10]], [2500, 3800, 3200]); }
    function _load(n, A, b)   { 
        document.getElementById('m1-size').value = n; 
        _renderMatrix(n, A, b); 
        solve(); // Calcular automáticamente al cargar el escenario
    }

    function solve() {
        const n = parseInt(document.getElementById('m1-size').value);
        const A = UI.readMatrix('m1-matrix', n, n);
        const b = UI.readVector('m1-matrix', n);
        const tol = parseFloat(document.getElementById('m1-tol').value) || 1e-4;
        const maxIter = parseInt(document.getElementById('m1-maxiter').value) || 100;
        const omega = parseFloat(document.getElementById('m1-omega').value) || 1.25;
        const rd = document.getElementById('m1-results');

        for (let i = 0; i < n; i++) {
            if (A[i][i] === 0) {
                rd.innerHTML = UI.createErrorMessage(`La diagonal A[${i+1}][${i+1}] es cero. Los métodos iterativos requieren elementos no nulos en la diagonal. Reordena las ecuaciones o usa Factorización LU.`);
                return;
            }
        }

        const methodKey = document.getElementById('m1-method').value;
        const opts = { tol, maxIter };
        const R = {};
        if (methodKey === 'todos' || methodKey === 'jacobi') { try { R.jacobi = LinearSystems.jacobi(A, b, opts) } catch(e) { R.jacobi = { error: e.message } } }
        if (methodKey === 'todos' || methodKey === 'gs')     { try { R.gs     = LinearSystems.gaussSeidel(A, b, opts) } catch(e) { R.gs = { error: e.message } } }
        if (methodKey === 'todos' || methodKey === 'sor')    { try { R.sor    = LinearSystems.sor(A, b, { ...opts, omega }) } catch(e) { R.sor = { error: e.message } } }
        if (methodKey === 'todos' || methodKey === 'lu')     { try { R.lu     = LinearSystems.luFactorization(A, b) } catch(e) { R.lu = { error: e.message } } }
        if (methodKey === 'todos' || methodKey === 'cg')     { try { R.cg     = LinearSystems.conjugateGradient(A, b, opts) } catch(e) { R.cg = { error: e.message } } }

        const allMs = [
            { k: 'jacobi', n: 'Jacobi' }, { k: 'gs', n: 'Gauss-Seidel' },
            { k: 'sor', n: `SOR (ω=${omega})` }, { k: 'lu', n: 'Factorización LU' }, { k: 'cg', n: 'Gradiente Conjugado' }
        ];
        const ms = allMs.filter(m => R[m.k]);
        const isDom = LinearSystems.isDiagonallyDominant(A);
        const zones = ZONE_LABELS[n] || ZONE_LABELS[3];

        let h = isDom
            ? `<div class="result-card success"><div class="result-title"><iconify-icon icon="heroicons:check-circle" width="20"></iconify-icon> Matriz Diagonalmente Dominante <span class="interp-badge good" style="margin-left:0.5rem">Convergencia garantizada</span></div><div class="result-label">Cada elemento diagonal supera la suma del resto de su fila → los métodos iterativos convergerán.</div></div>`
            : `<div class="result-card warning"><div class="result-title"><iconify-icon icon="heroicons:exclamation-triangle" width="20"></iconify-icon> Matriz NO diagonalmente dominante <span class="interp-badge warn" style="margin-left:0.5rem">Convergencia no garantizada</span></div><div class="result-label">Los métodos iterativos podrían divergir. Factorización LU siempre entrega resultado exacto.</div></div>`;

        const hdr = ['Método', ...Array.from({ length: n }, (_, i) => `x&#8321;&#8322;&#8323;`.split('')[i] !== undefined ? `<em>x<sub>${i+1}</sub></em>` : `x${i+1}`), 'Iteraciones', 'Error Final', 'Estado'];
        const rows = ms.map(m => {
            const r = R[m.k];
            if (r.error) return [m.n, ...new Array(n).fill('—'), '—', '—', `<span style="color:var(--red-deep);font-size:0.82rem">${r.error}</span>`];
            const s = r.solution.map(v => v.toFixed(4));
            const le = r.history[r.history.length - 1]?.error;
            const st = r.converged ? '<span class="convergence-indicator converged">✓ Convergió</span>' : '<span class="convergence-indicator diverged">✗ No convergió</span>';
            return [m.n, ...s, r.iterations, typeof le === 'number' ? le.toExponential(2) : '—', st];
        });

        h += `<div class="module-panel mt-3"><h3><iconify-icon icon="heroicons:table-cells" width="22"></iconify-icon> Comparación de Métodos</h3>${UI.createTable(hdr, rows)}</div>`;

        const best = ms.find(m => R[m.k].converged && !R[m.k].error);
        const luOk = R.lu && !R.lu.error;
        const refResult = luOk ? R.lu : (best ? R[best.k] : null);
        const convergedMethods = ms.filter(m => R[m.k].converged && !R[m.k].error);
        const fastestIter = convergedMethods.length ? convergedMethods.reduce((a, b2) => R[a.k].iterations <= R[b2.k].iterations ? a : b2) : null;
        const finalErr = best ? R[best.k].history[R[best.k].history.length-1]?.error : null;
        const errQual = finalErr !== null ? (finalErr < 1e-6 ? 'excelente' : finalErr < 1e-3 ? 'aceptable' : 'baja') : null;

        if (n === 3) {
            h += `<div class="module-panel mt-3"><h3><iconify-icon icon="heroicons:cube" width="22"></iconify-icon> Visualización 3D — Intersección de Planos</h3><p style="font-size:0.88rem;color:var(--text-secondary);margin-bottom:0.5rem;">Cada ecuación del sistema define un <em>plano</em> en el espacio 3D. La solución es el único punto donde los tres planos se cortan simultáneamente.</p><div id="m1-chart-3d" style="width:100%;height:400px;margin-top:0.75rem;"></div></div>`;
        }

        h += `<div class="two-col mt-3"><div>${UI.createChartContainer('m1-chart-conv','Convergencia del Error por Iteración')}</div><div>${UI.createChartContainer('m1-chart-bar','Iteraciones Necesarias por Método')}</div></div>`;

        const iterativeMs = ms.filter(m => m.k !== 'lu');
        const anyConverged = iterativeMs.some(m => R[m.k].converged && !R[m.k].error);
        const anyFailed = iterativeMs.some(m => (!R[m.k].converged || R[m.k].error));
        
        let convergenceContent = '';
        if (iterativeMs.length === 0) {
            convergenceContent = `<p>Has utilizado un <strong>método directo (Factorización LU)</strong>. Este método no requiere converger iterativamente, sino que resuelve algebraicamente el sistema en un solo paso, encontrando el plan de distribución exacto y perfecto sin oscilaciones.</p>`;
        } else if (anyConverged && !anyFailed) {
            convergenceContent = `<p><strong>¡La simulación convergió!</strong> Hemos encontrado un plan de distribución estable y sin contradicciones. Los cálculos de envíos se ajustaron paso a paso hasta cumplir con todas las restricciones de capacidad de las plantas y la demanda de las zonas, con un margen de error mínimo (<span class="math-inline">ε = ${tol}</span>).</p>`;
        } else if (anyConverged && anyFailed) {
            convergenceContent = `<p><strong>Algunos métodos convergieron y otros no.</strong> Los métodos exitosos encontraron un plan de distribución estable y exacto. Los que fallaron oscilaron sin encontrar un equilibrio logístico, lo cual es común cuando la matriz no tiene una estructura ideal (falta de dominancia diagonal).</p>`;
        } else {
            convergenceContent = `<p><strong>La simulación NO convergió.</strong> Esto significa que el plan logístico es caótico o matemáticamente inestable con los datos actuales: las cantidades a enviar oscilan sin encontrar un equilibrio. Esto ocurre si las rutas no son óptimas o hay inconsistencias en las restricciones (falta de dominancia diagonal).</p>`;
        }

        const hasNegative = refResult && !refResult.error && refResult.solution.some(v => v < 0);
        let distributionContent = '';
        if (refResult && !refResult.error) {
            distributionContent = `<p>Resultado matemático usando <strong>${luOk ? 'Factorización LU (exacto)' : best?.n}</strong>:</p>
                       <ul>${refResult.solution.map((v, i) => `<li><strong>${zones[i] || 'Zona '+(i+1)}:</strong> <span class="interp-highlight">${v.toFixed(2)} toneladas</span></li>`).join('')}</ul>`;
            
            if (hasNegative) {
                distributionContent += `<div style="margin-top:0.75rem; padding: 0.75rem; background: hsla(0, 80%, 95%, 0.7); border-left: 3px solid var(--red-deep); border-radius: var(--radius-sm);">
                    <p style="color: var(--red-deep); font-weight: 700; margin-bottom: 0.25rem;"><iconify-icon icon="heroicons:exclamation-circle" style="vertical-align:middle"></iconify-icon> ¡Alerta de Inviabilidad Física!</p>
                    <p style="font-size: 0.9rem; line-height: 1.5; color: var(--text-main);">Matemáticamente el sistema de ecuaciones tiene solución, pero arroja <strong>valores negativos</strong>. En la vida real, no puedes enviar "toneladas negativas" de alimento. Esto significa que con las rutas bloqueadas actuales, es <strong>físicamente imposible</strong> cubrir la demanda sin violar las capacidades. El sistema logístico está colapsado.</p>
                </div>`;
            } else {
                distributionContent += `<p style="margin-top:0.4rem;">Estos valores satisfacen <em>todas</em> las restricciones de capacidad y demanda simultáneamente, resultando en un plan de distribución físicamente viable y óptimo.</p>`;
            }
        } else {
            distributionContent = `<p>Ningún método logró resolver el sistema. Prueba aumentar iteraciones o usar Factorización LU.</p>`;
        }

        h += UI.createRichInterpretation([
            {
                title: 'Estado de la simulación (Convergencia)',
                icon: 'heroicons:information-circle',
                content: convergenceContent
            },
            {
                title: 'Distribución de recursos (Resultado)',
                icon: 'heroicons:map-pin',
                content: distributionContent
            },
            {
                title: 'Eficiencia comparada entre métodos',
                icon: 'heroicons:chart-bar',
                content: convergedMethods.length > 0
                    ? `<ul>${convergedMethods.map(m => {
                        const r = R[m.k];
                        const spd = r.iterations <= 20 ? '<span class="interp-badge good">Rápido</span>' : r.iterations <= 60 ? '<span class="interp-badge warn">Moderado</span>' : '<span class="interp-badge bad">Lento</span>';
                        return `<li><strong>${m.n}:</strong> <span class="interp-highlight">${r.iterations} iteraciones</span> ${spd}</li>`;
                      }).join('')}
                      ${luOk ? '<li><strong>Factorización LU:</strong> <span class="interp-badge info">Sin iteraciones</span> — método directo, solución exacta en un paso.</li>' : ''}
                    </ul>${fastestIter ? `<p style="margin-top:0.4rem;"><strong>${fastestIter.n}</strong> fue el método iterativo más eficiente para este escenario.</p>` : ''}`
                    : `<p>Ningún método iterativo convergió. Considera Factorización LU.</p>`
            },
            {
                title: 'Calidad numérica del resultado',
                icon: 'heroicons:beaker',
                content: finalErr !== null
                    ? `<p>Error final: <span class="math-inline">${finalErr.toExponential(3)}</span> → <strong>${errQual === 'excelente' ? 'Excelente precisión' : errQual === 'aceptable' ? '✔ Precisión aceptable' : '⚠ Precisión baja'}</strong>.</p>
                       <p style="margin-top:0.35rem;">${errQual === 'excelente' ? 'El margen de error es despreciable para decisiones logísticas reales.' : errQual === 'aceptable' ? 'El resultado es confiable para planificación. Reduce ε para mayor exactitud.' : 'Reduce ε o aumenta iteraciones para mayor confianza en los datos.'}</p>`
                    : `<p>LU no genera error iterativo — la solución es algebraicamente exacta.</p>`
            },
            {
                title: 'Conclusión práctica',
                icon: 'heroicons:light-bulb',
                content: `<ul>
                    <li>Implementar la distribución calculada garantiza que las ${n} zonas reciban exactamente los recursos que necesitan.</li>
                    <li>${isDom ? 'El sistema está bien condicionado (dominancia diagonal) — los resultados son numérica y logísticamente confiables.' : 'Verificar las restricciones logísticas: la falta de dominancia diagonal puede indicar datos inconsistentes o conflictivos.'}</li>
                    <li>Para sistemas grandes, <strong>Gauss-Seidel</strong> o <strong>SOR</strong> son más eficientes. Para máxima exactitud sin importar el costo, usar siempre <strong>Factorización LU</strong>.</li>
                </ul>`
            }
        ]);

        h += `<div class="module-panel mt-3"><h3><iconify-icon icon="heroicons:academic-cap" width="22"></iconify-icon> ¿Qué hace cada método?</h3>`;
        h += UI.createMethodExplanation('Jacobi', 'Actualiza todas las incógnitas a la vez usando solo valores de la iteración anterior. Simple y paralelizable, pero converge más lento. Requiere dominancia diagonal para garantizar convergencia.');
        h += UI.createMethodExplanation('Gauss-Seidel', 'Mejora sobre Jacobi: usa inmediatamente cada valor actualizado. Converge generalmente el <strong>doble de rápido</strong> con el mismo costo computacional.');
        h += UI.createMethodExplanation('SOR (Sobre-Relajación)', 'Gauss-Seidel acelerado con factor ω ∈ (0, 2). Un ω óptimo puede reducir las iteraciones <strong>10× o más</strong>. ω = 1 equivale a Gauss-Seidel puro.');
        h += UI.createMethodExplanation('Factorización LU', '<strong>Método directo:</strong> descompone A = L·U, luego resuelve L·y = b y U·x = y. No itera, no acumula error. La solución es algebraicamente exacta.');
        h += UI.createMethodExplanation('Gradiente Conjugado', 'Óptimo para matrices simétricas positivas definidas. Converge en ≤ n iteraciones teóricamente. Eficiente en sistemas grandes donde LU requeriría demasiada memoria.');
        h += `</div>`;

        rd.innerHTML = h;

        setTimeout(() => {
            const ds = []; ms.forEach(m => { const r = R[m.k]; if (!r.error && r.history.length > 1) ds.push({ label: m.n, data: r.history.map(h => h.error) }); });
            if (ds.length) { const ml = Math.max(...ds.map(d => d.data.length)); Charts.createLineChart('m1-chart-conv', { labels: Array.from({ length: ml }, (_, i) => i+1), datasets: ds, xLabel: 'Iteración', yLabel: 'Error' }); }
            const bl = [], bd = []; ms.forEach(m => { const r = R[m.k]; if (!r.error) { bl.push(m.n); bd.push(r.iterations); } });
            Charts.createBarChart('m1-chart-bar', { labels: bl, datasets: [{ label: 'Iteraciones', data: bd }], xLabel: 'Método', yLabel: 'Iteraciones' });

            if (n === 3 && typeof Plotly !== 'undefined') {
                const cx = refResult ? refResult.solution[0] : 0, cy = refResult ? refResult.solution[1] : 0;
                const xs = [], ys = [];
                for (let i = cx-20; i <= cx+20; i+=2) xs.push(i);
                for (let j = cy-20; j <= cy+20; j+=2) ys.push(j);
                const data = [];
                const css = ['Blues','Reds','Greens'];
                for (let eq = 0; eq < 3; eq++) {
                    const ac=A[eq][0],bc=A[eq][1],cc=A[eq][2],dc=b[eq];
                    const zData=[]; for(let j=0;j<ys.length;j++){const row=[];for(let i=0;i<xs.length;i++)row.push(cc!==0?(dc-ac*xs[i]-bc*ys[j])/cc:null);zData.push(row);}
                    if(cc!==0) data.push({z:zData,x:xs,y:ys,type:'surface',name:`Ecuación ${eq+1}`,showscale:false,opacity:0.8,colorscale:css[eq]});
                }
                if(refResult) data.push({x:[refResult.solution[0]],y:[refResult.solution[1]],z:[refResult.solution[2]],mode:'markers',type:'scatter3d',name:'Solución',marker:{size:8,color:'black'}});
                Plotly.newPlot('m1-chart-3d', data, { margin:{l:0,r:0,b:0,t:0},paper_bgcolor:'rgba(0,0,0,0)',plot_bgcolor:'rgba(0,0,0,0)',scene:{xaxis:{title:'Norte'},yaxis:{title:'Centro'},zaxis:{title:'Sur'}} }, { responsive:true });
            }
        }, 100);
    }

    return { render, init, solve, updateMatrixSize, loadBlocked, loadHighDemand };
})();
