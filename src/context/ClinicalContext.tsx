import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface VisionData {
  kneeAngleDegrees?: number;
  pelvicDropDegrees?: number;
  cadenceStepsPerMin?: number;
  stepLengthMeters?: number;
  notes?: string;
}

export interface CotStep {
  id: string;
  phase: 'Parsing' | 'Evidenz-Mapping' | 'Logik-Check' | 'MDR-Filter' | 'Finalisierung';
  description: string;
  confidence: number;
  sources?: { title: string; url: string }[];
  status: 'pending' | 'active' | 'complete' | 'error';
}

interface ClinicalContextType {
  visionData: VisionData | null;
  setVisionData: (data: VisionData | null) => void;
  isCotMode: boolean;
  setCotMode: (active: boolean) => void;
  cotSteps: CotStep[];
  setCotSteps: (steps: CotStep[]) => void;
  addCotStep: (step: Omit<CotStep, 'id'>) => string;
  updateCotStep: (id: string, updates: Partial<CotStep>) => void;
  clearContext: () => void;
}

const ClinicalContext = createContext<ClinicalContextType | undefined>(undefined);

export const ClinicalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [visionData, setVisionData] = useState<VisionData | null>(null);
  const [isCotMode, setCotMode] = useState<boolean>(true); // Default to true for Demo
  const [cotSteps, setCotSteps] = useState<CotStep[]>([]);

  const addCotStep = (step: Omit<CotStep, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    setCotSteps(prev => [...prev, { ...step, id }]);
    return id;
  };

  const updateCotStep = (id: string, updates: Partial<CotStep>) => {
    setCotSteps(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const clearContext = () => {
    setVisionData(null);
    setCotSteps([]);
  };

  return (
    <ClinicalContext.Provider value={{ 
      visionData, setVisionData, 
      isCotMode, setCotMode, 
      cotSteps, setCotSteps, 
      addCotStep, updateCotStep, 
      clearContext 
    }}>
      {children}
    </ClinicalContext.Provider>
  );
};

export const useClinicalContext = () => {
  const context = useContext(ClinicalContext);
  if (context === undefined) {
    throw new Error('useClinicalContext must be used within a ClinicalProvider');
  }
  return context;
};
