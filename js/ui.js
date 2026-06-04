/* ==========================================================================
   UI.js — Reusable UI Component Factory
   Every module uses these functions to build its interface.
   ========================================================================== */

const UI = (() => {

    /** Create a section with header */
    function createModuleSection({ icon, iconColor, title, subtitle, id }) {
        return `
        <section class="section module-section" id="${id}">
            <div class="container">
                <div class="section-header slide-up">
                    <div class="section-icon ${iconColor}">
                        <iconify-icon icon="${icon}" width="28"></iconify-icon>
                    </div>
                    <h1 class="section-title">${title}</h1>
                    <p class="section-subtitle">${subtitle}</p>
                </div>
                <div id="${id}-content" class="fade-in"></div>
            </div>
        </section>`;
    }

    /** Create a form with fields */
    function createForm({ id, fields, submitLabel, submitIcon, onSubmitFn }) {
        const fieldRows = fields.map(f => {
            if (f.type === 'separator') {
                return `<div style="grid-column: 1/-1; border-top:1px solid var(--gray-200); margin:0.5rem 0;"></div>`;
            }
            if (f.type === 'select') {
                const opts = f.options.map(o => `<option value="${o.value}" ${o.selected ? 'selected' : ''}>${o.label}</option>`).join('');
                return `
                <div class="form-group">
                    <label class="form-label" for="${f.id}">${f.label}</label>
                    <select class="form-select" id="${f.id}">${opts}</select>
                    ${f.hint ? `<span class="form-hint">${f.hint}</span>` : ''}
                </div>`;
            }
            return `
            <div class="form-group">
                <label class="form-label" for="${f.id}">${f.label}</label>
                <input class="form-input" type="${f.type || 'number'}" id="${f.id}" 
                       value="${f.value !== undefined ? f.value : ''}" 
                       placeholder="${f.placeholder || ''}"
                       step="${f.step || 'any'}"
                       ${f.min !== undefined ? `min="${f.min}"` : ''}
                       ${f.max !== undefined ? `max="${f.max}"` : ''}>
                ${f.hint ? `<span class="form-hint">${f.hint}</span>` : ''}
            </div>`;
        }).join('');

        return `
        <div class="module-panel" id="${id}">
            <h3><iconify-icon icon="heroicons:adjustments-horizontal" width="22"></iconify-icon> Parámetros de entrada</h3>
            <div class="form-row">${fieldRows}</div>
            <div class="btn-group">
                <button class="btn btn-primary" onclick="${onSubmitFn}">
                    <iconify-icon icon="${submitIcon || 'heroicons:play'}" width="18"></iconify-icon>
                    ${submitLabel || 'Ejecutar'}
                </button>
            </div>
        </div>`;
    }

    /** Create a matrix input */
    function createMatrixInput(id, rows, cols, values, vectorB) {
        let html = `<div class="flex flex-wrap items-center gap-2">`;
        html += `<div><div class="matrix-grid" id="${id}" style="grid-template-columns:repeat(${cols}, 1fr)">`;
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                const val = values ? values[i][j] : '';
                html += `<input type="number" step="any" id="${id}_${i}_${j}" value="${val}" placeholder="a${i+1}${j+1}">`;
            }
        }
        html += `</div></div>`;
        if (vectorB) {
            html += `<div style="font-size:1.5rem;color:var(--text-muted);margin:0 0.5rem;">·x =</div>`;
            html += `<div><div class="matrix-grid" id="${id}_b" style="grid-template-columns:1fr">`;
            for (let i = 0; i < rows; i++) {
                const val = vectorB[i] !== undefined ? vectorB[i] : '';
                html += `<input type="number" step="any" id="${id}_b_${i}" value="${val}" placeholder="b${i+1}">`;
            }
            html += `</div></div>`;
        }
        html += `</div>`;
        return html;
    }

    /** Create a data table */
    function createTable(headers, rows, options = {}) {
        const { id, highlightLast, classes } = options;
        let html = `<div class="table-wrapper" ${id ? `id="${id}"` : ''}>`;
        html += `<table class="data-table ${classes || ''}">`;
        html += `<thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead>`;
        html += `<tbody>`;
        rows.forEach((row, idx) => {
            const cls = (highlightLast && idx === rows.length - 1) ? 'result-row' : '';
            html += `<tr class="${cls}">${row.map(c => `<td>${c}</td>`).join('')}</tr>`;
        });
        html += `</tbody></table></div>`;
        return html;
    }

    /** Create an editable data table */
    function createEditableTable(id, headers, rows) {
        let html = `<div class="table-wrapper"><table class="data-table" id="${id}">`;
        html += `<thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead>`;
        html += `<tbody>`;
        rows.forEach((row, i) => {
            html += `<tr>${row.map((c, j) => 
                `<td><input type="number" step="any" class="form-input" style="padding:0.35rem 0.5rem;font-size:0.85rem" 
                      id="${id}_${i}_${j}" value="${c}"></td>`
            ).join('')}</tr>`;
        });
        html += `</tbody></table></div>`;
        html += `<div class="btn-group">
            <button class="btn btn-secondary" onclick="UI.addTableRow('${id}', ${headers.length})">
                <iconify-icon icon="heroicons:plus" width="16"></iconify-icon> Agregar fila
            </button>
            <button class="btn btn-secondary" onclick="UI.removeTableRow('${id}')">
                <iconify-icon icon="heroicons:minus" width="16"></iconify-icon> Quitar fila
            </button>
        </div>`;
        return html;
    }

    function addTableRow(tableId, cols) {
        const table = document.getElementById(tableId);
        const tbody = table.querySelector('tbody');
        const rowCount = tbody.rows.length;
        const tr = document.createElement('tr');
        for (let j = 0; j < cols; j++) {
            const td = document.createElement('td');
            td.innerHTML = `<input type="number" step="any" class="form-input" style="padding:0.35rem 0.5rem;font-size:0.85rem" 
                id="${tableId}_${rowCount}_${j}" value="">`;
            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    }

    function removeTableRow(tableId) {
        const table = document.getElementById(tableId);
        const tbody = table.querySelector('tbody');
        if (tbody.rows.length > 2) tbody.deleteRow(tbody.rows.length - 1);
    }

    /** Read editable table data */
    function readTableData(tableId) {
        const table = document.getElementById(tableId);
        const tbody = table.querySelector('tbody');
        const data = [];
        for (let i = 0; i < tbody.rows.length; i++) {
            const row = [];
            const inputs = tbody.rows[i].querySelectorAll('input');
            inputs.forEach(inp => row.push(parseFloat(inp.value)));
            if (row.some(v => !isNaN(v))) data.push(row);
        }
        return data;
    }

    /** Create result card */
    function createResultCard(title, value, label, type = 'success') {
        return `
        <div class="result-card ${type}">
            <div class="result-title">${title}</div>
            <div class="result-value">${value}</div>
            ${label ? `<div class="result-label">${label}</div>` : ''}
        </div>`;
    }

    /** Create stat box */
    function createStatBox(value, label) {
        return `
        <div class="stat-box">
            <div class="stat-value">${value}</div>
            <div class="stat-label">${label}</div>
        </div>`;
    }

    /** Create interpretation block */
    function createInterpretation(content) {
        return `
        <div class="interpretation">
            <div class="interpretation-header">
                <iconify-icon icon="heroicons:light-bulb" width="22"></iconify-icon>
                Interpretación de Resultados
            </div>
            ${content}
        </div>`;
    }

    /** Create method explanation */
    function createMethodExplanation(methodName, description) {
        return `
        <div class="method-explanation-enhanced">
            <h4>
                <iconify-icon icon="heroicons:academic-cap" width="18"></iconify-icon>
                ${methodName}
            </h4>
            <p>${description}</p>
        </div>`;
    }

    /**
     * Create a visual grid of variable cards with math notation.
     * vars: Array of { symbol: string (HTML), name: string, desc: string, color: 'red'|'yellow'|'green'|'blue' }
     */
    function createVarGrid(vars) {
        const cards = vars.map(v => `
        <div class="var-card">
            <div class="var-symbol ${v.color || ''}">${v.symbol}</div>
            <div class="var-info">
                <div class="var-name">${v.name}</div>
                <div class="var-desc">${v.desc}</div>
            </div>
        </div>`).join('');
        return `<div class="var-grid">${cards}</div>`;
    }

    /**
     * Create a rich, sectioned interpretation block.
     * sections: Array of { title: string, icon: string, content: string (HTML) }
     */
    function createRichInterpretation(sections) {
        const body = sections.map(s => `
        <div class="interp-section">
            <div class="interp-section-title">
                <iconify-icon icon="${s.icon || 'heroicons:chevron-right'}" width="14"></iconify-icon>
                ${s.title}
            </div>
            ${s.content}
        </div>`).join('');
        return `
        <div class="rich-interpretation">
            <div class="rich-interp-header">
                <iconify-icon icon="heroicons:light-bulb" width="22"></iconify-icon>
                Interpretación de Resultados
            </div>
            <div class="rich-interp-body">${body}</div>
        </div>`;
    }

    /**
     * Create a labeled matrix input with contextual row/column headers.
     * id: base id; rows/cols: dimensions; values: 2D array; vectorB: array;
     * rowLabels: string[]; colLabels: string[]; matrixTitle: string; vectorTitle: string
     */
    function createLabeledMatrixInput(id, rows, cols, values, vectorB, rowLabels, colLabels, matrixTitle, vectorTitle) {
        let html = `<div class="matrix-labeled-wrap">`;

        // Matrix A
        html += `<div class="matrix-labeled">`;
        if (matrixTitle) html += `<div class="matrix-labeled-title">${matrixTitle}</div>`;
        // Col headers
        if (colLabels && colLabels.length) {
            html += `<div class="matrix-col-headers">`;
            colLabels.forEach(lbl => { html += `<div class="matrix-col-header">${lbl}</div>`; });
            html += `</div>`;
        }
        // Rows
        for (let i = 0; i < rows; i++) {
            html += `<div class="matrix-row-wrap">`;
            if (rowLabels && rowLabels[i]) html += `<div class="matrix-row-label">${rowLabels[i]}</div>`;
            for (let j = 0; j < cols; j++) {
                const val = values ? values[i][j] : '';
                html += `<input type="number" step="any" id="${id}_${i}_${j}" value="${val}" placeholder="a${i+1}${j+1}" style="width:70px;text-align:center;padding:0.5rem;border:1.5px solid var(--gray-300);border-radius:var(--radius-sm);font-family:var(--font);font-size:0.9rem;transition:border-color var(--duration) var(--ease);outline:none;" onfocus="this.style.borderColor='var(--red-medium)'" onblur="this.style.borderColor='var(--gray-300)'">`;
            }
            html += `</div>`;
        }
        html += `</div>`;

        // Separator
        html += `<div class="matrix-sep">·<span style="font-family:Georgia;font-style:italic">x</span> =</div>`;

        // Vector b
        if (vectorB) {
            html += `<div class="matrix-labeled">`;
            if (vectorTitle) html += `<div class="matrix-labeled-title">${vectorTitle}</div>`;
            if (colLabels && colLabels.length) {
                html += `<div class="matrix-col-headers"><div class="matrix-col-header" style="padding-left:0;text-align:center">Valor</div></div>`;
            }
            for (let i = 0; i < rows; i++) {
                html += `<div class="matrix-row-wrap">`;
                if (rowLabels && rowLabels[i]) html += `<div class="matrix-row-label">${rowLabels[i]}</div>`;
                const val = vectorB[i] !== undefined ? vectorB[i] : '';
                html += `<input type="number" step="any" id="${id}_b_${i}" value="${val}" placeholder="b${i+1}" style="width:70px;text-align:center;padding:0.5rem;border:1.5px solid var(--gray-300);border-radius:var(--radius-sm);font-family:var(--font);font-size:0.9rem;transition:border-color var(--duration) var(--ease);outline:none;" onfocus="this.style.borderColor='var(--red-medium)'" onblur="this.style.borderColor='var(--gray-300)'">`;
                html += `</div>`;
            }
            html += `</div>`;
        }

        html += `</div>`;
        return html;
    }

    /** Create convergence indicator */
    function createConvergenceIndicator(converged, iterations, error) {
        const type = converged ? 'converged' : 'diverged';
        const text = converged ? 'Convergió' : 'No convergió';
        const icon = converged ? 'heroicons:check-circle' : 'heroicons:x-circle';
        return `
        <span class="convergence-indicator ${type}">
            <iconify-icon icon="${icon}" width="16"></iconify-icon>
            ${text} — ${iterations} iter. — error: ${typeof error === 'number' ? error.toExponential(4) : error}
        </span>`;
    }

    /** Create error message */
    function createErrorMessage(msg) {
        return `
        <div class="error-message">
            <iconify-icon icon="heroicons:exclamation-triangle" width="22"></iconify-icon>
            <div>${msg}</div>
        </div>`;
    }

    /** Create tabs */
    function createTabs(tabId, tabs) {
        let html = `<div class="tabs" id="${tabId}-tabs">`;
        tabs.forEach((t, i) => {
            html += `<button class="tab-btn ${i === 0 ? 'active' : ''}" onclick="UI.switchTab('${tabId}', '${t.id}')" data-tab="${t.id}">${t.label}</button>`;
        });
        html += `</div>`;
        tabs.forEach((t, i) => {
            html += `<div class="tab-content ${i === 0 ? 'active' : ''}" id="${t.id}">${t.content || ''}</div>`;
        });
        return html;
    }

    function switchTab(tabGroupId, tabId) {
        const group = document.getElementById(tabGroupId + '-tabs');
        if (!group) return;
        const parent = group.parentElement;
        group.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        group.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
        parent.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        document.getElementById(tabId).classList.add('active');
    }

    /** Create a chart placeholder */
    function createChartContainer(id, title) {
        return `
        <div class="chart-container">
            ${title ? `<div class="chart-title">${title}</div>` : ''}
            <div class="chart-canvas-wrap">
                <canvas id="${id}"></canvas>
            </div>
        </div>`;
    }

    /** Read matrix from inputs */
    function readMatrix(id, rows, cols) {
        const matrix = [];
        for (let i = 0; i < rows; i++) {
            const row = [];
            for (let j = 0; j < cols; j++) {
                row.push(parseFloat(document.getElementById(`${id}_${i}_${j}`).value) || 0);
            }
            matrix.push(row);
        }
        return matrix;
    }

    /** Read vector b from inputs */
    function readVector(id, size) {
        const v = [];
        for (let i = 0; i < size; i++) {
            v.push(parseFloat(document.getElementById(`${id}_b_${i}`).value) || 0);
        }
        return v;
    }

    return {
        createModuleSection,
        createForm,
        createMatrixInput,
        createLabeledMatrixInput,
        createTable,
        createEditableTable,
        addTableRow,
        removeTableRow,
        readTableData,
        createResultCard,
        createStatBox,
        createInterpretation,
        createRichInterpretation,
        createVarGrid,
        createMethodExplanation,
        createConvergenceIndicator,
        createErrorMessage,
        createTabs,
        switchTab,
        createChartContainer,
        readMatrix,
        readVector
    };
})();
