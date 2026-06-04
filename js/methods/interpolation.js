/* ==========================================================================
   Interpolation — Lagrange, Newton Divided Differences, Cubic Splines
   Pure functions: (xData, yData) => interpolation function + coefficients
   ========================================================================== */

const Interpolation = (() => {

    /** Lagrange interpolation */
    function lagrange(xData, yData) {
        const n = xData.length;

        const evaluate = (x) => {
            let result = 0;
            for (let i = 0; i < n; i++) {
                let li = 1;
                for (let j = 0; j < n; j++) {
                    if (j !== i) {
                        li *= (x - xData[j]) / (xData[i] - xData[j]);
                    }
                }
                result += yData[i] * li;
            }
            return result;
        };

        // Compute basis values at data points for display
        const basis = xData.map((_, i) => {
            return (x) => {
                let li = 1;
                for (let j = 0; j < n; j++) {
                    if (j !== i) li *= (x - xData[j]) / (xData[i] - xData[j]);
                }
                return li;
            };
        });

        return { evaluate, method: 'Lagrange', basis };
    }

    /** Newton Divided Differences interpolation */
    function newton(xData, yData) {
        const n = xData.length;
        // Build divided difference table
        const table = [];
        table[0] = [...yData];

        for (let j = 1; j < n; j++) {
            table[j] = [];
            for (let i = 0; i < n - j; i++) {
                table[j][i] = (table[j-1][i+1] - table[j-1][i]) / (xData[i+j] - xData[i]);
            }
        }

        const coefficients = table.map(col => col[0]);

        const evaluate = (x) => {
            let result = coefficients[0];
            let product = 1;
            for (let i = 1; i < n; i++) {
                product *= (x - xData[i-1]);
                result += coefficients[i] * product;
            }
            return result;
        };

        return { evaluate, method: 'Newton', coefficients, table };
    }

    /** Cubic Splines (Natural) */
    function cubicSplines(xData, yData) {
        const n = xData.length - 1; // number of intervals
        const h = [];
        for (let i = 0; i < n; i++) {
            h[i] = xData[i+1] - xData[i];
        }

        // Build tridiagonal system for c coefficients
        const alpha = [0];
        for (let i = 1; i < n; i++) {
            alpha[i] = (3/h[i]) * (yData[i+1] - yData[i]) - (3/h[i-1]) * (yData[i] - yData[i-1]);
        }

        // Solve tridiagonal system
        const l = [1], mu = [0], z = [0];
        for (let i = 1; i < n; i++) {
            l[i] = 2 * (xData[i+1] - xData[i-1]) - h[i-1] * mu[i-1];
            mu[i] = h[i] / l[i];
            z[i] = (alpha[i] - h[i-1] * z[i-1]) / l[i];
        }

        const c = new Array(n + 1).fill(0);
        const b = new Array(n);
        const d = new Array(n);
        const a = [...yData];

        l[n] = 1; z[n] = 0; c[n] = 0;

        for (let j = n - 1; j >= 0; j--) {
            c[j] = z[j] - mu[j] * c[j+1];
            b[j] = (a[j+1] - a[j]) / h[j] - h[j] * (c[j+1] + 2*c[j]) / 3;
            d[j] = (c[j+1] - c[j]) / (3 * h[j]);
        }

        const coefficients = [];
        for (let i = 0; i < n; i++) {
            coefficients.push({ a: a[i], b: b[i], c: c[i], d: d[i], x: xData[i] });
        }

        const evaluate = (x) => {
            // Find the right interval
            let i = 0;
            if (x <= xData[0]) i = 0;
            else if (x >= xData[n]) i = n - 1;
            else {
                for (let j = 0; j < n; j++) {
                    if (x >= xData[j] && x <= xData[j+1]) { i = j; break; }
                }
            }
            const dx = x - xData[i];
            return coefficients[i].a + coefficients[i].b * dx + coefficients[i].c * dx*dx + coefficients[i].d * dx*dx*dx;
        };

        return { evaluate, method: 'Splines Cúbicos', coefficients };
    }

    /** Generate smooth curve points */
    function generateCurve(evaluate, xMin, xMax, numPoints = 200) {
        const points = [];
        const step = (xMax - xMin) / (numPoints - 1);
        for (let i = 0; i < numPoints; i++) {
            const x = xMin + i * step;
            points.push({ x, y: evaluate(x) });
        }
        return points;
    }

    return { lagrange, newton, cubicSplines, generateCurve };
})();
