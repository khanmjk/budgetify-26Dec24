import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { FormField } from '../../../common/FormField';
import type { Department } from '../../../../types/models';
import { generateId } from '../../../../utils/generateId';

interface DepartmentSetupStepProps {
  data: Department[];
  organizationBudget: number;
  onUpdate: (departments: Department[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export const DepartmentSetupStep: React.FC<DepartmentSetupStepProps> = ({
  data,
  organizationBudget,
  onUpdate,
  onNext,
  onBack
}) => {
  const [error, setError] = useState('');

  const totalAllocated = data.reduce((sum, dept) => sum + (dept.totalBudget || 0), 0);
  const remainingBudget = organizationBudget - totalAllocated;

  const handleAddDepartment = () => {
    onUpdate([
      ...data,
      {
        id: generateId(),
        name: '',
        departmentHeadName: '',
        organizationId: '', // Will be set when organization is created
        totalBudget: 0
      }
    ]);
  };

  const handleUpdateDepartment = (index: number, updates: Partial<Department>) => {
    const newDepartments = [...data];
    newDepartments[index] = { ...newDepartments[index], ...updates };
    onUpdate(newDepartments);
  };

  const handleRemoveDepartment = (index: number) => {
    onUpdate(data.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate departments
    if (data.length === 0) {
      setError('At least one department is required');
      return;
    }

    if (data.some(dept => !dept.name.trim() || !dept.departmentHeadName.trim())) {
      setError('All departments must have a name and department head');
      return;
    }

    // Check for duplicate names
    const names = new Set();
    for (const dept of data) {
      const normalizedName = dept.name.trim().toLowerCase();
      if (names.has(normalizedName)) {
        setError('Department names must be unique');
        return;
      }
      names.add(normalizedName);
    }

    // Validate total budget allocation
    if (totalAllocated > organizationBudget) {
      setError('Total department budgets cannot exceed organization budget');
      return;
    }

    setError('');
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-medium text-gray-900">Departments</h2>
          <button
            type="button"
            onClick={handleAddDepartment}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Department
          </button>
        </div>

        <div className="mb-6 bg-gray-50 p-4 rounded-lg">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Organization Budget</p>
              <p className="text-lg font-medium text-gray-900">
                ${organizationBudget.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Remaining Budget</p>
              <p className={`text-lg font-medium ${
                remainingBudget < 0 ? 'text-red-600' : 'text-green-600'
              }`}>
                ${remainingBudget.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 rounded-md">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          {data.map((department, index) => (
            <div key={department.id} className="flex gap-4 items-start p-4 bg-gray-50 rounded-lg">
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    label="Department Name"
                    type="text"
                    required
                    value={department.name}
                    onChange={(e) => handleUpdateDepartment(index, { name: e.target.value })}
                  />
                  <FormField
                    label="Department Head"
                    type="text"
                    required
                    value={department.departmentHeadName}
                    onChange={(e) => handleUpdateDepartment(index, { departmentHeadName: e.target.value })}
                  />
                </div>
                <FormField
                  label="Budget Allocation"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={department.totalBudget || ''}
                  onChange={(e) => handleUpdateDepartment(index, { totalBudget: Number(e.target.value) })}
                />
              </div>
              <button
                type="button"
                onClick={() => handleRemoveDepartment(index)}
                className="p-2 text-gray-400 hover:text-red-500"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          ))}

          {data.length === 0 && (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">No departments added yet</p>
              <button
                type="button"
                onClick={handleAddDepartment}
                className="mt-2 inline-flex items-center px-3 py-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add your first department
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Back
        </button>
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Next Step
        </button>
      </div>
    </form>
  );
};