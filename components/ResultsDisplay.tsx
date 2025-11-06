import React from 'react';
import type { FontAnalysisResponse } from '../types';

interface ResultsDisplayProps {
  data: FontAnalysisResponse;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ data }) => (
  <div className="w-full max-w-lg mx-auto mt-8 bg-gray-800 rounded-lg shadow-lg p-6">
    <div className="text-center mb-6">
      <h2 className="text-sm uppercase text-blue-400 tracking-widest">Primary Font</h2>
      <p className="text-4xl font-bold text-white mt-1">{data.primary_font_name}</p>
      <div className="mt-2 text-lg text-gray-300">
        Confidence: <span className="font-semibold text-green-400">{(data.confidence_level * 100).toFixed(0)}%</span>
      </div>
    </div>
    
    <div>
      <h3 className="text-sm uppercase text-blue-400 tracking-widest mb-3">Closest Matches</h3>
      <ul className="space-y-3">
        {data.matches.map((match, index) => (
          <li key={index} className="bg-gray-700/50 p-4 rounded-md flex justify-between items-center">
            <span className="font-semibold text-gray-100">{match.name}</span>
            <span className="text-sm text-gray-400 bg-gray-600 px-2 py-1 rounded">{match.description}</span>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

export default ResultsDisplay;
