"use client";

import React from 'react';
import {
  ComposedChart,
  Line,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { SimpleDataPoint } from '../types';

interface SimpleRegressionChartProps {
  dataPoints: SimpleDataPoint[];
  regressionLine: { x: number; yRegression: number }[];
  domain: {
    x: [number, number];
    y: [number, number];
  };
  generateTicks: (min: number, max: number, count?: number) => number[];
}

export const SimpleRegressionChart: React.FC<SimpleRegressionChartProps> = ({
  dataPoints,
  regressionLine,
  domain,
  generateTicks,
}) => {
  const chartHeight = 400;

  return (
    <div className="w-full bg-[#1E1E1E] p-6 rounded-xl shadow-sm border border-gray-700" style={{ height: chartHeight }}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          margin={{
            top: 20,
            right: 20,
            bottom: 20,
            left: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            type="number"
            dataKey="x"
            name="X"
            domain={domain.x}
            ticks={generateTicks(domain.x[0], domain.x[1])}
            tickFormatter={(value) => value.toFixed(2)}
            stroke="#9CA3AF"
          />
          <YAxis
            type="number"
            dataKey="y"
            name="Y"
            domain={domain.y}
            ticks={generateTicks(domain.y[0], domain.y[1])}
            tickFormatter={(value) => value.toFixed(2)}
            stroke="#9CA3AF"
          />
          <Tooltip
            cursor={{ strokeDasharray: '3 3' }}
            contentStyle={{
              backgroundColor: '#2D2D2D',
              border: '1px solid #4B5563',
              borderRadius: '0.375rem',
            }}
            itemStyle={{ color: '#E5E7EB' }}
            labelStyle={{ color: '#E5E7EB' }}
            content={({ payload }) => {
              if (payload && payload.length > 0) {
                const point = payload[0].payload;
                return (
                  <div className="bg-[#2D2D2D] p-2 border border-gray-600 rounded shadow-sm">
                    <p className="text-sm text-gray-200">
                      <span className="font-medium">X:</span> {point.x.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-200">
                      <span className="font-medium">Y:</span>{' '}
                      {(point.y || point.yRegression).toFixed(2)}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />

          {/* Data Points */}
          <Scatter
            name="Points"
            data={dataPoints}
            fill="#60A5FA"
            fillOpacity={0.6}
            shape="circle"
          />

          {/* Regression Line */}
          <Line
            type="monotone"
            dataKey="yRegression"
            data={regressionLine}
            stroke="#60A5FA"
            strokeWidth={2}
            dot={false}
            activeDot={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};
