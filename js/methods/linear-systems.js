/* ==========================================================================
   Linear Systems — Jacobi, Gauss-Seidel, SOR, LU, Conjugate Gradient
   All functions are pure: (A, b, options) => { solution, iterations, history }
   ========================================================================== */

const LinearSystems = (() => {

    /** Jacobi iterative method */
    function jacobi(A, b, { tol = 1e-6, maxIter = 100, x0 = null } = {}) {
        const n = b.length;
        let x = x0 ? [...x0] : new Array(n).fill(0);
        const history = [];
        let converged = false;

        for (let k = 0; k < maxIter; k++) {
            const xNew = new Array(n);
            for (let i = 0; i < n; i++) {
                let sum = 0;
                for (let j = 0; j < n; j++) {
                    if (j !== i) sum += A[i][j] * x[j];
                }
                xNew[i] = (b[i] - sum) / A[i][i];
            }
            const error = Math.max(...xNew.map((v, i) => Math.abs(v - x[i])));
            history.push({ iteration: k + 1, x: [...xNew], error });
            x = xNew;
            if (error < tol) { converged = true; break; }
        }

        return { solution: x, converged, iterations: history.length, history };
    }

    /** Gauss-Seidel iterative method */
    function gaussSeidel(A, b, { tol = 1e-6, maxIter = 100, x0 = null } = {}) {
        const n = b.length;
        let x = x0 ? [...x0] : new Array(n).fill(0);
        const history = [];
        let converged = false;

        for (let k = 0; k < maxIter; k++) {
            const xOld = [...x];
            for (let i = 0; i < n; i++) {
                let sum = 0;
                for (let j = 0; j < n; j++) {
                    if (j !== i) sum += A[i][j] * x[j];
                }
                x[i] = (b[i] - sum) / A[i][i];
            }
            const error = Math.max(...x.map((v, i) => Math.abs(v - xOld[i])));
            history.push({ iteration: k + 1, x: [...x], error });
            if (error < tol) { converged = true; break; }
        }

        return { solution: x, converged, iterations: history.length, history };
    }

    /** SOR (Successive Over-Relaxation) */
    function sor(A, b, { tol = 1e-6, maxIter = 100, omega = 1.25, x0 = null } = {}) {
        const n = b.length;
        let x = x0 ? [...x0] : new Array(n).fill(0);
        const history = [];
        let converged = false;

        for (let k = 0; k < maxIter; k++) {
            const xOld = [...x];
            for (let i = 0; i < n; i++) {
                let sum = 0;
                for (let j = 0; j < n; j++) {
                    if (j !== i) sum += A[i][j] * x[j];
                }
                const xGS = (b[i] - sum) / A[i][i];
                x[i] = (1 - omega) * xOld[i] + omega * xGS;
            }
            const error = Math.max(...x.map((v, i) => Math.abs(v - xOld[i])));
            history.push({ iteration: k + 1, x: [...x], error });
            if (error < tol) { converged = true; break; }
        }

        return { solution: x, converged, iterations: history.length, history };
    }

    /** LU Factorization (Doolittle) */
    function luFactorization(A, b) {
        const n = b.length;
        const L = Array.from({ length: n }, () => new Array(n).fill(0));
        const U = Array.from({ length: n }, () => new Array(n).fill(0));

        // Doolittle decomposition
        for (let i = 0; i < n; i++) {
            // Upper triangular
            for (let j = i; j < n; j++) {
                let sum = 0;
                for (let k = 0; k < i; k++) sum += L[i][k] * U[k][j];
                U[i][j] = A[i][j] - sum;
            }
            // Lower triangular
            for (let j = i; j < n; j++) {
                if (i === j) {
                    L[i][i] = 1;
                } else {
                    let sum = 0;
                    for (let k = 0; k < i; k++) sum += L[j][k] * U[k][i];
                    L[j][i] = (A[j][i] - sum) / U[i][i];
                }
            }
        }

        // Forward substitution: Ly = b
        const y = new Array(n).fill(0);
        for (let i = 0; i < n; i++) {
            let sum = 0;
            for (let j = 0; j < i; j++) sum += L[i][j] * y[j];
            y[i] = (b[i] - sum) / L[i][i];
        }

        // Back substitution: Ux = y
        const x = new Array(n).fill(0);
        for (let i = n - 1; i >= 0; i--) {
            let sum = 0;
            for (let j = i + 1; j < n; j++) sum += U[i][j] * x[j];
            x[i] = (y[i] - sum) / U[i][i];
        }

        return { solution: x, L, U, y, converged: true, iterations: 1, history: [{ iteration: 1, x: [...x], error: 0 }] };
    }

    /** Conjugate Gradient (for symmetric positive definite) */
    function conjugateGradient(A, b, { tol = 1e-6, maxIter = 100, x0 = null } = {}) {
        const n = b.length;
        let x = x0 ? [...x0] : new Array(n).fill(0);
        const history = [];

        // r = b - Ax
        let r = b.map((bi, i) => bi - dot(A[i], x));
        let p = [...r];
        let rsOld = dot(r, r);

        for (let k = 0; k < maxIter; k++) {
            const Ap = A.map(row => dot(row, p));
            const alpha = rsOld / dot(p, Ap);
            x = x.map((xi, i) => xi + alpha * p[i]);
            r = r.map((ri, i) => ri - alpha * Ap[i]);

            const rsNew = dot(r, r);
            const error = Math.sqrt(rsNew);
            history.push({ iteration: k + 1, x: [...x], error });

            if (error < tol) {
                return { solution: x, converged: true, iterations: k + 1, history };
            }

            p = r.map((ri, i) => ri + (rsNew / rsOld) * p[i]);
            rsOld = rsNew;
        }

        return { solution: x, converged: false, iterations: maxIter, history };
    }

    function dot(a, b) {
        return a.reduce((sum, ai, i) => sum + ai * b[i], 0);
    }

    /** Check if matrix is diagonally dominant */
    function isDiagonallyDominant(A) {
        return A.every((row, i) => {
            const diag = Math.abs(row[i]);
            const offDiag = row.reduce((s, v, j) => j !== i ? s + Math.abs(v) : s, 0);
            return diag >= offDiag;
        });
    }

    return { jacobi, gaussSeidel, sor, luFactorization, conjugateGradient, isDiagonallyDominant };
})();
