import * as react from 'react';

interface SimpleDataPoint {
    x: number;
    y: number;
}
interface MultipleDataPoint {
    features: number[];
    output: number;
}
interface SimpleNewPoint {
    feature: string;
    output: string;
}
interface MultipleNewPoint {
    features: string[];
    output: string;
}
interface RegressionStats {
    slope: number;
    intercept: number;
    rSquared: number;
    calculatedSlope: number;
    calculatedIntercept: number;
    tss: number;
    mss: number;
    rss: number;
    tStatisticSlope: number;
    tStatisticIntercept: number;
    pValueSlope: number;
    pValueIntercept: number;
    fStatistic: number;
    pValueF: number;
    standardErrorSlope: number;
    standardErrorIntercept: number;
    vif: number;
    adjustedRSquared: number;
    dfRegression: number;
    dfResidual: number;
    dfTotal: number;
    coefficients: number[];
}
interface ChartDomain {
    x: [number, number];
    y: [number, number];
}

declare const useRegressionChart: () => {
    calculateChartDomain: (points: SimpleDataPoint[] | MultipleDataPoint[], selectedFeature?: number) => ChartDomain;
    getRegressionLinePoints: (type: "simple" | "multiple", points: SimpleDataPoint[] | MultipleDataPoint[], stats: RegressionStats, selectedFeature: number, domain: {
        x: [number, number];
        y: [number, number];
    }) => {
        x: number;
        yRegression: number;
    }[];
    generateTicks: (min: number, max: number, count?: number) => number[];
};

declare const useSimpleRegression: () => {
    simplePoints: SimpleDataPoint[];
    setSimplePoints: react.Dispatch<react.SetStateAction<SimpleDataPoint[]>>;
    manualMode: boolean;
    setManualMode: react.Dispatch<react.SetStateAction<boolean>>;
    manualSlope: number;
    setManualSlope: react.Dispatch<react.SetStateAction<number>>;
    manualIntercept: number;
    setManualIntercept: react.Dispatch<react.SetStateAction<number>>;
    calculateSimpleRegression: (points: SimpleDataPoint[]) => RegressionStats;
    generateRandomSimplePoints: (count: number) => SimpleDataPoint[];
};

declare const useMultipleRegression: () => {
    multiplePoints: MultipleDataPoint[];
    setMultiplePoints: react.Dispatch<react.SetStateAction<MultipleDataPoint[]>>;
    selectedFeature: number;
    setSelectedFeature: react.Dispatch<react.SetStateAction<number>>;
    calculateMultipleRegression: (points: MultipleDataPoint[]) => RegressionStats;
    generateRandomMultiplePoints: (count: number) => MultipleDataPoint[];
};

export { type ChartDomain, type MultipleDataPoint, type MultipleNewPoint, type RegressionStats, type SimpleDataPoint, type SimpleNewPoint, useMultipleRegression, useRegressionChart, useSimpleRegression };
