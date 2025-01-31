"use client";

import React from 'react';
import { DataPoint } from '../types';

interface DataInputFormProps {
  onAddPoint: (point: DataPoint) => void;
  feedback: string;
}

export const DataInputForm: React.FC<DataInputFormProps> = ({ onAddPoint, feedback }) => {
  const [newPoint, setNewPoint] = React.useState<{ x: string; y: string }>({ x: '', y: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPoint.x !== '' && newPoint.y !== '') {
      const x = parseFloat(newPoint.x);
      const y = parseFloat(newPoint.y);
      
      if (!isNaN(x) && !isNaN(y)) {
        onAddPoint({ x, y });
        setNewPoint({ x: '', y: '' });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[150px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            X Value
          </label>
          <input
            type="number"
            value={newPoint.x}
            onChange={(e) => setNewPoint({ ...newPoint, x: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            step="any"
          />
        </div>
        <div className="flex-1 min-w-[150px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Y Value
          </label>
          <input
            type="number"
            value={newPoint.y}
            onChange={(e) => setNewPoint({ ...newPoint, y: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            step="any"
          />
        </div>
        <div className="flex items-end">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Add Point
          </button>
        </div>
      </div>
      {feedback && (
        <div className="text-sm text-green-600 mt-2">
          {feedback}
        </div>
      )}
    </form>
  );
};
