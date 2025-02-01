export const transpose = (matrix: number[][]): number[][] => {
  if (!matrix[0]) return [[]];
  return matrix[0].map((_, i) => matrix.map(row => row[i]));
};

export const multiply = (a: number[][], b: number[][]): number[][] => {
  if (!a.length || !b.length || !a[0].length || !b[0].length) return [[]];

  const result = Array(a.length).fill(0).map(() => Array(b[0].length).fill(0));
  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < b[0].length; j++) {
      for (let k = 0; k < a[0].length; k++) {
        result[i][j] += a[i][k] * b[k][j];
      }
    }
  }
  return result;
};

export const determinant = (matrix: number[][]): number => {
  const n = matrix.length;

  if (n === 1) return matrix[0][0];
  if (n === 2) return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];

  let det = 0;
  for (let j = 0; j < n; j++) {
    det += Math.pow(-1, j) * matrix[0][j] * determinant(
      matrix.slice(1).map(row => [...row.slice(0, j), ...row.slice(j + 1)])
    );
  }
  return det;
};

export const cofactor = (matrix: number[][], row: number, col: number): number => {
  const subMatrix = matrix
    .slice(0, row)
    .concat(matrix.slice(row + 1))
    .map(row => [...row.slice(0, col), ...row.slice(col + 1)]);
  return Math.pow(-1, row + col) * determinant(subMatrix);
};

export const inverse = (matrix: number[][]): number[][] => {
  const n = matrix.length;

  if (n !== matrix[0].length) throw new Error('Matrix must be square');

  // Add small regularization term to diagonal for numerical stability
  const lambda = 1e-8;
  const regularizedMatrix = matrix.map((row, i) => 
    row.map((val, j) => i === j ? val + lambda : val)
  );

  const det = determinant(regularizedMatrix);
  if (Math.abs(det) < 1e-10) {
    throw new Error('Matrix is singular or nearly singular');
  }

  const cofactorMatrix = Array(n).fill(0).map(() => Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      cofactorMatrix[i][j] = Math.pow(-1, i + j) * cofactor(regularizedMatrix, i, j);
    }
  }

  const adjugate = transpose(cofactorMatrix);
  return adjugate.map(row => row.map(val => val / det));
};

export const diagonal = (matrix: number[][]): number[] => {
  return matrix.map((row, i) => row[i] || 0);
};
