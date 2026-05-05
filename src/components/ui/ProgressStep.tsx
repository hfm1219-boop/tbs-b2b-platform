import React from 'react';
import { CheckCircle2, Circle, AlertCircle } from 'lucide-react';

export type StepStatus = 'completed' | 'current' | 'pending' | 'error' | 'warning';

interface Step {
  id: string;
  label: string;
  description?: string;
  status: StepStatus;
  timestamp?: string;
}

interface ProgressStepProps {
  steps: Step[];
  orientation?: 'horizontal' | 'vertical';
}

export const ProgressStep: React.FC<ProgressStepProps> = ({ steps, orientation = 'horizontal' }) => {
  return (
    <div className={`flex ${orientation === 'horizontal' ? 'flex-row items-start justify-between w-full' : 'flex-col gap-6'}`}>
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;
        const isActive = step.status === 'current';
        const isCompleted = step.status === 'completed';
        const isError = step.status === 'error';
        
        return (
          <div key={step.id} className={`flex ${orientation === 'horizontal' ? 'flex-col items-center flex-1' : 'flex-row gap-4'}`}>
            <div className={`flex ${orientation === 'horizontal' ? 'flex-row items-center w-full' : 'flex-col items-center h-full'}`}>
              <div className="relative z-10">
                {isCompleted ? (
                  <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center shadow-lg shadow-green-200">
                    <CheckCircle2 size={16} />
                  </div>
                ) : isActive ? (
                  <div className="w-8 h-8 rounded-full bg-rojo text-white flex items-center justify-center shadow-lg shadow-rojo/20">
                    <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
                  </div>
                ) : isError ? (
                  <div className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg shadow-red-200">
                    <AlertCircle size={16} />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-100 text-gris flex items-center justify-center border-2 border-gray-200">
                    <Circle size={16} />
                  </div>
                )}
              </div>
              
              {!isLast && orientation === 'horizontal' && (
                <div className={`h-1 flex-1 mx-2 rounded-full ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}`} />
              )}
              
              {!isLast && orientation === 'vertical' && (
                <div className={`w-0.5 h-full mt-2 rounded-full ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}`} />
              )}
            </div>
            
            <div className={`${orientation === 'horizontal' ? 'text-center mt-3 px-2' : ''}`}>
              <div className={`text-xs font-black uppercase tracking-widest ${isActive ? 'text-rojo' : isCompleted ? 'text-green-600' : 'text-gris'}`}>
                {step.label}
              </div>
              {step.description && (
                <p className="text-[10px] font-bold text-gris mt-1 leading-tight">{step.description}</p>
              )}
              {step.timestamp && (
                <div className="mt-1 text-[9px] font-bold text-gris opacity-60 uppercase">{step.timestamp}</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
