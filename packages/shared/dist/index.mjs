import { useCallback, useState } from 'react';

var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var useRegressionChart = () => {
  const calculateChartDomain = useCallback((points, selectedFeature = 0) => {
    if (points.length === 0) {
      return {
        x: [-5, 5],
        y: [-5, 5]
      };
    }
    const isSimpleData = "x" in points[0];
    const xValues = isSimpleData ? points.map((p) => p.x) : points.map((p) => p.features[selectedFeature]);
    const yValues = isSimpleData ? points.map((p) => p.y) : points.map((p) => p.output);
    const xMin = Math.min(...xValues);
    const xMax = Math.max(...xValues);
    const yMin = Math.min(...yValues);
    const yMax = Math.max(...yValues);
    const xPadding = Math.max(1, (xMax - xMin) * 0.1);
    const yPadding = Math.max(1, (yMax - yMin) * 0.1);
    return {
      x: [xMin - xPadding, xMax + xPadding],
      y: [yMin - yPadding, yMax + yPadding]
    };
  }, []);
  const getRegressionLinePoints = useCallback((type, points, stats, selectedFeature, domain) => {
    const linePoints = [];
    const step = (domain.x[1] - domain.x[0]) / 99;
    if (type === "simple") {
      if (!stats.slope && !stats.intercept) {
        return linePoints;
      }
      for (let i = 0; i <= 99; i++) {
        const x = domain.x[0] + step * i;
        const yRegression = stats.slope * x + stats.intercept;
        linePoints.push({ x, yRegression });
      }
    } else {
      if (!stats.coefficients || !stats.coefficients.length) {
        return linePoints;
      }
      const multiPoints = points;
      const meanFeatures = Array(2).fill(0);
      multiPoints.forEach((point) => {
        point.features.forEach((val, idx) => {
          meanFeatures[idx] += val;
        });
      });
      meanFeatures.forEach((sum, idx) => {
        meanFeatures[idx] = sum / multiPoints.length || 0;
      });
      const coefficients = stats.coefficients;
      for (let i = 0; i <= 99; i++) {
        const x = domain.x[0] + step * i;
        const features = [...meanFeatures];
        features[selectedFeature] = x;
        const yRegression = coefficients[0] + features.reduce((sum, feat, idx) => {
          return sum + coefficients[idx + 1] * feat;
        }, 0);
        linePoints.push({ x, yRegression });
      }
    }
    return linePoints;
  }, []);
  const generateTicks = useCallback((min, max, count = 5) => {
    const step = (max - min) / (count - 1);
    return Array.from({ length: count }, (_, i) => min + step * i);
  }, []);
  return {
    calculateChartDomain,
    getRegressionLinePoints,
    generateTicks
  };
};

// src/utils/statistics.ts
var mean = (values) => {
  if (values.length === 0) return 0;
  return values.reduce((sum, val) => sum + val, 0) / values.length;
};
var variance = (values) => {
  if (values.length < 2) return 0;
  const m = mean(values);
  return values.reduce((sum, val) => sum + Math.pow(val - m, 2), 0) / (values.length - 1);
};
var calculatePValue = (tStat, degreesOfFreedom) => {
  const x = degreesOfFreedom / (degreesOfFreedom + tStat * tStat);
  const beta = Math.exp(
    0.5 * (Math.log(degreesOfFreedom) - Math.log(2 * Math.PI)) - Math.log(Math.sqrt(x * (1 - x)))
  );
  return 2 * (1 - beta);
};

// src/useSimpleRegression.ts
var useSimpleRegression = () => {
  const [simplePoints, setSimplePoints] = useState([]);
  const [manualMode, setManualMode] = useState(false);
  const [manualSlope, setManualSlope] = useState(0);
  const [manualIntercept, setManualIntercept] = useState(0);
  const calculateSimpleRegression = useCallback((points) => {
    if (points.length < 2) {
      return getDefaultRegressionStats();
    }
    try {
      const n = points.length;
      const xMean = mean(points.map((p) => p.x));
      const yMean = mean(points.map((p) => p.y));
      const xVariance = variance(points.map((p) => p.x));
      let slope;
      let intercept;
      if (manualMode) {
        slope = manualSlope;
        intercept = manualIntercept;
      } else {
        let numerator = 0;
        let denominator = 0;
        points.forEach((point) => {
          numerator += (point.x - xMean) * (point.y - yMean);
          denominator += Math.pow(point.x - xMean, 2);
        });
        slope = numerator / denominator;
        intercept = yMean - slope * xMean;
      }
      const yPred = points.map((p) => slope * p.x + intercept);
      const residuals = points.map((p, i) => p.y - yPred[i]);
      const tss = points.reduce((sum, p) => sum + Math.pow(p.y - yMean, 2), 0);
      const rss = residuals.reduce((sum, r) => sum + Math.pow(r, 2), 0);
      const mss = tss - rss;
      const rSquared = 1 - rss / tss;
      const dfTotal = n - 1;
      const dfRegression = 1;
      const dfResidual = n - 2;
      const mse = rss / dfResidual;
      const standardErrorSlope = Math.sqrt(mse / (n * xVariance));
      const standardErrorIntercept = Math.sqrt(mse * (1 / n + Math.pow(xMean, 2) / (n * xVariance)));
      const tStatisticSlope = slope / standardErrorSlope;
      const tStatisticIntercept = intercept / standardErrorIntercept;
      const pValueSlope = calculatePValue(Math.abs(tStatisticSlope), dfResidual);
      const pValueIntercept = calculatePValue(Math.abs(tStatisticIntercept), dfResidual);
      const adjustedRSquared = 1 - (1 - rSquared) * dfTotal / dfResidual;
      const fStatistic = mss / dfRegression / (rss / dfResidual);
      const pValueF = calculatePValue(Math.sqrt(fStatistic), dfResidual);
      return {
        slope,
        intercept,
        rSquared,
        calculatedSlope: slope,
        calculatedIntercept: intercept,
        tss,
        mss,
        rss,
        tStatisticSlope,
        tStatisticIntercept,
        pValueSlope,
        pValueIntercept,
        fStatistic,
        pValueF,
        standardErrorSlope,
        standardErrorIntercept,
        vif: 1,
        adjustedRSquared,
        dfRegression,
        dfResidual,
        dfTotal,
        coefficients: [intercept, slope]
      };
    } catch (error) {
      console.error("Error calculating regression:", error);
      return getDefaultRegressionStats();
    }
  }, [manualMode, manualSlope, manualIntercept]);
  const generateRandomSimplePoints = useCallback((count) => {
    const points = [];
    const slope = Math.random() * 6 - 3;
    const intercept = Math.random() * 4 - 2;
    const noise = 1.5;
    for (let i = 0; i < count; i++) {
      const x = Math.random() * 10 - 5;
      const noiseAmount = (Math.random() * 2 - 1) * noise * (1 + Math.random());
      const y = slope * x + intercept + noiseAmount;
      points.push({ x, y });
    }
    return points;
  }, []);
  return {
    simplePoints,
    setSimplePoints,
    manualMode,
    setManualMode,
    manualSlope,
    setManualSlope,
    manualIntercept,
    setManualIntercept,
    calculateSimpleRegression,
    generateRandomSimplePoints
  };
};
function getDefaultRegressionStats() {
  return {
    slope: 0,
    intercept: 0,
    rSquared: 0,
    calculatedSlope: 0,
    calculatedIntercept: 0,
    tss: 0,
    mss: 0,
    rss: 0,
    tStatisticSlope: 0,
    tStatisticIntercept: 0,
    pValueSlope: 1,
    pValueIntercept: 1,
    fStatistic: 0,
    pValueF: 1,
    standardErrorSlope: 0,
    standardErrorIntercept: 0,
    vif: 1,
    adjustedRSquared: 0,
    dfRegression: 0,
    dfResidual: 0,
    dfTotal: 0,
    coefficients: [0, 0]
  };
}

// src/utils/matrixOperations.ts
var transpose = (matrix) => {
  const rows = matrix.length;
  const cols = matrix[0].length;
  const result = Array(cols).fill(0).map(() => Array(rows).fill(0));
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      result[j][i] = matrix[i][j];
    }
  }
  return result;
};
var multiply = (a, b) => {
  const aRows = a.length;
  const aCols = a[0].length;
  const bCols = b[0].length;
  const result = Array(aRows).fill(0).map(() => Array(bCols).fill(0));
  for (let i = 0; i < aRows; i++) {
    for (let j = 0; j < bCols; j++) {
      for (let k = 0; k < aCols; k++) {
        result[i][j] += a[i][k] * b[k][j];
      }
    }
  }
  return result;
};
var inverse = (matrix) => {
  const n = matrix.length;
  const augmented = matrix.map(
    (row, i) => [...row, ...Array(n).fill(0).map((_, j) => i === j ? 1 : 0)]
  );
  for (let i = 0; i < n; i++) {
    const pivot = augmented[i][i];
    if (Math.abs(pivot) < 1e-10) {
      throw new Error("Matrix is singular");
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
  return augmented.map((row) => row.slice(n));
};

// src/useMultipleRegression.ts
var useMultipleRegression = () => {
  const [multiplePoints, setMultiplePoints] = useState([]);
  const [selectedFeature, setSelectedFeature] = useState(0);
  const calculateMultipleRegression = useCallback((points) => {
    if (points.length < 2) {
      return __spreadProps(__spreadValues({}, getDefaultRegressionStats2()), {
        coefficients: [0, 0, 0]
      });
    }
    try {
      const n = points.length;
      const p = points[0].features.length;
      const X = points.map((point) => [1, ...point.features]);
      const y = points.map((point) => point.output);
      const XtX = multiply(transpose(X), X);
      const XtXInv = inverse(XtX);
      const Xty = multiply(transpose(X), y.map((val) => [val])).map((row) => row[0]);
      const coefficients = multiply(XtXInv, Xty.map((val) => [val])).map((row) => row[0]);
      const yPred = multiply(X, coefficients.map((val) => [val])).map((row) => row[0]);
      const yMean = mean(y);
      const tss = y.reduce((sum, val) => sum + Math.pow(val - yMean, 2), 0);
      const rss = y.reduce((sum, val, i) => sum + Math.pow(val - yPred[i], 2), 0);
      const mss = tss - rss;
      const rSquared = 1 - rss / tss;
      const dfTotal = n - 1;
      const dfRegression = p;
      const dfResidual = n - (p + 1);
      const adjustedRSquared = 1 - (1 - rSquared) * dfTotal / dfResidual;
      const mse = rss / dfResidual;
      const standardErrors = XtXInv.map((row, i) => Math.sqrt(mse * row[i]));
      const tStatistics = coefficients.map((coef, i) => coef / standardErrors[i]);
      const fStatistic = mss / dfRegression / (rss / dfResidual);
      const pValueF = calculatePValue(Math.sqrt(fStatistic), dfResidual);
      return {
        slope: coefficients[1],
        intercept: coefficients[0],
        rSquared,
        calculatedSlope: coefficients[1],
        calculatedIntercept: coefficients[0],
        tss,
        mss,
        rss,
        tStatisticSlope: tStatistics[1],
        tStatisticIntercept: tStatistics[0],
        pValueSlope: calculatePValue(Math.abs(tStatistics[1]), dfResidual),
        pValueIntercept: calculatePValue(Math.abs(tStatistics[0]), dfResidual),
        fStatistic,
        pValueF,
        standardErrorSlope: standardErrors[1],
        standardErrorIntercept: standardErrors[0],
        vif: 1,
        adjustedRSquared,
        dfRegression,
        dfResidual,
        dfTotal,
        coefficients
      };
    } catch (error) {
      console.error("Error calculating multiple regression:", error);
      return __spreadProps(__spreadValues({}, getDefaultRegressionStats2()), {
        coefficients: [0, 0, 0]
      });
    }
  }, []);
  const generateRandomMultiplePoints = useCallback((count) => {
    const points = [];
    const coefficients = [2, 3];
    const intercept = 1;
    const noise = 0.5;
    for (let i = 0; i < count; i++) {
      const features = coefficients.map(() => Math.random() * 10 - 5);
      const output = intercept + features.reduce((sum, feat, idx) => sum + coefficients[idx] * feat, 0) + (Math.random() * 2 - 1) * noise;
      points.push({ features, output });
    }
    return points;
  }, []);
  return {
    multiplePoints,
    setMultiplePoints,
    selectedFeature,
    setSelectedFeature,
    calculateMultipleRegression,
    generateRandomMultiplePoints
  };
};
function getDefaultRegressionStats2() {
  return {
    slope: 0,
    intercept: 0,
    rSquared: 0,
    calculatedSlope: 0,
    calculatedIntercept: 0,
    tss: 0,
    mss: 0,
    rss: 0,
    tStatisticSlope: 0,
    tStatisticIntercept: 0,
    pValueSlope: 1,
    pValueIntercept: 1,
    fStatistic: 0,
    pValueF: 1,
    standardErrorSlope: 0,
    standardErrorIntercept: 0,
    vif: 1,
    adjustedRSquared: 0,
    dfRegression: 0,
    dfResidual: 0,
    dfTotal: 0,
    coefficients: [0, 0]
  };
}

export { useMultipleRegression, useRegressionChart, useSimpleRegression };
//# sourceMappingURL=index.mjs.map
//# sourceMappingURL=index.mjs.map