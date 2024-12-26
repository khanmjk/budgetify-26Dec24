import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { FormField } from '../../../common/FormField';
import type { Team, Manager } from '../../../../types/models';

interface BudgetAllocationStepProps {
  data: {
    teams: Team[];
    managers: Manager[];
  };
  departmentBudget: number;
  onUpdate: (data: { teams: Team[]; managers: Manager[] }) => void;
  onNext: () => void;
  onBack: () => void;
}

export const BudgetAllocationStep: React.FC<BudgetAllocationStepProps> = ({
  data,
  departmentBudget,
  onUpdate,
  onNext,
  onBack
}) => {
  const [error, setError] = useState('');

  const totalAllocated = data.teams.reduce((sum, team) => sum + (team.budget?.totalAmount || 0), 0);
  const remainingBudget = departmentBudget - totalAllocated;

  const handleUpdateTeamBudget = (index: number, amount: number) => {
    const newTeams = [...data.teams];
    newTeams[index] = {
      ...newTeams[index],
      budget: {
        id: newTeams[index].budget?.id || '',
        teamId: newTeams[index].id,
        totalAmount: amount,
        year: new Date().getFullYear()
      }
    };
    onUpdate({ ...data, teams: newTeams });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all teams have budgets
    if (data.teams.some(team => !team.budget?.totalAmount)) {
      setError('All teams must have a budget allocated');
      return;
    }

    // Validate total allocation doesn't exceed department budget
    if (totalAllocated > departmentBudget) {
      setError(`Total team budgets cannot exceed department budget of $${departmentBudget.toLocaleString()}`);
      return;
    }

    setError('');
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-6">Budget Allocation</h2>

        <div className="mb-6 bg-gray-50 p-4 rounded-lg">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500">Department Budget</p>
              <p className="text-lg font-medium text-gray-900">
                ${departmentBudget.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Allocated</p>
              <p className="text-lg font-medium text-indigo-600">
                ${totalAllocated.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Remaining</p>
              <p className={`text-lg font-medium ${
                remainingBudget < 0 ? 'text-red-600' : 'text-green-600'
              }`}>
                ${remainingBudget.toLocaleString()}
                {remainingBudget < 0 && (
                  <AlertTriangle className="inline-block ml-1 h-4 w-4" />
                )}
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
          {data.teams.map((team, index) => {
            const manager = data.managers.find(m => m.id === team.managerId);
            return (
              <div key={team.id} className="p-4 bg-gray-50 rounded-lg">
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-900">{team.name}</h3>
                  <p className="text-sm text-gray-500">Manager: {manager?.name}</p>
                </div>
                <FormField
                  label="Budget Allocation"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={team.budget?.totalAmount || ''}
                  onChange={(e) => handleUpdateTeamBudget(index, Number(e.target.value))}
                />
              </div>
            );
          })}
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