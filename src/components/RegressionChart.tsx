"use client";

import React from 'react';
import {
  ComposedChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Line,
  Tooltip,
  Legend,
} from 'recharts';
import { DataPoint, ChartDomain } from '../types';

interface RegressionChartProps {
  dataPoints: DataPoint[];
  regressionLine: Array<{ x: number; yRegression: number }>;
  chartDomain: ChartDomain;
  generateTicks: (min: number, max: number, count?: number) => number[];
}

export const RegressionChart: React.FC<RegressionChartProps> = ({
  dataPoints,
  regressionLine,
  chartDomain,
  generateTicks,
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <ComposedChart
        width={600}
        height={400}
        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        className="mx-auto"
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          type="number"
          dataKey="x"
          domain={chartDomain.x}
          ticks={generateTicks(...chartDomain.x)}
        />
        <YAxis
          type="number"
          domain={chartDomain.y}
          ticks={generateTicks(...chartDomain.y)}
        />
        <Tooltip />
        <Legend />

        <Line
          data={regressionLine}
          type="monotone"
          dataKey="yRegression"
          stroke="#82ca9d"
          name="Regression Line"
          strokeWidth={2}
          dot={false}
          activeDot={false}
          isAnimationActive={false}
        />

        <Scatter
          data={dataPoints}
          fill="#8884d8"
          name="Data Points"
          dataKey="y"
          shape={(props: any) => {
            const { cx, cy } = props;
            return (
              <circle
                cx={cx}
                cy={cy}
                r={6}
                fill="#8884d8"
                className="transition-all duration-200 hover:r-8"
              />
            );
          }}
        />
      </ComposedChart>
    </div>
  );
};
