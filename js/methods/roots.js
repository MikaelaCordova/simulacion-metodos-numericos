/* ==========================================================================
   Roots — Bisection, Newton-Raphson, Secant
   Pure functions: (f, params) => { root, iterations, history }
   ========================================================================== */

const Roots = (() => {

    /** Bisection method */
    function bisection(f, a, b, { tol = 1e-6, maxIter = 100 } = {}) {
        const history = [];
        if (f(a) * f(b) > 0) {
            return { root: null, converged: false, iterations: 0, history, error: 'f(a) y f(b) deben tener signos opuestos.' };
        }

        for (let k = 0; k < maxIter; k++) {
            const c = (a + b) / 2;
            const fc = f(c);
            const err = Math.abs(b - a) / 2;

            history.push({ iteration: k + 1, a, b, c, fc, error: err });

            if (Math.abs(fc) < tol || err < tol) {
                return { root: c, converged: true, iterations: k + 1, history };
            }

            if (f(a) * fc < 0) b = c;
            else a = c;
        }

        return { root: (a + b) / 2, converged: false, iterations: maxIter, history };
    }

    /** Newton-Raphson method */
    function newtonRaphson(f, df, x0, { tol = 1e-6, maxIter = 100 } = {}) {
        const history = [];
        let x = x0;

        for (let k = 0; k < maxIter; k++) {
            const fx = f(x);
            const dfx = df(x);

            if (Math.abs(dfx) < 1e-14) {
                return { root: x, converged: false, iterations: k + 1, history, error: 'Derivada cercana a cero.' };
            }

            const xNew = x - fx / dfx;
            const err = Math.abs(xNew - x);

            history.push({ iteration: k + 1, x, fx, dfx, xNew, error: err });

            if (err < tol || Math.abs(f(xNew)) < tol) {
                return { root: xNew, converged: true, iterations: k + 1, history };
            }

            x = xNew;
        }

        return { root: x, converged: false, iterations: maxIter, history };
    }

    /** Secant method */
    function secant(f, x0, x1, { tol = 1e-6, maxIter = 100 } = {}) {
        const history = [];
        let xPrev = x0, xCurr = x1;

        for (let k = 0; k < maxIter; k++) {
            const fPrev = f(xPrev);
            const fCurr = f(xCurr);

            if (Math.abs(fCurr - fPrev) < 1e-14) {
                return { root: xCurr, converged: false, iterations: k + 1, history, error: 'División por cero (f(x_{n}) ≈ f(x_{n-1})).' };
            }

            const xNew = xCurr - fCurr * (xCurr - xPrev) / (fCurr - fPrev);
            const err = Math.abs(xNew - xCurr);

            history.push({ iteration: k + 1, xPrev, xCurr, xNew, fCurr, error: err });

            if (err < tol || Math.abs(f(xNew)) < tol) {
                return { root: xNew, converged: true, iterations: k + 1, history };
            }

            xPrev = xCurr;
            xCurr = xNew;
        }

        return { root: xCurr, converged: false, iterations: maxIter, history };
    }

    /** Estimate convergence order from history */
    function estimateConvergenceOrder(history) {
        if (history.length < 4) return null;
        const errors = history.map(h => h.error).filter(e => e > 0);
        if (errors.length < 4) return null;
        const n = errors.length;
        const e1 = errors[n - 3], e2 = errors[n - 2], e3 = errors[n - 1];
        if (e1 === 0 || e2 === 0) return null;
        const order = Math.log(e3 / e2) / Math.log(e2 / e1);
        return isFinite(order) && order > 0 ? order : null;
    }

    return { bisection, newtonRaphson, secant, estimateConvergenceOrder };
})();
