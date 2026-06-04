/* ==========================================================================
   ODE — Euler, Heun, Runge-Kutta 4th Order
   Pure functions: (f, t0, y0, h, steps) => { tValues, yValues }
   ========================================================================== */

const ODE = (() => {

    /** Euler's method */
    function euler(f, t0, y0, h, steps) {
        const tValues = [t0];
        const yValues = [y0];
        let t = t0, y = y0;

        for (let i = 0; i < steps; i++) {
            y = y + h * f(t, y);
            t = t + h;
            tValues.push(t);
            yValues.push(y);
        }

        return { tValues, yValues, method: 'Euler', h, steps };
    }

    /** Heun's method (Improved Euler / Trapezoidal) */
    function heun(f, t0, y0, h, steps) {
        const tValues = [t0];
        const yValues = [y0];
        let t = t0, y = y0;

        for (let i = 0; i < steps; i++) {
            const k1 = f(t, y);
            const yPredict = y + h * k1;
            const k2 = f(t + h, yPredict);
            y = y + (h / 2) * (k1 + k2);
            t = t + h;
            tValues.push(t);
            yValues.push(y);
        }

        return { tValues, yValues, method: 'Heun', h, steps };
    }

    /** Runge-Kutta 4th Order (RK4) */
    function rk4(f, t0, y0, h, steps) {
        const tValues = [t0];
        const yValues = [y0];
        let t = t0, y = y0;

        for (let i = 0; i < steps; i++) {
            const k1 = h * f(t, y);
            const k2 = h * f(t + h/2, y + k1/2);
            const k3 = h * f(t + h/2, y + k2/2);
            const k4 = h * f(t + h, y + k3);
            y = y + (k1 + 2*k2 + 2*k3 + k4) / 6;
            t = t + h;
            tValues.push(t);
            yValues.push(y);
        }

        return { tValues, yValues, method: 'RK4', h, steps };
    }

    /** Find when y crosses a threshold */
    function findThresholdCrossing(tValues, yValues, threshold) {
        for (let i = 1; i < yValues.length; i++) {
            if (yValues[i] <= threshold && yValues[i-1] > threshold) {
                // Linear interpolation for more precise crossing
                const t = tValues[i-1] + (threshold - yValues[i-1]) * (tValues[i] - tValues[i-1]) / (yValues[i] - yValues[i-1]);
                return { time: t, index: i };
            }
        }
        return null;
    }

    return { euler, heun, rk4, findThresholdCrossing };
})();
