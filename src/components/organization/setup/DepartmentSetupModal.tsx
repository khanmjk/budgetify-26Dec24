import React from 'react';
import { DepartmentSetupWizard } from '../../department/setup/DepartmentSetupWizard';

interface DepartmentSetupModalProps {
  departmentId: string;
  departmentName: string;
  departmentBudget: number;
  currentDepartment: number;
  totalDepartments: number;
  onClose: () => void;
}

export const DepartmentSetupModal: React.FC<DepartmentSetupModalProps> = ({
  departmentId,
  departmentName,
  departmentBudget,
  currentDepartment,
  totalDepartments,
  onClose
}) => {
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-medium text-gray-900">
                Setup {departmentName}
              </h2>
              <p className="text-sm text-gray-500">
                Department {currentDepartment} of {totalDepartments}
              </p>
            </div>
          </div>

          <DepartmentSetupWizard
            departmentId={departmentId}
            departmentBudget={departmentBudget}
            currentDepartment={currentDepartment}
            totalDepartments={totalDepartments}
            onComplete={onClose}
          />
        </div>
      </div>
    </div>
  );
};