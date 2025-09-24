
import React, { useRef, useEffect } from 'react';
import { LogEntry } from '../types';
import LogItem from './LogItem';

interface LogStreamProps {
  logs: LogEntry[];
}

const LogStream: React.FC<LogStreamProps> = ({ logs }) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = 0;
        }
    }, [logs]);

    return (
        <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-4 shadow-lg flex-grow flex flex-col">
            <h2 className="text-lg font-semibold text-white mb-4 flex-shrink-0">Live Event Stream</h2>
            <div ref={scrollRef} className="overflow-y-auto pr-2 flex-grow h-96 scrollbar-thin">
                <div className="space-y-2">
                    {logs.map(log => (
                        <LogItem key={log.id} log={log} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LogStream;
