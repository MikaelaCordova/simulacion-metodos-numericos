/* ==========================================================================
   Integration — Trapezoidal Rule, Simpson 1/3, Simpson 3/8
   Pure functions: (f, a, b, n) => { result, segments }
   ========================================================================== */

const Integration = (() => {

    /** Trapezoidal Rule */
    function trapezoidal(f, a, b, n) {
        const h = (b - a) / n;
        let sum = f(a) + f(b);
        const segments = [{ x: a, y: f(a) }];

        for (let i = 1; i < n; i++) {
            const x = a + i * h;
            sum += 2 * f(x);
            segments.push({ x, y: f(x) });
        }
        segments.push({ x: b, y: f(b) });

        const result = (h / 2) * sum;
        return { result, segments, method: 'Trapecio', h, n };
    }

    /** Simpson 1/3 Rule (n must be even) */
    function simpson13(f, a, b, n) {
        if (n % 2 !== 0) n++; // Ensure even
        const h = (b - a) / n;
        let sum = f(a) + f(b);
        const segments = [{ x: a, y: f(a) }];

        for (let i = 1; i < n; i++) {
            const x = a + i * h;
            sum += (i % 2 === 0 ? 2 : 4) * f(x);
            segments.push({ x, y: f(x) });
        }
        segments.push({ x: b, y: f(b) });

        const result = (h / 3) * sum;
        return { result, segments, method: 'Simpson 1/3', h, n };
    }

    /** Simpson 3/8 Rule (n must be multiple of 3) */
    function simpson38(f, a, b, n) {
        while (n % 3 !== 0) n++;
        const h = (b - a) / n;
        let sum = f(a) + f(b);
        const segments = [{ x: a, y: f(a) }];

        for (let i = 1; i < n; i++) {
            const x = a + i * h;
            if (i % 3 === 0) sum += 2 * f(x);
            else sum += 3 * f(x);
            segments.push({ x, y: f(x) });
        }
        segments.push({ x: b, y: f(b) });

        const result = (3 * h / 8) * sum;
        return { result, segments, method: 'Simpson 3/8', h, n };
    }

    /** Integrate from tabulated data (x, y arrays) using trapezoidal */
    function trapezoidalData(xData, yData) {
        let sum = 0;
        for (let i = 0; i < xData.length - 1; i++) {
            const h = xData[i+1] - xData[i];
            sum += (yData[i] + yData[i+1]) * h / 2;
        }
        return sum;
    }

    /** Integrate from tabulated data using Simpson 1/3 (composite, for even segments) */
    function simpson13Data(xData, yData) {
        const n = xData.length - 1;
        if (n < 2) return trapezoidalData(xData, yData);
        let sum = 0;
        let i = 0;
        while (i + 2 <= n) {
            const h = (xData[i+2] - xData[i]) / 2;
            sum += (h / 3) * (yData[i] + 4 * yData[i+1] + yData[i+2]);
            i += 2;
        }
        // If odd number of segments, use trapezoidal for the last one
        if (i < n) {
            const h = xData[i+1] - xData[i];
            sum += (yData[i] + yData[i+1]) * h / 2;
        }
        return sum;
    }

    /** Integrate from tabulated data using Simpson 3/8 */
    function simpson38Data(xData, yData) {
        const n = xData.length - 1;
        if (n < 3) return trapezoidalData(xData, yData);
        let sum = 0;
        let i = 0;
        while (i + 3 <= n) {
            const h = (xData[i+3] - xData[i]) / 3;
            sum += (3 * h / 8) * (yData[i] + 3 * yData[i+1] + 3 * yData[i+2] + yData[i+3]);
            i += 3;
        }
        // Remaining segments with trapezoidal
        while (i < n) {
            const h = xData[i+1] - xData[i];
            sum += (yData[i] + yData[i+1]) * h / 2;
            i++;
        }
        return sum;
    }

    return { trapezoidal, simpson13, simpson38, trapezoidalData, simpson13Data, simpson38Data };
})();
