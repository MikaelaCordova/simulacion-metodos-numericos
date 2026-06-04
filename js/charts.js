/* ==========================================================================
   Charts.js — Chart.js wrapper / factory
   ========================================================================== */

const Charts = (() => {
    const instances = {};

    const COLORS = {
        red: 'hsl(0, 50%, 65%)',
        redLight: 'hsla(0, 50%, 65%, 0.15)',
        yellow: 'hsl(45, 70%, 55%)',
        yellowLight: 'hsla(45, 70%, 55%, 0.15)',
        green: 'hsl(140, 40%, 50%)',
        greenLight: 'hsla(140, 40%, 50%, 0.15)',
        blue: 'hsl(210, 60%, 55%)',
        blueLight: 'hsla(210, 60%, 55%, 0.15)',
        purple: 'hsl(270, 45%, 60%)',
        purpleLight: 'hsla(270, 45%, 60%, 0.15)',
        orange: 'hsl(25, 80%, 55%)',
        orangeLight: 'hsla(25, 80%, 55%, 0.15)',
        teal: 'hsl(175, 50%, 45%)',
        tealLight: 'hsla(175, 50%, 45%, 0.15)',
    };

    const PALETTE = [
        { border: COLORS.red, bg: COLORS.redLight },
        { border: COLORS.blue, bg: COLORS.blueLight },
        { border: COLORS.green, bg: COLORS.greenLight },
        { border: COLORS.purple, bg: COLORS.purpleLight },
        { border: COLORS.orange, bg: COLORS.orangeLight },
        { border: COLORS.teal, bg: COLORS.tealLight },
        { border: COLORS.yellow, bg: COLORS.yellowLight },
    ];

    const defaultOptions = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                labels: {
                    font: { family: "'Inter', sans-serif", size: 12, weight: '500' },
                    usePointStyle: true,
                    padding: 16,
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0,0,0,0.8)',
                titleFont: { family: "'Inter', sans-serif", size: 13 },
                bodyFont: { family: "'Inter', sans-serif", size: 12 },
                cornerRadius: 8,
                padding: 10,
            }
        },
        scales: {
            x: {
                grid: { color: 'rgba(0,0,0,0.05)' },
                ticks: { font: { family: "'Inter', sans-serif", size: 11 } }
            },
            y: {
                grid: { color: 'rgba(0,0,0,0.05)' },
                ticks: { font: { family: "'Inter', sans-serif", size: 11 } }
            }
        }
    };

    function destroy(id) {
        if (instances[id]) {
            instances[id].destroy();
            delete instances[id];
        }
    }

    /** Line chart — for convergence, evolution, functions */
    function createLineChart(canvasId, { labels, datasets, xLabel, yLabel, title, fill = false, tension = 0.3 }) {
        destroy(canvasId);
        const ctx = document.getElementById(canvasId);
        if (!ctx) return null;

        const chartDatasets = datasets.map((ds, i) => ({
            label: ds.label,
            data: ds.data,
            borderColor: ds.color || PALETTE[i % PALETTE.length].border,
            backgroundColor: ds.fill !== undefined ? (ds.bgColor || PALETTE[i % PALETTE.length].bg) : 'transparent',
            fill: ds.fill !== undefined ? ds.fill : fill,
            tension: ds.tension !== undefined ? ds.tension : tension,
            borderWidth: ds.borderWidth || 2.5,
            pointRadius: ds.pointRadius !== undefined ? ds.pointRadius : 3,
            pointHoverRadius: 6,
            borderDash: ds.dashed ? [6, 4] : [],
            ...ds.extra
        }));

        const options = JSON.parse(JSON.stringify(defaultOptions));
        if (xLabel) options.scales.x.title = { display: true, text: xLabel, font: { family: "'Inter',sans-serif", size: 12, weight: '600' } };
        if (yLabel) options.scales.y.title = { display: true, text: yLabel, font: { family: "'Inter',sans-serif", size: 12, weight: '600' } };

        instances[canvasId] = new Chart(ctx, {
            type: 'line',
            data: { labels, datasets: chartDatasets },
            options
        });

        return instances[canvasId];
    }

    /** Bar chart */
    function createBarChart(canvasId, { labels, datasets, xLabel, yLabel }) {
        destroy(canvasId);
        const ctx = document.getElementById(canvasId);
        if (!ctx) return null;

        const chartDatasets = datasets.map((ds, i) => ({
            label: ds.label,
            data: ds.data,
            backgroundColor: ds.colors || PALETTE.map(p => p.border).slice(0, ds.data.length),
            borderColor: ds.borderColors || PALETTE.map(p => p.border).slice(0, ds.data.length),
            borderWidth: 1.5,
            borderRadius: 6,
            ...ds.extra
        }));

        const options = JSON.parse(JSON.stringify(defaultOptions));
        if (xLabel) options.scales.x.title = { display: true, text: xLabel, font: { family: "'Inter',sans-serif", size: 12, weight: '600' } };
        if (yLabel) options.scales.y.title = { display: true, text: yLabel, font: { family: "'Inter',sans-serif", size: 12, weight: '600' } };

        instances[canvasId] = new Chart(ctx, {
            type: 'bar',
            data: { labels, datasets: chartDatasets },
            options
        });

        return instances[canvasId];
    }

    /** Scatter chart */
    function createScatterChart(canvasId, { datasets, xLabel, yLabel }) {
        destroy(canvasId);
        const ctx = document.getElementById(canvasId);
        if (!ctx) return null;

        const chartDatasets = datasets.map((ds, i) => ({
            label: ds.label,
            data: ds.data,
            borderColor: ds.color || PALETTE[i % PALETTE.length].border,
            backgroundColor: ds.bgColor || PALETTE[i % PALETTE.length].bg,
            pointRadius: ds.pointRadius || 5,
            pointHoverRadius: 8,
            showLine: ds.showLine || false,
            borderWidth: ds.borderWidth || 2,
            tension: ds.tension || 0,
            fill: ds.fill || false,
            ...ds.extra
        }));

        const options = JSON.parse(JSON.stringify(defaultOptions));
        if (xLabel) options.scales.x.title = { display: true, text: xLabel, font: { family: "'Inter',sans-serif", size: 12, weight: '600' } };
        if (yLabel) options.scales.y.title = { display: true, text: yLabel, font: { family: "'Inter',sans-serif", size: 12, weight: '600' } };

        instances[canvasId] = new Chart(ctx, {
            type: 'scatter',
            data: { datasets: chartDatasets },
            options
        });

        return instances[canvasId];
    }

    /** Area chart (line with fill) */
    function createAreaChart(canvasId, config) {
        return createLineChart(canvasId, { ...config, fill: true });
    }

    return {
        COLORS,
        PALETTE,
        createLineChart,
        createBarChart,
        createScatterChart,
        createAreaChart,
        destroy,
        instances
    };
})();
