import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { BasicInfoStep } from './steps/BasicInfoStep';
import { BudgetCategoriesStep } from './steps/BudgetCategoriesStep';
import { DepartmentSetupStep } from './steps/DepartmentSetupStep';
import { ReviewStep } from './steps/ReviewStep';
import type { Organization, BudgetCategory, Department } from '../../../types/models';

type WizardStep = 'basic' | 'categories' | 'departments' | 'review';

interface WizardData {
  organization: Partial<Organization>;
  budgetCategories: BudgetCategory[];
  departments: Department[];
}

export const OrganizationSetupWizard: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<WizardStep>('basic');
  const [wizardData, setWizardData] = useState<WizardData>({
    organization: {},
    budgetCategories: [],
    departments: []
  });

  const steps: { id: WizardStep; title: string }[] = [
    { id: 'basic', title: 'Basic Information' },
    { id: 'categories', title: 'Budget Categories' },
    { id: 'departments', title: 'Departments' },
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

  const renderStep = () => {
    switch (currentStep) {
      case 'basic':
        return (
          <BasicInfoStep
            data={wizardData.organization}
            onUpdate={(org) => updateWizardData({ organization: org })}
            onNext={handleNext}
          />
        );
      case 'categories':
        return (
          <BudgetCategoriesStep
            data={wizardData.budgetCategories}
            onUpdate={(categories) => updateWizardData({ budgetCategories: categories })}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 'departments':
        return (
          <DepartmentSetupStep
            data={wizardData.departments}
            organizationBudget={wizardData.organization.totalBudget || 0}
            onUpdate={(departments) => updateWizardData({ departments })}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 'review':
        return (
          <ReviewStep
            data={wizardData}
            onBack={handleBack}
            onComplete={() => navigate('/organizations')}
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