
import React from 'react';
import { LogEntry, LogLevel } from '../types';
import { InfoIcon, WarningIcon, ErrorIcon } from './icons';

interface LogItemProps {
  log: LogEntry;
}

const LogItem: React.FC<LogItemProps> = ({ log }) => {
  const levelStyles = {
    [LogLevel.INFO]: {
      bg: 'bg-blue-900/30',
      text: 'text-blue-300',
      icon: <InfoIcon className="h-5 w-5 text-blue-400" />,
    },
    [LogLevel.WARN]: {
      bg: 'bg-yellow-900/30',
      text: 'text-yellow-300',
      icon: <WarningIcon className="h-5 w-5 text-yellow-400" />,
    },
    [LogLevel.ERROR]: {
      bg: 'bg-red-900/30',
      text: 'text-red-300',
      icon: <ErrorIcon className="h-5 w-5 text-red-400" />,
    },
  };

  const styles = levelStyles[log.level];

  return (
    <div className={`p-3 rounded-md flex items-start space-x-3 font-mono text-sm ${styles.bg}`}>
      <div className="flex-shrink-0 pt-0.5">{styles.icon}</div>
      <div className="flex-grow">
        <div className="flex items-baseline space-x-2">
            <span className={`font-bold ${styles.text}`}>{log.level}</span>
            <span className="text-gray-500 text-xs">{log.timestamp.toLocaleTimeString()}</span>
            <span className="text-purple-400 font-semibold">{log.service}</span>
        </div>
        <p className="text-gray-300 mt-1">{log.message}</p>
      </div>
    </div>
  );
};

export default LogItem;
