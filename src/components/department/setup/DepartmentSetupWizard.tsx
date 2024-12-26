import React, { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import { TeamSetupStep } from './steps/TeamSetupStep';
import { BudgetAllocationStep } from './steps/BudgetAllocationStep';
import { ReviewStep } from './steps/ReviewStep';
import type { Team, Manager } from '../../../types/models';

type WizardStep = 'teams' | 'budgets' | 'review';

interface WizardData {
  teams: Team[];
  managers: Manager[];
}

interface DepartmentSetupWizardProps {
  departmentId: string;
  departmentBudget: number;
  currentDepartment: number;
  totalDepartments: number;
  onComplete: () => void;
}

export const DepartmentSetupWizard: React.FC<DepartmentSetupWizardProps> = ({
  departmentId,
  departmentBudget,
  currentDepartment,
  totalDepartments,
  onComplete
}) => {
  const [currentStep, setCurrentStep] = useState<WizardStep>('teams');
  const [wizardData, setWizardData] = useState<WizardData>({
    teams: [],
    managers: []
  });

  // Reset wizard state when department changes
  useEffect(() => {
    setCurrentStep('teams');
    setWizardData({
      teams: [],
      managers: []
    });
  }, [departmentId]);

  const steps: { id: WizardStep; title: string }[] = [
    { id: 'teams', title: 'Teams & Managers' },
    { id: 'budgets', title: 'Budget Allocation' },
    { id: 'review', title: 'Review' }
  ];

  const updateWizardData = (data: Partial<WizardData>) => {
    setWizardData(prev => ({ ...prev, ...data }));
  };

  const handleNext = () => {
    const currentIndex = steps.findIndex(step => step.id === currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].id);
    }
  };

  const handleBack = () => {
    const currentIndex = steps.findIndex(step => step.id === currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].id);
    }
  };

  const handleComplete = () => {
    onComplete();
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'teams':
        return (
          <TeamSetupStep
            data={wizardData}
            departmentId={departmentId}
            onUpdate={updateWizardData}
            onNext={handleNext}
          />
        );
      case 'budgets':
        return (
          <BudgetAllocationStep
            data={wizardData}
            departmentBudget={departmentBudget}
            onUpdate={updateWizardData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 'review':
        return (
          <ReviewStep
            data={wizardData}
            departmentId={departmentId}
            departmentBudget={departmentBudget}
            currentDepartment={currentDepartment}
            totalDepartments={totalDepartments}
            onBack={handleBack}
            onComplete={handleComplete}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <nav aria-label="Progress">
        <ol className="space-y-4 md:flex md:space-y-0 md:space-x-8">
          {steps.map((step, index) => {
            const isCurrent = currentStep === step.id;
            const isComplete = steps.findIndex(s => s.id === currentStep) > index;

            return (
              <li key={step.id} className="md:flex-1">
                <div className={`
                  group pl-4 py-2 flex flex-col border-l-4 md:pl-0 md:pt-4 md:pb-0 md:border-l-0 md:border-t-4
                  ${isCurrent ? 'border-indigo-600' : isComplete ? 'border-green-600' : 'border-gray-200'}
                `}>
                  <span className={`
                    text-xs font-semibold tracking-wide uppercase
                    ${isCurrent ? 'text-indigo-600' : isComplete ? 'text-green-600' : 'text-gray-500'}
                  `}>
                    {isComplete && <Check className="inline-block h-4 w-4 mr-1" />}
                    Step {index + 1}
                  </span>
                  <span className="text-sm font-medium">
                    {step.title}
                  </span>
                </div>
              </li>
            );
          })}
        </ol>
      </nav>

      <div className="mt-8">
        {renderStep()}
      </div>
    </div>
  );
};