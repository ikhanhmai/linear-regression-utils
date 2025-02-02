export type Matrix = number[][];

export const transpose = (matrix: Matrix): Matrix => {
  const rows = matrix.length;
  const cols = matrix[0].length;
  const result: Matrix = Array(cols).fill(0).map(() => Array(rows).fill(0));

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      result[j][i] = matrix[i][j];
    }
  }

  return result;
};

export const multiply = (a: Matrix, b: Matrix): Matrix => {
  const aRows = a.length;
  const aCols = a[0].length;
  const bCols = b[0].length;
  const result: Matrix = Array(aRows).fill(0).map(() => Array(bCols).fill(0));

  for (let i = 0; i < aRows; i++) {
    for (let j = 0; j < bCols; j++) {
      for (let k = 0; k < aCols; k++) {
        result[i][j] += a[i][k] * b[k][j];
      }
    }
  }

  return result;
};

export const inverse = (matrix: Matrix): Matrix => {
  const n = matrix.length;
  const augmented: Matrix = matrix.map((row, i) => 
    [...row, ...Array(n).fill(0).map((_, j) => i === j ? 1 : 0)]
  );

  // Gaussian elimination
  for (let i = 0; i < n; i++) {
    const pivot = augmented[i][i];
    if (Math.abs(pivot) < 1e-10) {
      throw new Error('Matrix is singular');
    }

    for (let j = 0; j < 2 * n; j++) {
      augmented[i][j] /= pivot;
    }

    for (let k = 0; k < n; k++) {
      if (k !== i) {
        const factor = augmented[k][i];
        for (let j = 0; j < 2 * n; j++) {
          augmented[k][j] -= factor * augmented[i][j];
        }
      }
    }
  }

  return augmented.map(row => row.slice(n));
};
