
import React from 'react';
import { SystemStats } from '../types';
import { ChartBarIcon, ExclamationTriangleIcon, WrenchScrewdriverIcon, DocumentTextIcon } from './icons';

interface StatusDashboardProps {
  stats: SystemStats;
}

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: number | string; color: string }> = ({ icon, label, value, color }) => (
  <div className="bg-gray-800/50 p-4 rounded-lg flex items-center space-x-4">
    <div className={`p-3 rounded-full ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-400">{label}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  </div>
);


const StatusDashboard: React.FC<StatusDashboardProps> = ({ stats }) => {
  const systemHealth = stats.totalLogs > 0 ? (((stats.totalLogs - stats.errors) / stats.totalLogs) * 100).toFixed(1) : '100.0';
  
  return (
    <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-4 shadow-lg">
       <h2 className="text-lg font-semibold text-white mb-4">System Overview</h2>
       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={<ChartBarIcon className="h-6 w-6 text-white"/>} label="System Health" value={`${systemHealth}%`} color="bg-green-500/80" />
        <StatCard icon={<DocumentTextIcon className="h-6 w-6 text-white"/>} label="Logs Processed" value={stats.totalLogs} color="bg-blue-500/80" />
        <StatCard icon={<ExclamationTriangleIcon className="h-6 w-6 text-white"/>} label="Errors Detected" value={stats.errors} color="bg-red-500/80" />
        <StatCard icon={<WrenchScrewdriverIcon className="h-6 w-6 text-white"/>} label="Fixes Applied" value={stats.fixesApplied} color="bg-yellow-500/80" />
      </div>
    </div>
  );
};

export default StatusDashboard;
