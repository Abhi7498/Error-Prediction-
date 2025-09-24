
import React from 'react';
import { LogEntry, AIAnalysis } from '../types';
import { XMarkIcon, LightBulbIcon, CommandLineIcon, CpuChipIcon } from './icons';

interface AnalysisPanelProps {
  error: LogEntry | null;
  analysis: AIAnalysis | null;
  isLoading: boolean;
  onApplyFix: () => void;
  onDismiss: () => void;
}

const LoadingSpinner: React.FC = () => (
    <div className="flex flex-col items-center justify-center text-center p-8">
        <CpuChipIcon className="h-12 w-12 text-cyan-400 animate-spin" />
        <p className="mt-4 text-lg font-semibold text-cyan-300">Aegis AI is thinking...</p>
        <p className="text-sm text-gray-400">Analyzing error telemetry and predicting failure points.</p>
    </div>
);

const NoErrorState: React.FC = () => (
    <div className="flex flex-col items-center justify-center text-center p-8 h-full">
         <LightBulbIcon className="h-12 w-12 text-gray-600" />
        <p className="mt-4 text-lg font-semibold text-gray-300">System Nominal</p>
        <p className="text-sm text-gray-500">Awaiting new events. Errors will be automatically analyzed here.</p>
    </div>
);


const AnalysisPanel: React.FC<AnalysisPanelProps> = ({ error, analysis, isLoading, onApplyFix, onDismiss }) => {
  return (
    <div className="bg-gray-800/40 border border-gray-700/50 rounded-xl shadow-2xl h-full flex flex-col sticky top-8">
      <div className="p-4 border-b border-gray-700/50 flex justify-between items-center flex-shrink-0">
        <h2 className="text-lg font-semibold text-white">AI Analysis & Remediation</h2>
        {error && (
            <button onClick={onDismiss} className="text-gray-500 hover:text-white transition-colors">
                <XMarkIcon className="h-6 w-6" />
            </button>
        )}
      </div>

      <div className="p-6 flex-grow overflow-y-auto scrollbar-thin">
        {isLoading && <LoadingSpinner />}
        {!isLoading && !error && <NoErrorState />}
        {!isLoading && error && analysis && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h3 className="text-sm font-semibold text-red-400 uppercase tracking-wider">Detected Error</h3>
              <p className="mt-1 font-mono text-sm bg-red-900/30 p-3 rounded-md text-red-200">{error.message}</p>
            </div>
             <div>
              <h3 className="text-sm font-semibold text-cyan-400 uppercase tracking-wider">Root Cause Analysis</h3>
              <p className="mt-1 text-gray-300">{analysis.rootCause}</p>
            </div>
             <div>
              <h3 className="text-sm font-semibold text-yellow-400 uppercase tracking-wider">Potential Impact</h3>
              <p className="mt-1 text-gray-300">{analysis.impact}</p>
            </div>
             <div className="bg-gray-900/50 p-4 rounded-lg border border-cyan-500/30">
              <h3 className="text-sm font-semibold text-cyan-300 uppercase tracking-wider">Suggested Fix</h3>
              <p className="mt-2 text-gray-200">{analysis.suggestion.description}</p>
              {analysis.suggestion.command && (
                <div className="mt-3 bg-black/50 p-3 rounded-md font-mono text-sm text-green-300 flex items-center space-x-2">
                    <CommandLineIcon className="h-5 w-5 flex-shrink-0"/>
                    <code>{analysis.suggestion.command}</code>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {analysis && !isLoading && (
        <div className="p-4 border-t border-gray-700/50 flex-shrink-0">
          <button 
            onClick={onApplyFix}
            className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-75"
          >
            {analysis.suggestion.actionLabel}
          </button>
        </div>
      )}
    </div>
  );
};

export default AnalysisPanel;
