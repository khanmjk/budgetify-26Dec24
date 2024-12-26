import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBudgetStore } from '../../../../store/budgetStore';
import { generateId } from '../../../../utils/generateId';
import { DepartmentSetupModal } from '../DepartmentSetupModal';
import type { Organization, BudgetCategory, Department } from '../../../../types/models';

interface ReviewStepProps {
  data: {
    organization: Partial<Organization>;
    budgetCategories: BudgetCategory[];
    departments: Department[];
  };
  onBack: () => void;
  onComplete: () => void;
}

export const ReviewStep: React.FC<ReviewStepProps> = ({
  data,
  onBack,
  onComplete
}) => {
  const navigate = useNavigate();
  const store = useBudgetStore();
  const [currentDeptIndex, setCurrentDeptIndex] = useState<number>(-1);
  const [organizationId, setOrganizationId] = useState<string>('');
  const [isCreatingOrg, setIsCreatingOrg] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreatingOrg(false);

    // Generate organization ID
    const newOrgId = generateId();
    setOrganizationId(newOrgId);

    // Create organization with budget categories
    const organization: Organization = {
      id: newOrgId,
      name: data.organization.name!,
      leaderName: data.organization.leaderName!,
      totalBudget: data.organization.totalBudget!,
      budgetCategories: data.budgetCategories.map(cat => ({
        ...cat,
        organizationId: newOrgId
      }))
    };

    // Add organization
    store.addOrganization(organization);

    // Start department setup sequence with the first department
    setCurrentDeptIndex(0);
  };

  const handleDepartmentSetupComplete = () => {
    // Add current department
    const currentDepartment = {
      ...data.departments[currentDeptIndex],
      organizationId
    };
    store.addDepartment(currentDepartment);

    // Move to next department or complete setup
    const nextIndex = currentDeptIndex + 1;
    if (nextIndex < data.departments.length) {
      // Continue with next department
      setCurrentDeptIndex(nextIndex);
    } else {
      // All departments are set up, complete the process
      onComplete();
      navigate('/organizations');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Organization Summary</h2>
        <dl className="grid grid-cols-2 gap-4">
          <div>
            <dt className="text-sm font-medium text-gray-500">Name</dt>
            <dd className="mt-1 text-sm text-gray-900">{data.organization.name}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Leader</dt>
            <dd className="mt-1 text-sm text-gray-900">{data.organization.leaderName}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Total Budget</dt>
            <dd className="mt-1 text-sm text-gray-900">${data.organization.totalBudget?.toLocaleString()}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Departments</dt>
            <dd className="mt-1 text-sm text-gray-900">{data.departments.length}</dd>
          </div>
        </dl>
      </div>

      {isCreatingOrg ? (
        <div className="flex justify-between">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Back
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Create Organization
          </button>
        </div>
      ) : (
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-blue-700">
            Setting up departments ({currentDeptIndex + 1} of {data.departments.length})
          </p>
        </div>
      )}

      {currentDeptIndex >= 0 && currentDeptIndex < data.departments.length && (
        <DepartmentSetupModal
          departmentId={data.departments[currentDeptIndex].id}
          departmentName={data.departments[currentDeptIndex].name}
          departmentBudget={data.departments[currentDeptIndex].totalBudget}
          currentDepartment={currentDeptIndex + 1}
          totalDepartments={data.departments.length}
          onClose={handleDepartmentSetupComplete}
        />
      )}
    </div>
  );
};