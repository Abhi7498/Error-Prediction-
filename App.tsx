
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Header from './components/Header';
import LogStream from './components/LogStream';
import AnalysisPanel from './components/AnalysisPanel';
import StatusDashboard from './components/StatusDashboard';
import { LogEntry, LogLevel, AIAnalysis, SystemStats } from './types';
import { analyzeError } from './services/geminiService';

const App: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [currentError, setCurrentError] = useState<LogEntry | null>(null);
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [stats, setStats] = useState<SystemStats>({ totalLogs: 0, errors: 0, fixesApplied: 0 });
  const isAnalyzingRef = useRef(isAnalyzing);

  useEffect(() => {
    isAnalyzingRef.current = isAnalyzing;
  }, [isAnalyzing]);


  const predefinedLogs: Omit<LogEntry, 'id' | 'timestamp'>[] = [
    { level: LogLevel.INFO, service: 'auth-service', message: 'User authentication successful for user: alex_g' },
    { level: LogLevel.INFO, service: 'api-gateway', message: 'Request received: GET /v1/products' },
    { level: LogLevel.WARN, service: 'payment-service', message: 'High latency detected in payment processing > 500ms' },
    { level: LogLevel.ERROR, service: 'db-connector', message: "Database connection failed: invalid credentials for user 'prod_user'" },
    { level: LogLevel.INFO, service: 'product-catalog', message: 'Product cache refreshed successfully' },
    { level: LogLevel.INFO, service: 'shipping-service', message: 'Shipping rates calculated for order #84321' },
    { level: LogLevel.ERROR, service: 'user-profile-api', message: "API request failed: parameter 'userId' is null" },
    { level: LogLevel.WARN, service: 'inventory-manager', message: 'Low stock warning for SKU: XYZ-123' },
    { level: LogLevel.ERROR, service: 'checkout-service', message: "Timeout connecting to service 'payment-gateway' after 3000ms" },
    { level: LogLevel.INFO, service: 'auth-service', message: 'User logout successful for user: jane_d' }
  ];

  const addLog = useCallback((log: Omit<LogEntry, 'id' | 'timestamp'>) => {
    const newLog: LogEntry = {
      ...log,
      id: Date.now() + Math.random(),
      timestamp: new Date(),
    };
    
    setLogs(prev => [newLog, ...prev.slice(0, 99)]);
    setStats(prev => ({
      ...prev,
      totalLogs: prev.totalLogs + 1,
      errors: log.level === LogLevel.ERROR ? prev.errors + 1 : prev.errors,
    }));

    if (log.level === LogLevel.ERROR && !isAnalyzingRef.current) {
        setCurrentError(newLog);
    }
  }, []);
  
  const applyFix = useCallback(() => {
      if (!currentError || !analysis) return;
      const fixLog: Omit<LogEntry, 'id' | 'timestamp'> = {
        level: LogLevel.INFO,
        service: 'aegis-ai',
        message: `FIX APPLIED: ${analysis.suggestion.description} for error in ${currentError.service}.`
      }
      addLog(fixLog);
      setStats(prev => ({ ...prev, fixesApplied: prev.fixesApplied + 1 }));
      setCurrentError(null);
      setAnalysis(null);
  }, [currentError, analysis, addLog]);


  useEffect(() => {
    const logInterval = setInterval(() => {
      const randomLog = predefinedLogs[Math.floor(Math.random() * predefinedLogs.length)];
      addLog(randomLog);
    }, 3000);

    return () => clearInterval(logInterval);
  }, [addLog]);

  useEffect(() => {
    const performAnalysis = async () => {
        if (currentError && !isAnalyzing) {
            setIsAnalyzing(true);
            setAnalysis(null);
            try {
                const result = await analyzeError(currentError.message);
                setAnalysis(result);
            } catch (error) {
                console.error("Error analyzing log:", error);
                setAnalysis({
                    errorType: "Analysis Failed",
                    rootCause: "The AI model could not process the request. This might be due to an API error or network issue.",
                    impact: "Unable to provide automated suggestions for the current error.",
                    suggestion: {
                        description: "Retry the analysis manually or check the browser console for more details.",
                        actionLabel: "Retry",
                        command: ""
                    }
                });
            } finally {
                setIsAnalyzing(false);
            }
        }
    };
    performAnalysis();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentError]);

  return (
    <div className="min-h-screen bg-gray-900 font-sans text-gray-200 flex flex-col">
      <Header />
      <main className="flex-grow p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <StatusDashboard stats={stats} />
          <LogStream logs={logs} />
        </div>
        <div className="lg:col-span-1">
          <AnalysisPanel 
            error={currentError} 
            analysis={analysis}
            isLoading={isAnalyzing}
            onApplyFix={applyFix}
            onDismiss={() => {
              setCurrentError(null);
              setAnalysis(null);
            }}
          />
        </div>
      </main>
    </div>
  );
};

export default App;
