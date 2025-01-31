"use client";

import React from 'react';
import {
  ComposedChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Line,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { DataPoint } from '../types';
import { useWindowSize } from '../hooks/useWindowSize';

interface RegressionChartProps {
  dataPoints: DataPoint[];
  regressionLine: { x: number; yRegression: number }[];
  domain: { x: number[]; y: number[] };
  generateTicks: (min: number, max: number, count?: number) => number[];
}

export const RegressionChart: React.FC<RegressionChartProps> = ({
  dataPoints,
  regressionLine,
  domain,
  generateTicks,
}) => {
  const windowSize = useWindowSize();
  const chartHeight = Math.min(600, Math.max(400, windowSize.height * 0.5));

  return (
    <div className="w-full" style={{ height: chartHeight }}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            type="number"
            dataKey="x"
            name="X"
            domain={domain.x as [number, number]}
            ticks={generateTicks(domain.x[0], domain.x[1])}
          />
          <YAxis
            type="number"
            dataKey="y"
            name="Y"
            domain={domain.y as [number, number]}
            ticks={generateTicks(domain.y[0], domain.y[1])}
          />
          <Tooltip
            cursor={{ strokeDasharray: '3 3' }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="bg-white px-4 py-2 shadow-lg rounded-lg border border-gray-200">
                    <p className="text-sm font-medium text-gray-900">Point</p>
                    <p className="text-sm text-gray-600">X: {data.x.toFixed(2)}</p>
                    <p className="text-sm text-gray-600">Y: {data.y ? data.y.toFixed(2) : data.yRegression.toFixed(2)}</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend verticalAlign="top" height={36} />
          
          {/* Regression Line */}
          <Line
            name="Regression Line"
            data={regressionLine}
            type="monotone"
            dataKey="yRegression"
            stroke="#10B981"
            strokeWidth={2}
            dot={false}
            activeDot={false}
            isAnimationActive={false}
          />
          
          {/* Data Points */}
          <Scatter
            name="Data Points"
            data={dataPoints}
            fill="#818CF8"
            shape={(props: any) => (
              <circle
                cx={props.cx}
                cy={props.cy}
                r={4}
                fill="#818CF8"
                stroke="#fff"
                strokeWidth={1}
              />
            )}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};
