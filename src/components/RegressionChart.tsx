"use client";

import React from 'react';
import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Scatter,
  ResponsiveContainer,
} from 'recharts';
import { useWindowSize } from '../hooks/useWindowSize';

interface DataPoint {
  x: number;
  y: number;
  yRegression?: number;
}

interface ScatterPointProps {
  cx: number;
  cy: number;
  fill?: string;
  stroke?: string;
}

interface RegressionChartProps {
  dataPoints: DataPoint[];
  regressionLine: { x: number; yRegression: number }[];
  domain: {
    x: [number, number];
    y: [number, number];
  };
  generateTicks: (min: number, max: number, count?: number) => number[];
}

export const RegressionChart: React.FC<RegressionChartProps> = ({
  dataPoints,
  regressionLine,
  domain,
  generateTicks,
}) => {
  const { height: windowHeight } = useWindowSize();
  const chartHeight = Math.max(400, Math.min(windowHeight * 0.6, 600));

  return (
    <div className="w-full" style={{ height: chartHeight }}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          margin={{
            top: 20,
            right: 20,
            bottom: 20,
            left: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            type="number"
            dataKey="x"
            name="X"
            domain={domain.x}
            ticks={generateTicks(domain.x[0], domain.x[1])}
          />
          <YAxis
            type="number"
            dataKey="y"
            name="Y"
            domain={domain.y}
            ticks={generateTicks(domain.y[0], domain.y[1])}
          />
          <Tooltip
            cursor={{ strokeDasharray: '3 3' }}
            content={({ payload }) => {
              if (payload && payload.length > 0) {
                const point = payload[0].payload;
                return (
                  <div className="bg-white p-2 border border-gray-200 rounded shadow-sm">
                    <p className="text-sm">
                      <span className="font-medium">X:</span> {point.x.toFixed(2)}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Y:</span>{' '}
                      {(point.y || point.yRegression).toFixed(2)}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />

          {/* Regression Line */}
          <Line
            type="monotone"
            dataKey="yRegression"
            data={regressionLine}
            stroke="#4F46E5"
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
            shape={(props: ScatterPointProps) => (
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
